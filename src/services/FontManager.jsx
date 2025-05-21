/**
 * FontManager.jsx - Service for managing and applying fonts in the logo editor
 */

class FontManager {
  constructor() {
    this.loadedFonts = new Map();
    this.availableFonts = [
      {
        family: 'Roboto',
        category: 'sans-serif',
        variants: ['regular', '500', '700'],
        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
      },
      {
        family: 'Open Sans',
        category: 'sans-serif',
        variants: ['regular', '600', '700'],
        url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
      },
      {
        family: 'Lato',
        category: 'sans-serif',
        variants: ['regular', '700', '900'],
        url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
      },
      {
        family: 'Montserrat',
        category: 'sans-serif',
        variants: ['regular', '500', '700'],
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap',
      },
      {
        family: 'Playfair Display',
        category: 'serif',
        variants: ['regular', '700', '900'],
        url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap',
      },
      {
        family: 'Merriweather',
        category: 'serif',
        variants: ['regular', '700', '900'],
        url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap',
      },
      {
        family: 'Poppins',
        category: 'sans-serif',
        variants: ['regular', '500', '700'],
        url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap',
      },
      {
        family: 'Oswald',
        category: 'sans-serif',
        variants: ['regular', '500', '700'],
        url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap',
      },
      {
        family: 'Raleway',
        category: 'sans-serif',
        variants: ['regular', '600', '800'],
        url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;800&display=swap',
      },
      {
        family: 'Ubuntu',
        category: 'sans-serif',
        variants: ['regular', '500', '700'],
        url: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap',
      }
    ];
    
    // Font categories for organization
    this.fontCategories = [
      {
        id: 'sans-serif',
        name: 'Sans Serif',
        description: 'Clean, modern fonts without decorative elements'
      },
      {
        id: 'serif',
        name: 'Serif',
        description: 'Traditional fonts with decorative elements at the ends of strokes'
      },
      {
        id: 'display',
        name: 'Display',
        description: 'Bold, decorative fonts ideal for titles and headings'
      },
      {
        id: 'handwriting',
        name: 'Handwriting',
        description: 'Fonts that mimic handwritten text'
      }
    ];
    
    // Default font weights mapped to CSS font-weight values
    this.fontWeightMap = {
      'thin': '100',
      'extra-light': '200',
      'light': '300',
      'regular': '400',
      'medium': '500',
      'semi-bold': '600',
      'bold': '700',
      'extra-bold': '800',
      'black': '900',
    };
  }

  /**
   * Initialize FontManager by preloading the default set of fonts
   * @returns {Promise} Promise that resolves when all default fonts have been loaded
   */
  async initialize() {
    // Create a style element to inject the font-face declarations
    const styleElement = document.createElement('style');
    styleElement.id = 'font-manager-styles';
    document.head.appendChild(styleElement);
    
    // Preload a few common fonts
    try {
      const fontsToPreload = ['Roboto', 'Open Sans', 'Montserrat', 'Playfair Display'];
      const loadPromises = fontsToPreload.map(fontFamily => this.loadFont(fontFamily));
      await Promise.all(loadPromises);
      return true;
    } catch (error) {
      console.error('Error initializing FontManager:', error);
      return false;
    }
  }

  /**
   * Get all available font categories
   * @returns {Array} Array of font category objects
   */
  getFontCategories() {
    return this.fontCategories;
  }

  /**
   * Get all available fonts, optionally filtered by category
   * @param {string} category - Category to filter by (optional)
   * @returns {Array} Array of font objects
   */
  getAvailableFonts(category = null) {
    if (category) {
      return this.availableFonts.filter(font => font.category === category);
    }
    return this.availableFonts;
  }

  /**
   * Get a specific font by family name
   * @param {string} fontFamily - The font family name to retrieve
   * @returns {Object|null} The font object or null if not found
   */
  getFontByFamily(fontFamily) {
    return this.availableFonts.find(font => font.family === fontFamily) || null;
  }

  /**
   * Load a font for use in the editor
   * @param {string} fontFamily - The font family to load
   * @returns {Promise} Promise that resolves when the font is loaded
   */
  async loadFont(fontFamily) {
    // If font is already loaded, return it
    if (this.loadedFonts.has(fontFamily)) {
      return this.loadedFonts.get(fontFamily);
    }

    const font = this.getFontByFamily(fontFamily);
    if (!font) {
      throw new Error(`Font family "${fontFamily}" not found in available fonts`);
    }

    try {
      // Create a link element to load the font
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = font.url;
      document.head.appendChild(linkElement);

      // Create a promise that resolves when the font is loaded
      const fontLoadPromise = new Promise((resolve, reject) => {
        linkElement.onload = () => {
          this.loadedFonts.set(fontFamily, font);
          resolve(font);
        };
        linkElement.onerror = () => {
          reject(new Error(`Failed to load font: ${fontFamily}`));
        };
      });

      return await fontLoadPromise;
    } catch (error) {
      console.error(`Error loading font ${fontFamily}:`, error);
      throw error;
    }
  }

  /**
   * Apply a font to text elements in the SVG
   * @param {Object} svgManager - Reference to the SVG manager service
   * @param {string} elementId - ID of the text element to style
   * @param {Object} fontOptions - Font styling options
   * @returns {Promise<boolean>} Promise that resolves to true if successful
   */
  async applyFontToElement(svgManager, elementId, fontOptions) {
    try {
      const {
        family = 'Roboto',
        weight = 'regular',
        size = 24,
        style = 'normal'
      } = fontOptions;
      
      // Load the font if not already loaded
      await this.loadFont(family);
      
      // Convert weight name to numeric value if needed
      const fontWeight = this.fontWeightMap[weight] || weight;

      // Apply the font to the SVG element
      return svgManager.updateTextElement(elementId, {
        fontFamily: family,
        fontSize: size,
        fontWeight,
        fontStyle: style
      });
    } catch (error) {
      console.error('Error applying font to element:', error);
      return false;
    }
  }
  
  /**
   * Get CSS font-weight value from weight name
   * @param {string} weightName - Name of the font weight (e.g., 'bold', 'medium')
   * @returns {string} CSS font-weight value
   */
  getFontWeightValue(weightName) {
    return this.fontWeightMap[weightName] || '400';
  }

  /**
   * Generate a CSS font stack for a given font family
   * @param {string} fontFamily - Primary font family
   * @param {boolean} includeGeneric - Whether to include generic fallbacks
   * @returns {string} Font stack for CSS
   */
  generateFontStack(fontFamily, includeGeneric = true) {
    const font = this.getFontByFamily(fontFamily);
    const category = font ? font.category : 'sans-serif';
    
    let fontStack = `"${fontFamily}"`;
    
    if (includeGeneric) {
      switch (category) {
        case 'serif':
          fontStack += ', Georgia, Times, "Times New Roman", serif';
          break;
        case 'monospace':
          fontStack += ', "Courier New", Courier, monospace';
          break;
        case 'handwriting':
          fontStack += ', cursive';
          break;
        case 'display':
          fontStack += ', fantasy';
          break;
        case 'sans-serif':
        default:
          fontStack += ', Arial, Helvetica, "Segoe UI", sans-serif';
          break;
      }
    }
    
    return fontStack;
  }
}

// Export a singleton instance
const fontManager = new FontManager();
export default fontManager;