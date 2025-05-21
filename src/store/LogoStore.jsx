import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import svgManager from '../services/SVGManager';
import colorManager from '../services/ColorManager';
import fontManager from '../services/FontManager';
import exportManager from '../services/ExportManager';
import { SVGTemplates } from '../utils/SVGTemplates';

// Create Zustand store for logo state management
const useLogoStore = create((set, get) => ({
  // Current project state
  currentProject: {
    id: uuidv4(),
    selectedLogoId: null,
    svgContent: '',
    elements: new Map(),
    selectedElementId: null,
    textElements: [], // Company name and tagline
    colorPalette: colorManager.getPalette('technical-blue'),
  },
  
  // Screen navigation state
  currentScreen: 'selection', // 'selection', 'editor', 'typography', 'export'
  
  // Logo selection action
  selectLogo: async (logoId) => {
    // Get the SVG template string
    const svgString = SVGTemplates[logoId];
    
    if (!svgString) {
      console.error(`Template ${logoId} not found`);
      return false;
    }
    
    // Initialize the SVG Manager with the template
    const elements = await svgManager.initialize(svgString, 'editing-canvas');
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        id: uuidv4(), // New project ID
        selectedLogoId: logoId,
        svgContent: svgString,
        elements,
        selectedElementId: null, // Clear selection
        textElements: [], // Clear any text elements
      },
      currentScreen: 'editor', // Navigate to editor
    }));
    
    return true;
  },
  
  // Navigate between screens
  setScreen: (screen) => {
    set({ currentScreen: screen });
  },
  
  // Element selection action
  selectElement: (elementId) => {
    set(state => ({
      currentProject: {
        ...state.currentProject,
        selectedElementId: elementId,
      }
    }));
    
    return true;
  },
  
  // Update element properties
  updateElement: (elementId, properties) => {
    const { currentProject } = get();
    const elements = new Map(currentProject.elements);
    const element = elements.get(elementId);
    
    if (!element) {
      console.error(`Element ${elementId} not found`);
      return false;
    }
    
    // Update the element in our store
    elements.set(elementId, { ...element, ...properties });
    
    // Apply updates to the SVG
    if (properties.fill || properties.stroke || properties.strokeWidth || properties.opacity) {
      svgManager.applyStyle(elementId, properties);
    }
    
    if (properties.transform) {
      svgManager.applyTransformation(elementId, properties.transform);
    }
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        elements,
      }
    }));
    
    return true;
  },
  
  // Add text element (company name or tagline)
  addTextElement: (textElementData) => {
    const id = textElementData.id || `text-${uuidv4()}`;
    const textElement = {
      id,
      content: textElementData.content || '',
      fontFamily: textElementData.fontFamily || fontManager.getDefaultFont().family,
      fontSize: textElementData.fontSize || 24,
      fontWeight: textElementData.fontWeight || '400',
      fill: textElementData.fill || '#000000',
      position: textElementData.position || { x: 200, y: 350 }, // Default position below the logo
      alignment: textElementData.alignment || 'center',
      letterSpacing: textElementData.letterSpacing || 0,
      type: textElementData.type || 'companyName', // 'companyName' or 'tagline'
    };
    
    // Add to SVG
    svgManager.addTextElement(textElement);
    
    // Position the text
    if (textElementData.position) {
      svgManager.positionTextElement(textElement);
    }
    
    // Add to store
    set(state => ({
      currentProject: {
        ...state.currentProject,
        textElements: [...state.currentProject.textElements, textElement],
      }
    }));
    
    return id;
  },
  
  // Update text element
  updateTextElement: (id, properties) => {
    const { currentProject } = get();
    const textElements = [...currentProject.textElements];
    const index = textElements.findIndex(el => el.id === id);
    
    if (index === -1) {
      console.error(`Text element ${id} not found`);
      return false;
    }
    
    // Update the text element
    const updatedElement = { ...textElements[index], ...properties };
    textElements[index] = updatedElement;
    
    // Apply updates to SVG
    // First, remove the old element and add the updated one
    const elementToUpdate = document.getElementById(id);
    if (elementToUpdate) {
      elementToUpdate.remove();
    }
    
    // Add the updated element
    svgManager.addTextElement(updatedElement);
    
    // Position the text if needed
    if (properties.position) {
      svgManager.positionTextElement(updatedElement);
    }
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        textElements,
      }
    }));
    
    return true;
  },
  
  // Apply color palette
  applyColorPalette: (paletteId) => {
    const palette = colorManager.getPalette(paletteId);
    
    if (!palette) {
      console.error(`Palette ${paletteId} not found`);
      return false;
    }
    
    const { currentProject } = get();
    const elements = new Map(currentProject.elements);
    
    // Apply to SVG elements
    elements.forEach((element, id) => {
      if (element.classList && element.classList.includes('primary-color-element')) {
        svgManager.applyStyle(id, { fill: palette.primary });
        element.fill = palette.primary;
      } else if (element.classList && element.classList.includes('secondary-color-element')) {
        svgManager.applyStyle(id, { fill: palette.secondary });
        element.fill = palette.secondary;
      } else if (element.classList && element.classList.includes('accent-color-element')) {
        svgManager.applyStyle(id, { fill: palette.accent });
        element.fill = palette.accent;
      }
    });
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        colorPalette: palette,
        elements,
      }
    }));
    
    return true;
  },
  
  // Apply color to specific element
  applyElementColor: (elementId, color, type = 'fill') => {
    if (type === 'fill') {
      return get().updateElement(elementId, { fill: color });
    } else if (type === 'stroke') {
      return get().updateElement(elementId, { stroke: color });
    }
    return false;
  },
  
  // Export logo
  exportLogo: async (format, resolution = 1) => {
    if (format === 'svg') {
      return exportManager.exportSVG(['main']);
    } else if (format === 'png') {
      return exportManager.exportPNG(['main'], resolution);
    }
    return false;
  },
  
  // Generate variants (P1 feature)
  generateVariants: () => {
    const { currentProject } = get();
    const variants = exportManager.generateVariants(currentProject);
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        variants,
      }
    }));
    
    return variants;
  },
}));

export default useLogoStore;