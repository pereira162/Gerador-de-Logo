/**
 * SVGManager.jsx - Serviço para gerenciar e manipular elementos SVG
 */
class SVGManager {
  constructor() {
    this.svgContainer = null;
    this.svgElement = null;
    this.svgNamespace = "http://www.w3.org/2000/svg";
    this.elementSelectCallback = null;
    this.selectedElement = null;
    this._eventListeners = new Map(); // Track event listeners for cleanup
  }

  _cleanup() {
    // Remove all event listeners
    if (this._eventListeners.size > 0) {
      this._eventListeners.forEach((listeners, element) => {
        listeners.forEach(({type, handler}) => {
          element.removeEventListener(type, handler);
        });
      });
      this._eventListeners.clear();
    }

    // Clear the container
    if (this.svgContainer) {
      while (this.svgContainer.firstChild) {
        this.svgContainer.removeChild(this.svgContainer.firstChild);
      }
    }

    // Reset selected element
    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected-highlight');
      this.selectedElement = null;
    }
  }

  // Inicializar o SVG Manager com conteúdo SVG em um container específico
  initialize(svgContent, containerId) {
    this.svgContainer = document.getElementById(containerId);
    
    if (!this.svgContainer) {
      console.error('Container não encontrado:', containerId);
      return false;
    }
    
    if (!svgContent || typeof svgContent !== 'string') {
      console.error('SVG content inválido');
      return false;
    }
    
    // Limpar o container e remover event listeners antigos
    this._cleanup();
    
    // Criar parser de DOM para o SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    
    // Verificar se o parsing foi bem sucedido
    const parserError = svgDoc.querySelector('parsererror');
    if (parserError) {
      console.error('SVG parsing error:', parserError.textContent);
      return false;
    }
    
    this.svgElement = svgDoc.documentElement;
    
    // Validar se é realmente um elemento SVG
    if (this.svgElement.tagName !== 'svg') {
      console.error('O documento não é um SVG válido');
      return false;
    }
    
    // Garantir que o SVG tenha viewBox e dimensões adequadas
    if (!this.svgElement.getAttribute('viewBox')) {
      this.svgElement.setAttribute('viewBox', '0 0 400 400');
    }
    if (!this.svgElement.getAttribute('width')) {
      this.svgElement.setAttribute('width', '100%');
    }
    if (!this.svgElement.getAttribute('height')) {
      this.svgElement.setAttribute('height', '100%');
    }
    
    // Adicionar o SVG ao container
    this.svgContainer.appendChild(this.svgElement);
    
    // Configurar eventos para os elementos SVG
    this._setupEventHandlers();
    
    return true;
  }

  // Configurar os handlers de eventos para os elementos SVG
  _setupEventHandlers() {
    console.log('Setting up SVG event handlers');
    
    // Selecionar todos os elementos que podem ser manipulados
    const editableElements = this.svgElement.querySelectorAll('path, circle, rect, ellipse, polygon, polyline, g, text');
    
    console.log(`Found ${editableElements.length} editable elements`); 
    
    editableElements.forEach((element, index) => {
      // Garantir que cada elemento tenha um ID único
      if (!element.id) {
        element.id = `element-${Date.now()}-${index}`;
      }
      
      // Adicionar evento de clique para seleção
      const clickHandler = (event) => {
        event.stopPropagation();
        console.log(`Element clicked: ${element.id}`);
        
        // Destacar visualmente o elemento
        this.highlightSelectedElement(element.id);
        
        // Chamar o callback se existir
        if (this.elementSelectCallback) {
          this.elementSelectCallback(element.id);
        }
      };
      
      // Registrar o handler para limpeza posterior
      if (!this._eventListeners.has(element)) {
        this._eventListeners.set(element, []);
      }
      this._eventListeners.get(element).push({ type: 'click', handler: clickHandler });
      
      element.addEventListener('click', clickHandler);
      
      // Adicionar estilo hover para indicar elementos clicáveis
      element.style.cursor = 'pointer';
      
      // Adicionar eventos de hover para feedback visual
      const mouseEnterHandler = () => {
        if (this.selectedElement !== element) {
          element.classList.add('hover-highlight');
        }
      };
      
      const mouseLeaveHandler = () => {
        element.classList.remove('hover-highlight');
      };
      
      element.addEventListener('mouseenter', mouseEnterHandler);
      element.addEventListener('mouseleave', mouseLeaveHandler);
      
      this._eventListeners.get(element).push(
        { type: 'mouseenter', handler: mouseEnterHandler },
        { type: 'mouseleave', handler: mouseLeaveHandler }
      );
    });
    
    // Clicar no SVG (fora dos elementos) deve desselecionar
    const svgClickHandler = (event) => {
      if (event.target === this.svgElement) {
        console.log('Background clicked, clearing selection');
        
        // Limpar o destaque visual
        this.highlightSelectedElement(null);
        
        if (this.elementSelectCallback) {
          this.elementSelectCallback(null); // Desselecionar
        }
      }
    };
    
    // Registrar o handler do SVG para limpeza
    if (!this._eventListeners.has(this.svgElement)) {
      this._eventListeners.set(this.svgElement, []);
    }
    this._eventListeners.get(this.svgElement).push({ type: 'click', handler: svgClickHandler });
    
    this.svgElement.addEventListener('click', svgClickHandler);
  }

  // Definir callback para quando um elemento for selecionado
  setElementSelectCallback(callback) {
    this.elementSelectCallback = callback;
  }

  // Analisar o SVG e criar um mapa de elementos com suas propriedades
  async parseSVGElements(svgContent) {
    if (!svgContent || typeof svgContent !== 'string') {
      console.error('SVG content inválido para parsing');
      return new Map();
    }

    try {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      
      // Verificar erros de parsing
      const parserError = svgDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error(`SVG parsing error: ${parserError.textContent}`);
      }
      
      const svgElement = svgDoc.documentElement;
      if (svgElement.tagName !== 'svg') {
        throw new Error('O documento não é um SVG válido');
      }
      
      // Encontrar todos os elementos que podem ser editados
      const editableElements = svgElement.querySelectorAll('path, circle, rect, ellipse, polygon, polyline, g');
      const elementMap = new Map();
      const usedIds = new Set(); // Rastrear IDs já utilizados
      
      editableElements.forEach((element, index) => {
        let elementId = element.id || element.getAttribute('data-id');
        
        // Se não tem ID ou o ID já está em uso, gerar um novo
        if (!elementId || usedIds.has(elementId)) {
          elementId = `element-${Date.now()}-${index}`;
          element.id = elementId;
        }
        
        usedIds.add(elementId);
        
        // Extrair propriedades relevantes com valores padrão seguros
        const properties = {
          type: element.tagName,
          fill: element.getAttribute('fill') || '#000000',
          stroke: element.getAttribute('stroke') || 'none',
          strokeWidth: parseFloat(element.getAttribute('stroke-width')) || 0,
          opacity: parseFloat(element.getAttribute('opacity')) || 1,
          role: element.getAttribute('data-role') || null,
          // Adicionado timestamp para garantir unicidade em recargas
          timestamp: Date.now(),
          originalId: element.id // Manter registro do ID original se necessário
        };
        
        elementMap.set(elementId, properties);
      });
      
      return elementMap;
    } catch (error) {
      console.error('Erro ao analisar elementos SVG:', error);
      return new Map(); // Retornar Map vazio em caso de erro
    }
  }

  // Atualizar propriedade de um elemento
  updateElementProperty(elementId, property, value) {
    if (!this.svgElement) return false;
    
    const element = this.svgElement.getElementById(elementId);
    if (!element) {
      console.error('Elemento não encontrado:', elementId);
      return false;
    }
    
    // Mapear propriedades para atributos SVG
    const attrMap = {
      fill: 'fill',
      stroke: 'stroke',
      strokeWidth: 'stroke-width',
      opacity: 'opacity',
      // Outras propriedades podem ser mapeadas aqui
    };
    
    const attr = attrMap[property];
    if (attr) {
      element.setAttribute(attr, value);
      return true;
    }
    
    return false;
  }

  // Adicionar elemento de texto ao SVG
  addTextElement(textProps) {
    if (!this.svgElement) return false;
    
    const {
      id,
      content,
      fontFamily = 'Arial',
      fontSize = 24,
      fontWeight = '400',
      fill = '#000000',
      position = { x: 200, y: 200 },
      alignment = 'middle'
    } = textProps;
    
    // Criar elemento de texto SVG
    const textElement = document.createElementNS(this.svgNamespace, 'text');
    textElement.setAttribute('id', id);
    textElement.setAttribute('x', position.x);
    textElement.setAttribute('y', position.y);
    textElement.setAttribute('font-family', fontFamily);
    textElement.setAttribute('font-size', fontSize);
    textElement.setAttribute('font-weight', fontWeight);
    textElement.setAttribute('fill', fill);
    textElement.setAttribute('text-anchor', alignment === 'center' ? 'middle' : alignment);
    textElement.setAttribute('dominant-baseline', 'middle');
    textElement.textContent = content;
    
    // Adicionar estilo hover para indicar elementos clicáveis
    textElement.style.cursor = 'pointer';
    
    // Adicionar evento de clique para seleção
    textElement.addEventListener('click', (event) => {
      event.stopPropagation();
      if (this.elementSelectCallback) {
        this.elementSelectCallback(id);
      }
    });
    
    // Adicionar ao SVG
    this.svgElement.appendChild(textElement);
    
    return true;
  }

  // Atualizar elemento de texto
  updateTextElement(textId, properties) {
    if (!this.svgElement) return false;
    
    const textElement = this.svgElement.getElementById(textId);
    if (!textElement) {
      console.error('Elemento de texto não encontrado:', textId);
      return false;
    }
    
    // Mapear propriedades para atributos SVG
    if (properties.content !== undefined) {
      textElement.textContent = properties.content;
    }
    if (properties.fontFamily !== undefined) {
      textElement.setAttribute('font-family', properties.fontFamily);
    }
    if (properties.fontSize !== undefined) {
      textElement.setAttribute('font-size', properties.fontSize);
    }
    if (properties.fontWeight !== undefined) {
      textElement.setAttribute('font-weight', properties.fontWeight);
    }
    if (properties.fill !== undefined) {
      textElement.setAttribute('fill', properties.fill);
    }
    if (properties.position !== undefined) {
      textElement.setAttribute('x', properties.position.x);
      textElement.setAttribute('y', properties.position.y);
    }
    if (properties.alignment !== undefined) {
      textElement.setAttribute('text-anchor', properties.alignment === 'center' ? 'middle' : properties.alignment);
    }
    
    return true;
  }
  
  // Remover elemento de texto
  removeTextElement(textId) {
    if (!this.svgElement) return false;
    
    const textElement = this.svgElement.getElementById(textId);
    if (!textElement) {
      console.error('Elemento de texto não encontrado para remoção:', textId);
      return false;
    }
    
    // Remover o elemento do DOM
    textElement.parentNode.removeChild(textElement);
    
    // Se este era o elemento selecionado, limpar a seleção
    if (this.selectedElement && this.selectedElement.id === textId) {
      this.selectedElement = null;
    }
    
    return true;
  }
  
  // Obter o conteúdo SVG atual como string
  getSVGContent() {
    if (!this.svgElement) return null;
    
    // Clonar para não modificar o original
    const clone = this.svgElement.cloneNode(true);
    
    // Limpar classes de seleção
    const selectedElements = clone.querySelectorAll('.selected-element');
    selectedElements.forEach(el => {
      el.classList.remove('selected-element');
    });
    
    return new XMLSerializer().serializeToString(clone);
  }
  
  // Aplicar estilo a um elemento SVG
  applyStyle(elementId, styles) {
    if (!this.svgElement) return false;
    
    const element = this.svgElement.getElementById(elementId);
    if (!element) {
      console.error('Elemento não encontrado:', elementId);
      return false;
    }
    
    // Aplicar os estilos ao elemento
    if (styles.fill !== undefined) {
      element.setAttribute('fill', styles.fill);
    }
    
    if (styles.stroke !== undefined) {
      element.setAttribute('stroke', styles.stroke);
    }
    
    if (styles.strokeWidth !== undefined) {
      element.setAttribute('stroke-width', styles.strokeWidth);
    }
    
    if (styles.opacity !== undefined) {
      element.setAttribute('opacity', styles.opacity);
    }
    
    return true;
  }
  
  // Aplicar transformações a um elemento SVG
  applyTransformation(elementId, transformData) {
    if (!this.svgElement) return false;
    
    const element = this.svgElement.getElementById(elementId);
    if (!element) {
      console.error('Elemento não encontrado:', elementId);
      return false;
    }
    
    // Extrair valores de transformação ou usar valores padrão
    const {
      x = 0,
      y = 0,
      rotation = 0,
      scaleX = 1,
      scaleY = 1
    } = transformData;
    
    // Determinar o centro do elemento para rotação
    let centerX = 0;
    let centerY = 0;
    
    // Para formas diferentes, determinar o centro de rotação
    if (element.tagName === 'rect') {
      // Para retângulos, usar o centro do retângulo
      const width = parseFloat(element.getAttribute('width') || 0);
      const height = parseFloat(element.getAttribute('height') || 0);
      centerX = width / 2;
      centerY = height / 2;
    } else if (element.tagName === 'circle') {
      // Para círculos, usar o centro definido pelos atributos cx e cy
      centerX = parseFloat(element.getAttribute('cx') || 0);
      centerY = parseFloat(element.getAttribute('cy') || 0);
    } else if (element.tagName === 'ellipse') {
      // Para elipses, usar o centro definido pelos atributos cx e cy
      centerX = parseFloat(element.getAttribute('cx') || 0);
      centerY = parseFloat(element.getAttribute('cy') || 0);
    } else if (element.tagName === 'path' || element.tagName === 'g') {
      // Para paths e grupos, calcular o centro pelo BBox
      try {
        const bbox = element.getBBox();
        centerX = bbox.x + bbox.width / 2;
        centerY = bbox.y + bbox.height / 2;
      } catch (e) {
        console.warn('Não foi possível calcular o BBox para', element.tagName);
        // Fallback para o centro do SVG
        centerX = 200;
        centerY = 200;
      }
    } else {
      // Fallback para elementos não suportados
      centerX = 200;
      centerY = 200;
    }
    
    // Construir a string de transformação SVG
    const transformString = `translate(${x}, ${y}) rotate(${rotation}, ${centerX}, ${centerY}) scale(${scaleX}, ${scaleY})`;
    
    // Aplicar a transformação ao elemento
    element.setAttribute('transform', transformString);
    
    return true;
  }
  
  // Obter estilo de um elemento SVG
  getElementStyle(elementId) {
    if (!this.svgElement) return null;
    
    const element = this.svgElement.getElementById(elementId);
    if (!element) {
      console.error('Elemento não encontrado:', elementId);
      return null;
    }
    
    // Retornar objeto com todas as propriedades de estilo relevantes
    return {
      fill: element.getAttribute('fill') || '#000000',
      stroke: element.getAttribute('stroke') || 'none',
      strokeWidth: element.getAttribute('stroke-width') ? parseFloat(element.getAttribute('stroke-width')) : 0,
      opacity: element.getAttribute('opacity') ? parseFloat(element.getAttribute('opacity')) : 1
    };
  }
  
  // Obter transformação de um elemento SVG
  getElementTransform(elementId) {
    if (!this.svgElement) return null;
    
    const element = this.svgElement.getElementById(elementId);
    if (!element) {
      console.error('Elemento não encontrado:', elementId);
      return null;
    }
    
    // Obter o atributo de transformação
    const transformAttr = element.getAttribute('transform') || '';
    
    // Valores padrão se não houver transformação
    const transformData = {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    };
    
    // Extrair valores de translate
    const translateMatch = transformAttr.match(/translate\(\s*([\d.-]+)\s*[,\s]\s*([\d.-]+)\s*\)/);
    if (translateMatch) {
      transformData.translateX = parseFloat(translateMatch[1]);
      transformData.translateY = parseFloat(translateMatch[2]);
    }
    
    // Extrair valores de scale
    const scaleMatch = transformAttr.match(/scale\(\s*([\d.-]+)\s*[,\s]\s*([\d.-]+)\s*\)/);
    if (scaleMatch) {
      transformData.scaleX = parseFloat(scaleMatch[1]);
      transformData.scaleY = parseFloat(scaleMatch[2]);
    }
    
    // Extrair valor de rotação - pegando apenas o valor de ângulo, ignorando o centro
    const rotateMatch = transformAttr.match(/rotate\(\s*([\d.-]+)/);
    if (rotateMatch) {
      transformData.rotation = parseFloat(rotateMatch[1]);
    }
    
    return transformData;
  }
  
  // Destacar elemento selecionado
  highlightSelectedElement(elementId) {
    if (!this.svgElement) return false;
    
    console.log('Highlighting element:', elementId);
    
    // Remover destaque anterior
    if (this.selectedElement) {
      console.log('Removing previous highlight from:', this.selectedElement.id);
      this.selectedElement.classList.remove('selected-highlight');
    }
    
    // Se um novo elemento foi selecionado
    if (elementId) {
      const element = this.svgElement.getElementById(elementId);
      if (element) {
        console.log('Adding highlight to:', elementId);
        element.classList.add('selected-highlight');
        this.selectedElement = element;
      } else {
        console.error('Element not found for highlighting:', elementId);
        this.selectedElement = null;
      }
    } else {
      this.selectedElement = null;
    }
    
    return true;
  }
}

// Exportar uma instância singleton
const svgManager = new SVGManager();
export default svgManager;