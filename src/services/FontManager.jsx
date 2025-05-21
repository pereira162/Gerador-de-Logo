/**
 * FontManager.jsx - Serviço para gerenciar fontes disponíveis para os logos
 */
class FontManager {
  constructor() {
    // Lista de fontes disponíveis
    this.fonts = [
      {
        family: 'Arial',
        displayName: 'Arial',
        category: 'sans-serif',
        weights: ['400', '700'],
      },
      {
        family: 'Helvetica',
        displayName: 'Helvetica',
        category: 'sans-serif',
        weights: ['400', '700'],
      },
      {
        family: 'Roboto',
        displayName: 'Roboto',
        category: 'sans-serif',
        weights: ['100', '300', '400', '500', '700', '900'],
        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap',
      },
      {
        family: 'Montserrat',
        displayName: 'Montserrat',
        category: 'sans-serif',
        weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap',
      },
      {
        family: 'Open Sans',
        displayName: 'Open Sans',
        category: 'sans-serif',
        weights: ['300', '400', '500', '600', '700', '800'],
        url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap',
      },
      {
        family: 'Playfair Display',
        displayName: 'Playfair Display',
        category: 'serif',
        weights: ['400', '500', '600', '700', '800', '900'],
        url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
      },
      {
        family: 'Poppins',
        displayName: 'Poppins',
        category: 'sans-serif',
        weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap',
      },
      {
        family: 'Lato',
        displayName: 'Lato',
        category: 'sans-serif',
        weights: ['100', '300', '400', '700', '900'],
        url: 'https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap',
      },
      {
        family: 'Merriweather',
        displayName: 'Merriweather',
        category: 'serif',
        weights: ['300', '400', '700', '900'],
        url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap',
      },
      {
        family: 'Ubuntu',
        displayName: 'Ubuntu',
        category: 'sans-serif',
        weights: ['300', '400', '500', '700'],
        url: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap',
      }
    ];

    // Fonte padrão
    this.defaultFont = this.fonts[0];
  }

  // Obter todas as fontes disponíveis
  getAllFonts() {
    return this.fonts;
  }

  // Obter fontes por categoria
  getFontsByCategory(category) {
    return this.fonts.filter(font => font.category === category);
  }

  // Obter uma fonte específica pelo nome
  getFont(fontFamily) {
    return this.fonts.find(font => font.family.toLowerCase() === fontFamily.toLowerCase()) || this.defaultFont;
  }

  // Obter a fonte padrão
  getDefaultFont() {
    return this.defaultFont;
  }

  // Carregar as fontes web necessárias
  loadFonts() {
    const loadedFonts = new Set();
    
    this.fonts.forEach(font => {
      if (font.url && !loadedFonts.has(font.family)) {
        // Criar um link para a fonte web se ela tiver uma URL
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = font.url;
        document.head.appendChild(link);
        
        loadedFonts.add(font.family);
      }
    });
    
    return true;
  }
}

// Exportar uma instância singleton
const fontManager = new FontManager();
export default fontManager;