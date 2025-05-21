/**
 * ColorManager.jsx - Serviço para gerenciar paletas de cores para os logos
 */
class ColorManager {
  constructor() {
    // Paletas de cores predefinidas
    this.palettes = {
      'technical-blue': {
        id: 'technical-blue',
        name: 'Azul Técnico',
        primary: '#0B3C5D',
        secondary: '#328CC1',
        accent: '#D9B310',
        neutral: '#1D2731',
      },
      'organic-green': {
        id: 'organic-green',
        name: 'Verde Orgânico',
        primary: '#2E7D32',
        secondary: '#81C784',
        accent: '#FFC107',
        neutral: '#263238',
      },
      'corporate-gray': {
        id: 'corporate-gray',
        name: 'Cinza Corporativo',
        primary: '#455A64',
        secondary: '#90A4AE',
        accent: '#FF5722',
        neutral: '#263238',
      },
      'creative-purple': {
        id: 'creative-purple',
        name: 'Roxo Criativo',
        primary: '#5E35B1',
        secondary: '#9575CD',
        accent: '#FFA000',
        neutral: '#212121',
      },
      'minimalist-black': {
        id: 'minimalist-black',
        name: 'Preto Minimalista',
        primary: '#212121',
        secondary: '#616161',
        accent: '#FBC02D',
        neutral: '#000000',
      },
    };

    // Paleta atual
    this.currentPalette = this.palettes['technical-blue'];
  }

  // Obter todas as paletas disponíveis
  getAllPalettes() {
    return Object.values(this.palettes);
  }

  // Obter uma paleta específica por ID
  getPalette(paletteId) {
    return this.palettes[paletteId] || this.palettes['technical-blue']; // Retorna a paleta padrão se não encontrar
  }

  // Definir a paleta atual
  setCurrentPalette(paletteId) {
    if (this.palettes[paletteId]) {
      this.currentPalette = this.palettes[paletteId];
      return true;
    }
    return false;
  }

  // Obter a paleta atual
  getCurrentPalette() {
    return this.currentPalette;
  }

  // Criar uma nova paleta personalizada
  createCustomPalette(palette) {
    if (!palette.id) {
      palette.id = `custom-${Date.now()}`;
    }

    this.palettes[palette.id] = {
      ...palette,
      name: palette.name || 'Paleta Personalizada',
    };

    return palette.id;
  }
}

// Exportar uma instância singleton
const colorManager = new ColorManager();
export default colorManager;