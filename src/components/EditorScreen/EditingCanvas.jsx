import React, { useEffect, useRef } from 'react';
import useLogoStore from '../../store/LogoStore';
import svgManager from '../../services/SVGManager';

const EditingCanvas = () => {
  const canvasRef = useRef(null);
  const selectElement = useLogoStore(state => state.selectElement);
  const selectedElementId = useLogoStore(state => state.currentProject.selectedElementId);
  const selectedLogoId = useLogoStore(state => state.currentProject.selectedLogoId);
  
  // Get the current SVG content from the store
  const svgContent = useLogoStore(state => state.currentProject.svgContent);
  
  // Set up SVG manager and initialize the canvas
  useEffect(() => {
    if (!canvasRef.current || !selectedLogoId || !svgContent) return;
    
    console.log('Initializing SVG in EditingCanvas with content:', svgContent.substring(0, 50) + '...');
    
    // Set the element select callback on the SVG manager
    svgManager.setElementSelectCallback((elementId) => {
      console.log('SVG element selected:', elementId);
      selectElement(elementId);
    });
    
    // Initialize the SVG content in the canvas
    const success = svgManager.initialize(svgContent, "editing-canvas");
    
    if (!success) {
      console.error('Failed to initialize SVG manager');
      return;
    }
    
    // Add CSS for selection highlighting if not already present
    const styleId = 'svg-editor-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        #editing-canvas svg * {
          transition: all 0.1s ease;
        }
        #editing-canvas .selected-highlight {
          outline: 3px dashed #2563eb !important;
          outline-offset: 2px !important;
        }
        #editing-canvas .hover-highlight {
          stroke: #2563eb80 !important;
          stroke-width: 1px !important;
          opacity: 0.9 !important;
          cursor: pointer !important;
        }
      `;
      document.head.appendChild(style);
    }
    
  }, [canvasRef, selectElement, selectedLogoId, svgContent]);
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Logo Canvas</h2>
      <p className="text-sm text-gray-600 mb-4">
        Click on any element of the logo to select and edit it. Use the properties panel to adjust colors, size, and position.
      </p>
      
      <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-inner border border-gray-200">
        <div 
          id="editing-canvas" 
          ref={canvasRef} 
          className="w-full max-w-md mx-auto h-full max-h-96 flex items-center justify-center"
        >
          {/* SVG will be rendered here by SVGManager */}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 italic">
        {selectedElementId ? (
          <div>Selected element: <span className="font-medium">{selectedElementId}</span></div>
        ) : (
          <div>Click on a logo element to select and edit it</div>
        )}
      </div>
    </div>
  );
};

export default EditingCanvas;