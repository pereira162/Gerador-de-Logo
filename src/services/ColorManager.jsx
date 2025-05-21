/**
 * ColorManager.jsx - Service for managing colors, palettes, and contrast
 */

class ColorManager {
  constructor() {
    // Default color schemes
    this.colorSchemes = {
      modern: [
        { name: 'Primary', hex: '#0B3C5D', rgb: [11, 60, 93] },
        { name: 'Secondary', hex: '#328CC1', rgb: [50, 140, 193] },
        { name: 'Accent', hex: '#D9B310', rgb: [217, 179, 16] },
        { name: 'Dark', hex: '#1D2731', rgb: [29, 39, 49] },
        { name: 'Light', hex: '#F5F5F5', rgb: [245, 245, 245] }
      ],
      vibrant: [
        { name: 'Primary', hex: '#D81159', rgb: [216, 17, 89] },
        { name: 'Secondary', hex: '#8F2D56', rgb: [143, 45, 86] },
        { name: 'Accent', hex: '#FFBC42', rgb: [255, 188, 66] },
        { name: 'Dark', hex: '#218380', rgb: [33, 131, 128] },
        { name: 'Light', hex: '#F5F5F5', rgb: [245, 245, 245] }
      ],
      minimal: [
        { name: 'Primary', hex: '#2D3142', rgb: [45, 49, 66] },
        { name: 'Secondary', hex: '#4F5D75', rgb: [79, 93, 117] },
        { name: 'Accent', hex: '#BFC0C0', rgb: [191, 192, 192] },
        { name: 'Dark', hex: '#121212', rgb: [18, 18, 18] },
        { name: 'Light', hex: '#FFFFFF', rgb: [255, 255, 255] }
      ],
      nature: [
        { name: 'Primary', hex: '#3A6B35', rgb: [58, 107, 53] },
        { name: 'Secondary', hex: '#CBD18F', rgb: [203, 209, 143] },
        { name: 'Accent', hex: '#E3B448', rgb: [227, 180, 72] },
        { name: 'Dark', hex: '#1E3F20', rgb: [30, 63, 32] },
        { name: 'Light', hex: '#F2F2F2', rgb: [242, 242, 242] }
      ],
      tech: [
        { name: 'Primary', hex: '#6C63FF', rgb: [108, 99, 255] },
        { name: 'Secondary', hex: '#536DFE', rgb: [83, 109, 254] },
        { name: 'Accent', hex: '#F50057', rgb: [245, 0, 87] },
        { name: 'Dark', hex: '#121212', rgb: [18, 18, 18] },
        { name: 'Light', hex: '#F5F5F5', rgb: [245, 245, 245] }
      ]
    };
    
    // Color roles for semantic usage
    this.colorRoles = [
      { id: 'primary', name: 'Primary', description: 'Main brand color' },
      { id: 'secondary', name: 'Secondary', description: 'Supporting brand color' },
      { id: 'accent', name: 'Accent', description: 'Highlights and call-to-action elements' },
      { id: 'background', name: 'Background', description: 'Main background color' },
      { id: 'text', name: 'Text', description: 'Text and important details' }
    ];
    
    // Current active color scheme
    this.activeScheme = 'modern';
  }

  /**
   * Get all available color schemes
   * @returns {Object} Object containing all color scheme arrays
   */
  getAllColorSchemes() {
    return this.colorSchemes;
  }

  /**
   * Get all color roles
   * @returns {Array} Array of color role objects
   */
  getColorRoles() {
    return this.colorRoles;
  }

  /**
   * Set the active color scheme
   * @param {string} schemeName - Name of the scheme to set active
   * @returns {boolean} Success status
   */
  setActiveColorScheme(schemeName) {
    if (this.colorSchemes[schemeName]) {
      this.activeScheme = schemeName;
      return true;
    }
    return false;
  }

  /**
   * Get the active color scheme
   * @returns {Array} Active color scheme array
   */
  getActiveColorScheme() {
    return this.colorSchemes[this.activeScheme];
  }

  /**
   * Get a specific color from the active scheme by name
   * @param {string} colorName - Name of the color (Primary, Secondary, etc.)
   * @returns {Object|null} Color object or null if not found
   */
  getColorByName(colorName) {
    const scheme = this.getActiveColorScheme();
    return scheme.find(color => color.name === colorName) || null;
  }

  /**
   * Calculate the relative luminance of a color for contrast calculations
   * @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
   * @param {Array} rgb - RGB values as array [r, g, b]
   * @returns {number} Luminance value
   */
  _calculateLuminance(rgb) {
    const [r, g, b] = rgb.map(val => {
      const normalized = val / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   * @see https://www.w3.org/TR/WCAG20/#contrast-ratiodef
   * @param {string} color1 - First hex color
   * @param {string} color2 - Second hex color
   * @returns {number} Contrast ratio
   */
  calculateContrastRatio(color1, color2) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const luminance1 = this._calculateLuminance(rgb1);
    const luminance2 = this._calculateLuminance(rgb2);
    
    // Ensure the lighter color is always in the numerator
    const lighterLum = Math.max(luminance1, luminance2);
    const darkerLum = Math.min(luminance1, luminance2);
    
    // Calculate contrast ratio: (L1 + 0.05) / (L2 + 0.05)
    const contrastRatio = (lighterLum + 0.05) / (darkerLum + 0.05);
    
    // Round to 2 decimal places
    return Math.round(contrastRatio * 100) / 100;
  }

  /**
   * Check if a color combination meets WCAG accessibility standards
   * @param {string} foregroundColor - Foreground color hex
   * @param {string} backgroundColor - Background color hex
   * @param {string} level - Accessibility level ('AA' or 'AAA')
   * @param {boolean} isLargeText - Whether this is large text
   * @returns {boolean} Whether the combination meets the standards
   */
  meetsAccessibilityStandards(foregroundColor, backgroundColor, level = 'AA', isLargeText = false) {
    const ratio = this.calculateContrastRatio(foregroundColor, backgroundColor);
    
    if (level === 'AAA') {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    } else { // AA
      return isLargeText ? ratio >= 3 : ratio >= 4.5;
    }
  }

  /**
   * Convert hex color to RGB array
   * @param {string} hex - Hex color string
   * @returns {Array|null} RGB values as array [r, g, b] or null if invalid
   */
  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Check if it's a valid hex color
    if (!/^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      return null;
    }
    
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return [r, g, b];
  }

  /**
   * Convert RGB array to hex color
   * @param {Array} rgb - RGB values as array [r, g, b]
   * @returns {string} Hex color string
   */
  rgbToHex(rgb) {
    return '#' + rgb.map(val => {
      const hex = Math.max(0, Math.min(255, Math.round(val))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Generate a random color
   * @returns {Object} Color object with hex and rgb values
   */
  generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    return {
      hex: this.rgbToHex([r, g, b]),
      rgb: [r, g, b]
    };
  }

  /**
   * Generate a monochromatic scheme based on a base color
   * @param {string} baseColor - Base color in hex format
   * @param {number} count - Number of colors to generate
   * @returns {Array} Array of color objects
   */
  generateMonochromaticScheme(baseColor, count = 5) {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return [];
    
    const hslBase = this.rgbToHsl(rgb);
    const colors = [];
    
    // Generate variations by adjusting lightness
    for (let i = 0; i < count; i++) {
      // Adjust lightness from 20% to 80%
      const lightness = 0.2 + (0.6 * i / (count - 1));
      const newRgb = this.hslToRgb([hslBase[0], hslBase[1], lightness]);
      
      colors.push({
        name: i === Math.floor(count / 2) ? 'Primary' : `Variation ${i + 1}`,
        hex: this.rgbToHex(newRgb),
        rgb: newRgb
      });
    }
    
    return colors;
  }

  /**
   * Generate a complementary color scheme based on a base color
   * @param {string} baseColor - Base color in hex format
   * @returns {Array} Array of color objects
   */
  generateComplementaryScheme(baseColor) {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return [];
    
    const hslBase = this.rgbToHsl(rgb);
    
    // Complementary color (opposite on color wheel)
    const hslComplement = [(hslBase[0] + 0.5) % 1, hslBase[1], hslBase[2]];
    const rgbComplement = this.hslToRgb(hslComplement);
    
    // Generate variations for accent and neutral colors
    const hslAccent = [(hslBase[0] + 0.25) % 1, 0.7, 0.6];
    const rgbAccent = this.hslToRgb(hslAccent);
    
    // Dark and light neutrals
    const rgbDark = [30, 30, 30];
    const rgbLight = [245, 245, 245];
    
    return [
      { name: 'Primary', hex: baseColor, rgb },
      { name: 'Secondary', hex: this.rgbToHex(rgbComplement), rgb: rgbComplement },
      { name: 'Accent', hex: this.rgbToHex(rgbAccent), rgb: rgbAccent },
      { name: 'Dark', hex: this.rgbToHex(rgbDark), rgb: rgbDark },
      { name: 'Light', hex: this.rgbToHex(rgbLight), rgb: rgbLight }
    ];
  }

  /**
   * Convert RGB to HSL
   * @param {Array} rgb - RGB values as array [r, g, b]
   * @returns {Array} HSL values as array [h, s, l]
   */
  rgbToHsl(rgb) {
    let [r, g, b] = rgb.map(val => val / 255);
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      // Achromatic case
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return [h, s, l];
  }

  /**
   * Convert HSL to RGB
   * @param {Array} hsl - HSL values as array [h, s, l]
   * @returns {Array} RGB values as array [r, g, b]
   */
  hslToRgb(hsl) {
    const [h, s, l] = hsl;
    let r, g, b;
    
    if (s === 0) {
      // Achromatic case
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }

  /**
   * Apply colors to SVG elements based on their roles
   * @param {Object} svgManager - The SVG manager service instance
   * @param {Object} colorMapping - Mapping of role to color (e.g. {primary: '#FF0000'})
   * @returns {boolean} Success status
   */
  applyColorsToSVG(svgManager, colorMapping) {
    if (!svgManager || !svgManager.svgElement) {
      console.error('Invalid SVG manager provided');
      return false;
    }

    try {
      // Get all elements with color roles
      const primaryElements = svgManager.svgElement.querySelectorAll('.primary-color-element');
      const secondaryElements = svgManager.svgElement.querySelectorAll('.secondary-color-element');
      const accentElements = svgManager.svgElement.querySelectorAll('.accent-color-element');
      const darkElements = svgManager.svgElement.querySelectorAll('.dark-color-element');
      const lightElements = svgManager.svgElement.querySelectorAll('.light-color-element');

      // Apply fill colors based on roles
      if (colorMapping.primary) {
        primaryElements.forEach(el => {
          if (el.hasAttribute('fill')) {
            el.setAttribute('fill', colorMapping.primary);
          }
        });
      }
      
      if (colorMapping.secondary) {
        secondaryElements.forEach(el => {
          if (el.hasAttribute('fill')) {
            el.setAttribute('fill', colorMapping.secondary);
          }
        });
      }
      
      if (colorMapping.accent) {
        accentElements.forEach(el => {
          if (el.hasAttribute('fill')) {
            el.setAttribute('fill', colorMapping.accent);
          }
        });
      }
      
      if (colorMapping.dark) {
        darkElements.forEach(el => {
          if (el.hasAttribute('fill')) {
            el.setAttribute('fill', colorMapping.dark);
          }
        });
      }
      
      if (colorMapping.light) {
        lightElements.forEach(el => {
          if (el.hasAttribute('fill')) {
            el.setAttribute('fill', colorMapping.light);
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error applying colors to SVG:', error);
      return false;
    }
  }

  /**
   * Create a custom color scheme
   * @param {string} name - Name for the new scheme
   * @param {Array} colors - Array of color objects
   * @returns {boolean} Success status
   */
  createCustomScheme(name, colors) {
    if (!name || !colors || !Array.isArray(colors) || colors.length < 3) {
      return false;
    }
    
    this.colorSchemes[name] = colors;
    return true;
  }

  /**
   * Get a color's brightness value (0-255) - used to determine if text should be light or dark
   * @param {string} hexColor - Hex color value
   * @returns {number} Brightness value
   */
  getColorBrightness(hexColor) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return 128;
    
    // Using the YIQ formula which gives a rough perceptual brightness
    return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  }

  /**
   * Determine if a color should use dark or light text
   * @param {string} backgroundColor - Background color in hex format
   * @returns {string} Recommended text color ('#FFFFFF' or '#000000')
   */
  getTextColorForBackground(backgroundColor) {
    const brightness = this.getColorBrightness(backgroundColor);
    return brightness > 125 ? '#000000' : '#FFFFFF';
  }

  /**
   * Adjust a color's brightness
   * @param {string} color - Color in hex format
   * @param {number} factor - Brightness adjustment factor (negative darkens, positive brightens)
   * @returns {string} Adjusted color in hex format
   */
  adjustColorBrightness(color, factor) {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;
    
    const adjustedRgb = rgb.map(val => {
      return Math.max(0, Math.min(255, val + (factor * 255)));
    });
    
    return this.rgbToHex(adjustedRgb);
  }
}

// Export a singleton instance
const colorManager = new ColorManager();
export default colorManager;