/**
 * SVGTemplates.jsx - Utility for managing SVG templates for the geometric logo platform
 * Contains references to all SVG templates and methods to access them
 */

// All available SVG template categories and their respective templates
const SVG_TEMPLATES = {
  basic: [
    {
      id: 'circle',
      name: 'Circle',
      path: '/assets/svg-templates/circle-icon.svg',
      thumbnail: '/assets/svg-templates/circle-icon.svg',
      description: 'Concentric circles design',
      category: 'basic',
    },
    {
      id: 'square',
      name: 'Square',
      path: '/assets/svg-templates/square-icon.svg',
      thumbnail: '/assets/svg-templates/square-icon.svg',
      description: 'Nested squares design',
      category: 'basic',
    },
    {
      id: 'triangle',
      name: 'Triangle',
      path: '/assets/svg-templates/triangle-icon.svg',
      thumbnail: '/assets/svg-templates/triangle-icon.svg',
      description: 'Layered triangles design',
      category: 'basic',
    },
    {
      id: 'hexagon',
      name: 'Hexagon',
      path: '/assets/svg-templates/hexagon-icon.svg',
      thumbnail: '/assets/svg-templates/hexagon-icon.svg',
      description: 'Nested hexagons design',
      category: 'basic',
    },
  ],
  special: [
    {
      id: 'star',
      name: 'Star',
      path: '/assets/svg-templates/star-icon.svg',
      thumbnail: '/assets/svg-templates/star-icon.svg',
      description: 'Star shape with layers',
      category: 'special',
    },
    {
      id: 'abstract',
      name: 'Abstract',
      path: '/assets/svg-templates/abstract-icon.svg',
      thumbnail: '/assets/svg-templates/abstract-icon.svg',
      description: 'Abstract organic shape',
      category: 'special',
    },
    {
      id: 'curve',
      name: 'Curve',
      path: '/assets/svg-templates/curve-icon.svg',
      thumbnail: '/assets/svg-templates/curve-icon.svg',
      description: 'Flowing curves design',
      category: 'special',
    },
    {
      id: 'grid',
      name: 'Grid',
      path: '/assets/svg-templates/grid-icon.svg',
      thumbnail: '/assets/svg-templates/grid-icon.svg',
      description: 'Modern grid pattern',
      category: 'special',
    },
    {
      id: 'lines',
      name: 'Lines',
      path: '/assets/svg-templates/lines-icon.svg',
      thumbnail: '/assets/svg-templates/lines-icon.svg',
      description: 'Dynamic line pattern',
      category: 'special',
    },
    {
      id: 'spiral',
      name: 'Spiral',
      path: '/assets/svg-templates/spiral-icon.svg',
      thumbnail: '/assets/svg-templates/spiral-icon.svg',
      description: 'Elegant spiral shape',
      category: 'special',
    },
  ],
};

// Additional metadata for template categories
const TEMPLATE_CATEGORIES = [
  {
    id: 'basic',
    name: 'Basic Shapes',
    description: 'Simple geometric shapes for clean, minimal logos',
  },
  {
    id: 'special',
    name: 'Special Shapes',
    description: 'More complex and unique geometric patterns',
  },
];

/**
 * Get all available template categories
 * @returns {Array} Array of template category objects
 */
const getAllCategories = () => {
  return TEMPLATE_CATEGORIES;
};

/**
 * Get all templates from a specific category
 * @param {string} categoryId - The ID of the category to filter by
 * @returns {Array} Array of template objects in the specified category
 */
const getTemplatesByCategory = (categoryId) => {
  return SVG_TEMPLATES[categoryId] || [];
};

/**
 * Get all available templates across all categories
 * @returns {Array} Flattened array of all template objects
 */
const getAllTemplates = () => {
  return Object.values(SVG_TEMPLATES).flat();
};

/**
 * Get a specific template by its ID
 * @param {string} templateId - The ID of the template to retrieve
 * @returns {Object|null} The template object or null if not found
 */
const getTemplateById = (templateId) => {
  for (const category in SVG_TEMPLATES) {
    const template = SVG_TEMPLATES[category].find(t => t.id === templateId);
    if (template) return template;
  }
  return null;
};

/**
 * Load an SVG template content from its path
 * @param {string} templateId - The ID of the template to load
 * @returns {Promise<string|null>} Promise resolving to the SVG content or null if not found
 */
const loadTemplateContent = async (templateId) => {
  try {
    const template = getTemplateById(templateId);
    if (!template) return null;
    
    const response = await fetch(template.path);
    if (!response.ok) throw new Error(`Failed to load template: ${response.statusText}`);
    
    return await response.text();
  } catch (error) {
    console.error('Error loading SVG template:', error);
    return null;
  }
};

/**
 * Create a new empty SVG template with basic structure
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @returns {string} Basic empty SVG template string
 */
const createEmptySVG = (width = 400, height = 400) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <g id="main-group" class="transform-group">
    <!-- Add elements here -->
  </g>
</svg>`;
};

export {
  getAllCategories,
  getTemplatesByCategory,
  getAllTemplates,
  getTemplateById,
  loadTemplateContent,
  createEmptySVG,
};