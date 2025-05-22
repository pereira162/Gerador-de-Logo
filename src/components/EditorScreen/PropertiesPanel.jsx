import React from 'react';
import useLogoStore from '../../store/LogoStore';
import svgManager from '../../services/SVGManager';

const PropertiesPanel = () => {
  const { currentProject, updateElement, updateElementTransform } = useLogoStore(state => ({
    currentProject: state.currentProject,
    updateElement: state.updateElement,
    updateElementTransform: state.updateElementTransform
  }));
  
  const { elements, selectedElementId, currentElementStyles, transformations } = currentProject;
  const selectedElementFromMap = selectedElementId ? elements.get(selectedElementId) : null;
  const selectedElementTransform = selectedElementId ? transformations.get(selectedElementId) : null;
  
  // Combine element data from both sources
  const selectedElement = selectedElementId ? {
    ...selectedElementFromMap,
    ...currentElementStyles,
  } : null;
  
  // Handle style changes
  const handleStyleChange = (property, value) => {
    if (!selectedElementId) return;
    
    updateElement(selectedElementId, { [property]: value });
  };
  
  // Handle transformation changes
  const handleTransformChange = (property, value) => {
    if (!selectedElementId) return;
    
    const currentTransform = selectedElementTransform || {
      translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1
    };
    
    // Update the appropriate transform property
    const transformUpdate = {};
    if (property === 'translateX') {
      transformUpdate.translateX = Number(value);
    } else if (property === 'translateY') {
      transformUpdate.translateY = Number(value);
    } else if (property === 'rotation') {
      transformUpdate.rotation = Number(value);
    } else if (property === 'scaleX') {
      transformUpdate.scaleX = Number(value);
    } else if (property === 'scaleY') {
      transformUpdate.scaleY = Number(value);
    }
    
    updateElementTransform(selectedElementId, transformUpdate);
  };
  
  if (!selectedElement) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-center p-4">
          Select an element from the logo to edit its properties
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Element Properties</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Element Type</label>
            <div className="bg-gray-100 p-2 rounded text-sm">{selectedElement.type}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Element ID</label>
            <div className="bg-gray-100 p-2 rounded text-sm">{selectedElement.id}</div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Style</h4>
        
        {selectedElement.fill !== 'none' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fill Color</label>
            <div className="flex items-center">
              <input 
                type="color" 
                value={selectedElement.fill || '#000000'} 
                onChange={(e) => handleStyleChange('fill', e.target.value)}
                className="h-10 w-14 border-0"
              />
              <input 
                type="text" 
                value={selectedElement.fill || '#000000'} 
                onChange={(e) => handleStyleChange('fill', e.target.value)}
                className="ml-2 flex-1 border rounded p-1 text-sm"
              />
            </div>
          </div>
        )}
        
        {selectedElement.stroke !== 'none' && (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Stroke Color</label>
              <div className="flex items-center">
                <input 
                  type="color" 
                  value={selectedElement.stroke || '#000000'} 
                  onChange={(e) => handleStyleChange('stroke', e.target.value)}
                  className="h-10 w-14 border-0"
                />
                <input 
                  type="text" 
                  value={selectedElement.stroke || '#000000'} 
                  onChange={(e) => handleStyleChange('stroke', e.target.value)}
                  className="ml-2 flex-1 border rounded p-1 text-sm"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Stroke Width</label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="0.5"
                value={selectedElement.strokeWidth || 0} 
                onChange={(e) => handleStyleChange('strokeWidth', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{selectedElement.strokeWidth || 0}px</div>
            </div>
          </>
        )}
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={selectedElement.opacity || 1} 
            onChange={(e) => handleStyleChange('opacity', Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">{Math.round((selectedElement.opacity || 1) * 100)}%</div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Transformation</h4>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">X Position</label>
            <input 
              type="number"
              value={selectedElementTransform?.translateX || 0} 
              onChange={(e) => handleTransformChange('translateX', e.target.value)}
              className="w-full border rounded p-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Y Position</label>
            <input 
              type="number"
              value={selectedElementTransform?.translateY || 0} 
              onChange={(e) => handleTransformChange('translateY', e.target.value)}
              className="w-full border rounded p-1 text-sm"
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rotation (degrees)</label>
          <input 
            type="range" 
            min="0" 
            max="360" 
            step="1"
            value={selectedElementTransform?.rotation || 0} 
            onChange={(e) => handleTransformChange('rotation', e.target.value)}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">{selectedElementTransform?.rotation || 0}°</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Scale X</label>
            <input 
              type="range" 
              min="0.1" 
              max="2" 
              step="0.05"
              value={selectedElementTransform?.scaleX || 1} 
              onChange={(e) => handleTransformChange('scaleX', e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{selectedElementTransform?.scaleX || 1}x</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Scale Y</label>
            <input 
              type="range" 
              min="0.1" 
              max="2" 
              step="0.05"
              value={selectedElementTransform?.scaleY || 1} 
              onChange={(e) => handleTransformChange('scaleY', e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{selectedElementTransform?.scaleY || 1}x</div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <button 
          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded w-full"
          onClick={() => {
            // Reset styles
            updateElement(selectedElementId, {
              fill: selectedElement.original?.fill || selectedElement.fill,
              stroke: selectedElement.original?.stroke || selectedElement.stroke,
              strokeWidth: selectedElement.original?.strokeWidth || selectedElement.strokeWidth,
              opacity: 1
            });
            
            // Reset transformations
            updateElementTransform(selectedElementId, {
              translateX: 0,
              translateY: 0,
              rotation: 0,
              scaleX: 1,
              scaleY: 1
            });
          }}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;