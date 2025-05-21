import React, { useState, useEffect } from 'react';
import useLogoStore from '../../store/LogoStore';
import { availableSVGTemplates } from '../../utils/SVGTemplates';
import '../../index.css';

const LogoSelectionScreen = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { selectLogo, setScreen } = useLogoStore();

  // Dividir os templates em linhas para exibição em grade
  const groupedTemplates = [];
  for (let i = 0; i < availableSVGTemplates.length; i += 3) {
    groupedTemplates.push(availableSVGTemplates.slice(i, i + 3));
  }
  
  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template.id);
    const success = await selectLogo(template.id);
    if (success) {
      setScreen('editor');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Gerador de Logo Geométrico</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Crie logotipos geométricos profissionais em minutos. Escolha um modelo base e personalize-o conforme sua necessidade.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Escolha um modelo de logo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableSVGTemplates.map(template => (
            <div 
              key={template.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg 
                ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="bg-gray-50 p-4 h-40 flex items-center justify-center mb-4 rounded">
                {template.preview ? (
                  <img 
                    src={template.preview} 
                    alt={template.name} 
                    className="h-full object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl text-gray-500">{template.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-lg text-gray-800">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">© 2023 Gerador de Logo Geométrico</p>
      </div>
    </div>
  );
};

export default LogoSelectionScreen;