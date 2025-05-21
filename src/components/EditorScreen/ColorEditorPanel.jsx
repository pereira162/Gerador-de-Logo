import React, { useState } from 'react';
import useLogoStore from '../../store/LogoStore';
import colorManager from '../../services/ColorManager';

const ColorEditorPanel = () => {
  const [isGlobalMode, setIsGlobalMode] = useState(true);
  const [customPaletteName, setCustomPaletteName] = useState('');
  const [customPrimary, setCustomPrimary] = useState('#0B3C5D');
  const [customSecondary, setCustomSecondary] = useState('#328CC1');
  const [customAccent, setCustomAccent] = useState('#D9B310');

  const { 
    currentProject, 
    selectedElementId, 
    applyColorPalette, 
    applyElementColor 
  } = useLogoStore(state => ({
    currentProject: state.currentProject,
    selectedElementId: state.currentProject.selectedElementId,
    applyColorPalette: state.applyColorPalette,
    applyElementColor: state.applyElementColor
  }));
  
  const presetPalettes = colorManager.getPresetPalettes();
  const selectedElement = selectedElementId ? currentProject.elements.get(selectedElementId) : null;
  
  // Handle color mode toggle between global and element-specific
  const handleColorModeToggle = (mode) => {
    setIsGlobalMode(mode === 'global');
  };
  
  // Handle palette selection
  const handlePaletteSelect = (paletteId) => {
    applyColorPalette(paletteId);
  };
  
  // Handle element color change
  const handleElementColorChange = (type, color) => {
    if (!selectedElementId) return;
    applyElementColor(selectedElementId, color, type);
  };
  
  // Handle custom palette creation
  const handleCreateCustomPalette = () => {
    if (!customPaletteName.trim()) {
      alert('Please enter a name for your custom palette');
      return;
    }
    
    const customPalette = colorManager.createCustomPalette(
      customPaletteName,
      customPrimary,
      customSecondary,
      customAccent
    );
    
    // Apply the custom palette
    applyColorPalette(customPalette.id);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Color Editor</h3>
        
        {/* Color Mode Toggle */}
        <div className="flex mb-4 border rounded overflow-hidden">
          <button 
            className={`flex-1 py-2 text-sm font-medium ${isGlobalMode ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handleColorModeToggle('global')}
          >
            Global Colors
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium ${!isGlobalMode ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handleColorModeToggle('element')}
            disabled={!selectedElementId}
          >
            Element Colors
          </button>
        </div>
      </div>
      
      {/* Global Color Mode */}
      {isGlobalMode ? (
        <div>
          <h4 className="font-medium mb-3">Color Palettes</h4>
          <div className="space-y-3">
            {presetPalettes.map(palette => (
              <div 
                key={palette.id} 
                className="p-3 border rounded hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => handlePaletteSelect(palette.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{palette.name}</span>
                  {currentProject.colorPalette?.id === palette.id && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded" style={{backgroundColor: palette.primary}}></div>
                  <div className="w-8 h-8 rounded" style={{backgroundColor: palette.secondary}}></div>
                  <div className="w-8 h-8 rounded" style={{backgroundColor: palette.accent}}></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Custom Palette Creator */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-3">Create Custom Palette</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Palette Name</label>
                <input 
                  type="text" 
                  value={customPaletteName} 
                  onChange={(e) => setCustomPaletteName(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                  placeholder="My Custom Palette"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex items-center">
                  <input 
                    type="color" 
                    value={customPrimary} 
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="h-10 w-14 border-0"
                  />
                  <input 
                    type="text" 
                    value={customPrimary} 
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="ml-2 flex-1 border rounded p-2 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <div className="flex items-center">
                  <input 
                    type="color" 
                    value={customSecondary} 
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="h-10 w-14 border-0"
                  />
                  <input 
                    type="text" 
                    value={customSecondary} 
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="ml-2 flex-1 border rounded p-2 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                <div className="flex items-center">
                  <input 
                    type="color" 
                    value={customAccent} 
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="h-10 w-14 border-0"
                  />
                  <input 
                    type="text" 
                    value={customAccent} 
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="ml-2 flex-1 border rounded p-2 text-sm"
                  />
                </div>
              </div>
              
              <button 
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                onClick={handleCreateCustomPalette}
              >
                Create & Apply Custom Palette
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Element-specific color mode
        <div>
          {selectedElement ? (
            <div className="space-y-4">
              <h4 className="font-medium mb-3">Edit {selectedElement.id} Colors</h4>
              
              {selectedElement.fill !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fill Color</label>
                  <div className="flex items-center">
                    <input 
                      type="color" 
                      value={selectedElement.fill || '#000000'} 
                      onChange={(e) => handleElementColorChange('fill', e.target.value)}
                      className="h-10 w-14 border-0"
                    />
                    <input 
                      type="text" 
                      value={selectedElement.fill || '#000000'} 
                      onChange={(e) => handleElementColorChange('fill', e.target.value)}
                      className="ml-2 flex-1 border rounded p-2 text-sm"
                    />
                  </div>
                </div>
              )}
              
              {selectedElement.stroke !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stroke Color</label>
                  <div className="flex items-center">
                    <input 
                      type="color" 
                      value={selectedElement.stroke || '#000000'} 
                      onChange={(e) => handleElementColorChange('stroke', e.target.value)}
                      className="h-10 w-14 border-0"
                    />
                    <input 
                      type="text" 
                      value={selectedElement.stroke || '#000000'} 
                      onChange={(e) => handleElementColorChange('stroke', e.target.value)}
                      className="ml-2 flex-1 border rounded p-2 text-sm"
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Color presets for quick selection:</p>
                <div className="grid grid-cols-5 gap-2">
                  {['#0B3C5D', '#328CC1', '#D9B310', '#2A9D8F', '#E9C46A', 
                    '#264653', '#4F6272', '#B7C3F3', '#DD7230', '#606C38']
                    .map((color, index) => (
                      <div 
                        key={index} 
                        className="w-8 h-8 rounded-full cursor-pointer border"
                        style={{backgroundColor: color}}
                        onClick={() => handleElementColorChange('fill', color)}
                        title={color}
                      ></div>
                    ))
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select an element from the logo to edit its colors
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorEditorPanel;