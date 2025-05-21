# Geometric Logo Platform - MVP Technical Development Guide

This guide provides the essential technical information needed to implement the P0 (must-have) features of the Geometric Logo Platform MVP.

## Key Technologies

- **Framework**: React 18+ with Vite
- **State Management**: Zustand
- **SVG Manipulation**: SVG.js library
- **Styling**: Tailwind CSS
- **Export**: Canvas API for SVG-to-PNG conversion

## P0 Features & Implementation Guidelines

### 1. Base SVG Icons

**Requirements:**
- Create 10 geometric SVG icons (located in `/public/assets/svg-templates/`)
- Use SVG 1.1 standard with viewBox="0 0 400 400"
- Elements must have proper IDs and classes for manipulation

**Critical Classes:**
- `editable`: Elements that can be edited
- `editable-fill`: Elements where fill color can be changed
- `editable-stroke`: Elements where stroke color can be changed
- `primary-color-element`, `secondary-color-element`, `accent-color-element`: For color palette application

**Example Icon Structure:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <g id="circle-main-group" class="transform-group">
    <circle id="circle-outer" class="editable editable-fill primary-color-element" 
            cx="200" cy="200" r="180" fill="#0B3C5D" />
  </g>
</svg>
```

### 2. Icon Selection Interface

**Implementation:**
- Create a grid view of the 10 base icons
- When selected, load SVG content using fetch API
- Parse SVG and initialize the editor with it

**Key Logic:**
```javascript
// Load SVG template
async function loadSVGTemplate(logoId) {
  const response = await fetch(`/assets/svg-templates/${logoId}.svg`);
  return await response.text();
}

// When icon is selected
async function selectLogo(logoId) {
  const svgString = await loadSVGTemplate(logoId);
  initializeEditor(svgString);
}
```

### 3. SVG Element Selection & Editing

**Implementation:**
- Make elements with class "editable" selectable
- Show properties of selected element in properties panel
- Implement basic transformations (move, rotate, scale)

**SVG Manager Core Methods:**
```javascript
class SVGManager {
  // Initialize with SVG content
  initialize(svgString, containerId) {
    // Parse SVG and set up event handlers
  }
  
  // Set up click handlers for editable elements
  setupEventHandlers() {
    const editableElements = this.svgInstance.find('.editable');
    editableElements.forEach(element => {
      element.click(() => this.onSelectElement(element.id()));
    });
  }
  
  // Apply style changes
  applyStyle(elementId, style) {
    const element = this.svgInstance.find(`#${elementId}`)[0];
    if (!element) return false;
    
    // Apply styles (fill, stroke, etc.)
    if (style.fill) element.fill(style.fill);
    if (style.stroke) element.stroke(style.stroke);
    if (style.strokeWidth) element.stroke({ width: style.strokeWidth });
    
    return true;
  }
  
  // Apply transformations
  applyTransformation(elementId, transform) {
    const element = this.svgInstance.find(`#${elementId}`)[0];
    if (!element) return false;
    
    // Apply transformations
    if (transform.translate) element.translate(transform.translate.x, transform.translate.y);
    if (transform.rotate !== undefined) element.rotate(transform.rotate);
    if (transform.scale) element.scale(transform.scale.x, transform.scale.y);
    
    return true;
  }
}
```

### 4. Color Customization

**Implementation:**
- Allow changing colors of individual elements
- Implement global color schemes with preset palettes

**Preset Palettes:**
1. Technical Blue: Primary=#0B3C5D, Secondary=#328CC1, Accent=#D9B310
2. Eco Green: Primary=#2A9D8F, Secondary=#E9C46A, Accent=#264653

**Color Application Logic:**
```javascript
function applyPaletteToElements(elements, palette) {
  elements.forEach((element, id) => {
    // Apply colors based on element classes
    if (element.hasClass('primary-color-element')) {
      element.fill(palette.primary);
    } else if (element.hasClass('secondary-color-element')) {
      element.fill(palette.secondary);
    } else if (element.hasClass('accent-color-element')) {
      element.fill(palette.accent);
    }
  });
}
```

### 5. Typography Integration

**Implementation:**
- Allow adding company name and optional tagline
- Include font selection from 4 bundled fonts
- Support positioning text relative to logo

**Bundled Fonts:**
- Inter (sans-serif)
- Merriweather (serif)
- Montserrat (sans-serif)
- Roboto Mono (monospace)

**Text Addition Logic:**
```javascript
function addTextElement(text, font, position) {
  const textElement = svg.text(text)
    .font({
      family: font.family,
      size: font.size,
      weight: font.weight
    })
    .fill(font.color);
  
  // Position text relative to logo
  const logoBBox = svg.bbox();
  if (position === 'below') {
    textElement.move(logoBBox.cx, logoBBox.y2 + 20);
    textElement.textAnchor('middle');
  } else if (position === 'beside') {
    textElement.move(logoBBox.x2 + 20, logoBBox.cy);
  }
  
  return textElement;
}
```

### 6. Export Functionality

**Implementation:**
- Implement export to SVG format
- Implement export to PNG using Canvas API

**PNG Export Logic:**
```javascript
async function exportToPNG(resolution = 1) {
  // Ensure fonts are loaded
  await fontManager.waitForFontsLoaded();
  
  // Get SVG string
  const svgString = svgManager.toSVGString();
  
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
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = 'logo.png';
      link.href = pngUrl;
      link.click();
      
      URL.revokeObjectURL(url);
      resolve();
    };
    img.src = url;
  });
}
```

## Store Structure (Zustand)

```javascript
const useLogoStore = create((set, get) => ({
  // Current project state
  currentProject: {
    iconId: null,
    svgContent: '',
    elements: new Map(), // Map of editable elements
    selectedElementId: null,
    textElements: [], // Company name and tagline
    colorPalette: null,
  },
  
  // Actions
  selectLogo: async (logoId) => { /* ... */ },
  selectElement: (elementId) => { /* ... */ },
  updateElement: (elementId, properties) => { /* ... */ },
  applyColorPalette: (palette) => { /* ... */ },
  addTextElement: (textElement) => { /* ... */ },
  exportLogo: (format, resolution) => { /* ... */ },
}))
```

## Component Structure

```
App
├── LogoSelectionScreen
│   └── IconGrid
├── EditorScreen
│   ├── EditingCanvas
│   ├── PropertiesPanel
│   ├── ColorEditorPanel
│   └── PreviewPanel
├── TypographyScreen
│   ├── FontSelector
│   └── TextPropertiesPanel
└── ExportScreen
    └── ExportOptionsPanel
```

## Critical Implementation Considerations

1. **SVG Manipulation Performance:**
   - Use SVG.js for efficient DOM operations
   - Implement debouncing for high-frequency operations
   - Test performance with complex icons

2. **Font Handling:**
   - Preload all fonts at application startup
   - Use FontFace API to track loading status
   - Ensure fonts are loaded before export

3. **SVG to PNG Conversion:**
   - Handle font rendering correctly during conversion
   - Support different export resolutions
   - Test export quality across browsers

4. **User Experience:**
   - Provide visual feedback during operations
   - Implement intuitive selection controls
   - Ensure responsive design for different screen sizes

## Dev Environment Setup

1. Create project using Vite:
   ```bash
   npm create vite@latest geometric-logo-platform -- --template react
   cd geometric-logo-platform
   npm install
   ```

2. Install dependencies:
   ```bash
   npm install zustand @svgdotjs/svg.js tailwindcss postcss autoprefixer
   ```

3. Initialize Tailwind CSS:
   ```bash
   npx tailwindcss init -p
   ```

4. Create folder structure and initialize main files

---

This guide focuses on the core P0 functionality for the Geometric Logo Platform MVP. Review and provide feedback on whether this technical summary meets your needs for implementation.
