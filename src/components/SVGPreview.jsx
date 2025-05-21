// src/components/SVGPreview.jsx
import React, { useEffect, useRef } from 'react';
import useLogoStore from '../store/LogoStore';
import svgManager from '../services/SVGManager';
import fontManager from '../services/FontManager'; // Ainda necessário para garantir que as fontes sejam carregadas

const SVGPreview = ({ width = 400, height = 400, containerId = 'svg-preview-default' }) => { // Adicionado containerId como prop
  const canvasRef = useRef(null);
  const { currentProject, selectElement } = useLogoStore(state => ({
      currentProject: state.currentProject,
      selectElement: state.selectElement,
  }));
  
  // Configurar o handler de seleção uma vez
  useEffect(() => {
    // Este useEffect é problemático se svgManager for um singleton e este componente
    // for montado/desmontado ou usado em múltiplas instâncias.
    // O callback de seleção talvez devesse ser global ou gerenciado de outra forma
    // se múltiplos previews precisarem ser interativos. Para P0, um preview principal interativo.
    svgManager.setElementSelectCallback((elementId) => {
      selectElement(elementId);
    });
  }, [selectElement]);
  
  // Carregar/Atualizar SVG no canvas quando o conteúdo ou ID do container mudar
  useEffect(() => {
    const loadSVGContent = async () => {
      if (canvasRef.current && currentProject.svgContent) {
        await fontManager.initialize(); // Garante que as fontes P0 estão prontas
        
        // Limpar o container específico antes de renderizar
        const container = document.getElementById(containerId);
        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            console.log(`SVGPreview: Initializing SVG in container ${containerId} with content:`, currentProject.svgContent.substring(0, 50) + '...');
            svgManager.initialize(currentProject.svgContent, containerId);
            // O highlight é chamado pelo store quando selectedElementId muda
            if (currentProject.selectedElementId && containerId === 'main-editing-canvas-preview') { // Atualizado para novo ID
                 svgManager.highlightSelectedElement(currentProject.selectedElementId);
            }
        } else {
            console.warn(`SVGPreview: Container com id "${containerId}" não encontrado.`);
        }

      } else if (canvasRef.current) { // Limpa se não houver svgContent
          const container = document.getElementById(containerId);
          if (container) container.innerHTML = '';
      }
    };
    
    loadSVGContent();
  }, [currentProject.svgContent, containerId]); // Depende de svgContent e containerId

  // Reaplicar o highlight se o elemento selecionado mudar E este for o canvas principal de edição
  useEffect(() => {
    if (containerId === 'main-editing-canvas-preview' && currentProject.selectedElementId) { // Main editing canvas ID
        // Re-initialize for the selected container to ensure proper element selection
        if (currentProject.svgContent) {
            svgManager.initialize(currentProject.svgContent, containerId);
            svgManager.highlightSelectedElement(currentProject.selectedElementId);
        }
    }
  }, [currentProject.selectedElementId, containerId, currentProject.svgContent]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Prévia do Logo</h2>
        {containerId === 'main-editing-canvas-preview' && <p className="text-gray-500 text-sm">Clique em um elemento para editá-lo</p>}
      </div>
      
      <div 
        className="border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center"
        style={{ 
          width: width, 
          height: height, 
          maxWidth: '100%',
          margin: '0 auto'
        }}
      >
        {/* O ID do div interno agora é dinâmico */}
        <div 
          id={containerId} 
          ref={canvasRef}
          className="w-full h-full flex items-center justify-center"
        />
      </div>
    </div>
  );
};

export default SVGPreview;