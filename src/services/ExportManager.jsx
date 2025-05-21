/**
 * ExportManager.jsx - Serviço para gerenciar a exportação de logos em diferentes formatos
 */
class ExportManager {
  constructor() {
    this.svgDomParser = new DOMParser();
  }

  // Exportar SVG como string
  exportSVG() {
    const svgElement = document.querySelector('#editing-canvas svg');
    
    if (!svgElement) {
      console.error('SVG element not found');
      return null;
    }
    
    // Clonar o SVG para não modificar o original
    const clonedSvg = svgElement.cloneNode(true);
    
    // Garantir que o viewBox e dimensões estejam corretos
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    if (!clonedSvg.getAttribute('viewBox')) {
      clonedSvg.setAttribute('viewBox', '0 0 400 400');
    }
    
    // Remover atributos auxiliares de edição 
    clonedSvg.querySelectorAll('.selected-element').forEach(el => {
      el.classList.remove('selected-element');
      
      const originalStroke = el.getAttribute('data-original-stroke');
      if (originalStroke) {
        el.setAttribute('stroke', originalStroke);
        el.removeAttribute('data-original-stroke');
      }
    });
    
    return new XMLSerializer().serializeToString(clonedSvg);
  }

  // Exportar como PNG
  async exportPNG(elements = ['main'], resolution = 1) {
    const svgString = this.exportSVG(elements);
    
    if (!svgString) {
      return null;
    }
    
    // Criar uma imagem a partir do SVG
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        try {
          // Criar canvas com resolução adequada
          const canvas = document.createElement('canvas');
          const svgWidth = 400;
          const svgHeight = 400;
          
          canvas.width = svgWidth * resolution;
          canvas.height = svgHeight * resolution;
          
          const ctx = canvas.getContext('2d');
          
          // Fundo branco (opcional, deixar transparente se não especificado)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Desenhar a imagem SVG no canvas com escala
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Converter para PNG
          const pngData = canvas.toDataURL('image/png');
          
          // Limpar recursos
          URL.revokeObjectURL(url);
          
          resolve(pngData);
        } catch (e) {
          reject(e);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Falha ao carregar a imagem SVG'));
      };
      
      img.src = url;
    });
  }
  
  // Gerar variantes do logo (P1 feature - implementação básica)
  generateVariants(project) {
    const baseColors = [
      { primary: '#1E88E5', secondary: '#64B5F6', accent: '#FFC107' }, // Azul
      { primary: '#43A047', secondary: '#81C784', accent: '#FF5722' }, // Verde
      { primary: '#6D4C41', secondary: '#A1887F', accent: '#FFCA28' }, // Marrom
      { primary: '#5E35B1', secondary: '#9575CD', accent: '#4DD0E1' }  // Roxo
    ];
    
    // Criar variantes simples com cores diferentes
    const variants = baseColors.map((colorSet, index) => {
      return {
        id: `variant-${index}`,
        name: `Variante ${index + 1}`,
        colors: colorSet,
        // Aqui geraria uma prévia do SVG com as cores aplicadas
        // Por enquanto, apenas retornamos o conjunto de cores
      };
    });
    
    return variants;
  }
  
  // Preparar o logo para publicação/importação em outros sistemas
  prepareForPublishing(svgString, metadata = {}) {
    // Adicionar metadados ao SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.documentElement;
    
    // Adicionar metadados
    const metadataElement = doc.createElement('metadata');
    metadataElement.setAttribute('id', 'logo-metadata');
    
    // Converter metadados para XML
    const metadataContent = Object.entries(metadata)
      .map(([key, value]) => `<meta name="${key}">${value}</meta>`)
      .join('');
    
    metadataElement.innerHTML = metadataContent;
    svgElement.appendChild(metadataElement);
    
    return new XMLSerializer().serializeToString(svgElement);
  }
}

// Exportar uma instância singleton
const exportManager = new ExportManager();
export default exportManager;