# Geometric Logo Platform - System Design Document

## 1. Implementation Approach

### 1.1 Overview
The Geometric Logo Platform is a web-based application that allows users to select SVG templates, customize elements (colors, transformations), add text, and export the final logo. The application is entirely client-side ('self-contained') built with React, Zustand for state management, and Tailwind CSS for styling.

### 1.2 Technology Stack
- **Frontend Framework**: React.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **SVG Manipulation**: Custom SVGManager service
- **Bundling**: Vite

### 1.3 Key Challenges and Solutions

#### 1.3.1 SVG Element Selection and Editing
The platform needs to allow users to interact with SVG elements for editing. This involves:
- Identifying clickable elements with proper class markers (`editable`, `primary-color-element`, `secondary-color-element`, etc.)
- Providing visual feedback when hovering/selecting elements
- Recording selected elements in the application state
- Displaying appropriate editing controls based on the selected element type

#### 1.3.2 Properties Panel Implementation
The properties panel must dynamically update based on the selected element, showing:
- For shape elements: color pickers, transformation controls, opacity slider
- For text elements: font family selector, font size, alignment, color picker, bold/italic toggles

#### 1.3.3 Real-time Preview
All edits must be immediately reflected in the editor canvas, requiring a robust two-way binding between:
- The properties panel controls
- The application state (via Zustand)
- The actual SVG DOM manipulation (via SVGManager)

## 2. Data Structures and Interfaces

### 2.1 Core Data Models

#### Project
Represents a complete logo project with all its elements and configurations.

```typescript
interface Project {
  id: string;
  name: string;
  svgContent: string;  // Current SVG content as string
  templateId: string;  // ID of the base template
  elements: {[elementId: string]: ElementProperties};
  textElements: TextElement[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### ElementProperties
Stores properties for each SVG element in the logo.

```typescript
interface ElementProperties {
  id: string;
  type: 'path' | 'circle' | 'rect' | 'ellipse' | 'polygon' | 'polyline' | 'g';
  fill: string | null;
  stroke: string | null;
  strokeWidth: number | null;
  opacity: number;
  transform: {
    translate: {x: number, y: number},
    scale: {x: number, y: number},
    rotate: number,
  };
  originalAttributes: Object;  // Original SVG attributes
}
```

#### TextElement
Represents text elements added to the logo.

```typescript
interface TextElement {
  id: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textAlignment: 'start' | 'middle' | 'end';
  fill: string;
  position: {x: number, y: number};
  transform: {
    translate: {x: number, y: number},
    scale: {x: number, y: number},
    rotate: number,
  };
}
```

### 2.2 State Management

The application uses Zustand for state management with the following main stores:

#### LogoStore
Central store managing the logo editing state.

```typescript
interface LogoState {
  // Project data
  currentProject: Project | null;
  availableTemplates: Template[];
  isLoading: boolean;
  error: string | null;
  
  // Selection state
  selectedElementId: string | null;
  selectedTextElementId: string | null;
  currentElementStyles: Partial<ElementProperties> | null;
  
  // Actions
  createNewProject: (templateId: string) => void;
  loadProject: (projectId: string) => void;
  saveProject: () => void;
  
  // Element selection
  selectElement: (elementId: string) => void;
  selectTextElement: (textElementId: string) => void;
  clearSelection: () => void;
  
  // Element modification
  updateElementStyle: (elementId: string, styles: Partial<ElementProperties>) => void;
  updateElementTransform: (elementId: string, transform: Partial<Transform>) => void;
  updateTextElement: (textElementId: string, props: Partial<TextElement>) => void;
  
  // Text operations
  addTextElement: (initialProps?: Partial<TextElement>) => void;
  removeTextElement: (textElementId: string) => void;
  
  // Export operations
  exportAsSVG: () => string;
  exportAsPNG: () => Promise<string>;
  exportAsJPG: () => Promise<string>;
}
```

#### UIStore
Manages UI-related state like active screens, modals, etc.

```typescript
interface UIState {
  activeScreen: 'welcome' | 'templates' | 'editor' | 'typography' | 'export';
  isPropertiesPanelOpen: boolean;
  activeTab: 'shape' | 'text' | 'export';
  isTemplateModalOpen: boolean;
  isSaveModalOpen: boolean;
  
  // Actions
  setActiveScreen: (screen: UIState['activeScreen']) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  togglePropertiesPanel: () => void;
  openTemplateModal: () => void;
  closeTemplateModal: () => void;
  openSaveModal: () => void;
  closeSaveModal: () => void;
}
```

## 3. Key Components and Services

### 3.1 Core Services

#### SVGManager
Handles all DOM manipulation of SVG elements.

```typescript
class SVGManager {
  // Initialization
  initialize(svgContent: string, containerId: string): void;
  cleanup(): void;
  
  // Selection management
  setElementSelectCallback(callback: (elementId: string) => void): void;
  highlightElement(elementId: string): void;
  clearHighlight(): void;
  
  // Element properties
  getElementStyle(elementId: string): Partial<ElementProperties>;
  setElementStyle(elementId: string, styles: Partial<ElementProperties>): void;
  getElementTransform(elementId: string): Transform;
  setElementTransform(elementId: string, transform: Partial<Transform>): void;
  
  // Text management
  addTextElement(textElement: TextElement): void;
  updateTextElement(textElementId: string, props: Partial<TextElement>): void;
  removeTextElement(textElementId: string): void;
  
  // Export
  getSVGContent(): string;
  rasterize(format: 'png' | 'jpg', scale?: number): Promise<string>;
}
```

### 3.2 Main Components

#### App Structure
- **AppRouter**: Manages navigation between main screens
- **MainLayout**: Common layout wrapping all screens

#### Editor Screen Components
- **EditorScreen**: Main container for the editor
- **EditingCanvas**: SVG display and interaction area
- **PropertiesPanel**: Dynamic panel displaying controls for selected elements
  - **ShapeProperties**: Controls specific to shapes (color, opacity, etc)
  - **TextProperties**: Controls specific to text elements
- **ToolsSidebar**: Tools and operations (undo/redo, alignment, etc)

#### PropertiesPanel Components
- **ColorPicker**: Custom color selection control
- **TransformationControls**: Interface for scale, rotation, translation
- **OpacitySlider**: Slider for adjusting element opacity
- **ResetButton**: Button to reset element to original properties
- **TextFormatControls**: Text-specific formatting tools

## 4. Key Implementation Requirements

### 4.1 SVG Element Selection and Editing
1. All SVG templates must have `.editable` class on elements that should be selectable
2. Color-editable elements should have additional classes: `.primary-color-element`, `.secondary-color-element`, etc.
3. The SVGManager must attach click handlers to all elements with the `.editable` class
4. When an element is selected:
   - Its ID must be stored in LogoStore.selectedElementId
   - Its current styles must be extracted and stored in LogoStore.currentElementStyles
   - The PropertiesPanel must update to show the relevant controls
   - Visual indication should appear (highlight, handles, etc.)

### 4.2 Properties Panel Implementation
1. The panel must dynamically render different controls based on selected element type
2. Controls must be two-way bound to the store state
3. Changes must be immediately applied to the SVG
4. Each property section should include a reset button to restore defaults

### 4.3 Text Element Handling
1. Text elements are represented differently from SVG elements
2. Adding text creates a new SVG text element in the DOM
3. Text-specific properties (font, alignment, etc.) require dedicated controls

## 5. Anything UNCLEAR

1. **User Permissions**: The current design doesn't address user authentication or project storage persistence. It's assumed projects are stored locally.

2. **Template Management**: The system for adding/importing new templates needs further specification.

3. **Advanced Features**: Features like layers management, grouping/ungrouping elements, and keyboard shortcuts need further implementation details.

4. **Performance Optimization**: For complex SVGs with many elements, optimization strategies may be needed for smooth editing experience.