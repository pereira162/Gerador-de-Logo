import React from 'react';
import useLogoStore from '../../store/LogoStore';
import svgManager from '../../services/SVGManager';
import colorManager from '../../services/ColorManager';
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

  // Obter paletas de cores disponíveis
  const availablePalettes = colorManager.getAllPalettes();
  
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

          {/* Editor de elementos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Editar Elemento</h2>
            
            {selectedElement ? (
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700">
                  Selecionado: {currentProject.selectedElementId}
                </p>
                
                {/* Cor de preenchimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cor de Preenchimento
                  </label>
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded mr-2 border border-gray-300" 
                      style={{ backgroundColor: selectedElement.fill || 'transparent' }}
                    />
                    <input
                      type="color"
                      value={selectedElement.fill || '#000000'}
                      onChange={(e) => handleElementChange('fill', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Cor de contorno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cor de Contorno
                  </label>
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded mr-2 border border-gray-300" 
                      style={{ backgroundColor: selectedElement.stroke || 'transparent' }}
                    />
                    <input
                      type="color"
                      value={selectedElement.stroke || '#000000'}
                      onChange={(e) => handleElementChange('stroke', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Espessura do contorno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Espessura do Contorno: {selectedElement.strokeWidth || 0}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={selectedElement.strokeWidth || 0}
                    onChange={(e) => handleElementChange('strokeWidth', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                {/* Opacidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opacidade: {Math.round((selectedElement.opacity || 1) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedElement.opacity || 1}
                    onChange={(e) => handleElementChange('opacity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                Clique em um elemento do logo para editá-lo
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorScreen;