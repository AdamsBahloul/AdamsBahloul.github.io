/**
 * =============================================================================
 * CENTRAL PORTFOLIO DATA FILE - ADAM BAHLOUL
 * =============================================================================
 * 
 * Edit your personal details, project details, skills, and links in this single file.
 * Unknown fields and links are explicitly marked with TODO placeholders.
 * 
 * Supports both ES Modules (browser import) and CommonJS (Node.js build/tests).
 */

const portfolioData = {
  // ---------------------------------------------------------------------------
  // Personal & Brand Identity
  // ---------------------------------------------------------------------------
  personal: {
    name: "Adam Bahloul",
    initials: "AB",
    headline: "Embedded Systems Student & Creative Developer",
    supportingLine: "I build practical software, explore intelligent systems and create thoughtful digital experiences.",
    availability: "Available for Internships & Thesis Internships",
    location: "CET / UTC+1",
    timezone: "CET",
    aboutBio: "I’m a computer science student focused on embedded systems and intelligent technologies. My interests span low-level software, robotics, AI and connected devices. Alongside engineering, I work in visual design and digital communication, bringing a product-minded approach to the way I build and present ideas.",
    aboutSecondary: "My technical foundation combines systems-level C/C++, Linux kernel environments, and robotics kinematics with modern software workflows. Complementing my engineering rigor, my background in visual identity and UI/UX design enables me to bridge complex technical architectures with intuitive, human-centered interfaces.",
    portraitImage: "./assets/images/about-adam.svg",
  },

  // ---------------------------------------------------------------------------
  // Contact & Social Links (Placeholders marked with TODO)
  // ---------------------------------------------------------------------------
  contact: {
    // TODO: Replace with your actual email address
    email: "TODO: your.email@example.com",
    
    // TODO: Replace with your actual LinkedIn profile URL
    linkedin: "TODO: https://linkedin.com/in/adambahloul",
    
    // TODO: Replace with your actual GitHub profile URL
    github: "TODO: https://github.com/adambahloul",
    
    // TODO: Add your CV / Resume PDF file to the assets/ folder and update path here
    cvPath: "TODO: ./assets/cv-adam-bahloul.pdf",
    
    // TODO: Replace with your Behance or Portfolio URL if applicable
    behance: "TODO: https://behance.net/adambahloul",
  },

  // ---------------------------------------------------------------------------
  // Navigation Menu Items
  // ---------------------------------------------------------------------------
  navigation: [
    { label: "Home", href: "#hero" },
    { label: "Work", href: "#work" },
    { label: "Playground", href: "#playground" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],

  // ---------------------------------------------------------------------------
  // Hero Tagline & Features
  // ---------------------------------------------------------------------------
  hero: {
    tags: [
      "[ Embedded Systems ]",
      "[ Robotics & AI ]",
      "[ Low-Level C/C++ ]",
      "[ Creative Engineering ]",
    ],
    headings: {
      line1: "Systems",
      line2: "& Intelligent",
      line3: "Technologies",
    },
    primaryCta: {
      label: "Explore Work",
      href: "#work",
    },
    secondaryCta: {
      label: "Download CV",
      href: "TODO: ./assets/cv-adam-bahloul.pdf",
    },
  },

  // ---------------------------------------------------------------------------
  // Selected Featured Projects (3–6 Strong Projects)
  // ---------------------------------------------------------------------------
  projects: [
    {
      id: "lumaflux",
      title: "LumaFlux",
      category: "Software & Simulation / Physics Education",
      role: "Simulation Engine & 3D Visualization",
      summary: "Interactive electromagnetic-field simulator designed to make field theory intuitive through real-time mathematical visualization.",
      problem: "Electromagnetic field dynamics (Coulomb potentials, gradient, divergence, Lorentz forces) are notoriously difficult to grasp from static 2D textbook diagrams.",
      contribution: "Designed and implemented the core 3D simulation engine, vector calculus routines, and dynamic field line rendering pipeline.",
      implementation: "Real-time numerical integration for electrostatic and magnetostatic charge configurations, interactive vector field line tracing, equipotential contour generation, and optimized WebGL/Three.js shader rendering.",
      technologies: ["TypeScript", "Three.js", "WebGL", "GLSL Shaders", "Physics Modeling", "Vector Calculus"],
      images: [
        "./assets/images/projects/lumaflux-1.svg",
        "./assets/images/projects/lumaflux-2.svg",
        "./assets/images/projects/lumaflux-3.svg",
      ],
      bgImage: "./assets/images/projects/lumaflux-1.svg",
      // TODO: Replace with live demo or repository URL
      link: "TODO: https://github.com/adambahloul/lumaflux",
      status: "Active Project",
    },
    {
      id: "tars-robotics",
      title: "Miniature TARS Robotics Platform",
      category: "Robotics & Dynamic Simulation",
      role: "Kinematic Modeling & Simulation Pipeline",
      summary: "Kinematic modeling, locomotion simulation, and control pipeline for an unconventional multi-pedal articulated robot in Gazebo.",
      problem: "Recreating the multi-joint rotational walking gait of a monolithic multi-link robot requires complex kinematic solving and dynamic stability management.",
      contribution: "Constructed the full URDF robotic model with joint limits, configured the physics simulation world in Gazebo, and developed Python control nodes for gait sequencing.",
      implementation: "Gazebo dynamic simulation, ROS / ROS2 control nodes, URDF / Xacro multi-link kinematics modeling, joint trajectory controllers, real-time joint state telemetry.",
      technologies: ["ROS / ROS 2", "Gazebo", "Python", "C++", "URDF / Xacro", "Linux", "Robotics Kinematics"],
      images: [
        "./assets/images/projects/tars-1.svg",
        "./assets/images/projects/tars-2.svg",
        "./assets/images/projects/tars-3.svg",
      ],
      bgImage: "./assets/images/projects/tars-1.svg",
      // TODO: Replace with live demo or repository URL
      link: "TODO: https://github.com/adambahloul/tars-robotics",
      status: "Simulation & Gait Research",
    },
    {
      id: "gesture-drone",
      title: "Gesture-Controlled Drone Prototype",
      category: "Embedded Systems & Computer Vision",
      role: "CV Pipeline & Flight Telemetry Integration",
      summary: "Touchless human-machine interaction framework mapping real-time hand gestures to UAV flight telemetry.",
      problem: "Traditional RC controllers require dedicated manual dexterity; exploring intuitive, hands-free edge computer vision for short-range drone control.",
      contribution: "Built low-latency hand pose estimation pipeline on host, mapped geometric gesture vectors into roll/pitch/yaw/throttle commands, and interfaced with flight controller.",
      implementation: "OpenCV and MediaPipe hand landmark detection, velocity vector filtering to mitigate jitter, serial/UDP telemetry link sending MAVLink / custom packets with hardware fail-safes and timeout cutoffs.",
      technologies: ["Python", "OpenCV", "MediaPipe", "Embedded Linux", "MAVLink", "Serial / UDP Telemetry", "Fail-safe Architecture"],
      images: [
        "./assets/images/projects/drone-1.svg",
        "./assets/images/projects/drone-2.svg",
        "./assets/images/projects/drone-3.svg",
      ],
      bgImage: "./assets/images/projects/drone-1.svg",
      // TODO: Replace with live demo or repository URL
      link: "TODO: https://github.com/adambahloul/gesture-drone",
      status: "Prototype (Tested in Controlled Environment)",
    },
    {
      id: "homemesh-gateway",
      title: "HomeMesh-Gateway",
      category: "Embedded Systems & IoT",
      role: "Embedded System Architecture & Daemon Development",
      summary: "Linux-based local-first smart-home gateway providing secure device discovery, sensor telemetry routing, and privacy.",
      problem: "Commercial IoT hubs enforce proprietary cloud dependencies, high latency, and privacy compromises.",
      contribution: "Designed system architecture, implemented Linux background daemon for MQTT message dispatching, and built local configuration dashboard.",
      implementation: "Custom C/Python daemon running on embedded Linux SBC, Mosquitto MQTT broker integration, local SQLite logging for sensor time-series data, REST and WebSocket endpoints for local web UI.",
      technologies: ["Embedded Linux", "C / C++", "Python", "MQTT (Mosquitto)", "SQLite", "Shell Scripting", "IoT Protocols"],
      images: [
        "./assets/images/projects/homemesh-1.svg",
        "./assets/images/projects/homemesh-2.svg",
        "./assets/images/projects/homemesh-3.svg",
      ],
      bgImage: "./assets/images/projects/homemesh-1.svg",
      // TODO: Replace with live demo or repository URL
      link: "TODO: https://github.com/adambahloul/homemesh-gateway",
      status: "Working Prototype",
    },
    {
      id: "isi-identity",
      title: "ISI Visual Identity & Communications",
      category: "UI/UX & Visual Design",
      role: "Lead Visual Designer & Brand Strategist",
      summary: "Comprehensive visual branding, graphic design system, event communications, and digital media kit for a university student body.",
      problem: "Fragmented event promotions and lack of visual cohesion weakened engagement across academic and technical student initiatives.",
      contribution: "Created complete brand book, logo marks, social media campaign templates, event posters, and typography system.",
      implementation: "Modular component design system in Figma, print-ready vector typography assets in Adobe Illustrator, structured social media asset pipeline with rigorous aesthetic standards.",
      technologies: ["Figma", "Adobe Illustrator", "Brand Architecture", "Typography Systems", "UI/UX Design", "Digital Media"],
      images: [
        "./assets/images/projects/isi-1.svg",
        "./assets/images/projects/isi-2.svg",
        "./assets/images/projects/isi-3.svg",
      ],
      bgImage: "./assets/images/projects/isi-1.svg",
      // TODO: Replace with Behance or design portfolio URL
      link: "TODO: https://behance.net/adambahloul",
      status: "Published & Active",
    },
    {
      id: "bi-pipeline",
      title: "Business Intelligence Pipeline",
      category: "Software & Data Engineering",
      role: "Data Warehouse Schema & ETL Developer",
      summary: "Automated ETL pipeline and relational data warehouse powering executive performance analytics and dashboards.",
      problem: "Siloed operational logs and disparate spreadsheets led to manual reporting friction and delayed decision making.",
      contribution: "Designed dimensional star-schema warehouse, authored Python extraction & cleansing scripts, and created interactive multi-metric Power BI dashboards.",
      implementation: "Python ETL scripts with automated validation and error logging, MySQL relational data warehouse with indexed summary views, automated scheduled refresh, Power BI analytical dashboards.",
      technologies: ["Python", "MySQL", "ETL Architecture", "Power BI", "SQL", "Data Modeling", "Automation"],
      images: [
        "./assets/images/projects/bi-1.svg",
        "./assets/images/projects/bi-2.svg",
        "./assets/images/projects/bi-3.svg",
      ],
      bgImage: "./assets/images/projects/bi-1.svg",
      // TODO: Replace with repository or project report URL
      link: "TODO: https://github.com/adambahloul/bi-pipeline",
      status: "Completed Project",
    },
  ],

  // ---------------------------------------------------------------------------
  // Playground / Engineering Experiments (Compact Interactive Works)
  // ---------------------------------------------------------------------------
  playground: [
    {
      id: "exp-vector",
      title: "Vector Field Visualizer",
      type: "Interactive Simulation",
      description: "Real-time vector calculation and 3D field line projection for dynamic electric dipole systems.",
      details: "Calculates electric potential gradients across a 3D coordinate lattice using client-side WebGL computation. Users can dynamically place positive and negative point charges to observe field line reconfigurations.",
      tags: ["WebGL", "Three.js", "Vector Calculus"],
      thumbnail: "./assets/images/playground/exp-vector.svg",
      link: "TODO: https://github.com/adambahloul/vector-field-experiment",
    },
    {
      id: "exp-kinematics",
      title: "Robot Kinematics Solver",
      type: "Robotics Simulation",
      description: "Forward and inverse kinematic chain solver for multi-degree-of-freedom articulated robotic limbs.",
      details: "Interactive 3-DOF planar robot arm kinematics simulator demonstrating analytical inverse kinematics and Jacobians for smooth trajectory tracking.",
      tags: ["Python", "Kinematics", "Gazebo"],
      thumbnail: "./assets/images/playground/exp-kinematics.svg",
      link: "TODO: https://github.com/adambahloul/robot-kinematics",
    },
    {
      id: "exp-cv",
      title: "Hand Landmark Tracking",
      type: "Edge Computer Vision",
      description: "21-point 3D hand skeleton landmark detection running real-time inference on edge video feeds.",
      details: "Edge vision pipeline extracting finger angles and gesture classifiers with sub-30ms latency for low-overhead embedded platforms.",
      tags: ["OpenCV", "MediaPipe", "Edge Vision"],
      thumbnail: "./assets/images/playground/exp-cv.svg",
      link: "TODO: https://github.com/adambahloul/hand-tracking-pipeline",
    },
    {
      id: "exp-hud",
      title: "Avionics Telemetry HUD",
      type: "Telemetry & Control",
      description: "Heads-up display visualizing artificial horizon, altitude, throttle, and flight mode in real-time.",
      details: "Lightweight canvas HUD renderer consuming simulated MAVLink telemetry packets with pitch/roll attitude indicators and airspeed gauges.",
      tags: ["MAVLink", "Canvas", "Telemetry"],
      thumbnail: "./assets/images/playground/exp-hud.svg",
      link: "TODO: https://github.com/adambahloul/telemetry-hud",
    },
    {
      id: "exp-dsp",
      title: "Waveform & DSP Analyzer",
      type: "Signal Processing",
      description: "Interactive Fourier decomposition and oscilloscope waveform generator for analog sensor signals.",
      details: "Digital signal processing tool visualizing sinusoidal harmonics, Fast Fourier Transform (FFT) frequency spectrums, and low-pass filter responses.",
      tags: ["DSP", "FFT", "Signal Processing"],
      thumbnail: "./assets/images/playground/exp-dsp.svg",
      link: "TODO: https://github.com/adambahloul/dsp-analyzer",
    },
    {
      id: "exp-mesh",
      title: "Mesh Network Graph",
      type: "Distributed Systems",
      description: "Dynamic peer discovery and packet-routing graph visualizer for multi-node local networks.",
      details: "Simulates ad-hoc decentralized message routing, node hop discovery, and packet-loss resilience in constrained IoT environments.",
      tags: ["MQTT", "Mesh Routing", "Networks"],
      thumbnail: "./assets/images/playground/exp-mesh.svg",
      link: "TODO: https://github.com/adambahloul/mesh-graph",
    },
  ],

  // ---------------------------------------------------------------------------
  // Technical Skills (Categorized & Verified)
  // ---------------------------------------------------------------------------
  skills: {
    // Ticker highlight items (for the animated marquee)
    ticker: [
      "Embedded Systems & C/C++",
      "Robotics & Simulation (ROS / Gazebo)",
      "Linux Kernel & Device Drivers",
      "Computer Vision & Edge AI",
      "Microcontrollers (STM32 / ESP32)",
      "Hardware Protocols (SPI, I2C, UART)",
      "UI/UX & Design Systems (Figma)",
      "Python ETL & Data Pipelines",
      "Real-time Telemetry & MQTT",
      "WebGL & Creative Engineering",
    ],
    
    // Detailed categorized skill matrix
    categories: [
      {
        name: "Embedded & Systems",
        skills: [
          "C / C++ (Low-Level Firmware)",
          "Embedded Linux & Shell Scripting",
          "Microcontrollers (STM32, ESP32, Arduino)",
          "Hardware Protocols (SPI, I2C, UART, CAN)",
          "Sensors, Actuators & ADC/DAC Interfaces",
          "RTOS Concepts & Hardware Debugging",
        ],
      },
      {
        name: "Programming & Software",
        skills: [
          "Python (Systems, Automation, ETL)",
          "C / C++ (Data Structures, Algorithms)",
          "JavaScript / TypeScript (Modern Web)",
          "SQL & Relational Databases (MySQL, SQLite)",
          "Linux Environment & Git Workflows",
          "REST APIs, Sockets & MQTT Protocol",
        ],
      },
      {
        name: "Robotics & AI",
        skills: [
          "ROS / ROS 2 (Nodes, Topics, Services)",
          "Gazebo Physics & Sensor Simulation",
          "URDF & Robot Kinematics Modeling",
          "Computer Vision (OpenCV, Image Filtering)",
          "MediaPipe Hand Landmark Estimation",
          "3D Vector Calculus & Physics Modeling",
        ],
      },
      {
        name: "Design & Creative Engineering",
        skills: [
          "UI/UX Design & Wireframing (Figma)",
          "Visual Identity & Brand Architecture",
          "Adobe Illustrator & Graphic Design",
          "Design Systems & Component Standards",
          "HTML5 / CSS3 / Responsive Layouts",
          "Three.js & Interactive WebGL",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Education & Experience Timeline (Strictly Factual)
  // ---------------------------------------------------------------------------
  timeline: [
    {
      period: "Current",
      title: "Computer Science & Embedded Systems Student",
      organization: "Higher Education Degree Program",
      description: "Pursuing coursework and applied projects in computer architecture, low-level programming, embedded systems, robotics, and intelligent algorithms.",
      type: "education",
    },
    {
      period: "Recent",
      title: "Visual Identity & Digital Communications Lead",
      organization: "ISI Student Organization",
      description: "Led visual identity development, design system guidelines, event branding campaigns, and digital communication materials.",
      type: "experience",
    },
    {
      period: "Recent",
      title: "Applied Engineering & Systems Projects",
      organization: "Autonomous & Collaborative Research",
      description: "Engineered functional prototypes including LumaFlux 3D physics simulator, TARS-inspired robot kinematics in Gazebo, and gesture-controlled drone telemetry framework.",
      type: "experience",
    },
    {
      period: "Upcoming",
      title: "Seeking Internship / Thesis Internship",
      organization: "International or Local Engineering Teams",
      description: "Targeting roles in Embedded Software, Robotics, Systems Engineering, or Intelligent Physical Computing.",
      type: "goal",
    },
  ],
};

// Universal export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { portfolioData };
}
if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}

