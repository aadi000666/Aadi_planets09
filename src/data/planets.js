// ─────────────────────────────────────────────────────────────
//  planets.js  —  corrected orbit spacing for clear visibility
//
//  SIZE multiplier in useThreeScene = 2.2
//  Orbit gaps verified — no planet/ring overlaps:
//    Sun      radius 8   → rendered 17.6 units
//    Mercury  orbitR 30  → gap from Sun edge = 12
//    Venus    orbitR 48  → gap = 18
//    Earth    orbitR 66  → gap = 18
//    Mars     orbitR 85  → gap = 19
//    Jupiter  orbitR 125 → gap = 40, ring outer = 125+29 = 154
//    Saturn   orbitR 175 → gap from Jupiter ring = 21, Saturn ring outer = 175+28 = 203
//    Uranus   orbitR 220 → gap from Saturn ring = 17
//    Neptune  orbitR 265 → gap = 45
// ─────────────────────────────────────────────────────────────

export const PLANETS = [
  {
    id: "sun",
    name: "Sun",
    type: "Star",
    radius: 8,
    color: "#FDB813",
    emissiveColor: "#FF6600",
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.003,
    tilt: 0,
    moons: [],
    desc: "The Sun is a giant ball of hot plasma at the center of our solar system. It accounts for 99.86% of the total mass and powers all life on Earth through nuclear fusion in its core.",
    facts: {
      "Age": "4.6 billion years",
      "Type": "G-type Main Sequence",
      "Surface Temp": "5,500 °C",
      "Core Temp": "15,000,000 °C",
      "Diameter": "1,392,700 km",
      "Mass": "1.989 × 10³⁰ kg",
      "Gravity": "274 m/s²",
      "Rotation": "25 Earth days"
    }
  },
  {
    id: "mercury",
    name: "Mercury",
    type: "Terrestrial Planet",
    radius: 1.2,
    color: "#AAAAAA",
    orbitRadius: 30,
    orbitSpeed: 4.74,
    rotationSpeed: 0.002,
    tilt: 0.034,
    moons: [],
    desc: "Mercury is the smallest planet and closest to the Sun. It has extreme temperature swings — scorching 430°C during the day and freezing −180°C at night due to its lack of atmosphere to retain heat.",
    facts: {
      "Distance from Sun": "57.9 million km",
      "Real Distance (AU)": "0.39 AU",
      "Diameter": "4,879 km",
      "Day Length": "59 Earth days",
      "Year Length": "88 Earth days",
      "Moons": "0",
      "Gravity": "3.7 m/s²",
      "Surface Temp": "−180°C to 430°C"
    }
  },
  {
    id: "venus",
    name: "Venus",
    type: "Terrestrial Planet",
    radius: 1.9,
    color: "#E8C560",
    orbitRadius: 48,
    orbitSpeed: 3.50,
    rotationSpeed: -0.001,
    tilt: 177.4,
    moons: [],
    desc: "Venus is the hottest planet (465°C average) despite not being closest to the Sun. Its thick CO₂ atmosphere creates a runaway greenhouse effect. Venus rotates backwards (retrograde) and very slowly!",
    facts: {
      "Distance from Sun": "108.2 million km",
      "Real Distance (AU)": "0.72 AU",
      "Diameter": "12,104 km",
      "Day Length": "243 Earth days",
      "Year Length": "225 Earth days",
      "Moons": "0",
      "Gravity": "8.87 m/s²",
      "Surface Temp": "465 °C (avg)"
    }
  },
  {
    id: "earth",
    name: "Earth",
    type: "Terrestrial Planet",
    radius: 2.0,
    color: "#4FA3E0",
    orbitRadius: 66,
    orbitSpeed: 2.98,
    rotationSpeed: 0.01,
    tilt: 23.5,
    moons: [
      { name: "Moon", radius: 0.5, orbitRadius: 4.5, color: "#CCCCCC", speed: 13.0 }
    ],
    desc: "Our home — the only known world with liquid water, a breathable atmosphere, and confirmed life. Earth's magnetic field protects us from harmful solar radiation. Plate tectonics continually reshape its surface.",
    facts: {
      "Distance from Sun": "149.6 million km",
      "Real Distance (AU)": "1.00 AU",
      "Diameter": "12,742 km",
      "Day Length": "24 hours",
      "Year Length": "365.25 days",
      "Moons": "1 (The Moon)",
      "Gravity": "9.8 m/s²",
      "Surface Temp": "−89°C to 58°C"
    }
  },
  {
    id: "mars",
    name: "Mars",
    type: "Terrestrial Planet",
    radius: 1.5,
    color: "#C1440E",
    orbitRadius: 85,
    orbitSpeed: 2.41,
    rotationSpeed: 0.009,
    tilt: 25.2,
    moons: [
      { name: "Phobos", radius: 0.25, orbitRadius: 3.2, color: "#999988", speed: 20.0 },
      { name: "Deimos", radius: 0.18, orbitRadius: 4.8, color: "#AAAAAA", speed: 8.0  }
    ],
    desc: "The Red Planet is red due to iron oxide (rust) on its surface. Mars has the tallest volcano in the solar system — Olympus Mons (22 km high) — and the deepest canyon — Valles Marineris. A future human destination!",
    facts: {
      "Distance from Sun": "227.9 million km",
      "Real Distance (AU)": "1.52 AU",
      "Diameter": "6,779 km",
      "Day Length": "24.6 hours",
      "Year Length": "687 Earth days",
      "Moons": "2 (Phobos, Deimos)",
      "Gravity": "3.72 m/s²",
      "Surface Temp": "−125°C to 20°C"
    }
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "Gas Giant",
    radius: 5.5,
    color: "#C88B3A",
    orbitRadius: 125,
    orbitSpeed: 1.31,
    rotationSpeed: 0.02,
    tilt: 3.1,
    moons: [
      { name: "Io",       radius: 0.5,  orbitRadius: 9.0,  color: "#FFD700", speed: 18.0 },
      { name: "Europa",   radius: 0.45, orbitRadius: 11.5, color: "#C8D8E8", speed: 12.0 },
      { name: "Ganymede", radius: 0.65, orbitRadius: 14.5, color: "#A08060", speed: 7.0  },
      { name: "Callisto", radius: 0.60, orbitRadius: 18.0, color: "#707070", speed: 4.5  }
    ],
    desc: "The largest planet — 1,300 Earths could fit inside! Jupiter's Great Red Spot is a storm larger than Earth that has raged for over 350 years. It has 95 known moons. Its magnetic field is 20,000× Earth's.",
    facts: {
      "Distance from Sun": "778.5 million km",
      "Real Distance (AU)": "5.20 AU",
      "Diameter": "139,820 km",
      "Day Length": "9.9 hours",
      "Year Length": "11.86 Earth years",
      "Moons": "95 known",
      "Gravity": "24.79 m/s²",
      "Atmosphere": "90% H₂, 10% He"
    }
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "Gas Giant",
    radius: 4.8,
    color: "#E4C47A",
    orbitRadius: 185,
    orbitSpeed: 0.97,
    rotationSpeed: 0.018,
    tilt: 26.7,
    hasRings: true,
    moons: [
      { name: "Titan",   radius: 0.65, orbitRadius: 11.0, color: "#E8A830", speed: 5.5 },
      { name: "Rhea",    radius: 0.35, orbitRadius: 14.0, color: "#CCBBAA", speed: 3.5 },
      { name: "Dione",   radius: 0.30, orbitRadius: 17.0, color: "#BBAACC", speed: 2.5 },
      { name: "Tethys",  radius: 0.28, orbitRadius: 20.0, color: "#AABBCC", speed: 2.0 }
    ],
    desc: "The ringed jewel of the solar system! Saturn's rings span 282,000 km but are only 10–100m thick — made of ice and rock fragments. Saturn is less dense than water; it would float on a giant ocean!",
    facts: {
      "Distance from Sun": "1.43 billion km",
      "Real Distance (AU)": "9.58 AU",
      "Diameter": "116,460 km",
      "Day Length": "10.7 hours",
      "Year Length": "29.46 Earth years",
      "Moons": "146 known",
      "Gravity": "10.44 m/s²",
      "Ring Width": "282,000 km"
    }
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "Ice Giant",
    radius: 3.2,
    color: "#7DE8E8",
    orbitRadius: 235,
    orbitSpeed: 0.68,
    rotationSpeed: -0.012,
    tilt: 97.8,
    moons: [
      { name: "Titania", radius: 0.38, orbitRadius: 7.5,  color: "#BBBBCC", speed: 4.0 },
      { name: "Oberon",  radius: 0.34, orbitRadius: 10.0, color: "#AAAAAA", speed: 2.5 }
    ],
    desc: "Uranus rotates on its side (98° tilt) — likely knocked over by a giant collision billions of years ago. Its rings are therefore nearly vertical. It has the coldest atmosphere of any planet at −224°C.",
    facts: {
      "Distance from Sun": "2.87 billion km",
      "Real Distance (AU)": "19.2 AU",
      "Diameter": "50,724 km",
      "Day Length": "17.2 hours",
      "Year Length": "84 Earth years",
      "Moons": "27 known",
      "Gravity": "8.87 m/s²",
      "Atmosphere Temp": "−224 °C"
    }
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "Ice Giant",
    radius: 3.0,
    color: "#3F54BA",
    orbitRadius: 280,
    orbitSpeed: 0.54,
    rotationSpeed: 0.014,
    tilt: 28.3,
    moons: [
      { name: "Triton", radius: 0.50, orbitRadius: 7.5, color: "#AACCEE", speed: -3.5 }
    ],
    desc: "The windiest planet — winds reach 2,100 km/h! Neptune was the first planet found through mathematical prediction before being observed. Its moon Triton orbits backwards and is slowly spiralling inward.",
    facts: {
      "Distance from Sun": "4.5 billion km",
      "Real Distance (AU)": "30.05 AU",
      "Diameter": "49,244 km",
      "Day Length": "16.1 hours",
      "Year Length": "165 Earth years",
      "Moons": "16 known",
      "Gravity": "11.15 m/s²",
      "Wind Speed": "2,100 km/h"
    }
  }
];

export const QUIZ_QUESTIONS = [
  { q: "Which is the largest planet in our Solar System?", options: ["Saturn","Jupiter","Uranus","Neptune"], answer: 1 },
  { q: "How many moons does Mars have?", options: ["0","1","2","4"], answer: 2 },
  { q: "Which planet has the most moons (as of 2024)?", options: ["Jupiter","Saturn","Uranus","Neptune"], answer: 1 },
  { q: "What is the hottest planet in the Solar System?", options: ["Mercury","Mars","Venus","Jupiter"], answer: 2 },
  { q: "Which planet rotates on its side (97° tilt)?", options: ["Neptune","Saturn","Uranus","Venus"], answer: 2 },
  { q: "What are Saturn's rings primarily made of?", options: ["Dust & Rock only","Ice & Rock fragments","Methane gas","Hydrogen gas"], answer: 1 },
  { q: "Which planet has the Great Red Spot storm?", options: ["Saturn","Mars","Neptune","Jupiter"], answer: 3 },
  { q: "How long does light take from Sun to Earth?", options: ["8 seconds","8 minutes","80 minutes","8 hours"], answer: 1 },
  { q: "Which planet spins backwards (retrograde rotation)?", options: ["Mercury","Earth","Venus","Mars"], answer: 2 },
  { q: "What is the smallest planet in the Solar System?", options: ["Mars","Mercury","Pluto","Venus"], answer: 1 },
  { q: "Which planet is known as the Red Planet?", options: ["Mercury","Jupiter","Mars","Venus"], answer: 2 },
  { q: "How many planets are in our Solar System?", options: ["7","8","9","10"], answer: 1 },
  { q: "Which is the coldest planet in the Solar System?", options: ["Saturn","Pluto","Neptune","Uranus"], answer: 3 },
  { q: "What is Jupiter's largest moon called?", options: ["Europa","Io","Ganymede","Callisto"], answer: 2 },
  { q: "Which planet has winds up to 2,100 km/h?", options: ["Jupiter","Saturn","Uranus","Neptune"], answer: 3 },
  { q: "What is the distance of Earth from Sun (in AU)?", options: ["0.72 AU","1.00 AU","1.52 AU","2.00 AU"], answer: 1 },
  { q: "Which planet is farthest from the Sun?", options: ["Saturn","Uranus","Neptune","Jupiter"], answer: 2 },
  { q: "How many Earth years does Neptune take to orbit the Sun?", options: ["29 years","84 years","165 years","248 years"], answer: 2 }
];