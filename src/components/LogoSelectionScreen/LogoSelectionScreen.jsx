import React, { useState } from 'react';
import useLogoStore from '../../store/LogoStore';
import { getAllTemplates, getTemplatesByCategory, getAllCategories } from '../../utils/SVGTemplates';
import '../../index.css';

const LogoSelectionScreen = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { selectLogo, setScreen } = useLogoStore();

  const categories = getAllCategories();
  
  // Get templates based on selected category or all templates
  const templates = selectedCategory === 'all' 
    ? getAllTemplates() 
    : getTemplatesByCategory(selectedCategory);
  
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
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Geometric Logo Generator</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create professional geometric logos in minutes. Choose a base template and customize it to your needs.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Select a Logo Template</h2>
        
        {/* Category selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Templates
          </button>
          
          {categories.map(category => (
            <button 
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
                ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <div 
              key={template.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg 
                ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="bg-gray-50 p-4 h-40 flex items-center justify-center mb-4 rounded">
                <img 
                  src={template.thumbnail} 
                  alt={template.name} 
                  className="h-full object-contain"
                />
              </div>
              <h3 className="font-medium text-lg text-gray-800">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">© 2023 Geometric Logo Generator</p>
      </div>
    </div>
  );
};

export default LogoSelectionScreen;