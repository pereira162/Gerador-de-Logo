// SVG templates for geometric logo icons
// Each template adheres to SVG 1.1 standard with viewBox="0 0 400 400"
// and includes the necessary classes for manipulation
export const SVGTemplates = {
  circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="circle-main-group" class="transform-group">
      <circle 
        id="circle-outer" 
        class="editable editable-fill primary-color-element" 
        cx="200" cy="200" r="180" 
        fill="#0B3C5D" 
      />
      <circle 
        id="circle-inner" 
        class="editable editable-fill secondary-color-element" 
        cx="200" cy="200" r="120" 
        fill="#328CC1" 
      />
      <circle 
        id="circle-center" 
        class="editable editable-fill accent-color-element" 
        cx="200" cy="200" r="60" 
        fill="#D9B310" 
      />
    </g>
  </svg>`,

  square: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="square-main-group" class="transform-group">
      <rect 
        id="square-outer" 
        class="editable editable-fill editable-stroke primary-color-element" 
        x="40" y="40" width="320" height="320" 
        fill="#0B3C5D" 
        stroke="#328CC1" stroke-width="2" 
      />
      <rect 
        id="square-middle" 
        class="editable editable-fill secondary-color-element" 
        x="80" y="80" width="240" height="240" 
        fill="#328CC1" 
      />
      <rect 
        id="square-inner" 
        class="editable editable-fill accent-color-element" 
        x="120" y="120" width="160" height="160" 
        fill="#D9B310" 
      />
    </g>
  </svg>`,

  triangle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="triangle-main-group" class="transform-group">
      <polygon 
        id="triangle-outer" 
        class="editable editable-fill primary-color-element" 
        points="200,40 40,340 360,340" 
        fill="#0B3C5D" 
      />
      <polygon 
        id="triangle-middle" 
        class="editable editable-fill secondary-color-element" 
        points="200,100 100,300 300,300" 
        fill="#328CC1" 
      />
      <polygon 
        id="triangle-inner" 
        class="editable editable-fill accent-color-element" 
        points="200,160 140,260 260,260" 
        fill="#D9B310" 
      />
    </g>
  </svg>`,

  hexagon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="hexagon-main-group" class="transform-group">
      <polygon 
        id="hexagon-outer" 
        class="editable editable-fill primary-color-element" 
        points="200,40 340,120 340,280 200,360 60,280 60,120" 
        fill="#0B3C5D" 
      />
      <polygon 
        id="hexagon-middle" 
        class="editable editable-fill secondary-color-element" 
        points="200,100 290,150 290,250 200,300 110,250 110,150" 
        fill="#328CC1" 
      />
      <polygon 
        id="hexagon-inner" 
        class="editable editable-fill accent-color-element" 
        points="200,140 250,170 250,230 200,260 150,230 150,170" 
        fill="#D9B310" 
      />
    </g>
  </svg>`,

  spiral: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="spiral-main-group" class="transform-group">
      <path 
        id="spiral-outer" 
        class="editable editable-stroke primary-color-element" 
        d="M200,200 C200,180 220,160 240,160 C270,160 290,190 290,220 C290,260 250,290 210,290 C160,290 120,250 120,200 C120,140 170,100 230,100 C300,100 350,150 350,220 C350,300 280,350 200,350 C110,350 50,290 50,200 C50,100 130,50 200,50"
        fill="none" stroke="#0B3C5D" stroke-width="8" 
      />
      <circle 
        id="spiral-center" 
        class="editable editable-fill accent-color-element" 
        cx="200" cy="200" r="20" 
        fill="#D9B310" 
      />
    </g>
  </svg>`,

  grid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="grid-main-group" class="transform-group">
      <rect 
        id="grid-background" 
        class="editable editable-fill" 
        x="50" y="50" width="300" height="300" 
        fill="#ffffff" 
      />
      
      <!-- Horizontal lines -->
      <line id="grid-h-1" class="editable editable-stroke primary-color-element" x1="50" y1="100" x2="350" y2="100" stroke="#0B3C5D" stroke-width="3" />
      <line id="grid-h-2" class="editable editable-stroke primary-color-element" x1="50" y1="150" x2="350" y2="150" stroke="#0B3C5D" stroke-width="3" />
      <line id="grid-h-3" class="editable editable-stroke primary-color-element" x1="50" y1="200" x2="350" y2="200" stroke="#0B3C5D" stroke-width="3" />
      <line id="grid-h-4" class="editable editable-stroke primary-color-element" x1="50" y1="250" x2="350" y2="250" stroke="#0B3C5D" stroke-width="3" />
      <line id="grid-h-5" class="editable editable-stroke primary-color-element" x1="50" y1="300" x2="350" y2="300" stroke="#0B3C5D" stroke-width="3" />
      
      <!-- Vertical lines -->
      <line id="grid-v-1" class="editable editable-stroke secondary-color-element" x1="100" y1="50" x2="100" y2="350" stroke="#328CC1" stroke-width="3" />
      <line id="grid-v-2" class="editable editable-stroke secondary-color-element" x1="150" y1="50" x2="150" y2="350" stroke="#328CC1" stroke-width="3" />
      <line id="grid-v-3" class="editable editable-stroke secondary-color-element" x1="200" y1="50" x2="200" y2="350" stroke="#328CC1" stroke-width="3" />
      <line id="grid-v-4" class="editable editable-stroke secondary-color-element" x1="250" y1="50" x2="250" y2="350" stroke="#328CC1" stroke-width="3" />
      <line id="grid-v-5" class="editable editable-stroke secondary-color-element" x1="300" y1="50" x2="300" y2="350" stroke="#328CC1" stroke-width="3" />
      
      <!-- Highlight points at intersections -->
      <circle id="grid-point-1" class="editable editable-fill accent-color-element" cx="200" cy="200" r="8" fill="#D9B310" />
      <circle id="grid-point-2" class="editable editable-fill accent-color-element" cx="150" cy="150" r="5" fill="#D9B310" />
      <circle id="grid-point-3" class="editable editable-fill accent-color-element" cx="250" cy="150" r="5" fill="#D9B310" />
      <circle id="grid-point-4" class="editable editable-fill accent-color-element" cx="150" cy="250" r="5" fill="#D9B310" />
      <circle id="grid-point-5" class="editable editable-fill accent-color-element" cx="250" cy="250" r="5" fill="#D9B310" />
    </g>
  </svg>`,

  lines: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="lines-main-group" class="transform-group">
      <line 
        id="line-horizontal" 
        class="editable editable-stroke primary-color-element" 
        x1="40" y1="200" x2="360" y2="200" 
        stroke="#0B3C5D" stroke-width="15" 
      />
      <line 
        id="line-vertical" 
        class="editable editable-stroke secondary-color-element" 
        x1="200" y1="40" x2="200" y2="360" 
        stroke="#328CC1" stroke-width="15" 
      />
      <circle 
        id="lines-intersection" 
        class="editable editable-fill accent-color-element" 
        cx="200" cy="200" r="25" 
        fill="#D9B310" 
      />
      <line 
        id="line-diagonal-1" 
        class="editable editable-stroke primary-color-element" 
        x1="80" y1="80" x2="320" y2="320" 
        stroke="#0B3C5D" stroke-width="8" 
      />
      <line 
        id="line-diagonal-2" 
        class="editable editable-stroke secondary-color-element" 
        x1="320" y1="80" x2="80" y2="320" 
        stroke="#328CC1" stroke-width="8" 
      />
    </g>
  </svg>`,

  curve: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="curve-main-group" class="transform-group">
      <path 
        id="curve-wave-1" 
        class="editable editable-stroke primary-color-element" 
        d="M40,200 C80,140 120,260 160,140 C200,20 240,120 280,240 C320,360 360,200 360,200" 
        fill="none" stroke="#0B3C5D" stroke-width="12" 
      />
      <path 
        id="curve-wave-2" 
        class="editable editable-stroke secondary-color-element" 
        d="M40,250 C80,190 120,310 160,190 C200,70 240,170 280,290 C320,410 360,250 360,250" 
        fill="none" stroke="#328CC1" stroke-width="8" 
      />
      <path 
        id="curve-wave-3" 
        class="editable editable-stroke accent-color-element" 
        d="M40,150 C80,90 120,210 160,90 C200,40 240,120 280,190 C320,260 360,150 360,150" 
        fill="none" stroke="#D9B310" stroke-width="5" 
      />
    </g>
  </svg>`,

  fractal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="fractal-main-group" class="transform-group">
      <!-- Main triangle -->
      <polygon 
        id="fractal-main" 
        class="editable editable-fill primary-color-element" 
        points="200,40 40,320 360,320" 
        fill="#0B3C5D" 
      />
      <!-- Level 1 triangles -->
      <polygon 
        id="fractal-l1-1" 
        class="editable editable-fill secondary-color-element" 
        points="200,40 120,180 280,180" 
        fill="#328CC1" 
      />
      <polygon 
        id="fractal-l1-2" 
        class="editable editable-fill secondary-color-element" 
        points="120,180 40,320 200,320" 
        fill="#328CC1" 
      />
      <polygon 
        id="fractal-l1-3" 
        class="editable editable-fill secondary-color-element" 
        points="280,180 200,320 360,320" 
        fill="#328CC1" 
      />
      <!-- Level 2 triangles (accent color) -->
      <polygon 
        id="fractal-l2-1" 
        class="editable editable-fill accent-color-element" 
        points="200,110 160,180 240,180" 
        fill="#D9B310" 
      />
      <polygon 
        id="fractal-l2-2" 
        class="editable editable-fill accent-color-element" 
        points="120,250 80,320 160,320" 
        fill="#D9B310" 
      />
      <polygon 
        id="fractal-l2-3" 
        class="editable editable-fill accent-color-element" 
        points="280,250 240,320 320,320" 
        fill="#D9B310" 
      />
    </g>
  </svg>`,

  biomorf: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <g id="biomorf-main-group" class="transform-group">
      <!-- Main organic shape -->
      <path 
        id="biomorf-main" 
        class="editable editable-fill primary-color-element" 
        d="M200,50 C260,50 320,90 350,150 C380,210 380,280 340,330 C300,380 240,380 200,370 C160,380 100,380 60,330 C20,280 20,210 50,150 C80,90 140,50 200,50 Z" 
        fill="#0B3C5D" 
      />
      <!-- Inner organic shape -->
      <path 
        id="biomorf-inner" 
        class="editable editable-fill secondary-color-element" 
        d="M200,100 C240,100 280,130 300,170 C320,210 320,260 290,290 C260,320 220,320 200,315 C180,320 140,320 110,290 C80,260 80,210 100,170 C120,130 160,100 200,100 Z" 
        fill="#328CC1" 
      />
      <!-- Center accent -->
      <path 
        id="biomorf-accent" 
        class="editable editable-fill accent-color-element" 
        d="M200,150 C220,150 240,160 250,180 C260,200 260,220 250,240 C240,260 220,260 200,255 C180,260 160,260 150,240 C140,220 140,200 150,180 C160,160 180,150 200,150 Z" 
        fill="#D9B310" 
      />
      <!-- Organic circles -->
      <circle 
        id="biomorf-circle-1" 
        class="editable editable-fill accent-color-element" 
        cx="150" cy="150" r="15" 
        fill="#D9B310" 
      />
      <circle 
        id="biomorf-circle-2" 
        class="editable editable-fill accent-color-element" 
        cx="250" cy="150" r="15" 
        fill="#D9B310" 
      />
    </g>
  </svg>`
};

export const availableSVGTemplates = [
  { id: "circle", name: "Circle (Unity)" },
  { id: "square", name: "Square (Stability)" },
  { id: "triangle", name: "Triangle (Direction)" },
  { id: "hexagon", name: "Hexagon (Efficiency)" },
  { id: "spiral", name: "Spiral (Growth)" },
  { id: "grid", name: "Grid (Organization)" },
  { id: "lines", name: "Lines (Connectivity)" },
  { id: "curve", name: "Curve (Adaptation)" },
  { id: "fractal", name: "Fractal (Scalability)" },
  { id: "biomorf", name: "Biomorfic (Natural-Tech Balance)" }
];