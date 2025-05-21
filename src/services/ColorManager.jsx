class ColorManager {
  constructor() {
    this.presetPalettes = new Map([
      ['technical-blue', {
        id: 'technical-blue',
        name: 'Technical Blue',
        primary: '#0B3C5D',
        secondary: '#328CC1',
        accent: '#D9B310',
        isCustom: false
      }],
      ['eco-green', {
        id: 'eco-green',
        name: 'Eco Green',
        primary: '#2A9D8F',
        secondary: '#E9C46A',
        accent: '#264653',
        isCustom: false
      }],
      ['gray-sophisticated', {
        id: 'gray-sophisticated',
        name: 'Gray Sophisticated',
        primary: '#4F6272',
        secondary: '#B7C3F3',
        accent: '#DD7230',
        isCustom: false
      }],
      ['earth-natural', {
        id: 'earth-natural',
        name: 'Earth Natural',
        primary: '#606C38',
        secondary: '#DDA15E',
        accent: '#FEFAE0',
        isCustom: false
      }],
      ['clean-energy', {
        id: 'clean-energy',
        name: 'Clean Energy',
        primary: '#457B9D',
        secondary: '#A8DADC',
        accent: '#F1FAEE',
        isCustom: false
      }]
    ]);
  }
  
  // Get all preset palettes
  getPresetPalettes() {
    return Array.from(this.presetPalettes.values());
  }
  
  // Get a specific palette by ID
  getPalette(paletteId) {
    return this.presetPalettes.get(paletteId) || null;
  }
  
  // Create a custom palette
  createCustomPalette(name, primary, secondary, accent) {
    const id = `custom-${Date.now()}`;
    const customPalette = {
      id,
      name: name || 'Custom Palette',
      primary,
      secondary,
      accent,
      isCustom: true
    };
    
    this.presetPalettes.set(id, customPalette);
    return customPalette;
  }
  
  // Convert HEX to RGB
  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  }
  
  // Convert RGB to HEX
  rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }
  
  // Apply a palette to SVG elements
  applyPaletteToElements(elements, palette) {
    const updatedElements = new Map();
    
    elements.forEach((element, id) => {
      const updatedElement = { ...element };
      
      // Apply colors based on element classes
      if (element.classList && element.classList.includes('primary-color-element')) {
        updatedElement.fill = palette.primary;
      } else if (element.classList && element.classList.includes('secondary-color-element')) {
        updatedElement.fill = palette.secondary;
      } else if (element.classList && element.classList.includes('accent-color-element')) {
        updatedElement.fill = palette.accent;
      }
      
      updatedElements.set(id, updatedElement);
    });
    
    return updatedElements;
  }
  
  // Get a contrasting color (black or white) for a given background
  getContrastColor(backgroundColor) {
    // Convert hex to RGB
    const rgb = this.hexToRgb(backgroundColor);
    
    // Calculate luminance - formulae from WCAG 2.0
    const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    
    // Return black for light backgrounds, white for dark
    return luminance > 128 ? '#000000' : '#FFFFFF';
  }
}

// Export a singleton instance
const colorManager = new ColorManager();
export default colorManager;