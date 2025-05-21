// src/components/LogoCreator.jsx
import React, { useState, useEffect } from 'react';
import SVGTemplateSelector from './SVGTemplateSelector';
import SVGPreview from './SVGPreview';
import SVGExporter from './SVGExporter'; // Usado na tela de exportação
import useLogoStore from '../store/LogoStore';
import colorManager from '../services/ColorManager';
import fontManager from '../services/FontManager';

// Importar os painéis de edição que podem ter sido separados
// import PropertiesPanel from './EditorScreen/PropertiesPanel'; // Se você tiver
// import ColorEditorPanel from './EditorScreen/ColorEditorPanel'; // Se você tiver

const LogoCreator = () => {
  useEffect(() => {
    const initializeResources = async () => {
      try {
        await fontManager.initialize();
        // Inicializa com o primeiro esquema ou 'modern'
        const schemes = colorManager.getAllColorSchemes();
        const schemeKeys = Object.keys(schemes);
        colorManager.setActiveColorScheme(schemeKeys.length > 0 ? schemeKeys[0] : 'modern');
      } catch (error) {
        console.error('Erro ao carregar recursos:', error);
      }
    };
    initializeResources();
  }, []);

  const { 
    currentProject, 
    currentScreen, 
    setScreen, 
    // selectElement, // A seleção é feita pelo SVGManager e notificada ao store
    updateElement, // Para estilos
    updateElementTransform, // Para transformações
    initElementTransform, // Para inicializar transformações no store
    addTextElement // Para adicionar texto
  } = useLogoStore();

  // O estado local do colorPicker pode ser removido se a UI for simplificada ou
  // se o ColorPicker for um componente mais complexo que gerencia seu próprio estado de abertura.
  // const [colorPicker, setColorPicker] = useState({ isOpen: false, elementId: null, propertyType: 'fill' });

  // Ler estilos e transformações do store para o elemento selecionado
  const selectedElementStyles = currentProject.selectedElementId 
    ? currentProject.currentElementStyles || {} 
    : {};
  const selectedElementTransforms = currentProject.selectedElementId
    ? currentProject.transformations.get(currentProject.selectedElementId) || 
      { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0 }
    : { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0 };


  useEffect(() => {
    if (currentProject.selectedElementId && !currentProject.transformations.has(currentProject.selectedElementId)) {
      initElementTransform(currentProject.selectedElementId);
    }
  }, [currentProject.selectedElementId, currentProject.transformations, initElementTransform]);

  const handleStyleChange = (property, value) => {
    if (!currentProject.selectedElementId) return;
    updateElement(currentProject.selectedElementId, { [property]: value });
  };
  
  const handleTransformChange = (property, value) => {
    if (!currentProject.selectedElementId) return;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return; // Evitar passar NaN
    updateElementTransform(currentProject.selectedElementId, { [property]: numericValue });
  };
  
  const resetElementTransformAndStyle = () => { // Renomeado para clareza P0
    if (!currentProject.selectedElementId) return;
    // P0: Resetar transformações para o padrão
    updateElementTransform(currentProject.selectedElementId, {
      translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0
    });
    // P0: Resetar fill para uma cor padrão (ex: cinza)
    updateElement(currentProject.selectedElementId, { fill: '#CCCCCC' });
    // Stroke e outros estilos podem ser P1
  };

  const handleAddText = () => {
    const textContent = prompt('Digite o nome da empresa (P0):');
    if (!textContent || !textContent.trim()) return;

    // Para P0, usamos a primeira fonte P0 e cor de texto com contraste
    const defaultFontP0 = fontManager.getAvailableFonts().find(f => f.name === 'Inter') || fontManager.getAvailableFonts()[0];
    const textColorP0 = colorManager.getTextColorForBackground(currentProject.colorPalette.primary || '#FFFFFF');

    addTextElement({
      content: textContent,
      fontFamily: defaultFontP0.family,
      fontSize: 32, // Tamanho P0
      fontWeight: '700', // Peso P0
      fill: textColorP0,
      type: 'companyName',
      position: { x: 200, y: 350 }, // Posição P0 fixa
      alignment: 'middle' // P0 fixo
    });
  };

  const renderContent = () => {
    switch (currentScreen) {
      case 'selection':
        return (
          <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Crie seu Logo Geométrico</h1>
            <SVGTemplateSelector /> {/* Assume que SVGTemplateSelector foi atualizado para usar os novos SVGTemplates.jsx */}
          </div>
        );
      
      case 'editor':
        return (
          <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                {/* Passa um ID único para o container do preview principal */}
                <SVGPreview containerId="main-editing-canvas-preview" />
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleAddText}
                    className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Adicionar Nome da Empresa (P0)
                  </button>
                </div>
              </div>
              
              <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-150px)]">
                <h2 className="text-2xl font-bold mb-4">Personalizar Elementos</h2>
                
                {currentProject.selectedElementId ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Editando: <span className="font-mono text-sm">{currentProject.selectedElementId}</span>
                      </h3>

                      {/* Controles de Cor (P0 - Fill) */}
                      <div className="col-span-2 pb-4 border-b border-gray-200">
                        <h4 className="text-md font-medium mb-3">Cor de Preenchimento (Fill)</h4>
                        <div className="flex items-center">
                           <input
                            type="color"
                            className="ml-2 p-0 w-10 h-10 border-0 cursor-pointer" // Estilo para melhor visualização
                            value={selectedElementStyles.fill || '#CCCCCC'}
                            onChange={(e) => handleStyleChange('fill', e.target.value)}
                          />
                          <input 
                            type="text" 
                            className="ml-2 p-1 border border-gray-300 rounded text-sm flex-1"
                            value={selectedElementStyles.fill || '#CCCCCC'}
                            onChange={(e) => {
                                if (/^#[0-9A-F]{6}$/i.test(e.target.value) || /^#[0-9A-F]{3}$/i.test(e.target.value)) {
                                    handleStyleChange('fill', e.target.value);
                                }
                            }}
                            placeholder="#RRGGBB"
                          />
                        </div>
                      </div>

                      {/* Controles de Transformação (P0) */}
                      <div className="col-span-2 pt-4 pb-4 border-b border-gray-200">
                        <h4 className="text-md font-medium mb-3">Transformações</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Posição X</label>
                            <input 
                              type="number" step="1" className="w-full mt-1 p-1 border rounded" 
                              value={selectedElementTransforms.translateX}
                              onChange={(e) => handleTransformChange('translateX', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Posição Y</label>
                            <input 
                              type="number" step="1" className="w-full mt-1 p-1 border rounded"
                              value={selectedElementTransforms.translateY}
                              onChange={(e) => handleTransformChange('translateY', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Escala X</label>
                            <input 
                              type="number" min="0.1" max="5" step="0.01" className="w-full mt-1 p-1 border rounded"
                              value={selectedElementTransforms.scaleX}
                              onChange={(e) => handleTransformChange('scaleX', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Escala Y</label>
                            <input 
                              type="number" min="0.1" max="5" step="0.01" className="w-full mt-1 p-1 border rounded"
                              value={selectedElementTransforms.scaleY}
                              onChange={(e) => handleTransformChange('scaleY', e.target.value)} />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Rotação (°)</label>
                            <input 
                              type="number" min="0" max="360" step="1" className="w-full mt-1 p-1 border rounded"
                              value={selectedElementTransforms.rotation}
                              onChange={(e) => handleTransformChange('rotation', e.target.value)} />
                          </div>
                        </div>
                        <div className="mt-3 text-right">
                          <button
                            onClick={resetElementTransformAndStyle}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Redefinir Elemento (P0: Fill e Transform)
                          </button>
                        </div>
                      </div>
                      {/* Outros Controles de Estilo (Stroke, StrokeWidth, Opacity) são P1/P2 */}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <p>Selecione um elemento no logo para editá-lo.</p>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setScreen('typography')} // Mudado para levar à tela de tipografia
                    className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors w-full mb-2"
                  >
                    Avançar para Tipografia
                  </button>
                  <button
                    onClick={() => setScreen('export')}
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
                  >
                    Ir para Exportação
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'typography': // Adicionando case para a tela de tipografia
        return <TypographyScreen />; // Renderiza o componente TypographyScreen

      case 'export':
        return (
          <div className="container mx-auto p-4">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <SVGPreview containerId="export-screen-preview" /> {/* ID Único */}
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
            <p>Tela não encontrada.</p>
            <button onClick={() => setScreen('selection')} className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md">
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
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Gerador de Logo Geométrico
          </h1>
          <nav className="flex justify-center mt-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-l-md transition-colors
                  ${currentScreen === 'selection' 
                    ? 'bg-blue-600 text-white ring-1 ring-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-300'}`}
                onClick={() => setScreen('selection')}
              >
                1. Modelos
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors
                  ${currentScreen === 'editor' 
                    ? 'bg-blue-600 text-white ring-1 ring-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-300'}
                  ${!currentProject.selectedLogoId ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => currentProject.selectedLogoId && setScreen('editor')}
                disabled={!currentProject.selectedLogoId}
              >
                2. Editor
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors
                  ${currentScreen === 'typography' 
                    ? 'bg-blue-600 text-white ring-1 ring-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-300'}
                  ${!currentProject.selectedLogoId ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => currentProject.selectedLogoId && setScreen('typography')}
                disabled={!currentProject.selectedLogoId}
              >
                3. Tipografia
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors
                  ${currentScreen === 'export' 
                    ? 'bg-blue-600 text-white ring-1 ring-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-300'}
                  ${!currentProject.selectedLogoId ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => currentProject.selectedLogoId && setScreen('export')}
                disabled={!currentProject.selectedLogoId}
              >
                4. Exportar
              </button>
            </div>
          </nav>
        </header>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default LogoCreator;