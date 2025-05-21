# Geometric Logo Platform

A web-based application for creating, customizing, and exporting geometric logo designs. This platform provides simple yet powerful tools for users to create professional-looking logos based on geometric principles.

## Features

- **Geometric Logo Templates**: Choose from a variety of pre-designed geometric logo templates
- **Interactive Editor**: Select and customize individual elements of your logo
- **Color Customization**: Apply professionally designed color palettes to your logo
- **Typography Tools**: Add and customize text elements with various fonts
- **Export Options**: Download your finished logo in SVG or PNG formats

## Project Structure

```
├── src/
│   ├── components/       # React components
│   ├── services/         # Core services for SVG manipulation, colors, fonts, etc.
│   │   ├── ColorManager.jsx    # Color scheme management
│   │   ├── ExportManager.jsx   # SVG/PNG export functionality
│   │   ├── FontManager.jsx     # Font loading and management
│   │   └── SVGManager.jsx      # SVG manipulation and rendering
│   ├── store/            # State management
│   │   └── LogoStore.jsx       # Zustand store for application state
│   ├── utils/            # Utility functions and data
│   │   └── SVGTemplates.js     # Logo template definitions
│   ├── screens/          # Main application screens
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles (Tailwind)
├── public/
│   ├── templates/        # SVG template files
│   └── thumbnails/       # Template preview thumbnails
└── ... (configuration files)
```

## Core Architecture

### Services

- **SVGManager**: Central service for SVG manipulation, handling rendering, element selection, and property modification
- **ColorManager**: Manages color schemes and applies them to SVG elements
- **FontManager**: Handles font loading and application to text elements
- **ExportManager**: Facilitates SVG and PNG export functionality

### State Management

The application uses Zustand for state management with a central LogoStore that maintains:

- Current project state
- Selected elements
- Color palette information
- Text elements
- Element transformations

## Development Setup

### Prerequisites

- Node.js (v18+)
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd Gerador-de-Logo

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

## Development Guidelines

- Follow the component structure when adding new features
- Use TailwindCSS for styling components
- Update the SVGTemplates.js file when adding new templates
- Add proper documentation for new functions and components
- Follow the [Adding New SVG Icons Guide](./Adding_New_SVG_Icons_Guide.md) when creating new templates

## Available Scripts

- `pnpm install` - Install dependencies
- `pnpm run dev` - Start development server
- `pnpm run lint` - Lint source files
- `pnpm run build` - Build for production

## Documentation

- [MVP P0 Completion Report](./MVP_P0_Completion_Report.md) - Current status and next steps
- [Software Architecture Document](./Software_Architecture_Document.md) - Technical architecture details
- [Technical Development Summary for MVP](./Technical_Development_Summary_for_MVP.md) - MVP development checklist
- [Adding New SVG Icons Guide](./Adding_New_SVG_Icons_Guide.md) - Guide for adding new template SVGs
- [Geometric Logo Design Guide](./Consolidated_Geometric_Logo_Design_Guide.md) - Design principles