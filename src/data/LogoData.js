// src/data/LogoData.js

const LogoData = [
  {
    id: 1,
    name: "Precision Triangle",
    description: "A minimalist geometric design based on triangular forms that represent precision, stability and upward growth.",
    geometricLogic: "Multiple triangular forms arranged in perfect alignment. The design uses equilateral triangles with 60° angles to create a sense of perfect balance and mathematical precision.",
    symbolism: "Represents stability, structural integrity, and upward progress - core values in engineering. The triangular shapes evoke architectural structures and engineering frameworks.",
    colors: [
      { name: "Deep Blue", hex: "#0B3C5D" },
      { name: "Steel Gray", hex: "#4F6272" },
      { name: "Accent Teal", hex: "#328CC1" }
    ],
    svgPath: `
      <g>
        <polygon points="50,10 90,80 10,80" fill="none" stroke="currentColor" stroke-width="2" />
        <polygon points="50,25 80,75 20,75" fill="none" stroke="currentColor" stroke-width="2" />
        <polygon points="50,40 70,70 30,70" fill="currentColor" />
      </g>
    `
  },
  {
    id: 2,
    name: "Infinite Circuit",
    description: "A sophisticated geometric pattern based on interconnected circular elements that suggest continuity and seamless integration.",
    geometricLogic: "Concentric circles with precise gaps and connecting lines. The design uses the golden ratio (1:1.618) for the relationship between inner and outer circles.",
    symbolism: "Represents continuous improvement, integration of systems, and holistic engineering approaches. The circular nature symbolizes complete solutions and cyclical processes.",
    colors: [
      { name: "Charcoal", hex: "#2D3142" },
      { name: "Silver", hex: "#BFC0C0" },
      { name: "Electric Blue", hex: "#4062BB" }
    ],
    svgPath: `
      <g>
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="2" />
        <line x1="50" y1="10" x2="50" y2="30" stroke="currentColor" stroke-width="2" />
        <line x1="50" y1="70" x2="50" y2="90" stroke="currentColor" stroke-width="2" />
        <line x1="10" y1="50" x2="30" y2="50" stroke="currentColor" stroke-width="2" />
        <line x1="70" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="2" />
      </g>
    `
  },
  {
    id: 3,
    name: "Cubic Dimension",
    description: "An isometric 3D design that creates the illusion of depth and dimension using simple geometric forms.",
    geometricLogic: "Isometric projection of cubic forms using 30° angles to create a three-dimensional appearance on a two-dimensional plane.",
    symbolism: "Represents spatial thinking, structural engineering, and multi-dimensional problem solving. The 3D perspective suggests depth of expertise and capability to handle complex projects.",
    colors: [
      { name: "Navy Blue", hex: "#1E3D59" },
      { name: "Light Gray", hex: "#E8E8E8" },
      { name: "Soft Teal", hex: "#67B7D1" }
    ],
    svgPath: `
      <g>
        <polygon points="20,40 50,25 80,40 50,55" fill="none" stroke="currentColor" stroke-width="2" />
        <polygon points="20,40 20,70 50,85 50,55" fill="none" stroke="currentColor" stroke-width="2" />
        <polygon points="50,55 50,85 80,70 80,40" fill="none" stroke="currentColor" stroke-width="2" />
        <polygon points="35,47.5 65,47.5 65,62.5 35,62.5" fill="currentColor" />
      </g>
    `
  },
  {
    id: 4,
    name: "Hexagon Matrix",
    description: "A nature-inspired design based on hexagonal geometry found in efficient natural structures like honeycomb.",
    geometricLogic: "Multiple interconnected hexagons arranged in a grid pattern. Each hexagon has perfect 120° internal angles, creating an efficient tessellation.",
    symbolism: "Represents efficiency, optimal resource utilization, and natural engineering principles. The hexagonal structure evokes both technological precision and natural optimization.",
    colors: [
      { name: "Forest Green", hex: "#2A9D8F" },
      { name: "Light Sage", hex: "#E9F5DB" }, 
      { name: "Deep Teal", hex: "#264653" }
    ],
    svgPath: `
      <g>
        <polygon points="50,20 68,30 68,50 50,60 32,50 32,30" fill="none" stroke="currentColor" stroke-width="2" />
        <polygon points="32,50 50,60 50,80 32,70" fill="none" stroke="currentColor" stroke-width="2" />
        <polygon points="68,50 68,70 50,80 50,60" fill="none" stroke="currentColor" stroke-width="2" />
        <polygon points="50,40 59,45 59,55 50,60 41,55 41,45" fill="currentColor" />
      </g>
    `
  },
  {
    id: 5,
    name: "Linear Flow",
    description: "A monoline design that uses single-weight lines to create a clean, sophisticated geometric pattern suggesting flow and movement.",
    geometricLogic: "Parallel and intersecting lines of equal thickness (monoline style) with precise 45° and 90° angles, creating a sense of directed movement.",
    symbolism: "Represents process flow, efficiency, and streamlined systems. The directional lines suggest progress, movement, and engineered pathways.",
    colors: [
      { name: "Deep Indigo", hex: "#3A506B" },
      { name: "Gray Blue", hex: "#5BC0BE" },
      { name: "Platinum", hex: "#E5E5E5" }
    ],
    svgPath: `
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20,20 L80,20 L80,40 L60,40 L60,60 L80,60 L80,80 L20,80 L20,60 L40,60 L40,40 L20,40 Z" />
        <line x1="40" y1="40" x2="60" y2="60" />
        <line x1="40" y1="60" x2="60" y2="40" />
      </g>
    `
  },
  {
    id: 6,
    name: "Fibonacci Spiral",
    description: "An elegant geometric design based on the Fibonacci sequence and golden spiral, connecting mathematics with natural growth patterns.",
    geometricLogic: "Golden spiral constructed using quarter-circle arcs with radii following the Fibonacci sequence (1, 1, 2, 3, 5, 8, etc.).",
    symbolism: "Represents natural optimization, mathematical harmony, and sustainable growth. The spiral form connects engineering precision with natural design principles.",
    colors: [
      { name: "Forest Green", hex: "#2F4F4F" },
      { name: "Golden Yellow", hex: "#E9C46A" },
      { name: "Terracotta", hex: "#E76F51" }
    ],
    svgPath: `
      <g fill="none" stroke="currentColor" stroke-width="2">
        <rect x="40" y="40" width="10" height="10" />
        <rect x="30" y="40" width="10" height="10" />
        <rect x="30" y="30" width="20" height="10" />
        <rect x="30" y="50" width="30" height="20" />
        <path d="M50,50 Q30,50 30,30 Q30,60 60,60 Q60,30 40,30" />
      </g>
    `
  },
  {
    id: 7,
    name: "Negative Space Arrow",
    description: "A clever geometric design that utilizes negative space to create directional elements within a simple framework.",
    geometricLogic: "Overlapping geometric shapes create negative space that forms an arrow or directional indicator. The design uses precise mathematical proportions to ensure the negative space is clearly visible.",
    symbolism: "Represents forward thinking, innovation, and finding elegant solutions within constraints. The directional element suggests progress and future-oriented engineering.",
    colors: [
      { name: "Deep Purple", hex: "#4A4E69" },
      { name: "Light Gray", hex: "#F2F2F2" },
      { name: "Coral", hex: "#F96E46" }
    ],
    svgPath: `
      <g>
        <rect x="15" y="25" width="70" height="50" fill="currentColor" />
        <polygon points="35,25 65,50 35,75" fill="white" />
      </g>
    `
  },
  {
    id: 8,
    name: "Grid Wave",
    description: "A dynamic geometric pattern that combines rigid grid structure with flowing wave elements, representing the balance between precision and adaptability.",
    geometricLogic: "Orthogonal grid lines with superimposed sine wave curves. The waves follow mathematical sine functions with precise amplitude and wavelength.",
    symbolism: "Represents the integration of rigid structure with dynamic adaptation - a balance crucial in modern engineering. The wave pattern suggests energy, data flow, and responsive systems.",
    colors: [
      { name: "Dark Slate", hex: "#1B2A41" },
      { name: "Bright Blue", hex: "#0582CA" },
      { name: "Light Gray", hex: "#CCD7EA" }
    ],
    svgPath: `
      <g>
        <line x1="20" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="2" />
        <line x1="40" y1="20" x2="40" y2="80" stroke="currentColor" stroke-width="2" />
        <line x1="60" y1="20" x2="60" y2="80" stroke="currentColor" stroke-width="2" />
        <line x1="80" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="2" />
        <path d="M20,50 C30,40 40,60 50,50 C60,40 70,60 80,50" fill="none" stroke="currentColor" stroke-width="3" />
      </g>
    `
  },
  {
    id: 9,
    name: "Modular Blocks",
    description: "A structured geometric design composed of modular elements that can be perceived as building blocks or components of a larger system.",
    geometricLogic: "Multiple rectangular elements arranged in a deliberate pattern with precise spacing and alignment. The design follows principles of modular design with standardized proportions.",
    symbolism: "Represents modularity, systematic thinking, and scalable solutions. The block structure suggests building components, integrated systems, and architectural thinking.",
    colors: [
      { name: "Dark Blue", hex: "#003459" },
      { name: "Medium Blue", hex: "#007EA7" },
      { name: "Light Blue", hex: "#9ED8DB" }
    ],
    svgPath: `
      <g>
        <rect x="25" y="25" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" />
        <rect x="55" y="25" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" />
        <rect x="25" y="55" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" />
        <rect x="55" y="55" width="20" height="20" fill="currentColor" />
        <line x1="45" y1="35" x2="55" y2="35" stroke="currentColor" stroke-width="2" />
        <line x1="35" y1="45" x2="35" y2="55" stroke="currentColor" stroke-width="2" />
        <line x1="65" y1="45" x2="65" y2="55" stroke="currentColor" stroke-width="2" />
        <line x1="45" y1="65" x2="55" y2="65" stroke="currentColor" stroke-width="2" />
      </g>
    `
  },
  {
    id: 10,
    name: "Sustainable Cycle",
    description: "A circular geometric design that incorporates recycling and continuous flow elements to represent sustainable engineering and circular economy concepts.",
    geometricLogic: "Triple interlocking circles forming a triangular arrangement with directional flow indicators. The design uses precisely calculated overlapping areas and equal spacing.",
    symbolism: "Represents sustainability, circular economy principles, and regenerative engineering. The continuous flow pattern suggests recycling processes and sustainable resource management.",
    colors: [
      { name: "Green", hex: "#2A9D8F" },
      { name: "Leaf Green", hex: "#56C596" },
      { name: "Teal", hex: "#457B9D" }
    ],
    svgPath: `
      <g fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="35" cy="60" r="25" />
        <circle cx="65" cy="60" r="25" />
        <circle cx="50" cy="35" r="25" />
        <path d="M40,60 L45,55 L40,50" />
        <path d="M60,50 L65,55 L70,50" />
        <path d="M50,55 L55,60 L60,55" />
      </g>
    `
  }
];

export default LogoData;