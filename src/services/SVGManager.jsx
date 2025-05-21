/**
 * SVGManager.jsx - Serviço para gerenciar e manipular elementos SVG
 */
class SVGManager {
  constructor() {
    this.svgContainer = null;
    this.svgElement = null;
    this.svgNamespace = "http://www.w3.org/2000/svg";
    this.elementSelectCallback = null;
  }

  // Inicializar o SVG Manager com conteúdo SVG em um container específico
  initialize(svgContent, containerId) {
    this.svgContainer = document.getElementById(containerId);
    
    if (!this.svgContainer) {
      console.error('Container não encontrado:', containerId);
      return false;
    }
    
    // Limpar o container
    while (this.svgContainer.firstChild) {
      this.svgContainer.removeChild(this.svgContainer.firstChild);
    }
    
    // Criar parser de DOM para o SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    this.svgElement = svgDoc.documentElement;
    
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
    // Selecionar todos os elementos que podem ser manipulados
    const editableElements = this.svgElement.querySelectorAll('path, circle, rect, ellipse, polygon, polyline, g');
    
    editableElements.forEach(element => {
      // Adicionar evento de clique para seleção
      element.addEventListener('click', (event) => {
        event.stopPropagation();
        const elementId = element.id || element.getAttribute('data-id');
        
        if (elementId && this.elementSelectCallback) {
          this.elementSelectCallback(elementId);
        }
      });
      
      // Adicionar estilo hover para indicar elementos clicáveis
      element.style.cursor = 'pointer';
    });
    
    // Clicar no SVG (fora dos elementos) deve desselecionar
    this.svgElement.addEventListener('click', (event) => {
      if (event.target === this.svgElement && this.elementSelectCallback) {
        this.elementSelectCallback(null); // Desselecionar
      }
    });
  }

  // Definir callback para quando um elemento for selecionado
  setElementSelectCallback(callback) {
    this.elementSelectCallback = callback;
  }

  // Analisar o SVG e criar um mapa de elementos com suas propriedades
  async parseSVGElements(svgContent) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    
    // Encontrar todos os elementos que podem ser editados
    const editableElements = svgElement.querySelectorAll('path, circle, rect, ellipse, polygon, polyline, g');
    const elementMap = new Map();
    
    editableElements.forEach((element, index) => {
      // Garantir que cada elemento tenha um ID
      if (!element.id) {
        element.id = `element-${index}`;
      }
      
      // Extrair propriedades relevantes
      const properties = {
        type: element.tagName,
        fill: element.getAttribute('fill') || '#000000',
        stroke: element.getAttribute('stroke') || 'none',
        strokeWidth: element.getAttribute('stroke-width') ? parseFloat(element.getAttribute('stroke-width')) : 0,
        opacity: element.getAttribute('opacity') ? parseFloat(element.getAttribute('opacity')) : 1,
        // Extrair role para uso com paletas de cores
        role: element.getAttribute('data-role') || null,
        // Outras propriedades específicas podem ser adicionadas aqui
      };
      
      elementMap.set(element.id, properties);
    });
    
    return elementMap;
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
}

// Exportar uma instância singleton
const svgManager = new SVGManager();
export default svgManager;