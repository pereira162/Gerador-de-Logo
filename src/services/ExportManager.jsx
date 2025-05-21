import svgManager from './SVGManager';
import fontManager from './FontManager';

class ExportManager {
  constructor() {
    this.svgManager = svgManager;
    this.fontManager = fontManager;
  }
  
  // Export logo as SVG
  async exportSVG(selectedVariants = ['main']) {
    // Ensure we have an SVG instance
    if (!this.svgManager.svgInstance) {
      throw new Error('No SVG loaded for export');
    }
    
    // Get the SVG string
    const svgString = this.svgManager.toSVGString();
    
    // For basic implementation, just return the main SVG
    // In the future, this would handle multiple variants
    if (selectedVariants.length === 1 && selectedVariants[0] === 'main') {
      this.downloadFile(svgString, 'logo.svg', 'image/svg+xml');
      return true;
    }
    
    // Advanced implementation would create different versions
    // For the MVP, we only support the main variant
    return true;
  }
  
  // Export logo as PNG
  async exportPNG(selectedVariants = ['main'], resolution = 1) {
    // Ensure fonts are loaded first
    await this.fontManager.waitForFontsLoaded();
    
    // Get SVG string
    const svgString = this.svgManager.toSVGString();
    
    // Create canvas with appropriate size
    const canvas = document.createElement('canvas');
    canvas.width = 400 * resolution;
    canvas.height = 400 * resolution;
    const ctx = canvas.getContext('2d');
    
    // Draw SVG on canvas
    const img = new Image();
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        // Draw with resolution scaling
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        
        // Create download link
        this.downloadFile(pngUrl, 'logo.png', 'image/png', true);
        
        // Clean up
        URL.revokeObjectURL(url);
        resolve(true);
      };
      
      img.src = url;
    });
  }
  
  // Generate variants of the logo
  generateVariants(logoState) {
    // This would create horizontal, vertical, etc. variants
    // For the MVP, we'll keep it simple
    const variants = {
      main: this.svgManager.toSVGString()
    };
    
    return variants;
  }
  
  // Helper to download a file
  downloadFile(content, filename, mimeType, isDataURL = false) {
    const link = document.createElement('a');
    
    if (isDataURL) {
      link.href = content; // Content is already a data URL
    } else {
      // Create a blob and object URL
      const blob = new Blob([content], { type: mimeType });
      link.href = URL.createObjectURL(blob);
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL if created
    if (!isDataURL) {
      URL.revokeObjectURL(link.href);
    }
    
    return true;
  }
  
  // Create a ZIP package with multiple files
  // Note: This is a P1 feature, not required for MVP
  async createZipPackage(files) {
    // For future implementation
    console.warn('ZIP packaging is a P1 feature, not implemented in MVP');
    return false;
  }
}

// Export a singleton instance
const exportManager = new ExportManager();
export default exportManager;