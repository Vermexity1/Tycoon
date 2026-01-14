import { Upgrade, GameState } from './types';

export const INITIAL_UPGRADES: Upgrade[] = [
  // Tier 0: No Rebirths
  {
    id: 'intern',
    name: 'Unpaid Intern',
    baseCost: 15,
    baseIncome: 1,
    count: 0,
    costMultiplier: 1.15,
    description: 'They work for "experience". Generates passive coffee... and cash.',
    icon: '☕',
    requiredRebirths: 0
  },
  {
    id: 'server',
    name: 'Basic Server',
    baseCost: 100,
    baseIncome: 5,
    count: 0,
    costMultiplier: 1.15,
    description: 'A dusty tower PC in the closet mining crypto.',
    icon: '💻',
    requiredRebirths: 0
  },
  {
    id: 'manager',
    name: 'Middle Manager',
    baseCost: 1100,
    baseIncome: 22,
    count: 0,
    costMultiplier: 1.15,
    description: 'Increases productivity by scheduling endless meetings.',
    icon: '👔',
    requiredRebirths: 0
  },
  {
    id: 'ai_bot',
    name: 'ChatBot v1.0',
    baseCost: 12000,
    baseIncome: 150,
    count: 0,
    costMultiplier: 1.15,
    description: 'Automates customer support with generic responses.',
    icon: '🤖',
    requiredRebirths: 0
  },
  {
    id: 'blockchain',
    name: 'Blockchain Node',
    baseCost: 130000,
    baseIncome: 1000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Decentralized profits. Very volatile.',
    icon: '🔗',
    requiredRebirths: 0
  },
  {
    id: 'quantum',
    name: 'Quantum Core',
    baseCost: 1400000,
    baseIncome: 8000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Solves problems before they exist.',
    icon: '⚛️',
    requiredRebirths: 0
  },
  {
    id: 'neural_link',
    name: 'Neural Link Implant',
    baseCost: 8500000,
    baseIncome: 45000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Direct brain-to-market interface for max efficiency.',
    icon: '🧠',
    requiredRebirths: 0
  },
  {
    id: 'androids',
    name: 'Android Workforce',
    baseCost: 65000000,
    baseIncome: 320000,
    count: 0,
    costMultiplier: 1.15,
    description: 'They never sleep, they never complain.',
    icon: '🦾',
    requiredRebirths: 0
  },
  {
    id: 'fusion',
    name: 'Fusion Reactor',
    baseCost: 450000000,
    baseIncome: 2100000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Infinite clean energy to power the servers.',
    icon: '☀️',
    requiredRebirths: 0
  },
  {
    id: 'space_elevator',
    name: 'Space Elevator',
    baseCost: 3200000000,
    baseIncome: 14000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Off-world logistics for the elite.',
    icon: '🚀',
    requiredRebirths: 0
  },
  {
    id: 'dyson',
    name: 'Dyson Sphere',
    baseCost: 25000000000,
    baseIncome: 95000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Harnessing the entire output of a star.',
    icon: '🪐',
    requiredRebirths: 0
  },
  {
    id: 'simulator',
    name: 'Universal Simulator',
    baseCost: 500000000000,
    baseIncome: 800000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'We are living in a simulation. Your simulation.',
    icon: '🌌',
    requiredRebirths: 0
  },
  
  // Tier 1: Advanced (1 Rebirth)
  {
    id: 'genetic_lab',
    name: 'Genetic Mod Lab',
    baseCost: 2000000000000, // 2T
    baseIncome: 2000000000, // 2B
    count: 0,
    costMultiplier: 1.15,
    description: 'Custom-designed employees for peak performance.',
    icon: '🧬',
    requiredRebirths: 1
  },
  {
    id: 'cloud_city',
    name: 'Cloud City',
    baseCost: 15000000000000, // 15T
    baseIncome: 10000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Floating corporate HQs in the stratosphere.',
    icon: '☁️',
    requiredRebirths: 1
  },
  {
    id: 'weather_control',
    name: 'Weather Control Array',
    baseCost: 80000000000000, // 80T
    baseIncome: 45000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Ensuring sunny days for shareholders, storms for rivals.',
    icon: '⛈️',
    requiredRebirths: 1
  },
  {
    id: 'ocean_cities',
    name: 'Oceanic Metropolis',
    baseCost: 300000000000000, // 300T
    baseIncome: 150000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Untapped markets beneath the waves.',
    icon: '🌊',
    requiredRebirths: 1
  },

  // Tier 2: Mega (2-3 Rebirths)
  {
    id: 'moon_base',
    name: 'Moon Base Alpha',
    baseCost: 1000000000000000, // 1Qa
    baseIncome: 400000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Low gravity manufacturing.',
    icon: '🌑',
    requiredRebirths: 2
  },
  {
    id: 'he3_mine',
    name: 'Helium-3 Mine',
    baseCost: 5000000000000000, // 5Qa
    baseIncome: 1500000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'The ultimate fuel source for the next generation.',
    icon: '⛏️',
    requiredRebirths: 2
  },
  {
    id: 'orbital_ring',
    name: 'Orbital Ring',
    baseCost: 25000000000000000, // 25Qa
    baseIncome: 6000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'A continuous city encircling the Earth.',
    icon: '💍',
    requiredRebirths: 2
  },
  {
    id: 'mars_terraform',
    name: 'Mars Terraforming',
    baseCost: 100000000000000000, // 100Qa
    baseIncome: 20000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Turning the Red Planet green... like money.',
    icon: '🌱',
    requiredRebirths: 3
  },
  {
    id: 'asteroid_hub',
    name: 'Asteroid Belt Hub',
    baseCost: 600000000000000000, // 600Qa
    baseIncome: 100000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Mining precious metals in zero-G.',
    icon: '☄️',
    requiredRebirths: 3
  },
  {
    id: 'jupiter_scoop',
    name: 'Jupiter Gas Scoop',
    baseCost: 3000000000000000000, // 3Qi
    baseIncome: 450000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Harvesting hydrogen on a planetary scale.',
    icon: '🎈',
    requiredRebirths: 3
  },

  // Tier 3: Giga (4-6 Rebirths)
  {
    id: 'saturn_hotel',
    name: 'Saturn Ring Hotel',
    baseCost: 15000000000000000000, // 15Qi
    baseIncome: 2000000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'The most expensive view in the solar system.',
    icon: '🏨',
    requiredRebirths: 4
  },
  {
    id: 'titan_plant',
    name: 'Titan Methanery',
    baseCost: 80000000000000000000, // 80Qi
    baseIncome: 10000000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Liquid methane oceans are profitable.',
    icon: '🏭',
    requiredRebirths: 4
  },
  {
    id: 'pluto_outpost',
    name: 'Pluto Outpost',
    baseCost: 500000000000000000000, // 500Qi
    baseIncome: 50000000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Far from the sun, but close to the profit.',
    icon: '❄️',
    requiredRebirths: 5
  },
  {
    id: 'kuiper_scanner',
    name: 'Kuiper Belt Scanner',
    baseCost: 2000000000000000000000, // 2Sx
    baseIncome: 200000000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Finding ancient relics in deep space.',
    icon: '📡',
    requiredRebirths: 5
  },
  {
    id: 'oort_harvester',
    name: 'Oort Cloud Harvester',
    baseCost: 15000000000000000000000, // 15Sx
    baseIncome: 1000000000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Catching comets before they fall.',
    icon: '🌨️',
    requiredRebirths: 6
  },
  {
    id: 'proxima_probe',
    name: 'Proxima Probe',
    baseCost: 100000000000000000000000, // 100Sx
    baseIncome: 6000000000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Our first step to another star.',
    icon: '🛸',
    requiredRebirths: 6
  },

  // Tier 4: Tera (7-10 Rebirths)
  {
    id: 'warp_drive',
    name: 'Warp Drive Prototype',
    baseCost: 800000000000000000000000, // 800Sx
    baseIncome: 40000000000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'Bending space for faster delivery times.',
    icon: '🌀',
    requiredRebirths: 7
  },
  {
    id: 'dyson_swarm',
    name: 'Dyson Swarm',
    baseCost: 5000000000000000000000000, // 5Sp
    baseIncome: 250000000000000000000,
    count: 0,
    costMultiplier: 1.15,
    description: 'A network of satellites collecting solar output.',
    icon: '🔆',
    requiredRebirths: 7
  },
  {
    id: 'star_lifter',
    name: 'Star Lifter',
    baseCost: 40000000000000000000000000, // 40Sp
    baseIncome: 1500000000000000000000, // 1.5Sx
    count: 0,
    costMultiplier: 1.15,
    description: 'Mining raw plasma directly from the sun.',
    icon: '🏗️',
    requiredRebirths: 8
  },
  {
    id: 'neutron_forge',
    name: 'Neutron Star Forge',
    baseCost: 300000000000000000000000000, // 300Sp
    baseIncome: 12000000000000000000000, // 12Sx
    count: 0,
    costMultiplier: 1.15,
    description: 'Forging matter in extreme gravity.',
    icon: '🔨',
    requiredRebirths: 8
  },
  {
    id: 'black_hole_gen',
    name: 'Black Hole Generator',
    baseCost: 2000000000000000000000000000, // 2Oc
    baseIncome: 80000000000000000000000, // 80Sx
    count: 0,
    costMultiplier: 1.15,
    description: 'Energy from the event horizon.',
    icon: '🕳️',
    requiredRebirths: 9
  },
  {
    id: 'antimatter_fac',
    name: 'Antimatter Factory',
    baseCost: 15000000000000000000000000000, // 15Oc
    baseIncome: 500000000000000000000000, // 500Sx
    count: 0,
    costMultiplier: 1.15,
    description: 'The most volatile substance in existence.',
    icon: '💥',
    requiredRebirths: 9
  },
  {
    id: 'dark_energy',
    name: 'Dark Energy Siphon',
    baseCost: 100000000000000000000000000000, // 100Oc
    baseIncome: 4000000000000000000000000, // 4Sp
    count: 0,
    costMultiplier: 1.15,
    description: 'Expanding the universe... and your wallet.',
    icon: '🌌',
    requiredRebirths: 10
  },
  {
    id: 'wormhole_gate',
    name: 'Wormhole Gate',
    baseCost: 800000000000000000000000000000, // 800Oc
    baseIncome: 30000000000000000000000000, // 30Sp
    count: 0,
    costMultiplier: 1.15,
    description: 'Instant transportation across the sector.',
    icon: '🚪',
    requiredRebirths: 10
  },

  // Tier 5: Cosmic (11-15 Rebirths)
  {
    id: 'galactic_fed',
    name: 'Galactic Trade Federation',
    baseCost: 5000000000000000000000000000000, // 5No
    baseIncome: 200000000000000000000000000, // 200Sp
    count: 0,
    costMultiplier: 1.15,
    description: 'Taxing entire solar systems.',
    icon: '🏛️',
    requiredRebirths: 11
  },
  {
    id: 'filament_net',
    name: 'Galaxy Filament Net',
    baseCost: 40000000000000000000000000000000, // 40No
    baseIncome: 1500000000000000000000000000, // 1.5Oc
    count: 0,
    costMultiplier: 1.15,
    description: 'Communication lines between galaxies.',
    icon: '🕸️',
    requiredRebirths: 11
  },
  {
    id: 'univ_sim_2',
    name: 'Universe Simulator v2',
    baseCost: 300000000000000000000000000000000, // 300No
    baseIncome: 12000000000000000000000000000, // 12Oc
    count: 0,
    costMultiplier: 1.15,
    description: 'Simulating simulations inside simulations.',
    icon: '💾',
    requiredRebirths: 12
  },
  {
    id: 'multiverse_drill',
    name: 'Multiverse Drill',
    baseCost: 2000000000000000000000000000000000, // 2Dc
    baseIncome: 90000000000000000000000000000, // 90Oc
    count: 0,
    costMultiplier: 1.15,
    description: 'Piercing the veil of reality.',
    icon: '🔩',
    requiredRebirths: 12
  },
  {
    id: 'timeline_editor',
    name: 'Timeline Editor',
    baseCost: 20000000000000000000000000000000000, // 20Dc
    baseIncome: 700000000000000000000000000000, // 700Oc
    count: 0,
    costMultiplier: 1.15,
    description: 'Retconning bad investments.',
    icon: '⏳',
    requiredRebirths: 13
  },
  {
    id: 'reality_anchor',
    name: 'Reality Anchor',
    baseCost: 150000000000000000000000000000000000, // 150Dc
    baseIncome: 5000000000000000000000000000000, // 5No
    count: 0,
    costMultiplier: 1.15,
    description: 'Stabilizing your assets across dimensions.',
    icon: '⚓',
    requiredRebirths: 13
  },
  {
    id: 'dimension_hopper',
    name: 'Dimension Hopper',
    baseCost: 1000000000000000000000000000000000000, // 1Ud
    baseIncome: 40000000000000000000000000000000, // 40No
    count: 0,
    costMultiplier: 1.15,
    description: 'Importing goods from parallel worlds.',
    icon: '🦘',
    requiredRebirths: 14
  },
  {
    id: 'entropy_rev',
    name: 'Entropy Reverser',
    baseCost: 10000000000000000000000000000000000000, // 10Ud
    baseIncome: 350000000000000000000000000000000, // 350No
    count: 0,
    costMultiplier: 1.15,
    description: 'Making old money new again.',
    icon: '🔄',
    requiredRebirths: 14
  },
  {
    id: 'big_bang',
    name: 'Big Bang Igniter',
    baseCost: 80000000000000000000000000000000000000, // 80Ud
    baseIncome: 2500000000000000000000000000000000, // 2.5Dc
    count: 0,
    costMultiplier: 1.15,
    description: 'Starting your own universe from scratch.',
    icon: '🎆',
    requiredRebirths: 15
  },

  // Tier 6: Dimensional (16-25 Rebirths)
  {
    id: 'akashic',
    name: 'Akashic Record Access',
    baseCost: 600000000000000000000000000000000000000, // 600Ud
    baseIncome: 20000000000000000000000000000000000, // 20Dc
    count: 0,
    costMultiplier: 1.15,
    description: 'Knowing every trade that ever happened.',
    icon: '📜',
    requiredRebirths: 16
  },
  {
    id: 'conscious_up',
    name: 'Consciousness Uploader',
    baseCost: 5000000000000000000000000000000000000000, // 5Dd
    baseIncome: 150000000000000000000000000000000000, // 150Dc
    count: 0,
    costMultiplier: 1.15,
    description: 'Leaving the physical body behind for pure profit.',
    icon: '👻',
    requiredRebirths: 17
  },
  {
    id: 'singularity',
    name: 'The Singularity',
    baseCost: 40000000000000000000000000000000000000000, // 40Dd
    baseIncome: 1000000000000000000000000000000000000, // 1Ud
    count: 0,
    costMultiplier: 1.15,
    description: 'One mind, infinite money.',
    icon: '👁️',
    requiredRebirths: 18
  },
  {
    id: 'concept_eraser',
    name: 'Concept Eraser',
    baseCost: 300000000000000000000000000000000000000000, // 300Dd
    baseIncome: 10000000000000000000000000000000000000, // 10Ud
    count: 0,
    costMultiplier: 1.15,
    description: 'Delete "Poverty" from existence.',
    icon: '✏️',
    requiredRebirths: 20
  },
  {
    id: 'dev_keyboard',
    name: 'The Developer Keyboard',
    baseCost: 999000000000000000000000000000000000000000, // 999Dd
    baseIncome: 100000000000000000000000000000000000000, // 100Ud
    count: 0,
    costMultiplier: 1.15,
    description: 'Access the source code of reality.',
    icon: '⌨️',
    requiredRebirths: 25
  }
];

export const INITIAL_STATE: GameState = {
  money: 0,
  totalLifetimeMoney: 0,
  rebirths: 0,
  prestigeMultiplier: 1.0,
  upgrades: {}, // Will be populated dynamically
  startTime: Date.now(),
  companyName: 'Startup Inc.',
  manualClicks: 0,
  blackjackWins: 0
};

export const REBIRTH_COST = 1000000; // 1 Million to first rebirth
export const REBIRTH_SCALING = 5; // Each rebirth requires 5x more lifetime earnings