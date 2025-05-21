import { SVG } from '@svgdotjs/svg.js';

class SVGManager {
  constructor() {
    this.parser = new DOMParser();
    this.svgDocument = null;
    this.svgInstance = null;
    this.editableElements = new Map();
    this.onElementSelectCallback = null;
  }

  // Initialize with SVG content
  initialize(svgString, containerId) {
    // Clear any existing SVG
    if (this.svgInstance) {
      this.svgInstance.remove();
    }

    // Parse SVG string into DOM
    this.svgDocument = this.parser.parseFromString(svgString, 'image/svg+xml');
    
    // Create SVG.js instance
    this.svgInstance = SVG().addTo(`#${containerId}`).size('100%', '100%');
    this.svgInstance.svg(svgString);
    
    // Get all editable elements and build a map
    this.editableElements = new Map();
    this.setupEventHandlers();
    
    return this.getElementsMap();
  }
  
  // Set up click handlers for editable elements
  setupEventHandlers() {
    const editables = this.svgInstance.find('.editable');
    
    editables.each((i, members) => {
      const el = members[i];
      
      // Store element info in map
      const elementType = el.type;
      const id = el.attr('id');
      
      // Skip if no ID
      if (!id) return;
      
      // Add to map
      this.editableElements.set(id, {
        id,
        type: elementType,
        fill: el.attr('fill') || 'none',
        stroke: el.attr('stroke') || 'none',
        strokeWidth: parseFloat(el.attr('stroke-width')) || 0,
        opacity: parseFloat(el.attr('opacity')) || 1,
        transform: {
          translate: { x: 0, y: 0 },
          rotate: 0,
          scale: { x: 1, y: 1 },
          origin: { x: 0, y: 0 }
        },
        original: {
          fill: el.attr('fill') || 'none',
          stroke: el.attr('stroke') || 'none',
          strokeWidth: parseFloat(el.attr('stroke-width')) || 0,
          transform: {
            translate: { x: 0, y: 0 },
            rotate: 0,
            scale: { x: 1, y: 1 },
            origin: { x: 0, y: 0 }
          }
        }
      });
      
      // Add click handler
      el.click(() => {
        if (this.onElementSelectCallback) {
          this.onElementSelectCallback(id);
        }
      });
    });
    
    return this.editableElements;
  }
  
  getElementsMap() {
    return this.editableElements;
  }
  
  setElementSelectCallback(callback) {
    this.onElementSelectCallback = callback;
  }
  
  // Apply style changes to element
  applyStyle(elementId, style) {
    const element = this.svgInstance.find(`#${elementId}`)[0];
    if (!element) return false;
    
    // Update element with new styles
    if (style.fill) element.fill(style.fill);
    if (style.stroke) element.stroke(style.stroke);
    if (style.strokeWidth !== undefined) element.stroke({ width: style.strokeWidth });
    if (style.opacity !== undefined) element.opacity(style.opacity);
    
    // Update our map
    const elementData = this.editableElements.get(elementId);
    if (elementData) {
      if (style.fill) elementData.fill = style.fill;
      if (style.stroke) elementData.stroke = style.stroke;
      if (style.strokeWidth !== undefined) elementData.strokeWidth = style.strokeWidth;
      if (style.opacity !== undefined) elementData.opacity = style.opacity;
    }
    
    return true;
  }
  
  // Apply transformations to element
  applyTransformation(elementId, transform) {
    // Find the SVG element and the group that contains it
    const element = this.svgInstance.find(`#${elementId}`)[0];
    if (!element) return false;
    
    // Clear any existing transforms
    element.transform({});
    
    // Apply new transformation
    if (transform.translate) {
      element.translate(transform.translate.x, transform.translate.y);
    }
    
    if (transform.rotate !== undefined) {
      const cx = transform.origin ? transform.origin.x : element.cx();
      const cy = transform.origin ? transform.origin.y : element.cy();
      element.rotate(transform.rotate, cx, cy);
    }
    
    if (transform.scale) {
      element.scale(transform.scale.x, transform.scale.y);
    }
    
    // Update our map
    const elementData = this.editableElements.get(elementId);
    if (elementData) {
      elementData.transform = { ...transform };
    }
    
    return true;
  }
  
  // Add text element to the SVG
  addTextElement(textElement) {
    const svgText = this.svgInstance.text(textElement.content)
      .font({
        family: textElement.fontFamily,
        size: textElement.fontSize,
        weight: textElement.fontWeight
      })
      .fill(textElement.fill)
      .id(textElement.id);
    
    if (textElement.position) {
      svgText.move(textElement.position.x, textElement.position.y);
    }
    
    if (textElement.alignment === 'center') {
      svgText.attr('text-anchor', 'middle');
    } else if (textElement.alignment === 'right') {
      svgText.attr('text-anchor', 'end');
    }
    
    if (textElement.letterSpacing) {
      svgText.attr('letter-spacing', textElement.letterSpacing);
    }
    
    // Add to map
    this.editableElements.set(textElement.id, {
      id: textElement.id,
      type: 'text',
      fill: textElement.fill,
      stroke: 'none',
      strokeWidth: 0,
      opacity: 1,
      transform: {
        translate: { x: 0, y: 0 },
        rotate: 0,
        scale: { x: 1, y: 1 },
        origin: { x: 0, y: 0 }
      },
      original: {
        fill: textElement.fill,
        stroke: 'none',
        strokeWidth: 0,
        transform: {
          translate: { x: 0, y: 0 },
          rotate: 0,
          scale: { x: 1, y: 1 },
          origin: { x: 0, y: 0 }
        }
      }
    });
    
    return textElement.id;
  }
  
  // Position text element relative to the logo or specific element
  positionTextElement(textElement, referenceElement = null) {
    const textEl = this.svgInstance.find(`#${textElement.id}`)[0];
    if (!textEl) return false;
    
    let bbox;
    
    if (referenceElement) {
      const refEl = this.svgInstance.find(`#${referenceElement}`)[0];
      if (refEl) {
        bbox = refEl.bbox();
      } else {
        bbox = this.svgInstance.bbox();
      }
    } else {
      bbox = this.svgInstance.bbox();
    }
    
    // Position text based on specified position
    if (textElement.position === 'below') {
      textEl.move(bbox.cx, bbox.y2 + 20).attr('text-anchor', 'middle');
    } else if (textElement.position === 'above') {
      textEl.move(bbox.cx, bbox.y - 20).attr('text-anchor', 'middle');
    } else if (textElement.position === 'left') {
      textEl.move(bbox.x - 10, bbox.cy).attr('text-anchor', 'end');
    } else if (textElement.position === 'right') {
      textEl.move(bbox.x2 + 10, bbox.cy).attr('text-anchor', 'start');
    } else if (textElement.position === 'center') {
      textEl.move(bbox.cx, bbox.cy).attr('text-anchor', 'middle');
    } else {
      // Custom position
      textEl.move(textElement.position.x, textElement.position.y);
    }
    
    return true;
  }
  
  // Convert SVG to a string
  toSVGString() {
    return this.svgInstance.svg();
  }
  
  // Get the bounding box of an element or the entire SVG
  getBBox(elementId = null) {
    if (elementId) {
      const el = this.svgInstance.find(`#${elementId}`)[0];
      return el ? el.bbox() : null;
    }
    return this.svgInstance.bbox();
  }
}

// Export a singleton instance
const svgManager = new SVGManager();
export default svgManager;