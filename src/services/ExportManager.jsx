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

    // 1. Garantir que as fontes P0 estejam prontas e carregadas.
    // Uma abordagem mais avançada (P1/P2) seria identificar as fontes USADAS no svgContent
    // e garantir que apenas elas sejam carregadas.
    try {
      await fontManager.loadInitialFonts(); // Ou um método que carregue as fontes P0
      console.log("Fontes verificadas/carregadas para exportação PNG.");
    } catch (error) {
      console.error("Erro ao carregar fontes para exportação PNG:", error);
      // Pode-se optar por continuar mesmo assim, o navegador pode usar fallbacks.
      // alert("Atenção: Algumas fontes podem não ter sido carregadas corretamente para a exportação PNG.");
    }

    // 2. Criar uma imagem a partir do SVG string
    return new Promise((resolve, reject) => {
      const img = new Image();

      // Para evitar problemas com caracteres especiais e garantir que o SVG seja bem formado para o Image src:
      // Codificar o SVG string para ser usado em um data URL.
      // Removido o encodeURIComponent que estava causando problemas com a renderização de SVG em Image.src
      // O ideal é que o svgContent já seja uma string SVG válida e limpa.
      // Se houver problemas, pode ser necessário sanitizar ou usar btoa para base64.
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${svgContent}`;
      // Alternativa com base64 se houver problemas com caracteres especiais:
      // const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;


      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let svgWidth = 400; // Default
          let svgHeight = 400; // Default

          // Tentar extrair dimensões do SVG (do viewBox ou width/height)
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
          const svgNode = svgDoc.documentElement;

          if (svgNode) {
            const viewBox = svgNode.getAttribute('viewBox');
            if (viewBox) {
              const parts = viewBox.split(' ');
              if (parts.length === 4) {
                svgWidth = parseFloat(parts[2]); // width do viewBox
                svgHeight = parseFloat(parts[3]); // height do viewBox
              }
            } else {
              // Se não houver viewBox, tenta pegar width/height do elemento SVG
              // Mas estes podem ser relativos (ex: '100%'), então um fallback numérico é importante.
              svgWidth = parseFloat(svgNode.getAttribute('width')) || svgWidth;
              svgHeight = parseFloat(svgNode.getAttribute('height')) || svgHeight;
            }
            // Garante que não sejam NaN
            svgWidth = isNaN(svgWidth) ? 400 : svgWidth;
            svgHeight = isNaN(svgHeight) ? 400 : svgHeight;
          }
          
          canvas.width = svgWidth * resolutionScale;
          canvas.height = svgHeight * resolutionScale;
          
          const ctx = canvas.getContext('2d');
          
          // Limpar o canvas para garantir transparência se o SVG não tiver fundo explícito
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const pngDataUrl = canvas.toDataURL('image/png');
          
          this._triggerDownload(pngDataUrl, filename);
          console.log(`${filename} exportação PNG iniciada.`);
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
        console.error('Falha ao carregar a imagem SVG para conversão PNG. O SVG pode estar malformado ou conter recursos não suportados.', e);
        alert('Falha ao preparar a imagem para exportação PNG. Verifique se o logo contém elementos complexos ou fontes não padrão.');
        if (img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
        reject(new Error('Falha ao carregar a imagem SVG para conversão PNG.'));
      };
      
      img.src = svgDataUrl;
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