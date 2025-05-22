import React from 'react';
import useLogoStore from '../../store/LogoStore';
import svgManager from '../../services/SVGManager';
import ShapeProperties from './ShapeProperties';
import TextProperties from './TextProperties';

const PropertiesPanel = () => {
  const { currentProject, updateElement, updateElementTransform, updateTextElement } = useLogoStore(state => ({
    currentProject: state.currentProject,
    updateElement: state.updateElement,
    updateElementTransform: state.updateElementTransform,
    updateTextElement: state.updateTextElement
  }));
  
  const { elements, selectedElementId, currentElementStyles, transformations, textElements } = currentProject;
  const selectedElementFromMap = selectedElementId ? elements.get(selectedElementId) : null;
  const selectedTextElement = selectedElementId ? textElements.find(el => el.id === selectedElementId) : null;
  const selectedElementTransform = selectedElementId ? transformations.get(selectedElementId) : null;
  
  // Determine if the selected element is a text element or a shape
  const isTextElement = !!selectedTextElement;
  
  // Combine element data from both sources for shape elements
  const selectedElement = selectedElementId && !isTextElement ? {
    ...selectedElementFromMap,
    ...currentElementStyles,
  } : null;
  
  // Handle style changes for shape elements
  const handleStyleChange = (property, value) => {
    if (!selectedElementId) return;
    
    updateElement(selectedElementId, { [property]: value });
  };
  
  // Handle text property changes
  const handleTextPropertyChange = (property, value) => {
    if (!selectedElementId || !isTextElement) return;
    
    updateTextElement(selectedElementId, { [property]: value });
  };
  
  // Handle text content changes
  const handleTextContentChange = (content) => {
    if (!selectedElementId || !isTextElement) return;
    
    updateTextElement(selectedElementId, { content });
  };
  
  // Handle transformation changes
  const handleTransformChange = (property, value) => {
    if (!selectedElementId) return;
    
    const currentTransform = selectedElementTransform || {
      translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1
    };
    
    // Update the appropriate transform property
    const transformUpdate = {};
    transformUpdate[property] = Number(value);
    
    updateElementTransform(selectedElementId, transformUpdate);
  };
  
  // Reset properties to default
  const handleReset = () => {
    if (!selectedElementId) return;
    
    if (isTextElement) {
      // Reset text element to defaults
      // Note: This assumes original values are stored or can be determined
      // Adjust as needed for your actual implementation
      updateTextElement(selectedElementId, {
        fontSize: 24,
        fontWeight: '400',
        opacity: 1,
        alignment: 'middle'
      });
    } else {
      // Reset shape element
      updateElement(selectedElementId, {
        fill: selectedElement.original?.fill || selectedElement.fill,
        stroke: selectedElement.original?.stroke || selectedElement.stroke,
        strokeWidth: selectedElement.original?.strokeWidth || selectedElement.strokeWidth,
        opacity: 1
      });
    }
    
    // Reset transformations
    updateElementTransform(selectedElementId, {
      translateX: 0,
      translateY: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1
    });
  };
  
  if (!selectedElement && !selectedTextElement) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-center p-4">
          Select an element from the logo to edit its properties
        </p>
      </div>
    );
  }
  
  return (
    <div className="properties-panel overflow-y-auto max-h-[calc(100vh-200px)] p-4">
      {isTextElement ? (
        // Render Text Properties Panel
        <TextProperties 
          element={selectedTextElement}
          transform={selectedElementTransform}
          onStyleChange={handleTextPropertyChange}
          onContentChange={handleTextContentChange}
          onTransformChange={handleTransformChange}
          onReset={handleReset}
        />
      ) : (
        // Render Shape Properties Panel
        <ShapeProperties 
          element={selectedElement}
          transform={selectedElementTransform}
          onStyleChange={handleStyleChange}
          onTransformChange={handleTransformChange}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default PropertiesPanel;