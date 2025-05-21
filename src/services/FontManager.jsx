class FontManager {
  constructor() {
    this.fonts = new Map();
    this.fontsLoaded = false;
    this.fontLoadPromises = [];
  }
  
  // Load the bundled fonts
  async loadFonts() {
    // Define fonts to load
    const fontsToLoad = [
      {
        family: 'Inter',
        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
        weights: [400, 500, 700]
      },
      {
        family: 'Merriweather',
        url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
        weights: [400, 700]
      },
      {
        family: 'Montserrat',
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap',
        weights: [400, 500, 700]
      },
      {
        family: 'Roboto Mono',
        url: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap',
        weights: [400, 500, 700]
      }
    ];
    
    // Create a link element for each font
    fontsToLoad.forEach(font => {
      // Create a link element
      const link = document.createElement('link');
      link.href = font.url;
      link.rel = 'stylesheet';
      
      // Append to head
      document.head.appendChild(link);
      
      // Create FontFace objects for each weight
      font.weights.forEach(weight => {
        const fontFace = new FontFace(
          font.family, 
          `url(https://fonts.gstatic.com/s/${font.family.toLowerCase()}/v10/mem${weight === 400 ? '8' : weight === 700 ? 'c' : 'b'}.ttf)`, 
          { weight: String(weight) }
        );
        
        // Load the font face
        const loadPromise = fontFace.load().then(
          loadedFace => {
            document.fonts.add(loadedFace);
            this.fonts.set(`${font.family}-${weight}`, loadedFace);
            return loadedFace;
          },
          err => {
            console.error(`Error loading font ${font.family} weight ${weight}:`, err);
            return null;
          }
        );
        
        this.fontLoadPromises.push(loadPromise);
      });
    });
    
    // Wait for all fonts to load
    await Promise.all(this.fontLoadPromises);
    this.fontsLoaded = true;
    
    return this.fontsLoaded;
  }
  
  // Wait for all fonts to be loaded
  async waitForFontsLoaded() {
    if (this.fontsLoaded) {
      return true;
    }
    
    await Promise.all(this.fontLoadPromises);
    this.fontsLoaded = true;
    return true;
  }
  
  // Get all available fonts
  getAvailableFonts() {
    return [
      { name: 'Inter', family: 'Inter, sans-serif', type: 'sans-serif' },
      { name: 'Merriweather', family: 'Merriweather, serif', type: 'serif' },
      { name: 'Montserrat', family: 'Montserrat, sans-serif', type: 'sans-serif' },
      { name: 'Roboto Mono', family: 'Roboto Mono, monospace', type: 'monospace' }
    ];
  }
  
  // Get the default font
  getDefaultFont() {
    return {
      name: 'Inter',
      family: 'Inter, sans-serif',
      weight: 400,
      size: 24
    };
  }
}

// Export a singleton instance
const fontManager = new FontManager();
export default fontManager;