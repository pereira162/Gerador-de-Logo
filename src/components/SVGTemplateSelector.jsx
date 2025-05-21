import React, { useState, useEffect } from 'react';
import { availableSVGTemplates } from '../utils/SVGTemplates';
import useLogoStore from '../store/LogoStore';

const SVGTemplateSelector = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { selectLogo } = useLogoStore();

  // Dividir os templates em linhas para exibição em grade
  const groupedTemplates = [];
  for (let i = 0; i < availableSVGTemplates.length; i += 3) {
    groupedTemplates.push(availableSVGTemplates.slice(i, i + 3));
  }
  
  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template);
    await selectLogo(template.id);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Selecione um ícone base</h2>
      <p className="text-gray-600 mb-6">
        Escolha um dos modelos geométricos abaixo como base para o seu logo.
        Você poderá personalizar cores e formas na próxima etapa.
      </p>
      
      <div className="space-y-6">
        {groupedTemplates.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-4">
            {row.map((template) => (
              <div 
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`w-full sm:w-64 p-4 border rounded-md hover:shadow-lg transition-all cursor-pointer 
                  ${selectedTemplate?.id === template.id 
                    ? 'border-blue-500 shadow-md bg-blue-50' 
                    : 'border-gray-300'}`}
              >
                <div className="bg-gray-50 p-4 h-48 flex items-center justify-center mb-3 rounded-md">
                  {template.preview ? (
                    <img 
                      src={template.preview} 
                      alt={template.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">{template.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-lg text-gray-800">{template.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{template.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SVGTemplateSelector;