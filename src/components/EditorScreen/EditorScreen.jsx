import React, { useEffect } from 'react';
import useLogoStore from '../../store/LogoStore';
import svgManager from '../../services/SVGManager';
import colorManager from '../../services/ColorManager';
import fontManager from '../../services/FontManager';
import PropertiesPanel from './PropertiesPanel';
import '../../index.css';

const EditorScreen = () => {
  const { 
    currentProject, 
    setScreen, 
    selectElement,
    updateElement
  } = useLogoStore();

  // Obter elemento selecionado
  const selectedElement = currentProject.selectedElementId 
    ? [...currentProject.elements].find(([id]) => id === currentProject.selectedElementId)?.[1]
    : null;

  // Obter paletas de cores disponíveis (transformando o objeto em array para o map)
  const allColorSchemes = colorManager.getAllColorSchemes();
  const availablePalettes = Object.keys(allColorSchemes).map(schemeName => ({
    id: schemeName,
    name: schemeName.charAt(0).toUpperCase() + schemeName.slice(1), // Capitaliza o nome para exibição
    // Para o preview na UI, pegamos as cores principais
    primary: allColorSchemes[schemeName].find(c => c.name === 'Primary')?.hex || '#000000',
    secondary: allColorSchemes[schemeName].find(c => c.name === 'Secondary')?.hex || '#CCCCCC',
    accent: allColorSchemes[schemeName].find(c => c.name === 'Accent')?.hex || '#FF0000',
  }));
  
  // Initialize the SVG content in the editing canvas
  useEffect(() => {
    const svgContent = currentProject.svgContent;
    const selectedLogoId = currentProject.selectedLogoId;
    
    if (!svgContent || !selectedLogoId) return;
    
    // Initialize the SVG Manager with the current SVG content
    const initSVG = async () => {
      await fontManager.initialize(); // Ensure fonts are loaded
      svgManager.initialize(svgContent, "editing-canvas");
      
      // Apply highlight if there's a selected element
      if (currentProject.selectedElementId) {
        svgManager.highlightSelectedElement(currentProject.selectedElementId);
      }
    };
    
    initSVG();
  }, [currentProject.svgContent, currentProject.selectedLogoId, currentProject.selectedElementId]);
  
  // Manipuladores de evento
  const handleElementChange = (property, value) => {
    if (!currentProject.selectedElementId) return;
    
    const updateData = {};
    updateData[property] = value;
    updateElement(currentProject.selectedElementId, updateData);
  };
  
  const handleApplyPalette = (paletteId) => {
    useLogoStore.getState().applyColorPalette(paletteId);
  };

  const handlePreviousClick = () => {
    setScreen('selection');
  };

  const handleNextClick = () => {
    setScreen('typography');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editor de Logo</h1>
        <div className="flex gap-4">
          <button
            onClick={handlePreviousClick}
            className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleNextClick}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Próximo: Tipografia
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de previsualização */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Prévia</h2>
          <div 
            className="border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center"
            style={{ 
              height: '400px',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            <div 
              id="editing-canvas" 
              className="w-full h-full flex items-center justify-center"
              onClick={() => selectElement(null)} /* Ensure clicking on empty area deselects */
            />
          </div>
        </div>

        {/* Painel de edição */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Paletas de Cores</h2>
            <div className="grid grid-cols-2 gap-3">
              {availablePalettes.map((palette) => (
                <div
                  key={palette.id}
                  className={`p-2 border rounded cursor-pointer hover:shadow transition-shadow
                    ${currentProject.colorPalette?.id === palette.id ? 'border-blue-500 shadow-sm' : 'border-gray-200'}`}
                  onClick={() => handleApplyPalette(palette.id)}
                >
                  <div className="flex mb-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.primary }}></div>
                    <div className="w-6 h-6 rounded ml-1" style={{ backgroundColor: palette.secondary }}></div>
                    <div className="w-6 h-6 rounded ml-1" style={{ backgroundColor: palette.accent }}></div>
                  </div>
                  <span className="text-sm">{palette.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Properties Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Editar Elemento</h2>
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorScreen;