import React, { useState, useEffect } from 'react';
import useLogoStore from '../../store/LogoStore';
import fontManager from '../../services/FontManager';
import svgManager from '../../services/SVGManager';
import '../../index.css';

const TypographyScreen = () => {
  const { currentProject, setScreen, addTextElement, updateTextElement } = useLogoStore();
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [selectedFont, setSelectedFont] = useState(fontManager.getAvailableFonts()[0]?.family || 'Roboto');
  const [fontWeight, setFontWeight] = useState('400');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');

  // Get the current SVG content from the store
  const svgContent = useLogoStore(state => state.currentProject.svgContent);
  const selectedLogoId = useLogoStore(state => state.currentProject.selectedLogoId);

  // Obter todas as fontes disponíveis
  const availableFonts = fontManager.getAvailableFonts();
  
  // Obter pesos de fonte disponíveis para a fonte selecionada
  const selectedFontObj = fontManager.getFontByFamily(selectedFont);
  const availableWeights = selectedFontObj ? selectedFontObj.variants : ['400', '700'];

  // Initialize the SVG content in the editing canvas
  useEffect(() => {
    if (!svgContent || !selectedLogoId) return;
    
    // Initialize the SVG Manager with the current SVG content
    svgManager.initialize(svgContent, "typography-screen-preview-container");
    
  }, [svgContent, selectedLogoId]);

  // Manipuladores de eventos
  const handleAddCompanyName = () => {
    if (!companyName.trim()) return;
    
    const companyNameId = currentProject.textElements.find(el => el.type === 'companyName')?.id;
    
    if (companyNameId) {
      // Atualizar texto existente
      updateTextElement(companyNameId, {
        content: companyName,
        fontFamily: selectedFont,
        fontSize: fontSize,
        fontWeight: fontWeight,
        fill: textColor,
      });
    } else {
      // Adicionar novo texto
      addTextElement({
        content: companyName,
        fontFamily: selectedFont,
        fontSize: fontSize,
        fontWeight: fontWeight,
        fill: textColor,
        position: { x: 200, y: 320 }, // Posição abaixo do logo
        alignment: 'center',
        type: 'companyName',
      });
    }
  };

  const handleAddTagline = () => {
    if (!tagline.trim()) return;
    
    const taglineId = currentProject.textElements.find(el => el.type === 'tagline')?.id;
    
    if (taglineId) {
      // Atualizar texto existente
      updateTextElement(taglineId, {
        content: tagline,
        fontFamily: selectedFont,
        fontSize: Math.max(fontSize - 6, 10), // Menor que o nome da empresa
        fontWeight: fontWeight,
        fill: textColor,
      });
    } else {
      // Adicionar novo texto
      addTextElement({
        content: tagline,
        fontFamily: selectedFont,
        fontSize: Math.max(fontSize - 6, 10), // Menor que o nome da empresa
        fontWeight: fontWeight,
        fill: textColor,
        position: { x: 200, y: 350 }, // Posição abaixo do nome da empresa
        alignment: 'center',
        type: 'tagline',
      });
    }
  };

  const handlePreviousClick = () => {
    setScreen('editor');
  };

  const handleNextClick = () => {
    setScreen('export');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tipografia</h1>
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
            Próximo: Exportar
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
              id="typography-screen-preview-container" 
              className="w-full h-full flex items-center justify-center"
            />
          </div>
        </div>

        {/* Painel de edição de tipografia */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Adicionar Texto</h2>
            
            <div className="space-y-6">
              {/* Nome da empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Sua empresa"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Slogan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Seu slogan aqui"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Fonte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonte
                </label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {availableFonts.map(font => (
                    <option key={font.family} value={font.family} style={{ fontFamily: font.family }}>
                      {font.displayName}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Peso da fonte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso da Fonte
                </label>
                <select
                  value={fontWeight}
                  onChange={(e) => setFontWeight(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {availableWeights.map(weight => (
                    <option key={weight} value={weight}>
                      {weight === '400' ? 'Normal (400)' : 
                       weight === '700' ? 'Negrito (700)' : `Peso ${weight}`}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Tamanho da fonte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho da Fonte: {fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="48"
                  step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              {/* Cor do texto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor do Texto
                </label>
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded mr-2 border border-gray-300" 
                    style={{ backgroundColor: textColor }}
                  />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Botões de aplicação */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddCompanyName}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Aplicar Nome
                </button>
                <button
                  onClick={handleAddTagline}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Aplicar Slogan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographyScreen;