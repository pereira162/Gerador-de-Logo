import React, { useState, useEffect } from 'react';
import useLogoStore from '../../store/LogoStore';
import fontManager from '../../services/FontManager';
import svgManager from '../../services/SVGManager';
import colorManager from '../../services/ColorManager';

const TypographyScreen = () => {
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [companyNameFont, setCompanyNameFont] = useState('Inter');
  const [taglineFont, setTaglineFont] = useState('Inter');
  const [companyNameSize, setCompanyNameSize] = useState(24);
  const [taglineSize, setTaglineSize] = useState(16);
  const [companyNameWeight, setCompanyNameWeight] = useState('500');
  const [taglineWeight, setTaglineWeight] = useState('400');
  const [namePosition, setNamePosition] = useState('below');
  const [taglinePosition, setTaglinePosition] = useState('below-name');
  
  const { 
    currentProject, 
    addTextElement, 
    updateTextElement, 
    setScreen 
  } = useLogoStore(state => ({
    currentProject: state.currentProject,
    addTextElement: state.addTextElement,
    updateTextElement: state.updateTextElement,
    setScreen: state.setScreen
  }));

  // Available fonts
  const availableFonts = fontManager.getAvailableFonts();
  
  // Load existing text elements if they exist
  useEffect(() => {
    // Load fonts
    fontManager.loadFonts();
    
    // Check if we already have text elements
    const existingCompanyName = currentProject.textElements.find(el => el.type === 'companyName');
    const existingTagline = currentProject.textElements.find(el => el.type === 'tagline');
    
    if (existingCompanyName) {
      setCompanyName(existingCompanyName.content);
      setCompanyNameFont(existingCompanyName.fontFamily.split(',')[0]);
      setCompanyNameSize(existingCompanyName.fontSize);
      setCompanyNameWeight(existingCompanyName.fontWeight);
      setNamePosition(existingCompanyName.positionType || 'below');
    }
    
    if (existingTagline) {
      setTagline(existingTagline.content);
      setTaglineFont(existingTagline.fontFamily.split(',')[0]);
      setTaglineSize(existingTagline.fontSize);
      setTaglineWeight(existingTagline.fontWeight);
      setTaglinePosition(existingTagline.positionType || 'below-name');
    }
    
  }, [currentProject.textElements]);
  
  // Update or add company name text
  const handleUpdateCompanyName = () => {
    const existingCompanyName = currentProject.textElements.find(el => el.type === 'companyName');
    const textColor = colorManager.getContrastColor(currentProject.colorPalette?.primary || '#0B3C5D');
    
    // Calculate position based on selection
    let position;
    if (namePosition === 'below') {
      position = { x: 200, y: 350 };
    } else if (namePosition === 'above') {
      position = { x: 200, y: 30 };
    } else if (namePosition === 'left') {
      position = { x: 30, y: 200 };
    } else if (namePosition === 'right') {
      position = { x: 370, y: 200 };
    }
    
    // If company name already exists, update it
    if (existingCompanyName) {
      updateTextElement(existingCompanyName.id, {
        content: companyName,
        fontFamily: `${companyNameFont}, sans-serif`,
        fontSize: companyNameSize,
        fontWeight: companyNameWeight,
        fill: textColor,
        position,
        positionType: namePosition
      });
    } 
    // Otherwise create new company name
    else if (companyName) {
      addTextElement({
        content: companyName,
        fontFamily: `${companyNameFont}, sans-serif`,
        fontSize: companyNameSize,
        fontWeight: companyNameWeight,
        fill: textColor,
        position,
        positionType: namePosition,
        type: 'companyName',
        alignment: 'center'
      });
    }
    
    // Now handle tagline positioning relative to company name
    updateTagline();
  };
  
  // Update or add tagline text
  const updateTagline = () => {
    const existingTagline = currentProject.textElements.find(el => el.type === 'tagline');
    const textColor = colorManager.getContrastColor(currentProject.colorPalette?.secondary || '#328CC1');
    
    // Calculate position based on selection and company name position
    let position;
    
    if (taglinePosition === 'below-name') {
      if (namePosition === 'below') {
        position = { x: 200, y: 380 };
      } else if (namePosition === 'above') {
        position = { x: 200, y: 60 };
      } else if (namePosition === 'left') {
        position = { x: 30, y: 225 };
      } else if (namePosition === 'right') {
        position = { x: 370, y: 225 };
      }
    } else if (taglinePosition === 'opposite') {
      if (namePosition === 'below') {
        position = { x: 200, y: 30 };
      } else if (namePosition === 'above') {
        position = { x: 200, y: 350 };
      } else if (namePosition === 'left') {
        position = { x: 370, y: 200 };
      } else if (namePosition === 'right') {
        position = { x: 30, y: 200 };
      }
    }
    
    // If tagline already exists, update it
    if (existingTagline) {
      updateTextElement(existingTagline.id, {
        content: tagline,
        fontFamily: `${taglineFont}, sans-serif`,
        fontSize: taglineSize,
        fontWeight: taglineWeight,
        fill: textColor,
        position,
        positionType: taglinePosition
      });
    } 
    // Otherwise create new tagline
    else if (tagline) {
      addTextElement({
        content: tagline,
        fontFamily: `${taglineFont}, sans-serif`,
        fontSize: taglineSize,
        fontWeight: taglineWeight,
        fill: textColor,
        position,
        positionType: taglinePosition,
        type: 'tagline',
        alignment: 'center'
      });
    }
  };

  // Update both text elements
  const handleApplyChanges = () => {
    handleUpdateCompanyName();
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Typography Editor</h1>
          <div className="space-x-2">
            <button 
              onClick={() => setScreen('editor')}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Back to Editor
            </button>
            <button 
              onClick={() => setScreen('export')}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
            >
              Export Logo
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (Preview) */}
        <div className="w-2/3 p-8 bg-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Logo Preview</h2>
          <div className="flex-1 bg-white rounded-lg shadow-inner border border-gray-200 flex items-center justify-center">
            <div 
              id="editing-canvas" 
              className="w-full max-w-md mx-auto aspect-square"
            >
              {/* SVG is rendered here by SVGManager */}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Preview shows how your company name and tagline will appear with the logo.
          </div>
        </div>
        
        {/* Right Panel (Typography Controls) */}
        <div className="w-1/3 p-6 border-l border-gray-300 overflow-y-auto">
          <div className="space-y-6">
            {/* Company Name */}
            <div className="pb-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Company Name</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
                  <select 
                    value={companyNameFont} 
                    onChange={(e) => setCompanyNameFont(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    {availableFonts.map(font => (
                      <option key={font.name} value={font.name}>{font.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="12" 
                        max="48" 
                        value={companyNameSize} 
                        onChange={(e) => setCompanyNameSize(Number(e.target.value))}
                        className="w-full mr-2"
                      />
                      <span className="w-8 text-center">{companyNameSize}px</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <select 
                      value={companyNameWeight} 
                      onChange={(e) => setCompanyNameWeight(e.target.value)}
                      className="w-full border rounded p-2"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="700">Bold</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select 
                    value={namePosition} 
                    onChange={(e) => setNamePosition(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    <option value="below">Below Logo</option>
                    <option value="above">Above Logo</option>
                    <option value="left">Left of Logo</option>
                    <option value="right">Right of Logo</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Tagline */}
            <div className="pb-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Tagline</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input 
                    type="text" 
                    value={tagline} 
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Enter your tagline"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
                  <select 
                    value={taglineFont} 
                    onChange={(e) => setTaglineFont(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    {availableFonts.map(font => (
                      <option key={font.name} value={font.name}>{font.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="8" 
                        max="32" 
                        value={taglineSize} 
                        onChange={(e) => setTaglineSize(Number(e.target.value))}
                        className="w-full mr-2"
                      />
                      <span className="w-8 text-center">{taglineSize}px</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <select 
                      value={taglineWeight} 
                      onChange={(e) => setTaglineWeight(e.target.value)}
                      className="w-full border rounded p-2"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="700">Bold</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select 
                    value={taglinePosition} 
                    onChange={(e) => setTaglinePosition(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    <option value="below-name">Near Company Name</option>
                    <option value="opposite">Opposite Side of Logo</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Apply Changes */}
            <div>
              <button 
                onClick={handleApplyChanges}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
              >
                Apply Typography Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographyScreen;