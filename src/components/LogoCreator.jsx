import React, { useState, useEffect } from 'react';
import SVGTemplateSelector from './SVGTemplateSelector';
import SVGPreview from './SVGPreview';
import SVGExporter from './SVGExporter';
import useLogoStore from '../store/LogoStore';

const LogoCreator = () => {
  const { currentProject, currentScreen, setScreen, selectElement, updateElement } = useLogoStore();
  const [colorPicker, setColorPicker] = useState({
    isOpen: false,
    elementId: null,
    propertyType: 'fill', // 'fill' ou 'stroke'
  });

  // Elementos ativos no editor
  const selectedElement = currentProject.selectedElementId
    ? [...currentProject.elements].find(([id]) => id === currentProject.selectedElementId)?.[1]
    : null;

  // Gerenciar mudança de valores para o elemento selecionado
  const handleElementChange = (property, value) => {
    if (!currentProject.selectedElementId) return;

    let updateData = {};
    updateData[property] = value;
    
    updateElement(currentProject.selectedElementId, updateData);
  };

  // Adicionar texto ao logo
  const handleAddText = () => {
    const textContent = prompt('Digite o texto para adicionar ao logo:');
    if (!textContent) return;

    const textElement = {
      content: textContent,
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#000000',
      type: 'companyName'
    };

    // Adicionar texto no centro do logo
    useLogoStore.getState().addTextElement(textElement);
  };

  // Renderizar conteúdo baseado na tela atual
  const renderContent = () => {
    switch (currentScreen) {
      case 'selection':
        return (
          <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Crie seu Logo Geométrico</h1>
            <SVGTemplateSelector />
          </div>
        );
      
      case 'editor':
        return (
          <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Área de Preview */}
              <div className="lg:w-1/2">
                <SVGPreview />
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleAddText}
                    className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Adicionar Texto
                  </button>
                </div>
              </div>
              
              {/* Área de Edição */}
              <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Personalizar Elementos</h2>
                
                {selectedElement ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Editando: {currentProject.selectedElementId}
                      </h3>
                      <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
                        {/* Cores */}
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cor de Preenchimento
                          </label>
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
                              style={{ backgroundColor: selectedElement.fill || '#FFFFFF' }}
                              onClick={() => setColorPicker({ 
                                isOpen: true, 
                                elementId: currentProject.selectedElementId, 
                                propertyType: 'fill' 
                              })}
                            />
                            <input
                              type="color"
                              className="ml-2 p-1 w-16"
                              value={selectedElement.fill || '#FFFFFF'}
                              onChange={(e) => handleElementChange('fill', e.target.value)}
                            />
                            <input 
                              type="text" 
                              className="ml-2 p-1 border border-gray-300 rounded text-sm"
                              value={selectedElement.fill || '#FFFFFF'}
                              onChange={(e) => handleElementChange('fill', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cor de Contorno
                          </label>
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
                              style={{ backgroundColor: selectedElement.stroke || '#000000' }}
                              onClick={() => setColorPicker({
                                isOpen: true,
                                elementId: currentProject.selectedElementId,
                                propertyType: 'stroke'
                              })}
                            />
                            <input
                              type="color"
                              className="ml-2 p-1 w-16"
                              value={selectedElement.stroke || '#000000'}
                              onChange={(e) => handleElementChange('stroke', e.target.value)}
                            />
                            <input 
                              type="text" 
                              className="ml-2 p-1 border border-gray-300 rounded text-sm"
                              value={selectedElement.stroke || '#000000'}
                              onChange={(e) => handleElementChange('stroke', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        {/* Largura do traço */}
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Espessura do Contorno
                          </label>
                          <div className="flex items-center">
                            <input
                              type="range"
                              min="0"
                              max="20"
                              step="0.5"
                              className="w-full"
                              value={selectedElement.strokeWidth || 0}
                              onChange={(e) => handleElementChange('strokeWidth', parseFloat(e.target.value))}
                            />
                            <span className="ml-2 min-w-[40px] text-center">
                              {selectedElement.strokeWidth || 0}
                            </span>
                          </div>
                        </div>
                        
                        {/* Opacidade */}
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opacidade
                          </label>
                          <div className="flex items-center">
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              className="w-full"
                              value={selectedElement.opacity || 1}
                              onChange={(e) => handleElementChange('opacity', parseFloat(e.target.value))}
                            />
                            <span className="ml-2 min-w-[40px] text-center">
                              {Math.round((selectedElement.opacity || 1) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <p>Selecione um elemento no logo para editá-lo</p>
                    <p className="text-sm mt-2">Clique em qualquer parte do logo para começar</p>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setScreen('export')}
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Avançar para Exportação
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'export':
        return (
          <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <SVGPreview />
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={() => setScreen('editor')}
                    className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Voltar para Edição
                  </button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <SVGExporter />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <p>Tela não encontrada. Por favor retorne à seleção de logo.</p>
            <button
              onClick={() => setScreen('selection')}
              className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Voltar para Seleção
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">
            Gerador de Logo Geométrico
          </h1>
          <div className="flex justify-center mt-4">
            <div className="inline-flex rounded-md shadow">
              <button
                className={`px-4 py-2 ${
                  currentScreen === 'selection' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-l-md`}
                onClick={() => setScreen('selection')}
              >
                Escolher Modelo
              </button>
              <button
                className={`px-4 py-2 ${
                  currentScreen === 'editor' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => currentProject.selectedLogoId ? setScreen('editor') : null}
                disabled={!currentProject.selectedLogoId}
              >
                Editar Logo
              </button>
              <button
                className={`px-4 py-2 ${
                  currentScreen === 'export' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-r-md`}
                onClick={() => currentProject.selectedLogoId ? setScreen('export') : null}
                disabled={!currentProject.selectedLogoId}
              >
                Exportar
              </button>
            </div>
          </div>
        </header>

        {renderContent()}
      </div>
    </div>
  );
};

export default LogoCreator;