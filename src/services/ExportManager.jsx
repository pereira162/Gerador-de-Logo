// src/services/ExportManager.jsx
import fontManager from './FontManager'; // Importar o FontManager
// Para downloads mais robustos, você pode considerar usar a biblioteca file-saver
// import { saveAs } from 'file-saver'; // Descomente se for usar: npm install file-saver

class ExportManager {
  constructor() {
    // Não precisamos mais do DOMParser aqui se recebermos a string SVG diretamente.
  }

  /**
   * Exporta o conteúdo SVG fornecido como um arquivo .svg.
   * @param {string} svgContent - A string serializada do SVG a ser exportada.
   * @param {string} [filename='logo.svg'] - O nome do arquivo para download.
   * @returns {string | null} - Retorna a string SVG original ou null em caso de erro.
   */
  exportSVG(svgContent, filename = 'logo.svg') {
    if (!svgContent || typeof svgContent !== 'string') {
      console.error('ExportManager: Conteúdo SVG inválido ou não fornecido para exportação.');
      alert("Nenhum logo para exportar como SVG.");
      return null;
    }
    
    // O svgContent já deve ser o estado final e limpo do logo.
    // A limpeza de classes/atributos de edição deve ocorrer antes, no SVGManager.getSVGContent()
    // ou na action do store que prepara o svgContent para exportação.

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    this._triggerDownload(blob, filename);
    console.log(`${filename} exportação SVG iniciada.`);
    return svgContent;
  }

  /**
   * Exporta o conteúdo SVG fornecido como um arquivo .png.
   * @param {string} svgContent - A string serializada do SVG a ser convertida e exportada.
   * @param {string} [filename='logo.png'] - O nome do arquivo para download.
   * @param {number} [resolutionScale=1] - O fator de escala para a resolução do PNG.
   * @returns {Promise<string | null>} - Promessa que resolve com o DataURL do PNG ou null em caso de erro.
   */
  async exportPNG(svgContent, filename = 'logo.png', resolutionScale = 1) {
    if (!svgContent || typeof svgContent !== 'string') {
      console.error('ExportManager: Conteúdo SVG inválido ou não fornecido para exportação PNG.');
      alert("Nenhum logo para exportar como PNG.");
      return null;
    }

    // 1. Extrair e carregar todas as fontes usadas no SVG
    try {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const textElements = svgDoc.querySelectorAll('text');
      const usedFonts = new Set();

      textElements.forEach(text => {
        const fontFamily = text.getAttribute('font-family');
        if (fontFamily) {
          usedFonts.add(fontFamily.replace(/['"]*/g, '')); // Remove quotes
        }
      });

      // Carregar todas as fontes usadas
      const fontLoadPromises = Array.from(usedFonts).map(async font => {
        try {
          await fontManager.loadFont(font);
          console.log(`Fonte ${font} carregada para exportação.`);
        } catch (err) {
          console.warn(`Não foi possível carregar a fonte ${font}, usando fallback.`);
        }
      });

      await Promise.allSettled(fontLoadPromises); // Continue mesmo se algumas falharem
      console.log("Fontes necessárias verificadas/carregadas para exportação PNG.");
    } catch (error) {
      console.error("Erro ao carregar fontes para exportação PNG:", error);
      alert("Atenção: Algumas fontes podem não ter sido carregadas corretamente. A exportação continuará com fontes alternativas.");
    }

    // 2. Criar uma imagem a partir do SVG string
    return new Promise((resolve, reject) => {
      // Primeiro, analisar e limpar o SVG
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgNode = svgDoc.documentElement;
      
      // Extrair e validar dimensões
      let svgWidth = 400; // Default
      let svgHeight = 400; // Default
      
      // Primeiro tentar viewBox
      const viewBox = svgNode.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(/[\s,]+/); // Suporta espaços e vírgulas
        if (parts.length === 4) {
          svgWidth = Math.abs(parseFloat(parts[2]));
          svgHeight = Math.abs(parseFloat(parts[3]));
        }
      }
      
      // Se não tem viewBox ou dimensões inválidas, tentar width/height
      if (!viewBox || isNaN(svgWidth) || isNaN(svgHeight) || svgWidth <= 0 || svgHeight <= 0) {
        const width = svgNode.getAttribute('width');
        const height = svgNode.getAttribute('height');
        
        // Converter unidades para pixels se necessário
        if (width && height) {
          const tempDiv = document.createElement('div');
          tempDiv.style.visibility = 'hidden';
          document.body.appendChild(tempDiv);
          
          tempDiv.style.width = width;
          svgWidth = tempDiv.offsetWidth || 400;
          
          tempDiv.style.height = height;
          svgHeight = tempDiv.offsetHeight || 400;
          
          document.body.removeChild(tempDiv);
        }
      }
      
      // Garantir dimensões mínimas e válidas
      svgWidth = Math.max(50, Math.min(4096, svgWidth));
      svgHeight = Math.max(50, Math.min(4096, svgHeight));
      
      // Atualizar o SVG com as dimensões finais
      svgNode.setAttribute('width', String(svgWidth));
      svgNode.setAttribute('height', String(svgHeight));
      
      // Criar a imagem
      const img = new Image();
      const svgString = new XMLSerializer().serializeToString(svgDoc);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        try {
          URL.revokeObjectURL(svgUrl); // Limpar o URL do blob
          const canvas = document.createElement('canvas');
          
          // Aplicar o fator de escala com limites seguros
          const scale = Math.max(0.1, Math.min(10, resolutionScale));
          canvas.width = svgWidth * scale;
          canvas.height = svgHeight * scale;
          
          const ctx = canvas.getContext('2d');
          
          // Habilitar suavização para melhor qualidade
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Limpar o canvas para garantir transparência
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Desenhar com alta qualidade
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Criar PNG com qualidade máxima
          const pngDataUrl = canvas.toDataURL('image/png', 1.0);
          
          this._triggerDownload(pngDataUrl, filename);
          console.log(`${filename} exportação PNG iniciada com escala ${scale}x.`);
          resolve(pngDataUrl); // Retorna o dataURL do PNG
        } catch (e) {
          console.error("Erro ao renderizar SVG no canvas:", e);
          alert("Erro ao gerar o PNG. Detalhes no console.");
          reject(e);
        } finally {
            // Limpar o URL do Blob da imagem, se aplicável
            // (não necessário para data URLs usados diretamente no img.src, 
            // mas se estivéssemos usando URL.createObjectURL com um Blob SVG)
            if (img.src.startsWith('blob:')) {
                 URL.revokeObjectURL(img.src);
            }
        }
      };
      
      img.onerror = (e) => {
        console.error('Falha ao carregar a imagem SVG para conversão PNG:', e);
        
        // Limpar recursos
        if (svgUrl) {
          URL.revokeObjectURL(svgUrl);
        }
        
        // Tentar método alternativo com base64
        try {
          console.log('Tentando método alternativo de exportação...');
          const base64SVG = btoa(unescape(encodeURIComponent(svgString)));
          const base64Url = `data:image/svg+xml;base64,${base64SVG}`;
          
          // Criar nova imagem com base64
          const altImg = new Image();
          altImg.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const scale = Math.max(0.1, Math.min(10, resolutionScale));
              canvas.width = svgWidth * scale;
              canvas.height = svgHeight * scale;
              
              const ctx = canvas.getContext('2d');
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(altImg, 0, 0, canvas.width, canvas.height);
              
              const pngDataUrl = canvas.toDataURL('image/png', 1.0);
              this._triggerDownload(pngDataUrl, filename);
              console.log(`${filename} exportação PNG concluída (método alternativo).`);
              resolve(pngDataUrl);
            } catch (canvasError) {
              console.error('Falha no método alternativo de exportação:', canvasError);
              alert('Não foi possível exportar o logo como PNG. Por favor, tente exportar como SVG.');
              reject(canvasError);
            }
          };
          
          altImg.onerror = () => {
            console.error('Ambos os métodos de exportação falharam.');
            alert('Não foi possível exportar o logo como PNG. Por favor, tente exportar como SVG.');
            reject(new Error('Falha em ambos os métodos de exportação PNG.'));
          };
          
          altImg.src = base64Url;
        } catch (base64Error) {
          console.error('Falha ao tentar método alternativo:', base64Error);
          alert('Não foi possível exportar o logo como PNG. Por favor, tente exportar como SVG.');
          reject(base64Error);
        }
      };
      
      img.src = svgUrl;
    });
  }

  /**
   * Helper para disparar o download de um arquivo.
   * @param {string | Blob} dataOrBlobUrl - O DataURL do arquivo ou um Blob.
   * @param {string} filename - O nome do arquivo para download.
   * @private
   */
  _triggerDownload(dataOrBlobOrUrl, filename) {
    const link = document.createElement('a');
    if (typeof dataOrBlobOrUrl === 'string') {
        link.href = dataOrBlobOrUrl; // Assume DataURL ou um URL já existente
    } else if (dataOrBlobOrUrl instanceof Blob) {
        link.href = URL.createObjectURL(dataOrBlobOrUrl);
    } else {
        console.error("Tipo de dado inválido para download.");
        return;
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revogar o ObjectURL se foi criado a partir de um Blob e não é um DataURL
    if (typeof dataOrBlobOrUrl !== 'string' && link.href.startsWith('blob:')) {
      URL.revokeObjectURL(link.href);
    }
  }
  
  // generateVariants e prepareForPublishing são P1/P2 e podem ser implementados depois.
  generateVariants(svgContent, projectDetails) {
    // ... (lógica P1/P2 para criar variantes baseadas no svgContent e detalhes do projeto)
    console.warn("generateVariants não implementado para P0");
    return [{ id: 'main', name: 'Logo Principal', svg: svgContent }]; // Retorna pelo menos o principal
  }
  
  prepareForPublishing(svgString, metadata = {}) {
    // ... (lógica P1/P2 para adicionar metadados ao SVG)
    console.warn("prepareForPublishing não implementado para P0");
    return svgString;
  }
}

// Exporta uma única instância (Singleton pattern)
const exportManager = new ExportManager();
export default exportManager;