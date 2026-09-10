import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Mail,
  Linkedin,
  Github,
  Boxes,
  Thermometer,
  Cpu,
  Rocket,
  FlaskConical,
  ArrowLeft,
  FolderKanban,
  Briefcase,
  User,
  Laptop,
  BookOpen,
  ArrowUpRight,
  Lightbulb,
} from "lucide-react";

const COLORS = {
  bg: "#04060D",
  panelGlass: "rgba(255,255,255,0.05)",
  panelBorder: "rgba(255,255,255,0.14)",
  textPrimary: "#F2F5FA",
  textMuted: "#8B96AC",
  accent: "#4FA8FF",
  accentSoft: "rgba(79,168,255,0.16)",
  white: "#EDEFF4",
  overlayBg: "rgba(6,8,14,0.94)",
};
const PAPER = COLORS;

const FONT_SANS = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const FONT_MONO = "'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

const STRUCT_HEX = 0x8b96ac;
const ACCENT_HEX = 0x4fa8ff;
const PAINT_HEX = 0x1c4f8f;

const PART_LABELS = {
  shell: "Body panels",
  crashguard: "Crash guard / bumper beam",
  battery: "Battery bay",
  motor: "Motor block",
  chassis: "Chassis frame",
  suspension: "Suspension struts",
  radiator: "Radiator",
  heatsink: "Heatsink",
  ecu: "ECU / control board",
  harness: "Wiring harness",
  dashboard: "Dashboard",
};

const PROJECTS = [
  {
    id: "thermal",
    label: "BGA Thermal Analysis",
    icon: Thermometer,
    parts: ["radiator", "heatsink"],
    title: "BGA SoC Thermal-Structural Analysis",
    source: "ANSYS Icepak, ANSYS Mechanical · 2025",
    context: "Traced a warpage failure back to its root physical cause",
    stats: [
      { label: "Steady state", value: "90°C" },
      { label: "Transient peak", value: "80.2°C @ 159s" },
      { label: "Von Mises stress", value: "865 MPa" },
      { label: "Warpage", value: "15.5 µm" },
    ],
    description:
      "Ran a coupled thermal-structural simulation of a BGA SoC package in ANSYS Icepak and Mechanical across a 0.3–35W dissipation range, root-caused the warpage to a CTE mismatch (solder 21 ppm/°C vs. substrate 17 ppm/°C), and proposed underfill epoxy plus a low-CTE substrate as corrective changes. A companion 35W CPU case under fan cooling (Icepak, 10mm radius, 0.01 m³/s) topped out at 119°C die temperature.",
    relevantTo: ["Battery thermal management (BTMS)", "Power electronics cooling", "Thermal-structural simulation (ANSYS Icepak)"],
    caseStudy: {
      impact: "Traced a chip-package warpage failure back to a specific material mismatch, and proposed the fix.",
      metrics: [
        { value: "90°C", label: "Steady state" },
        { value: "865 MPa", label: "Von Mises stress" },
        { value: "15.5 µm", label: "Warpage" },
        { value: "119°C", label: "CPU die temp, fan-cooled" },
      ],
      tools: ["ANSYS Icepak", "ANSYS Mechanical", "SolidWorks"],
      challenge: {
        problem: "A BGA SoC package showed warpage and stress risk across a 0.3–35W dissipation range, with delamination a real possibility if the root cause wasn't identified.",
        approach: "Modeled the full package stack (die, TIM, spreader, substrate, PCB) in SolidWorks, then ran a coupled thermal-structural simulation across the power range in ANSYS Icepak and Mechanical.",
        result: "Root-caused the warpage to a CTE mismatch between the solder (21 ppm/°C) and substrate (17 ppm/°C), and proposed underfill epoxy plus a low-CTE substrate as corrective changes.",
      },
      process: [
        {
          title: "Model the package stack",
          description: "Built a realistic BGA SoC model — die, TIM, spreader, substrate, and PCB — in SolidWorks.",
          images: [{ src: "/images/bga/cpu-package-iso.jpg", caption: "Initial BGA package model (SolidWorks)" }],
        },
        {
          title: "Run the coupled simulation",
          description: "Simulated 0.3–35W dissipation with convection (h = 20–750 W/m²·K) in ANSYS Icepak and Mechanical, finding a 90°C steady state and 865 MPa von Mises stress.",
        },
        {
          title: "Revise the model & propose fixes",
          description: "Increased the mold size in a revised model to evaluate warpage sensitivity, and proposed underfill epoxy plus a low-CTE substrate as corrective changes. A companion 35W CPU case under fan cooling (10mm radius, 0.01 m³/s) topped out at 119°C.",
          images: [{ src: "/images/bga/bga-v3-iso.jpg", caption: "Revised model — increased mold size" }],
        },
      ],
    },
  },
  {
    id: "electronics",
    label: "Harness Tester Challenge",
    icon: Cpu,
    parts: ["harness", "ecu"],
    title: "comma.ai Harness Tester Challenge",
    source: "Hardware Debug & Integration · June 2026",
    context: "Found real hardware bugs across firmware, schematic, and PCB",
    stats: [
      { label: "Bugs found", value: "33" },
      { label: "Layers", value: "Firmware, schematic, PCB" },
    ],
    description:
      "Audited firmware, schematic, and PCB of comma.ai's hardware tester board end-to-end: diagnosed I2C failures on a CY8C9560 GPIO expander (inverted reset logic, wrong device ID, pass/fail inversion, 64-bit overflow), plus schematic faults including a wrong MOSFET, missing LED resistors, and a GPS TX/RX swap.",
    relevantTo: ["Vehicle wiring harness design", "Hardware-in-the-loop test engineering", "Embedded/electrical diagnostics"],
  },
];

const EXPERIENCE = [
  {
    id: "usc-composites",
    label: "USC Composites Lab",
    icon: FlaskConical,
    parts: ["shell", "crashguard", "dashboard"],
    title: "Composites Research Engineer & Teaching Assistant",
    source: "USC Advanced Composites Lab · Oct 2024 – Dec 2025",
    description: "Research and TA role designing, fabricating, and root-causing composite structures for SAMPE competition entries.",
    achievements: [
      "Fabricated composite beams via vacuum infusion — up to 7,200N failure load, won 4 of 7 SAMPE categories",
      "Root-caused infusion defects to tubing placement — cut rejection rate to zero",
      "Fabricated a fuselage pod at 5,000N+ load resistance, zero rework — won SAMPE 2025 fuselage category",
      "Standardized the build procedure for the whole lab",
    ],
    relevantTo: ["Composites manufacturing research", "Aerospace/automotive panel fabrication"],
    caseStudy: {
      impact: "Fixed a broken fabrication process and then won with it — 4 of 7 judged categories across two years of SAMPE competition.",
      metrics: [
        { value: "0%", label: "Rejection rate (down from a real defect problem)" },
        { value: "7,200N", label: "Peak beam failure load" },
        { value: "5,000N+", label: "Fuselage transverse load resistance" },
        { value: "4/7", label: "SAMPE categories won" },
      ],
      tools: ["Siemens NX", "Vacuum infusion", "Root cause analysis", "Composite layup"],
      challenge: {
        problem: "Vacuum infusion builds kept failing inspection — defects were showing up in the I-beam walls, driving up the rejection rate and slowing the whole lab down.",
        approach: "Traced the defects back to helix tubing placement inside the mold, redesigned the tubing layout, and added a mandatory leak-check step before every infusion.",
        result: "Rejection rate dropped to zero, and the fix was documented into a standard build procedure so new lab members could run infusions independently.",
      },
      process: [
        {
          title: "Design the part",
          description: "Designed structural composite beams in Siemens NX, and a glass-fiber fuselage pod with a load-path-optimized ply schedule.",
          images: [{ caption: "Beam design & layup" }],
        },
        {
          title: "Build via vacuum infusion",
          description: "Fabricated beams across a 350–800g weight range and a full fuselage pod, targeting maximum failure load per gram.",
          images: [{ caption: "Fuselage pod fabrication" }],
        },
        { title: "Root-cause the defects", description: "Diagnosed recurring I-beam wall defects down to helix tubing placement, then redesigned it and added a leak-check checkpoint." },
        {
          title: "Standardize & compete",
          description: "Documented the fixed procedure for the whole lab, then took both parts to SAMPE — winning 4 of 7 categories plus the fuselage category outright.",
          images: [{ caption: "SAMPE competition" }],
        },
      ],
    },
  },
  {
    id: "atlast",
    label: "ATLAST",
    icon: Rocket,
    parts: ["battery", "motor", "chassis"],
    title: "Mechanical Engineer, Founding Team — ATLAST",
    source: "Hydrogen fuel cell hybrid motorcycle · Jan 2022 – May 2023",
    description: "First engineering hire on a hydrogen fuel cell hybrid motorcycle — owned CAD, chassis integration, bench testing, and composite body design across the full vehicle.",
    achievements: [
      "Modeled fuel cell, motor, and battery placement in SolidWorks to hit safety-factor and CG targets",
      "Arc-welded custom brackets to integrate the powertrain onto a repurposed chassis",
      "Validated the PEM fuel cell across 41 load steps — 18/18 automated tests passing",
      "Designed and hand-laid a full-coverage glass fiber fairing in Fusion 360",
    ],
    relevantTo: ["Founding/early hardware engineer roles", "Cross-disciplinary vehicle integration", "0-to-1 hardware startups"],
    caseStudy: {
      impact: "Took a hydrogen fuel cell motorcycle from concept to a validated, ridable prototype — as the team's first engineer.",
      metrics: [
        { value: "41", label: "Load steps validated" },
        { value: "18/18", label: "Automated tests passing" },
        { value: "3g", label: "Design load factor (brackets)" },
        { value: "~$19K", label: "Seed funding raised" },
        { value: "3", label: "Accelerators" },
      ],
      tools: ["SolidWorks", "Fusion 360", "Arc welding", "Python", "DAQ / bench testing"],
      challenge: {
        problem: "The fuel cell, motor, and battery all had to fit on a double-cradle chassis without breaking safety-factor or center-of-mass requirements — on a repurposed frame, not a clean-sheet design.",
        approach: "Modeled the full assembly in SolidWorks and iterated component placement until every target was met on screen, then cut non-load-bearing sections out of the base frame and arc-welded custom brackets at exactly the CAD-defined positions.",
        result: "A functional, clean prototype frame built from a repurposed base — with every powertrain component exactly where CAD said it needed to be.",
      },
      process: [
        {
          title: "Model the full assembly",
          description: "Placed the fuel cell, motor, and battery in SolidWorks, iterating positions until safety-factor and center-of-mass targets were met.",
        },
        {
          title: "Reengineer the chassis",
          description: "Cut non-load-bearing sections from a repurposed frame and arc-welded custom brackets at SolidWorks-defined positions.",
        },
        {
          title: "Hand-calc every mounting bracket",
          description:
            "Designed and stress-checked the fuel cell tabs, battery tray, and hydrogen cylinder C-clamps by hand under a 3g load factor — fuel cell bracket stress came out to ≈7 MPa (under 3% of mild steel's ~250 MPa yield), and both the battery tray and cylinder clamp welds checked out under 0.5 MPa shear against a ~100 MPa allowable.",
          images: [
            { src: "/images/atlast/fuel-cell-mount.jpg", caption: "Fuel cell bracket mount (4 tabs @ 63.5°)" },
            { src: "/images/atlast/h2-cylinder-clamp.jpg", caption: "Hydrogen cylinder C-clamp" },
            { src: "/images/atlast/h2-cylinder-mounted.jpg", caption: "Cylinder mounted on chassis" },
          ],
        },
        {
          title: "Model the suspension & integrate the hub motor",
          description:
            "Modeled the existing dual-shock front and rear suspension in SolidWorks and validated deformation under revised loads in ANSYS (31.93mm at 10% preload). Resolved rear hub motor integration with custom-machined axle extensions and swing arm modifications.",
          images: [
            { src: "/images/atlast/front-fork-cad.jpg", caption: "Front fork assembly (SolidWorks)" },
            { src: "/images/atlast/swing-arm-cad.jpg", caption: "Swing arm, modified for hub motor" },
            { src: "/images/esvc/motor-mount-cad.jpg", caption: "Motor mount design (SolidWorks)" },
          ],
        },
        {
          title: "Validate the powertrain",
          description: "Ran the PEM fuel cell through 41 load steps, capturing V-I curves, and built a Python tool to auto-check results against 6 specs — 18/18 passing.",
        },
        {
          title: "Design & build the body",
          description: "Designed a full-coverage glass fiber fairing in Fusion 360 for clearance across every component, then hand-laid the panels.",
          images: [
            { src: "/images/atlast/composite-body-render.jpg", caption: "Composite body (Fusion 360)" },
            { src: "/images/atlast/atlast-real-photo.jpg", caption: "The finished ATLAST motorcycle" },
          ],
        },
      ],
    },
  },
  {
    id: "esvc",
    label: "ESVC",
    icon: Boxes,
    parts: ["chassis", "suspension"],
    title: "Chassis Design & Integration Engineer — ESVC",
    source: "Electric Solar Vehicle Competition, ISIE India · Aug 2022 – Apr 2023",
    description: "Designed and validated a structural steel spaceframe chassis for a national EV competition, then coordinated its cross-functional integration.",
    achievements: [
      "Designed a steel spaceframe in CATIA V5; produced GD&T drawings and BOM",
      "Ran 6 FEA iterations — hit 6 kN·m/deg stiffness with ~8% mass reduction",
      "Ran a DFMEA pre-fabrication, resolving 5 weld-access conflicts before cutting metal",
      "Coordinated full vehicle integration — passed all ISIE inspections on first shakedown",
    ],
    relevantTo: ["Vehicle structural/CAE engineering", "Chassis design validation"],
    caseStudy: {
      impact: "Designed a competition chassis that hit its stiffness target and passed every inspection on the first shakedown.",
      metrics: [
        { value: "6", label: "kN·m/deg torsional stiffness" },
        { value: "~8%", label: "Mass reduction, first build" },
        { value: "0.58°", label: "Angular twist under load" },
        { value: "5", label: "Weld conflicts caught pre-fab" },
      ],
      tools: ["CATIA V5", "AutoCAD", "ANSYS Mechanical (BEAM188/189)", "GD&T (ANSI Y-14.5)", "DFMEA"],
      challenge: {
        problem: "The chassis needed to hit a hard torsional stiffness number while staying light enough to be competitive — and any fabrication mistake at competition scale would be expensive and slow to fix.",
        approach: "Built a beam-element FEA model in ANSYS: imported the CATIA spaceframe as an IGS wireframe, converted it to line bodies, approximated the curved roll-cage members as straight segments, and applied a pure torque couple (±5000N at the front) with the rear four corners fixed.",
        result: "The model measured 7.094mm of total twist, which works out to 6 kN·m/deg torsional stiffness — with the straight-line beam approximation capturing an estimated 98% of the actual stiffness, and the triangulated base frame confirmed as the primary source of torsional resistance.",
      },
      process: [
        {
          title: "Design the spaceframe",
          description: "Designed a structural steel spaceframe in CATIA V5 to the ESVC rulebook (50mm OD tube, 2mm wall thickness, 700mm track width), then produced GD&T drawings and a BOM to ANSI Y-14.5 in AutoCAD.",
          images: [{ src: "/images/esvc/spaceframe-render.jpg", caption: "Spaceframe chassis (CATIA)" }],
        },
        {
          title: "Build the FEA model",
          description: "Imported the geometry into ANSYS as line bodies (BEAM188/189 elements, Ro=25mm/Ri=23mm circular section), replacing curved roll-cage members with straight-segment approximations and using Share Topology to merge coincident nodes.",
          images: [{ src: "/images/esvc/ansys-geometry-import.jpg", caption: "Line-body geometry import (ANSYS Mechanical)" }],
        },
        {
          title: "Apply loads & solve",
          description: "Fixed the four rear corner vertices and applied a ±5000N torque couple at the front to create pure torsional loading — producing +3.543mm / -3.551mm of opposite vertical deflection.",
          images: [{ src: "/images/esvc/ansys-beam-mesh.jpg", caption: "BEAM188/189 mesh" }],
        },
        {
          title: "Derive the stiffness",
          description: "Converted the 7.094mm total twist to 0.58° of angular deflection over the 700mm track width, then divided the 3,500N·m applied torque by that angle to get ≈6 kN·m/deg.",
          images: [{ src: "/images/esvc/ansys-deformation-result.jpg", caption: "Total deformation result — 0.58° twist" }],
        },
        {
          title: "Catch failures before fabrication",
          description: "Ran a formal DFMEA and resolved 5 weld-access conflicts directly in CAD.",
        },
        {
          title: "Integrate & validate the vehicle",
          description: "Coordinated cross-functional integration of suspension, brakes, steering, differential, and power electronics — passed all ISIE inspections first try.",
          images: [{ src: "/images/esvc/esvc-real-vehicle.jpg", caption: "The finished ESVC vehicle at competition" }],
        },
      ],
    },
  },
];

const FREELANCE_PROJECTS = [
  {
    id: "perfume-gallery",
    title: "Perfume Gallery — Store Layout (AutoCAD)",
    goal: "Retail store layout and fixture placement for a perfume gallery.",
    bullets: ["Designed the full floor plan — office room, restroom, storefront entrance, and product display fixture rows — with complete dimensioning."],
    images: [{ src: "/images/freelance/perfume-gallery-floorplan.jpg", caption: "Store floor plan (AutoCAD)", large: true }],
  },
  {
    id: "rotor-blade",
    title: "Rotor Blade (CATIA)",
    goal: "Parametric aero-surface design.",
    bullets: ["Built a fully parametric rotor blade surface in CATIA for fast geometry iteration."],
    images: [{ src: "/images/freelance/rotor-blade.jpg", caption: "Rotor blade, CATIA" }],
  },
  {
    id: "waste-management",
    title: "Smart Waste Management System (CATIA)",
    goal: "Assembly design for separation & collection.",
    bullets: ["Designed the full assembly for automated waste separation and collection, from concept sketches through detailed CATIA drawings."],
    images: [
      { src: "/images/freelance/waste-mgmt-assembly.jpg", caption: "Assembly (CATIA)" },
      { src: "/images/freelance/waste-mgmt-drawings.jpg", caption: "Orthographic drawings" },
    ],
  },
  {
    id: "h2-truck",
    title: "Panther Concept — Hydrogen Fuel Cell Truck (Fusion 360)",
    goal: "Explore a heavy-duty hydrogen truck with a body-on-frame chassis.",
    bullets: [
      "Designed the chassis with leaf-spring suspension and body mounts",
      "Modeled the full body shell, tires, and frame in Fusion 360",
      "Explored fuel cell integration on a commercial vehicle platform",
    ],
    images: [
      { src: "/images/freelance/panther-concept-v1.jpg", caption: "Panther concept, 3/4 view" },
      { src: "/images/freelance/panther-concept-side.jpg", caption: "Panther concept, side view" },
    ],
  },
  {
    id: "rc-boat",
    title: "RC Boat",
    goal: "3D-printed remote-control boat build.",
    bullets: ["Designed and 3D-printed a working RC boat hull."],
    images: [],
  },
];

function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.4)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function makeEnvTexture() {
  const w = 512,
    h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#dfeeff");
  sky.addColorStop(0.28, "#8fb8e8");
  sky.addColorStop(0.5, "#1c3a63");
  sky.addColorStop(0.72, "#0a1526");
  sky.addColorStop(1, "#05070d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  const band = ctx.createLinearGradient(0, h * 0.4, 0, h * 0.62);
  band.addColorStop(0, "rgba(255,255,255,0)");
  band.addColorStop(0.5, "rgba(220,235,255,0.9)");
  band.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = band;
  ctx.fillRect(0, h * 0.4, w, h * 0.22);
  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

export default function App() {
  const mountRef = useRef(null);
  const stateRef = useRef({ view: "home", selectedId: null });
  const [view, setView] = useState("home");
  const [selectedId, setSelectedId] = useState(null);
  const [caseStudyId, setCaseStudyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [minSplashDone, setMinSplashDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinSplashDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const list = view === "projects" ? PROJECTS : view === "experience" ? EXPERIENCE : [];
  const selected = list.find((s) => s.id === selectedId) || null;
  const caseStudyEntry = EXPERIENCE.find((s) => s.id === caseStudyId) || PROJECTS.find((s) => s.id === caseStudyId) || null;
  const [caseStudyOrigin, setCaseStudyOrigin] = useState("experience");

  useEffect(() => {
    stateRef.current.view = view;
  }, [view]);
  useEffect(() => {
    stateRef.current.selectedId = selectedId;
  }, [selectedId]);

  function goHome() {
    setView("home");
    setSelectedId(null);
    setCaseStudyId(null);
  }
  function openSection(v) {
    setView(v);
    setSelectedId(null);
    setCaseStudyId(null);
  }
  function openCaseStudy(id) {
    setCaseStudyOrigin(view);
    setCaseStudyId(id);
    setView("case-study");
  }
  function backFromCaseStudy() {
    setCaseStudyId(null);
    setView(caseStudyOrigin);
  }

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.bg);
    scene.fog = new THREE.Fog(new THREE.Color(COLORS.bg).getHex(), 10, 24);
    scene.environment = makeEnvTexture();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.minDistance = 3.5;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI * 0.52;
    controls.addEventListener("start", () => (controls.autoRotate = false));

    // --- Lighting ---
    const hemi = new THREE.HemisphereLight(0x6f9fff, 0x05060c, 0.8);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xdfe9ff, 1.4);
    key.position.set(5, 6, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4fa8ff, 0.5);
    fill.position.set(-6, 2, -4);
    scene.add(fill);

    const grid = new THREE.GridHelper(30, 30, 0x1a2740, 0x0c1220);
    grid.position.y = -0.02;
    scene.add(grid);

    function makeGlowBackdropTexture() {
      const s = 512;
      const c = document.createElement("canvas");
      c.width = c.height = s;
      const ctx = c.getContext("2d");
      const grad = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grad.addColorStop(0, "rgba(79,168,255,0.32)");
      grad.addColorStop(0.5, "rgba(79,168,255,0.15)");
      grad.addColorStop(1, "rgba(79,168,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    }
    const glowBackdropMat = new THREE.SpriteMaterial({
      map: makeGlowBackdropTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 1,
    });
    const glowBackdrop = new THREE.Sprite(glowBackdropMat);
    glowBackdrop.scale.set(8, 6, 1);
    glowBackdrop.position.set(0, 2, -6);
    scene.add(glowBackdrop);

    // Contact shadow
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d");
    const sg = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    sg.addColorStop(0, "rgba(0,0,0,0.55)");
    sg.addColorStop(1, "rgba(0,0,0,0)");
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 256, 256);
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 3),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.001, 0);
    scene.add(shadowMesh);

    // --- Car root: real BMW E30 M3 model (logo-scrubbed, recolored) + hidden internal subsystems ---
    // This model is authored in real meters (Z = length, X = width, Y = height), so all
    // coordinates below are true-to-scale, taken directly from the file's own node data.
    const carRoot = new THREE.Group();
    scene.add(carRoot);

    const registry = {};
    const glowSprites = {};
    const glowTex = makeGlowTexture();
    function registerMesh(k, mesh, parent) {
      if (!registry[k]) registry[k] = { meshes: [] };
      registry[k].meshes.push(mesh);
      (parent || carRoot).add(mesh);
    }
    function addGlow(k, position, scale = 0.9) {
      const mat = new THREE.SpriteMaterial({ map: glowTex, color: ACCENT_HEX, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      sprite.position.copy(position);
      sprite.scale.set(scale, scale, 1);
      carRoot.add(sprite);
      glowSprites[k] = sprite;
    }

    let bodyMat = null;
    const shellMaterials = []; // { mat, homeOpacity, isBodyPanel } — everything that should ghost-out in x-ray mode
    const SHELL_MATERIAL_NAMES = [
      "BMW_E30_M3_PLASTIC",
      "BMW_E30_M3_CHROME",
      "BMW_E30_M3_WINDOWS",
      "BMW_E30_M3_BLACKOUT",
      "BMW_E30_M3_SIDE_MIRROR",
      "BMW_E30_M3_TAILLIGHT_REFLECTOR",
      "BMW_E30_M3_HEADLIGHT_REFLECTOR",
      "BMW_E30_M3_LENS",
    ];
    // Only actual body panel trim highlights when "Body panels" is the active selection —
    // lights, lenses, glass, chrome, and mirrors should just fade normally like everything else.
    const BODY_PANEL_MATERIAL_NAMES = ["BMW_E30_M3_PLASTIC"];
    const textureLoader = new THREE.TextureLoader();
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      "/car/bmw-e30-m3.glb",
      (gltf) => {
        try {
          const model = gltf.scene;
          let meshCount = 0;
          model.traverse((child) => {
            if (!child.isMesh || !child.material) return;
            meshCount++;
            const matName = child.material.name;

            if (matName === "BMW_E30_M3_PAINT") {
              // Controllable paint material (blue <-> x-ray glass), replacing the factory red.
              // Lighter roughness/clearcoat than before — less "heavy chrome slab," cheaper to render.
              bodyMat = new THREE.MeshPhysicalMaterial({
                color: PAINT_HEX,
                transparent: true,
                opacity: 1,
                roughness: 0.32,
                metalness: 0.5,
                clearcoat: 0.5,
                clearcoatRoughness: 0.2,
              });
              child.material = bodyMat;
            } else if (matName === "BMW_E30_M3_EMBLEMS") {
              // Removes the roundel, "BMW" script, and M-stripe badge in one go
              child.visible = false;
            } else if (matName === "BMW_E30_M3_RIM") {
              // Swap in a version of the rim texture with the wheel-cap roundel painted out
              const fixedTex = textureLoader.load("/car/bmw-rim-fixed.png");
              fixedTex.flipY = false;
              fixedTex.colorSpace = THREE.SRGBColorSpace;
              child.material = child.material.clone();
              child.material.map = fixedTex;
              child.material.needsUpdate = true;
            } else if (SHELL_MATERIAL_NAMES.includes(matName)) {
              // Every other body-adjacent part (chrome, plastic trim, windows, mirror, lenses)
              // needs to ghost out along with the paint, or the "shell" looks broken/patchy
              // in x-ray mode instead of uniformly translucent. Only the actual body-panel
              // trim should brighten on selection, though — not lights, glass, or chrome.
              const mat = child.material.clone();
              mat.transparent = true;
              const homeOpacity = mat.opacity ?? 1;
              const isBodyPanel = BODY_PANEL_MATERIAL_NAMES.includes(matName);
              shellMaterials.push({ mat, homeOpacity, isBodyPanel });
              child.material = mat;
            }
          });
          carRoot.add(model);
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          box.getSize(size);
          console.log(
            `[car] Loaded OK — ${meshCount} meshes, bodyMat found: ${!!bodyMat}, size: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}, center: ${box
              .getCenter(new THREE.Vector3())
              .toArray()
              .map((v) => v.toFixed(2))}`
          );
          setModelInfo(
            `meshes: ${meshCount} | paint found: ${!!bodyMat} | size: ${size.x.toFixed(2)}×${size.y.toFixed(2)}×${size.z.toFixed(2)}`
          );
          if (!bodyMat) {
            setLoadError("Model loaded but no mesh named 'BMW_E30_M3_PAINT' was found — check material names in the file.");
          }
          setLoading(false);
        } catch (e) {
          console.error("[car] Error while processing loaded model:", e);
          setLoadError(`Error processing model: ${e.message}`);
          setLoading(false);
        }
      },
      (progress) => {
        if (progress.total) console.log(`[car] Loading: ${((progress.loaded / progress.total) * 100).toFixed(0)}%`);
      },
      (err) => {
        console.error("[car] Failed to load car model:", err);
        setLoadError(`Failed to load model: ${err.message || err}`);
        setLoading(false);
      }
    );

    // --- Hidden internal subsystems ---
    // Real axle data from the model: front axle Z=1.35, rear axle Z=-1.24, track half-width X=0.70
    const FRONT_Z = 1.35;
    const REAR_Z = -1.24;
    const TRACK_X = 0.7;
    const chassisMat = () => new THREE.MeshStandardMaterial({ color: STRUCT_HEX, transparent: true, roughness: 0.5, metalness: 0.4, emissive: 0x000000 });
    const thinLine = (points, color = STRUCT_HEX) =>
      new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 }));

    // partAnchors: one 3D world point per labelable part, used for the leader-line callouts
    const partAnchors = {};

    // Chassis rails — I-beam cross-section (top flange + bottom flange + web) instead of a
    // plain box, plus rivet dots along the length, so it reads as a structural rail, not a bar.
    [-0.5, 0.5].forEach((x) => {
      const flangeTop = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.015, 3.2), chassisMat());
      flangeTop.position.set(x, 0.3, 0.05);
      registerMesh("chassis", flangeTop);
      const flangeBottom = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.015, 3.2), chassisMat());
      flangeBottom.position.set(x, 0.22, 0.05);
      registerMesh("chassis", flangeBottom);
      const web = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 3.2), chassisMat());
      web.position.set(x, 0.26, 0.05);
      registerMesh("chassis", web);
      for (let i = -7; i <= 7; i++) {
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), chassisMat());
        rivet.position.set(x, 0.3, i * 0.2);
        registerMesh("chassis", rivet);
      }
    });
    [REAR_Z - 0.15, -0.2, FRONT_Z - 0.2].forEach((z) => {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.07, 0.07), chassisMat());
      cross.position.set(0, 0.26, z);
      registerMesh("chassis", cross);
    });
    addGlow("chassis", new THREE.Vector3(0, 0.26, -0.2), 0.7);
    partAnchors.chassis = new THREE.Vector3(0.5, 0.3, 0.9);

    // Suspension struts + coil springs — smaller, and mounted on a group tilted inward at
    // the top (like a real MacPherson strut) instead of standing straight up through the fender.
    const HUB_Y = 0.34;
    const STRUT_LOCAL_BOTTOM = 0.34; // relative to hub
    const STRUT_LOCAL_TOP = 0.48;
    const INCLINE = 0.22; // radians, ~13° lean toward the car's centerline
    [FRONT_Z, REAR_Z].forEach((z) =>
      [-TRACK_X, TRACK_X].forEach((x) => {
        const pivot = new THREE.Group();
        pivot.position.set(x, HUB_Y, z);
        pivot.rotation.z = x > 0 ? INCLINE : -INCLINE;
        carRoot.add(pivot);

        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, STRUT_LOCAL_TOP - STRUT_LOCAL_BOTTOM, 12), chassisMat());
        strut.position.set(0, (STRUT_LOCAL_BOTTOM + STRUT_LOCAL_TOP) / 2, 0);
        registerMesh("suspension", strut, pivot);

        const mountPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.015, 12), chassisMat());
        mountPlate.position.set(0, STRUT_LOCAL_TOP + 0.012, 0);
        registerMesh("suspension", mountPlate, pivot);

        for (let i = 0; i < 3; i++) {
          const coil = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 8, 16), chassisMat());
          coil.position.set(0, STRUT_LOCAL_BOTTOM + i * 0.045, 0);
          coil.rotation.x = Math.PI / 2;
          registerMesh("suspension", coil, pivot);
        }

        // Lower link connecting the wheel hub up to the strut bottom
        const link = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, STRUT_LOCAL_BOTTOM, 10), chassisMat());
        link.position.set(0, STRUT_LOCAL_BOTTOM / 2, 0);
        registerMesh("suspension", link, pivot);
      })
    );
    partAnchors.suspension = new THREE.Vector3(TRACK_X, HUB_Y + 0.4, FRONT_Z);

    // Battery pack — cell-partition lines + two terminal posts, reads as a battery not a block
    const battery = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.16, 1.3), chassisMat());
    battery.position.set(0, 0.34, -0.35);
    registerMesh("battery", battery);
    for (let i = -3; i <= 3; i++) {
      const cellLine = thinLine(
        [new THREE.Vector3(i * 0.12, 0.34 - 0.09, -0.35 - 0.62), new THREE.Vector3(i * 0.12, 0.34 - 0.09, -0.35 + 0.62)],
        STRUCT_HEX
      );
      registerMesh("battery", cellLine);
    }
    [-0.15, 0.15].forEach((dx) => {
      const terminal = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06, 10), chassisMat());
      terminal.position.set(dx, 0.45, -0.85);
      registerMesh("battery", terminal);
    });
    addGlow("battery", new THREE.Vector3(0, 0.34, -0.35), 0.9);
    partAnchors.battery = new THREE.Vector3(0.45, 0.4, -0.35);

    // Motor — rear-mounted, transverse orientation driving the rear wheels (RWD layout).
    // Cylinder axis runs along X (car width) so it lines up directly with the half-shafts.
    const motorZ = REAR_Z - 0.15;
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.55, 20), chassisMat());
    motor.rotation.z = Math.PI / 2;
    motor.position.set(0, 0.4, motorZ);
    registerMesh("motor", motor);
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6;
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.02), chassisMat());
      rib.position.set(0, 0.4 + Math.cos(a) * 0.2, motorZ + Math.sin(a) * 0.2);
      registerMesh("motor", rib);
    }
    // Half-shafts driving each rear wheel — the actual "rear wheel drive" connection
    [-TRACK_X, TRACK_X].forEach((x) => {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, Math.abs(x) - 0.28, 12), chassisMat());
      shaft.rotation.z = Math.PI / 2;
      shaft.position.set((x > 0 ? 0.28 + Math.abs(x) : -0.28 - Math.abs(x)) / 2, 0.4, motorZ);
      registerMesh("motor", shaft);
    });
    partAnchors.motor = new THREE.Vector3(0.35, 0.5, motorZ);

    // Power cable connecting battery to motor — the two are functionally linked, so show it
    const powerCableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 0.3, -0.35),
      new THREE.Vector3(0.15, 0.28, -0.75),
      new THREE.Vector3(0.1, 0.32, motorZ + 0.15),
      new THREE.Vector3(0, 0.4, motorZ),
    ]);
    const powerCable = new THREE.Mesh(new THREE.TubeGeometry(powerCableCurve, 20, 0.02, 8, false), chassisMat());
    registerMesh("motor", powerCable);

    // Radiator — front of the engine bay, with fin lines across its face
    const radiator = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.35, 0.08), chassisMat());
    radiator.position.set(0, 0.5, 1.55);
    registerMesh("radiator", radiator);
    for (let i = -4; i <= 4; i++) {
      const fin = thinLine(
        [new THREE.Vector3(i * 0.08, 0.5 - 0.17, 1.55 - 0.04), new THREE.Vector3(i * 0.08, 0.5 + 0.17, 1.55 - 0.04)],
        STRUCT_HEX
      );
      registerMesh("radiator", fin);
    }
    addGlow("radiator", new THREE.Vector3(0, 0.5, 1.55), 0.65);
    partAnchors.radiator = new THREE.Vector3(0.4, 0.65, 1.55);

    // Heatsink — finned block, upper engine bay
    const heatsink = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.28), chassisMat());
    heatsink.position.set(0, 0.72, 1.0);
    registerMesh("heatsink", heatsink);
    for (let i = 0; i < 5; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.018), chassisMat());
      fin.position.set(0, 0.8, 0.88 + i * 0.05);
      registerMesh("heatsink", fin);
    }
    partAnchors.heatsink = new THREE.Vector3(0.3, 0.85, 1.0);

    // ECU — flat board with chip bumps and a connector-pin edge
    const ecu = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.34), chassisMat());
    ecu.position.set(0, 0.78, 0.6);
    registerMesh("ecu", ecu);
    [[-0.06, -0.08], [0.05, -0.02], [-0.02, 0.08], [0.06, 0.1]].forEach(([dx, dz]) => {
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.05), chassisMat());
      chip.position.set(dx, 0.81, 0.6 + dz);
      registerMesh("ecu", chip);
    });
    for (let i = -4; i <= 4; i++) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.02, 0.008), chassisMat());
      pin.position.set(-0.12, 0.77, 0.6 + i * 0.03);
      registerMesh("ecu", pin);
    }
    partAnchors.ecu = new THREE.Vector3(0.24, 0.85, 0.6);

    // Dashboard — wide panel spanning the cabin just behind the windshield, with a small
    // raised instrument cluster on the driver's side.
    const dashboard = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 0.22), chassisMat());
    dashboard.position.set(0, 0.78, 0.95);
    registerMesh("dashboard", dashboard);
    const instrumentCluster = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.1), chassisMat());
    instrumentCluster.position.set(0.35, 0.83, 1.0);
    registerMesh("dashboard", instrumentCluster);
    partAnchors.dashboard = new THREE.Vector3(0.5, 0.85, 0.95);

    // Wiring harness running the length of the car — routed above the battery box top (0.42)
    // with margin, since it previously passed straight through the battery's center and
    // z-fought with it depending on viewing angle.
    const harnessCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.7, 0.6),
      new THREE.Vector3(0, 0.5, 0.15),
      new THREE.Vector3(0, 0.5, -0.35),
      new THREE.Vector3(0, 0.5, -0.9),
      new THREE.Vector3(0, 0.46, -1.4),
    ]);
    const harness = new THREE.Mesh(new THREE.TubeGeometry(harnessCurve, 30, 0.017, 8, false), chassisMat());
    registerMesh("harness", harness);
    addGlow("harness", new THREE.Vector3(0, 0.5, -0.35), 0.45);
    partAnchors.harness = new THREE.Vector3(0.3, 0.5, -0.9);
    partAnchors.shell = new THREE.Vector3(0.95, 0.95, 0);

    // Crash guards — front & rear bumper reinforcement beams (composites application)
    [2.0, -2.05].forEach((zPos) => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.08), chassisMat());
      beam.position.set(0, 0.38, zPos);
      registerMesh("crashguard", beam);
      [-0.55, 0.55].forEach((x) => {
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.16), chassisMat());
        bracket.position.set(x, 0.38, zPos - Math.sign(zPos) * 0.1);
        registerMesh("crashguard", bracket);
      });
    });
    partAnchors.crashguard = new THREE.Vector3(0.6, 0.4, 2.0);

    // --- Camera framing ---
    camera.position.set(4.0, 2.0, 5.2);
    controls.target.set(0, 0.6, 0);
    controls.update();

    // --- Technical-drawing-style leader-line labels for whichever parts are highlighted ---
    const svgNS = "http://www.w3.org/2000/svg";
    const overlaySvg = document.createElementNS(svgNS, "svg");
    overlaySvg.setAttribute("style", "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;");
    mount.appendChild(overlaySvg);

    const labelEls = {};
    Object.keys(partAnchors).forEach((key) => {
      const g = document.createElementNS(svgNS, "g");
      g.style.opacity = "0";
      g.style.transition = "opacity 0.35s ease";

      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("stroke", "#4FA8FF");
      line.setAttribute("stroke-width", "1.3");
      g.appendChild(line);

      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("r", "3");
      dot.setAttribute("fill", "#4FA8FF");
      g.appendChild(dot);

      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("rx", "4");
      rect.setAttribute("fill", "rgba(8,11,18,0.88)");
      rect.setAttribute("stroke", "rgba(79,168,255,0.45)");
      rect.setAttribute("stroke-width", "1");
      g.appendChild(rect);

      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("fill", "#F2F5FA");
      text.setAttribute("font-size", "11.5");
      text.setAttribute("font-family", FONT_SANS);
      text.setAttribute("dominant-baseline", "middle");
      text.textContent = PART_LABELS[key] || key;
      g.appendChild(text);

      overlaySvg.appendChild(g);
      labelEls[key] = { g, line, dot, rect, text };
    });

    // Shifts the rendered car left/right within the SAME canvas bounds (no DOM movement,
    // so nothing for the page's overflow:hidden to clip — unlike the old CSS-transform
    // approach, which physically moved the canvas element and got cut off at the edge).
    const VIEW_MARGIN = 200;
    function applyViewOffset() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      const v = stateRef.current.view;
      const isXray = v === "projects" || v === "experience";
      const shiftPx = isXray || v === "home" ? 130 : 0;
      const fullW = w + VIEW_MARGIN * 2;
      const x = VIEW_MARGIN - shiftPx;
      camera.setViewOffset(fullW, h, x, 0, w, h);
      camera.updateProjectionMatrix();
    }

    function resize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      renderer.setSize(w, h);
      applyViewOffset();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let rafId;
    const clock = new THREE.Clock();
    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      controls.update();
      applyViewOffset();

      const currentView = stateRef.current.view;
      const isXray = currentView === "projects" || currentView === "experience";
      const sel = stateRef.current.selectedId;
      const activeList = currentView === "projects" ? PROJECTS : currentView === "experience" ? EXPERIENCE : [];
      const activeItem = activeList.find((s) => s.id === sel);

      const isDialogOpen = ["about", "freelance", "literature", "working", "case-study", "deepdive"].includes(currentView);
      const glowTarget = isDialogOpen ? 0 : 1;
      glowBackdropMat.opacity += (glowTarget - glowBackdropMat.opacity) * 0.08;

      const shellActive = isXray && !!activeItem && activeItem.parts.includes("shell");

      if (bodyMat) {
        let targetOpacity, targetColor;
        if (!isXray) {
          targetOpacity = 1;
          targetColor = PAINT_HEX;
        } else if (shellActive) {
          targetOpacity = 0.85;
          targetColor = ACCENT_HEX;
        } else if (sel) {
          targetOpacity = 0.05;
          targetColor = STRUCT_HEX;
        } else {
          targetOpacity = 0.14;
          targetColor = STRUCT_HEX;
        }
        const targetMetal = isXray ? 0.35 : 0.5;
        bodyMat.opacity += (targetOpacity - bodyMat.opacity) * 0.06;
        bodyMat.color.lerp(new THREE.Color(targetColor), 0.06);
        bodyMat.metalness += (targetMetal - bodyMat.metalness) * 0.06;
        bodyMat.depthWrite = bodyMat.opacity > 0.5;
        if (bodyMat.emissive) {
          bodyMat.emissive.lerp(new THREE.Color(shellActive ? ACCENT_HEX : 0x000000), 0.06);
          bodyMat.emissiveIntensity = shellActive ? 0.4 + Math.sin(t * 3) * 0.1 : 0;
        }
      }

      shellMaterials.forEach(({ mat, homeOpacity, isBodyPanel }) => {
        let target;
        if (!isXray) target = homeOpacity;
        else if (shellActive && isBodyPanel) target = Math.max(homeOpacity, 0.7);
        else if (sel) target = homeOpacity * 0.05;
        else target = homeOpacity * 0.3;
        mat.opacity += (target - mat.opacity) * 0.06;
        mat.depthWrite = mat.opacity > 0.5;
      });

      Object.entries(registry).forEach(([k, entry]) => {
        const isActive = !!activeItem && activeItem.parts.includes(k);
        entry.meshes.forEach((mesh) => {
          let targetOpacity;
          if (!isXray) targetOpacity = 0;
          else if (!sel) targetOpacity = 0.55;
          else targetOpacity = isActive ? 0.95 : 0.05;
          mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.08;

          const targetColor = new THREE.Color(isXray && sel && isActive ? ACCENT_HEX : STRUCT_HEX);
          mesh.material.color.lerp(targetColor, 0.08);

          if (mesh.material.emissive) {
            const emissiveTarget = isXray && sel && isActive ? new THREE.Color(ACCENT_HEX) : new THREE.Color(0x000000);
            mesh.material.emissive.lerp(emissiveTarget, 0.08);
            mesh.material.emissiveIntensity = isXray && sel && isActive ? 0.7 + Math.sin(t * 3) * 0.15 : 0;
          }
        });
      });

      Object.entries(glowSprites).forEach(([k, sprite]) => {
        const isActive = isXray && !!activeItem && activeItem.parts.includes(k);
        const targetOp = isActive ? 0.5 + Math.sin(t * 3) * 0.15 : 0;
        sprite.material.opacity += (targetOp - sprite.material.opacity) * 0.08;
      });

      // Position the leader-line callouts for whichever parts belong to the active selection
      const mw = mount.clientWidth;
      const mh = mount.clientHeight;
      Object.entries(partAnchors).forEach(([key, anchor]) => {
        const el = labelEls[key];
        if (!el) return;
        const isActive = isXray && !!activeItem && activeItem.parts.includes(key);
        if (!isActive) {
          el.g.style.opacity = "0";
          return;
        }
        const projected = anchor.clone().project(camera);
        if (projected.z > 1) {
          el.g.style.opacity = "0";
          return;
        }
        const sx = (projected.x * 0.5 + 0.5) * mw;
        const sy = (-projected.y * 0.5 + 0.5) * mh;
        const posIndex = activeItem.parts.indexOf(key);
        const dirY = posIndex % 2 === 0 ? -1 : 1;
        const boxX = sx + 55;
        const boxY = sy + 45 * dirY - 12;
        const label = PART_LABELS[key] || key;
        const boxW = Math.max(70, label.length * 6.4 + 16);
        const boxH = 24;

        el.line.setAttribute("x1", sx);
        el.line.setAttribute("y1", sy);
        el.line.setAttribute("x2", boxX);
        el.line.setAttribute("y2", boxY + boxH / 2);
        el.dot.setAttribute("cx", sx);
        el.dot.setAttribute("cy", sy);
        el.rect.setAttribute("x", boxX);
        el.rect.setAttribute("y", boxY);
        el.rect.setAttribute("width", boxW);
        el.rect.setAttribute("height", boxH);
        el.text.setAttribute("x", boxX + 8);
        el.text.setAttribute("y", boxY + boxH / 2 + 1);
        el.g.style.opacity = "1";
      });

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      mount.removeChild(renderer.domElement);
      mount.removeChild(overlaySvg);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  const isHome = view === "home";
  const isAbout = view === "about";
  const isFreelance = view === "freelance";
  const isLiterature = view === "literature";
  const isWorking = view === "working";
  const isDeepDive = view === "deepdive";
  const isCaseStudy = view === "case-study";
  const isSimplePage = isAbout || isFreelance || isLiterature || isWorking;
  const isXrayView = view === "projects" || view === "experience";

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.textPrimary, fontFamily: FONT_SANS, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        * { box-sizing: border-box; }
        .nav-btn {
          display: flex; align-items: center; gap: 12px; width: 100%;
          padding: 14px 18px; background: transparent; border: none;
          border-radius: 10px; color: ${COLORS.textPrimary}; font-size: 15px;
          font-family: ${FONT_SANS}; text-align: left; cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .nav-btn:hover { background: ${COLORS.accentSoft}; transform: translateX(2px); }
        .sys-btn {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 11px 14px; background: transparent; border: none;
          border-left: 2px solid transparent; color: ${COLORS.textMuted};
          font-family: ${FONT_SANS}; font-size: 14px; text-align: left;
          cursor: pointer; transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .sys-btn:hover { color: ${COLORS.textPrimary}; background: rgba(255,255,255,0.03); }
        .sys-btn.active { color: ${COLORS.accent}; border-left-color: ${COLORS.accent}; background: ${COLORS.accentSoft}; }
        .contact-link { color: ${COLORS.textMuted}; transition: color 0.2s ease; display: inline-flex; }
        .contact-link:hover { color: ${COLORS.accent}; }
        .back-btn {
          display: flex; align-items: center; gap: 8px; background: ${COLORS.panelGlass};
          border: 1px solid ${COLORS.panelBorder}; color: ${COLORS.textPrimary}; font-size: 13px;
          padding: 8px 14px; border-radius: 999px; cursor: pointer; backdrop-filter: blur(8px);
          transition: background 0.2s ease;
        }
        .back-btn:hover { background: ${COLORS.accentSoft}; }
        .glass-panel {
          background: ${COLORS.panelGlass}; border: 1px solid ${COLORS.panelBorder};
          backdrop-filter: blur(14px); border-radius: 16px;
        }
        .canvas-mount { width: 100%; height: 100%; touch-action: none; }
        @keyframes genieOpen {
          0% { transform: scale(0.82) translateY(36px); opacity: 0; }
          60% { transform: scale(1.015) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .dialog-window {
          position: absolute;
          top: 104px; left: 40px; right: 40px; bottom: 32px;
          border-radius: 20px;
          background: ${COLORS.panelGlass};
          border: 1px solid ${COLORS.panelBorder};
          backdrop-filter: blur(14px);
          overflow-y: auto;
          box-shadow: 0 24px 70px rgba(0,0,0,0.55);
          animation: genieOpen 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @media (max-width: 780px) {
          .home-panel { position: static !important; margin: 20px; width: auto !important; }
          .dialog-window { left: 12px; right: 12px; top: 96px; bottom: 12px; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: COLORS.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: loading || !minSplashDone ? 1 : 0,
          pointerEvents: loading || !minSplashDone ? "auto" : "none",
          transition: "opacity 1s ease",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 400, color: COLORS.textPrimary, fontFamily: "'Great Vibes', cursive" }}>hello</div>
      </div>

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "20px 28px", position: "relative", zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {!isHome && (
            <button className="back-btn" onClick={isCaseStudy ? backFromCaseStudy : isDeepDive ? () => setView("working") : goHome}>
              <ArrowLeft size={14} /> {isCaseStudy ? (caseStudyOrigin === "projects" ? "Projects" : "Experience") : isDeepDive ? "What I'm Working On" : "Home"}
            </button>
          )}
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "0.01em" }}>Vishnu Sai Sharan Ankathi</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>Mechanical Engineer — M.S. USC</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 13, color: COLORS.textMuted }}>
          <a className="contact-link" href="mailto:vishnusaisharan.a@gmail.com" title="vishnusaisharan.a@gmail.com">
            <Mail size={18} />
          </a>
          <a className="contact-link" href="https://linkedin.com/in/sharan-ankathi" title="linkedin.com/in/sharan-ankathi" target="_blank" rel="noreferrer">
            <Linkedin size={18} />
          </a>
          <a className="contact-link" href="https://github.com/sharanankathi" title="github.com/sharanankathi" target="_blank" rel="noreferrer">
            <Github size={18} />
          </a>
        </div>
      </header>

      <div
        style={{
          position: "absolute",
          inset: 0,
          top: 0,
          transform: `translateY(${isXrayView && selected ? -90 : 0}px)`,
          transition: "transform 0.4s ease",
        }}
      >
        <div ref={mountRef} className="canvas-mount" style={{ width: "100%", height: "100%" }} />
        {loading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted, fontSize: 13 }}>
            Loading model…
          </div>
        )}
        {loadError && (
          <div
            style={{
              position: "absolute",
              top: 90,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(200,50,50,0.15)",
              border: "1px solid rgba(255,100,100,0.4)",
              color: "#ffb3b3",
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 12,
              maxWidth: 500,
              zIndex: 10,
            }}
          >
            {loadError}
          </div>
        )}
      </div>

      {isHome && (
        <div className="glass-panel home-panel" style={{ position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)", width: 260, padding: 14, zIndex: 4 }}>
          <button className="nav-btn" onClick={() => openSection("experience")}>
            <Briefcase size={18} /> Experience
          </button>
          <button className="nav-btn" onClick={() => openSection("projects")}>
            <FolderKanban size={18} /> Projects
          </button>
          <button className="nav-btn" onClick={() => openSection("freelance")}>
            <Laptop size={18} /> Freelance Projects
          </button>
          <button className="nav-btn" onClick={() => openSection("literature")}>
            <BookOpen size={18} /> Literature Survey
          </button>
          <button className="nav-btn" onClick={() => openSection("working")}>
            <Lightbulb size={18} /> What I'm Working On
          </button>
          <button className="nav-btn" onClick={() => openSection("about")}>
            <User size={18} /> About Me
          </button>
        </div>
      )}

      {isHome && (
        <div
          style={{
            position: "absolute",
            bottom: 46,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 11,
            color: COLORS.accent,
            padding: "0 40px",
            zIndex: 4,
          }}
        >
          🚧 Still working on this website — more content going up regularly
        </div>
      )}

      {isHome && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 12,
            color: COLORS.textMuted,
            fontStyle: "italic",
            padding: "0 40px",
            zIndex: 4,
          }}
        >
          This car maps my engineering work — composites, thermal, structural, and electronics — onto the systems of a real vehicle, showing how it translates to automotive and mechanical engineering roles.
        </div>
      )}

      {isAbout && (
        <div className="dialog-window" style={{ zIndex: 6 }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 28px 80px" }}>
            <h1 style={{ margin: "0 0 20px", fontSize: 28, fontWeight: 700 }}>About Me</h1>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 32px", maxWidth: 700 }}>
              I am a graduate Mechanical Engineering student at the University of Southern California with a strong foundation in CAD design,
              FEA/CFD simulation, and hands-on fabrication. My experience spans from designing and fabricating hydrogen fuel cell vehicles and
              composite structures to performing advanced thermal–structural simulations of electronic chip packages. I combine practical
              manufacturing skills — including welding, machining, 3D printing, and composite layups — with high-level analysis using ANSYS,
              Abaqus, and CATIA. My projects demonstrate an ability to take concepts from modeling to real-world validation, balancing innovation
              with manufacturability. I am particularly passionate about thermal management, structural optimization, and automotive
              applications, and I aim to bring a design-to-validation mindset to industry challenges.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px", color: PAPER.textPrimary }}>Skills</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[
                { label: "CAD", value: "Siemens NX, SolidWorks, CATIA V5, Fusion 360" },
                { label: "Simulation", value: "Abaqus, ANSYS Workbench, Mechanical, Icepak" },
                { label: "Fabrication", value: "CNC machining, welding, 3D printing, hand layup, vacuum infusion, hand tools" },
              ].map((s) => (
                <div key={s.label} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${PAPER.panelBorder}`, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: PAPER.accent, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: PAPER.textMuted, lineHeight: 1.5 }}>{s.value}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px", color: PAPER.textPrimary }}>Core Strengths</h2>
            <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: 14, lineHeight: 1.8, color: PAPER.textMuted }}>
              <li>CAD-driven vehicle design (chassis, suspension, composite bodywork)</li>
              <li>Multiphysics thermal-structural simulation of electronic packages</li>
              <li>Hands-on composites fabrication and vehicle assembly</li>
            </ul>
          </div>
        </div>
      )}

      {isFreelance && (
        <div className="dialog-window" style={{ zIndex: 6 }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 28px 80px" }}>
            <h1 style={{ margin: "0 0 28px", fontSize: 28, fontWeight: 700 }}>Freelance Projects</h1>
            {FREELANCE_PROJECTS.map((p) => (
              <div key={p.id} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: `1px solid ${PAPER.panelBorder}` }}>
                <h2 style={{ fontSize: 19, fontWeight: 600, margin: "0 0 6px", color: PAPER.textPrimary }}>{p.title}</h2>
                <div style={{ fontSize: 13, color: PAPER.accent, marginBottom: 10 }}>{p.goal}</div>
                <ul style={{ margin: "0 0 16px", padding: "0 0 0 18px", fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted }}>
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {p.images.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {p.images.map((img) => (
                      <div
                        key={img.src}
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          border: `1px solid ${PAPER.panelBorder}`,
                          maxWidth: img.large ? "100%" : 320,
                          width: img.large ? "100%" : "auto",
                        }}
                      >
                        <img src={img.src} alt={img.caption} style={{ width: "100%", height: "auto", display: "block" }} />
                        <div style={{ fontSize: 11, color: PAPER.textMuted, padding: "8px 10px", background: "rgba(255,255,255,0.03)" }}>{img.caption}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isLiterature && (
        <div className="dialog-window" style={{ zIndex: 6 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 28px 80px" }}>
            <div style={{ fontSize: 12, color: PAPER.accent, fontFamily: FONT_MONO, marginBottom: 6 }}>
              Internship Report · VNR VJIET, Hyderabad · 2021–2022
            </div>
            <h1 style={{ margin: "0 0 24px", fontSize: 26, fontWeight: 700 }}>Study of Thermal Barrier Coatings on Piston of I.C. Engine</h1>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>Abstract</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              High temperatures in an I.C. engine drive thermal stress in the piston, reducing both its life and the engine's efficiency.
              Thermal barrier coatings (TBCs) act as insulating layers that reduce this heat loss. Materials like 7–8% yttria-stabilized
              zirconia (YSZ), mullite, Al₂O₃, AlSi, and NiCrAl all improve efficiency, cut specific fuel consumption, and reduce CO/HC
              emissions when applied to the piston head, cylinder liner, and valve seats. Of these, YSZ and zirconium oxide (ZrO₂) showed
              the best experimental results.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>Objectives</h2>
            <ul style={{ margin: "0 0 28px", padding: "0 0 0 18px", fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted }}>
              <li>Understand piston coating techniques</li>
              <li>Analyze heat and flux distribution on the piston crown before and after coating</li>
              <li>Analyze the effect of TBCs on specific fuel consumption and engine efficiency</li>
            </ul>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>Key Literature Findings</h2>
            <ul style={{ margin: "0 0 28px", padding: "0 0 0 18px", fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted }}>
              <li>Sivakumar & Senthilkumar: YSZ coating on the piston crown cut brake-specific fuel consumption up to 28.3%, HC emissions up to 35.2%, and CO emissions up to 2.72%</li>
              <li>Nittesh Mittal: NiCrAl + ZrO₂ coating on cylinder head and valves raised brake thermal efficiency by up to 7.4%</li>
              <li>Kamo: 100µm YSZ on piston/cylinder plus 500µm YSZ on the cylinder liner improved fuel efficiency 5–6%</li>
              <li>Buyukkaya: combining TBC with injection-timing changes achieved a 1–8% reduction in brake-specific fuel consumption</li>
            </ul>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 14px", color: PAPER.textPrimary }}>Methodology</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
              <p style={{ flex: "1 1 320px", fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: 0 }}>
                Modeled the piston in SolidWorks, then ran a coupled thermal analysis in ANSYS 15.1 with and without a YSZ coating at
                varying thickness — 600°C on the piston crown, convective cooling on the remaining surface (film coefficient 0.0002
                W/mm²·°C), 29°C ambient. A parallel physical test compared four pistons coated with ZrO₂ and TiO₂ (via plasma spray)
                against an uncoated aluminum-alloy baseline, run on a 2-stroke single-cylinder air-cooled petrol engine from 1000–4500
                rpm.
              </p>
              <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { src: "/images/literature/ansys-temp-02mm.jpg", caption: "ANSYS temperature distribution, 0.2mm coating" },
                  { src: "/images/literature/ansys-temp-04mm.jpg", caption: "ANSYS temperature distribution, 0.4mm coating" },
                  { src: "/images/literature/ansys-heatflux-uncoated.jpg", caption: "Heat flux, uncoated piston" },
                ].map((img) => (
                  <div key={img.src} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${PAPER.panelBorder}` }}>
                    <div style={{ height: 130, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={img.src} alt={img.caption} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                    </div>
                    <div style={{ fontSize: 10.5, color: PAPER.textMuted, padding: "6px 8px", background: "rgba(255,255,255,0.03)" }}>{img.caption}</div>
                  </div>
                ))}
              </div>
            </div>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 14px", color: PAPER.textPrimary }}>Results & Conclusion</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              <p style={{ flex: "1 1 320px", fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: 0 }}>
                As coating thickness increased, piston crown temperature and heat flux both dropped relative to the uncoated case —
                meaning less heat lost through the piston and more energy available to the engine. Between the two coatings tested, ZrO₂
                outperformed TiO₂, giving a 1–2% efficiency edge and better fuel consumption. Specific fuel consumption dropped roughly
                1% for both coated cases relative to the uncoated aluminum-alloy piston. Plasma spray coating was identified as the most
                widely used deposition technique for automotive TBC applications.
              </p>
              <div style={{ flex: "1 1 240px" }}>
                <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${PAPER.panelBorder}` }}>
                  <div style={{ height: 130, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                      src="/images/literature/me-vs-bp-graph.png"
                      alt="Mechanical efficiency vs. brake power"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                    />
                  </div>
                  <div style={{ fontSize: 10.5, color: PAPER.textMuted, padding: "6px 8px", background: "rgba(255,255,255,0.03)" }}>Mechanical efficiency vs. brake power</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isWorking && (
        <div className="dialog-window" style={{ zIndex: 6 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 28px 80px" }}>
            <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 700 }}>What I'm Working On</h1>
            <div style={{ fontSize: 14, color: PAPER.textMuted, marginBottom: 6 }}>
              Interested?{" "}
              <button
                onClick={() => setView("deepdive")}
                style={{ background: "none", border: "none", padding: 0, color: PAPER.accent, fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
              >
                Deep dive here
              </button>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: PAPER.accent, marginBottom: 20 }}>
              Hybrid marine-layer / seawater cooling for coastal data centers
            </div>

            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${PAPER.panelBorder}`, marginBottom: 24 }}>
              <img src="/images/working/hybrid-cooling-platform.jpg" alt="Hybrid cooling platform concept sketch" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>Why this research matters</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Data centers are running into a hard physical limit: cooling now accounts for roughly 40% of their total energy consumption, and
              as AI and cloud workloads push power density higher, that cooling burden is only growing. At the same time, land near major
              compute hubs is increasingly scarce, and freshwater-based cooling is coming under scrutiny as data centers compete with
              communities for water resources during droughts.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              The San Francisco Bay Area sits on a coastline with an unusual, underexploited advantage: a persistent marine-layer breeze that
              runs cool almost year-round, intensifying in summer exactly when cooling demand and grid strain peak elsewhere. Existing projects
              near the Bay — like Nautilus Data Technologies' water-cooled facilities — have already shown that ocean-adjacent siting is viable,
              but they rely on pumped seawater as the primary cooling mechanism. That leaves the region's free, self-regulating air resource
              almost entirely unused, and it means the pumping systems bear the full duty cycle, energy cost, and corrosion-driven structural
              wear on their own.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              This research is motivated by a specific, unanswered question: how much of that pumping burden can be offset by simply using the
              air that's already blowing past the site for free? No existing study models a hybrid system where marine-layer air handles the
              baseline cooling load and seawater pumping is reserved only for the residual gap — nor has anyone applied offshore oil-platform
              corrosion engineering to an above-water (not submerged, not barge-mounted) data center structure exposed to that same marine
              environment.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: 0 }}>
              The goal isn't to prove that ocean-adjacent data centers work — that's already been demonstrated. It's to quantify whether a
              smarter, hybrid approach to harnessing this specific coastline's climate can meaningfully reduce energy costs, water pumping
              volume, and structural degradation compared to the water-only model currently in use — and to do that with real climate data and
              engineering literature rather than assumption.
            </p>
          </div>
        </div>
      )}

      {isDeepDive && (
        <div className="dialog-window" style={{ zIndex: 6 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 28px 80px" }}>
            <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
              Hybrid Marine-Layer Air and Seawater-Pumped Cooling for an Above-Water Offshore Data Center in the San Francisco Bay Area
            </h1>
            <div style={{ fontSize: 14, fontStyle: "italic", color: PAPER.textMuted, marginBottom: 4 }}>A Feasibility Study and Conceptual Design Model</div>
            <div style={{ fontSize: 12, color: PAPER.accent, fontFamily: FONT_MONO, marginBottom: 28 }}>Working draft — conceptual design and feasibility modeling phase</div>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>Abstract</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              Data center cooling now accounts for roughly 40% of total facility energy consumption, and rising compute density and freshwater
              scarcity are pushing operators toward alternative cooling strategies sited near large, stable water bodies. This paper examines
              the feasibility of an above-water, pier- or platform-mounted data center sited along the San Francisco Bay coastline, cooled by a
              hybrid architecture: an indirect air-side economizer that uses the region's persistent marine-layer breeze as the primary
              (baseline) cooling resource, supplemented by pumped seawater through a secondary heat-exchanger loop only when ambient air alone
              cannot meet the target chilled-water supply temperature. Unlike existing Bay-adjacent water-cooled facilities (notably Nautilus
              Data Technologies' Stockton, CA installation, which pumps continuously), this hybrid design is intended to substantially reduce
              seawater pump duty cycle, and by extension pump energy consumption and seawater-loop corrosion exposure, while remaining within
              ASHRAE Class A2 thermal guidelines. Using three years of hourly climate reanalysis data and two years of measured San Francisco
              Bay water temperature, we construct a duty-cycle feasibility model, an energy/cost model referenced to a 1 MW facility, and a
              corrosion/maintenance cost model that separates fixed, site-driven structural protection (splash-zone corrosion on platform legs,
              which is largely design-independent) from variable, duty-cycle-dependent seawater-loop maintenance. Results indicate that a
              design targeting a 21°C chilled-water supply with a 3°C heat-exchanger approach allows air alone to satisfy cooling demand for
              approximately 91% of annual hours, with seawater covering an additional 6%, at an estimated 84% reduction in annual cooling
              energy cost relative to a conventional mechanical-chiller baseline. A duty-cycle-scaled corrosion model, grounded in offshore
              oil-and-gas corrosion engineering literature, suggests seawater-loop maintenance cost reductions of 66–94% relative to a
              continuously-pumped baseline, depending on whether a linear or literature-informed nonlinear ("floor") decay model is applied. We
              identify the joint modeling of hybrid air/seawater duty cycling and corrosion cost as a genuine, unaddressed gap in the
              literature, and outline the assumptions, data limitations, and next steps — including empirical validation and expert
              consultation — required before this concept could inform an actual engineering design.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>1. Introduction and Motivation</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Cooling accounts for approximately 40% of total data center energy consumption, and this burden is intensifying as AI and cloud
              workloads push power density higher. At the same time, land near major compute hubs is increasingly scarce, and freshwater-based
              cooling is under growing scrutiny as data centers compete with surrounding communities for water resources during drought
              periods.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              The San Francisco Bay Area coastline offers a climate resource that is, at present, largely unexploited by existing water-cooled
              facilities in the region: a persistent marine-layer breeze that keeps coastal air relatively cool and stable across much of the
              year. Nautilus Data Technologies has already demonstrated that ocean- and river-adjacent siting is commercially viable in this
              region — its Stockton, CA barge-mounted facility has operated since 2021 — but that design, and its earlier, rejected Alameda
              pier proposal, rely on continuous or near-continuous pumped-water cooling as the primary mechanism. This leaves the marine-layer
              air resource unused and places the full energy, mechanical, and corrosion burden on the pumping system.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              This research is motivated by a specific, unanswered question: how much of that pumping burden can be offset by using the air
              that is already moving past the site, at no marginal fuel cost? We propose and evaluate a hybrid design in which marine-layer
              air, drawn through an indirect economizer, handles baseline cooling load, and pumped seawater is reserved for the residual gap —
              with the structure itself sited above the water on a pier or platform, rather than submerged or barge-mounted. A secondary
              contribution of this work is the cross-application of offshore oil-and-gas corrosion engineering — splash-zone protection,
              cathodic protection design life, and glass-fiber-reinforced-polymer (GFRP) composite substitution — to this above-water data
              center context, an area with no direct precedent in the published literature.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              The objective of this paper is not to demonstrate that ocean-adjacent data centers are viable — that has already been shown —
              but to quantify whether a hybrid, duty-cycle-reducing approach measurably improves on the existing water-only model, using real
              climate and engineering data rather than assumption.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>2. Literature Review and Positioning of Novelty</h2>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>2.1 Free-air and economizer cooling</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Free-air and economizer cooling are mature, deployed data center strategies. Meta's air-cooled facility in Prineville, Oregon,
              reports a Power Usage Effectiveness (PUE) of approximately 1.07, compared to an industry average nearer 1.55. Indirect air-side
              economizers, in which outside air cools a closed water or refrigerant loop through a heat exchanger without directly contacting
              IT equipment, avoid the humidity and particulate exposure risks of direct free-air cooling and are the architecture adopted in
              this study.
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>2.2 Water-cooled and marine-adjacent data centers</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Nautilus Data Technologies operates a barge-mounted, water-cooled facility at the Port of Stockton, California (approximately 6.5
              MW critical IT load, a company-reported PUE of 1.15, and a primary/secondary heat-exchanger loop drawing roughly 4,500 GPM — up
              to 12,000 GPM installed capacity — from the San Joaquin River). Nautilus separately proposed, but did not build, a pier-mounted
              facility at Alameda Point on San Francisco Bay, which would have drawn and discharged approximately 10,000 GPM continuously;
              this proposal was unanimously rejected by the Alameda City Council in 2019 following environmental objections centered on
              continuous thermal discharge and marine-life entrainment risk. These cases establish that water-cooled, Bay-adjacent data
              centers are technically and (in Stockton's case) commercially viable, but also that continuous, once-through seawater use faces
              a real regulatory ceiling in this specific region.
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>2.3 Offshore corrosion engineering</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              The offshore oil-and-gas industry provides an extensive, quantitative literature on marine corrosion that has not previously been
              applied to above-water data center structures. Corrosion protection systems have been estimated to represent up to 10% of total
              platform capital investment (Hanson & Hurst, 1969), and corrosion-related maintenance has been estimated at 25–40% of operating
              costs industry-wide. Splash-zone protection is disproportionately expensive relative to atmospheric or submerged zones — on the
              order of 10 times the cost per unit area of atmospheric coatings, and potentially up to 50 times the initial application cost
              when offshore access and maintenance are included. Cathodic protection systems are conventionally designed, per DNV-RP-B401, to
              match the full structural design life of 20–40 years. Glass-fiber-reinforced-polymer (GFRP) composites have been shown, in at
              least one peer-reviewed offshore topside life-cycle cost analysis, to reduce structural life-cycle cost by up to 26% over 50
              years by eliminating most corrosion-related maintenance.
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>2.4 The gap this paper addresses</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              No identified source models a hybrid marine-layer-air and seawater-pumped cooling architecture in which air handles baseline load
              and water covers only the residual gap. Separately, while a body of physical evidence (notably Melchers' bi-modal corrosion model
              and intermittent-wetting studies of carbon steel) demonstrates that corrosion behavior under intermittent or cyclical wetting
              differs meaningfully from continuous immersion, no published cost model expresses corrosion-related operating expenditure as an
              explicit function of pumping or wetting duty cycle. This paper's contribution is twofold: (1) a quantified hybrid cooling
              duty-cycle model for this specific coastal microclimate, and (2) a first-pass, duty-cycle-scaled corrosion/maintenance cost model
              that distinguishes fixed, site-driven structural protection from variable, design-dependent seawater-loop maintenance.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>3. Methodology and Data Sources</h2>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>3.1 Climate data</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Hourly air temperature, relative humidity, and dew point were obtained from the Open-Meteo historical reanalysis archive for a
              San Francisco Bay coastal coordinate (approximately 37.79°N, 122.41°W) for the period January 1, 2022 through December 31, 2024
              (26,304 hourly observations).
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>3.2 Seawater temperature data</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Hourly Bay water temperature was obtained from NOAA CO-OPS station 9414290 (San Francisco). Data were available from January
              2022 through mid-February 2024 (approximately 2.02 years after removing gaps), which constitutes the overlap period used for all
              combined air/water calculations. This is a data limitation: standard climate normals use 30-year records, and the
              water-temperature sensor gap after February 2024 should be revisited with updated data before any engineering design is
              finalized.
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>3.3 Thermal feasibility criteria</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 10px" }}>
              Two cooling architectures were evaluated against ASHRAE 2021 Thermal Guidelines for Data Processing Environments, Class A2:
            </p>
            <ul style={{ margin: "0 0 16px", padding: "0 0 0 18px", fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted }}>
              <li>
                Direct free-air cooling (outside air supplied directly to IT intake): evaluated against both the ASHRAE "recommended" envelope
                (18–27°C dry bulb, 5.5–15°C dew point, ≤60% relative humidity) and the wider "allowable A2" envelope (10–35°C dry bulb, −12 to
                21°C dew point, 8–80% relative humidity).
              </li>
              <li>
                Indirect economizer cooling (outside air or seawater cools a closed loop via heat exchanger, never contacting IT equipment
                directly): evaluated using dry-bulb temperature only, since humidity does not affect a closed loop. Feasibility is defined as
                ambient temperature (air or water) falling at or below the target chilled-water supply temperature minus a specified
                heat-exchanger approach temperature.
              </li>
            </ul>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              The indirect architecture was selected as the primary design basis for this study, both because it produced substantially more
              favorable feasibility results and because it avoids introducing corrosive, salt-laden marine air directly into the IT environment
              — a risk not present in the direct free-air configuration.
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>3.4 Reference facility scale</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              All energy and cost estimates are referenced to an illustrative 1 MW critical IT load facility, using a U.S. average industrial
              electricity price of $0.125/kWh and 8,760 annual operating hours. This scale was chosen for tractability and rough comparability
              with the lower end of Nautilus's reported Stockton capacity range; it does not represent a specific proposed facility size.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>4. Climate Feasibility Model and Results</h2>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>4.1 Direct free-air cooling</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Direct free-air cooling, evaluated against the full ASHRAE Class A2 envelope, performed poorly: only 7.6% of hours annually fell
              within the "recommended" envelope, and 40.0% within the wider "allowable" envelope. Average outside air temperature over the
              study period was a mild 13.5°C, but average relative humidity was 78.7%, driven by the region's persistent marine-layer fog.
              Temperature is rarely the limiting factor in this climate; humidity is. This result argues against a direct free-air architecture
              for this site and motivated the shift to an indirect economizer model.
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>4.2 Indirect economizer: air and seawater compared</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Because an indirect loop is insensitive to humidity, feasibility improves substantially. At a 21°C target supply temperature,
              outside air alone is below the required threshold (accounting for heat-exchanger approach) between 79.4% (5°C approach) and
              91.4% (3°C approach) of annual hours.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              A counterintuitive finding emerged when Bay water temperature was incorporated: summer, not winter, is the weakest season for
              this hybrid system. In the 18°C-supply/5°C-approach configuration, the fraction of hours where neither air nor seawater meets the
              target reaches 99.9% in September. This occurs because immediate-coastal air temperature does not fall in summer the way the
              marine-layer literature's emphasis on summer breeze intensity might suggest — that intensification is driven by the temperature
              contrast pulling air toward the coast, not by the absolute coastal temperature itself becoming colder — and because Bay water
              also warms somewhat in summer due to reduced tidal mixing and upwelling influence in the inner Bay. This finding should be
              treated as a genuine result of the model rather than a confirmation of the initial hypothesis, and it materially affects the
              recommended design point below.
            </p>

            <div style={{ fontSize: 12, fontStyle: "italic", color: PAPER.textMuted, margin: "0 0 8px" }}>
              Table 1. Hybrid cooling duty cycle across three design points (percentage of annual hours), 2022–2024 overlap period.
            </div>
            <div style={{ overflowX: "auto", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${PAPER.panelBorder}` }}>
                    {["Design point", "Air alone sufficient", "Seawater fills gap", "Neither (needs mechanical backup)"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: PAPER.textPrimary, fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["18°C supply / 5°C approach", "48.8%", "3.4%", "47.8%"],
                    ["21°C supply / 5°C approach", "79.4%", "5.1%", "15.5%"],
                    ["21°C supply / 3°C approach (recommended)", "91.4%", "6.0%", "2.6%"],
                  ].map((row) => (
                    <tr key={row[0]} style={{ borderBottom: `1px solid ${PAPER.panelBorder}` }}>
                      {row.map((cell, i) => (
                        <td key={i} style={{ padding: "8px 10px", color: i === 0 ? PAPER.textPrimary : PAPER.textMuted }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              The 21°C supply / 3°C approach configuration is recommended as the primary design point for this study. A 21°C chilled-water
              supply is compatible with ASHRAE Class A2-rated servers' allowable intake range, and a 3°C approach temperature, while tighter
              (and therefore requiring a larger or more effective heat exchanger) than the 5°C case, is achievable with well-designed
              dry-cooler or plate heat-exchanger equipment. This configuration reduces the fraction of hours requiring conventional mechanical
              chiller backup to 2.6% annually, concentrated in the summer months.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>5. Energy and Cost Model</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Annual cooling-related energy overhead was estimated by weighting three published or industry-benchmark PUE-overhead figures by
              the duty-cycle fractions in Table 1: an air-side economizer overhead of 8% (consistent with Prineville-class facilities), a
              water-side/seawater economizer overhead of 4% (pump energy only, no compressor), and a conventional mechanical chiller overhead
              of 55% (mid-range PUE of approximately 1.55, used as the baseline comparator).
            </p>

            <div style={{ fontSize: 12, fontStyle: "italic", color: PAPER.textMuted, margin: "0 0 8px" }}>
              Table 2. Estimated annual cooling energy cost, 1 MW reference facility, at $0.125/kWh.
            </div>
            <div style={{ overflowX: "auto", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${PAPER.panelBorder}` }}>
                    {["Design point", "Effective PUE", "Annual cooling cost", "Savings vs. mechanical-only"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: PAPER.textPrimary, fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["18°C supply / 5°C approach", "~1.30", "$332,000", "45%"],
                    ["21°C supply / 5°C approach", "~1.15", "$165,000", "73%"],
                    ["21°C supply / 3°C approach (recommended)", "~1.09", "$98,000", "84%"],
                  ].map((row) => (
                    <tr key={row[0]} style={{ borderBottom: `1px solid ${PAPER.panelBorder}` }}>
                      {row.map((cell, i) => (
                        <td key={i} style={{ padding: "8px 10px", color: i === 0 ? PAPER.textPrimary : PAPER.textMuted }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              For the recommended design, the seawater loop itself was sized using standard heat-transfer relations for the 1 MW reference
              load at a 10°C design delta-T, yielding a required flow of approximately 380 GPM and a pump power draw of approximately 3.35 kW
              at an assumed 10 m pumping head and 70% pump efficiency. Because the pump operates only during the 6.0% of hours when seawater
              is required, estimated annual pump energy cost is approximately $125, versus approximately $3,670 if the same pump ran
              continuously as in a water-only design. This order-of-magnitude comparison, not the absolute dollar figures (which depend on
              real equipment selection), is the paper's central energy claim: duty-cycle reduction, not seawater cooling itself, is the source
              of the efficiency gain relative to existing water-only facilities.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              These figures are illustrative engineering estimates based on published PUE benchmarks and standard heat-transfer equations, not
              a vendor quotation or first-principles thermal simulation, and should be treated as directional rather than precise.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>6. Structural and Corrosion Cost Model</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              A key methodological distinction, informed by offshore engineering literature, is that a platform's structural legs are wetted by
              tidal and wave action regardless of whether the cooling system's pump is operating. Splash-zone corrosion protection for the
              structure is therefore a fixed, site-driven cost, not a lever controlled by the hybrid cooling design. The seawater intake,
              piping, pump, and heat-exchanger surfaces, by contrast, are wetted in proportion to actual water flow and are the appropriate
              locus for a duty-cycle-dependent maintenance model.
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>6.1 Fixed structural splash-zone protection</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              For an illustrative four-legged platform substructure (0.5 m leg diameter, 2.0 m splash-zone height consistent with San Francisco
              Bay's tidal range), estimated splash-zone surface area totals approximately 12.6 m². Applying offshore-industry per-area cost
              benchmarks (inflation-adjusted to current dollars) yields an estimated capital cost of approximately $13,000–$13,200 for metallic
              (copper-nickel) sheathing, or approximately $1,200 for a conventional coating system alone (before adding the steel cost of the
              12 mm sacrificial corrosion allowance typically required alongside coatings, per offshore design guidance). This cost is
              materially independent of the cooling architecture and should not be counted toward the hybrid design's savings claim; it is
              presented here for completeness of the structural cost picture. GFRP composite substitution, which eliminates recurring
              coating/cathodic-protection maintenance, is noted as a promising but separately-justified structural choice, supported by a 2026
              peer-reviewed offshore topside life-cycle analysis reporting up to 26% life-cycle cost reduction over 50 years.
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>6.2 Duty-cycle-dependent seawater loop maintenance</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 10px" }}>
              For an illustrative $100,000 seawater loop equipment package (pump, piping, intake screen, heat exchanger) at the 1 MW reference
              scale, a baseline continuous-duty maintenance rate of 10% of capital cost per year ($10,000/year) was assumed, consistent with
              general marine equipment maintenance benchmarks for continuously wetted service. Two scaling models were applied to estimate
              maintenance cost at reduced duty cycle:
            </p>
            <ul style={{ margin: "0 0 16px", padding: "0 0 0 18px", fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted }}>
              <li>A linear model, in which maintenance cost scales directly with duty cycle fraction.</li>
              <li>
                A literature-informed "floor" model (cost = baseline × (0.30 + 0.70 × duty fraction)), reflecting evidence from Melchers'
                bi-modal corrosion model and intermittent-wetting studies that even brief or infrequent wetting cycles initiate corrosion
                processes disproportionate to exposure time, and that reduced immersion duration can also reduce cathodic protection
                polarization effectiveness in the tidal/splash band.
              </li>
            </ul>

            <div style={{ fontSize: 12, fontStyle: "italic", color: PAPER.textMuted, margin: "0 0 8px" }}>
              Table 3. Estimated annual seawater-loop maintenance cost by design point and scaling model.
            </div>
            <div style={{ overflowX: "auto", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${PAPER.panelBorder}` }}>
                    {["Design point", "Water duty cycle", "Linear model", "Floor model"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: PAPER.textPrimary, fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["18°C supply / 5°C approach", "3.4%", "$340", "$3,238"],
                    ["21°C supply / 5°C approach", "5.1%", "$510", "$3,357"],
                    ["21°C supply / 3°C approach (recommended)", "6.0%", "$600", "$3,420"],
                    ["Continuous / water-only baseline (Nautilus-style)", "100%", "$10,000", "$10,000"],
                  ].map((row) => (
                    <tr key={row[0]} style={{ borderBottom: `1px solid ${PAPER.panelBorder}` }}>
                      {row.map((cell, i) => (
                        <td key={i} style={{ padding: "8px 10px", color: i === 0 ? PAPER.textPrimary : PAPER.textMuted }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              For the recommended design point, the linear model implies a 94% reduction in seawater-loop maintenance cost relative to a
              continuously-pumped baseline; the more conservative, literature-informed floor model implies a 66% reduction ($6,580/year
              savings). The floor model is recommended as the primary reported figure, as it more faithfully reflects the nonlinear,
              threshold-sensitive nature of marine corrosion documented in the literature, while the linear model is retained as an
              upper-bound sensitivity case.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              Both the equipment capital cost ($100,000) and the baseline maintenance rate (10% of capex/year) are illustrative assumptions
              rather than vendor- or site-specific figures, and should be replaced with real quotations before this model is used for any
              engineering or investment decision.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>7. Discussion, Assumptions, and Limitations</h2>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>7.1 Summary of findings</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              Taken together, the models developed in this paper suggest that a hybrid, indirect-economizer cooling architecture — using
              marine-layer air for baseline cooling and pumped seawater only for the residual gap — is technically plausible for an
              above-water Bay Area data center, and offers meaningful, quantifiable advantages over a continuously water-cooled design in both
              energy cost (an estimated 84% reduction in cooling energy cost at the recommended design point relative to a mechanical-only
              baseline) and seawater-loop maintenance cost (an estimated 66–94% reduction relative to continuous pumping, depending on the
              corrosion scaling model applied).
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>7.2 Key assumptions requiring validation</h3>
            <ul style={{ margin: "0 0 16px", padding: "0 0 0 18px", fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted }}>
              <li>
                Climate and water-temperature data are drawn from a single representative coordinate and a single NOAA tide station, not the
                specific candidate site; a real site survey and longer climate record (ideally 30 years) would be needed before engineering
                design.
              </li>
              <li>
                Heat-exchanger approach temperatures (3–8°C) and target chilled-water supply temperatures (15–21°C) are engineering
                assumptions, not vendor-specified equipment performance; actual values depend on selected heat-exchanger hardware.
              </li>
              <li>
                PUE-overhead benchmarks for each cooling mode are drawn from published industry figures for comparable but not identical
                systems, and are used as reasonable proxies rather than site-specific measurements.
              </li>
              <li>
                The seawater-loop equipment cost and maintenance-rate assumptions underlying the corrosion model are illustrative; the
                qualitative distinction between fixed structural cost and duty-cycle-dependent loop maintenance is more defensible than the
                specific dollar figures.
              </li>
              <li>
                The corrosion "floor model" functional form is a reasonable first approximation grounded in qualitative literature findings,
                not a fitted or independently validated quantitative model; deriving or validating this function is itself a candidate area
                for further research, potentially in collaboration with a corrosion engineering researcher.
              </li>
            </ul>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px", color: PAPER.textPrimary }}>7.3 Regulatory context</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              The 2019 rejection of Nautilus's Alameda proposal centered on continuous, once-through thermal discharge and marine-life
              entrainment risk. Because the hybrid design proposed here engages seawater pumping for an estimated 3–6% of annual hours rather
              than continuously, it may present a substantially smaller environmental footprint on these specific dimensions — though this
              claim would need to be substantiated through a proper environmental review process, including entrainment modeling at actual
              (not averaged) flow rates and intake velocities, before it could be treated as a regulatory advantage rather than a hypothesis.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>8. Conclusion and Next Steps</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 16px" }}>
              This paper has developed a quantified, data-grounded case for a hybrid marine-layer-air and seawater-pumped cooling architecture
              for an above-water offshore data center in the San Francisco Bay Area, positioned relative to the existing Nautilus Data
              Technologies precedent and grounded in offshore corrosion engineering literature not previously applied to this context. The
              recommended design point — a 21°C chilled-water supply with a 3°C heat-exchanger approach — is estimated to meet cooling demand
              from air alone 91.4% of annual hours, with seawater covering an additional 6.0%, at an estimated 84% reduction in cooling energy
              cost and a 66–94% reduction in seawater-loop maintenance cost relative to continuously-pumped and mechanical-only baselines,
              respectively.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: PAPER.textMuted, margin: "0 0 28px" }}>
              Recommended next steps are, in order: (1) validate the climate and water-temperature model against a longer historical record
              and, if possible, site-specific measurements; (2) obtain real heat-exchanger and pump equipment specifications to replace the
              illustrative approach-temperature and cost assumptions used here; (3) develop or locate a more rigorously derived duty-cycle
              corrosion cost function, ideally in consultation with a corrosion or marine engineering researcher; and (4) engage with
              researchers in data center energy modeling, coastal or marine structural engineering, and HVAC free-cooling systems to review
              this feasibility model before any further engineering design or site-specific proposal is developed.
            </p>

            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: PAPER.textPrimary }}>References</h2>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: PAPER.textMuted, fontStyle: "italic", margin: 0 }}>
              Full citation list to be compiled in the required academic format — ASHRAE 2021 Thermal Guidelines for Data Processing
              Environments; Hanson & Hurst, OTC-1042 (1969); NACE International IMPACT Study (2016); DNV-RP-B401; Melchers, long-term marine
              corrosion modeling (2022, 2025); relevant Nautilus Data Technologies public materials and Alameda Point environmental review
              documents; Open-Meteo historical weather archive; NOAA CO-OPS station 9414290; and other sources identified during the
              literature review phase of this project.
            </p>
          </div>
        </div>
      )}

      {isXrayView && (
        <div className="glass-panel" style={{ position: "absolute", left: 24, top: 96, bottom: 24, width: 220, padding: "10px 0", zIndex: 4, overflowY: "auto" }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, padding: "8px 16px", letterSpacing: "0.03em", textTransform: "uppercase" }}>
            {view === "projects" ? "Projects" : "Experience"}
          </div>
          {list.map((s) => {
            const Icon = s.icon;
            const active = selectedId === s.id;
            return (
              <button key={s.id} className={`sys-btn${active ? " active" : ""}`} style={{ padding: "11px 16px" }} onClick={() => setSelectedId(active ? null : s.id)}>
                <Icon size={16} />
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      {isXrayView && selected && selected.relevantTo && (
        <div
          style={{
            position: "absolute",
            left: 264,
            right: 24,
            top: 96,
            zIndex: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "rgba(79,168,255,0.1)",
              border: `1px solid ${COLORS.accent}`,
              boxShadow: "0 0 24px rgba(79,168,255,0.25)",
              borderRadius: 12,
              padding: "14px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 8,
              maxWidth: 700,
            }}
          >
            <span style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              How this relates to industry
            </span>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 14px" }}>
              {selected.relevantTo.map((tag) => (
                <span key={tag} style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {isXrayView && selected && (
        <div className="glass-panel" style={{ position: "absolute", left: 24, right: 24, bottom: 24, padding: "20px 26px", zIndex: 4, maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: COLORS.textPrimary }}>{selected.title}</h2>
            <span style={{ fontSize: 12, color: COLORS.accent, fontFamily: FONT_MONO }}>{selected.source}</span>
          </div>
          {selected.context && (
            <div style={{ fontSize: 13, color: COLORS.textPrimary, opacity: 0.85, marginBottom: 4 }}>{selected.context}</div>
          )}
          {selected.parts.length > 0 && (
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 10, letterSpacing: "0.01em" }}>
              Highlighted on the car: <span style={{ color: COLORS.accent }}>{selected.parts.map((p) => PART_LABELS[p] || p).join("  ·  ")}</span>
            </div>
          )}
          <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.55, color: COLORS.textMuted, maxWidth: 680 }}>{selected.description}</p>
          {selected.images && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 16, maxWidth: 680 }}>
              {selected.images.map((img) => (
                <div key={img.src} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORS.panelBorder}` }}>
                  <img src={img.src} alt={img.caption} style={{ width: "100%", height: "auto", display: "block" }} />
                  <div style={{ fontSize: 10.5, color: COLORS.textMuted, padding: "6px 8px", background: "rgba(255,255,255,0.03)" }}>{img.caption}</div>
                </div>
              ))}
            </div>
          )}
          {selected.achievements && (
            <ul style={{ margin: "0 0 14px", padding: "0 0 0 18px", fontSize: 13, lineHeight: 1.7, color: COLORS.textMuted, maxWidth: 680 }}>
              {selected.achievements.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
          {selected.stats && (
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
              {selected.stats.map((st) => (
                <div key={st.label}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 16, color: COLORS.accent, fontWeight: 600 }}>{st.value}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{st.label}</div>
                </div>
              ))}
            </div>
          )}
          {selected.caseStudy && (
            <button
              onClick={() => openCaseStudy(selected.id)}
              style={{
                marginTop: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                color: COLORS.accent,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Know more <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      )}

      {isXrayView && !selected && (
        <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center", fontSize: 12, color: COLORS.textMuted, zIndex: 4 }}>
          Select an item on the left — drag to orbit, scroll to zoom
        </div>
      )}

      {isCaseStudy && caseStudyEntry && caseStudyEntry.caseStudy && (
        <div className="dialog-window" style={{ zIndex: 6 }}>
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 28px 80px" }}>
            <div style={{ fontSize: 12, color: PAPER.accent, fontFamily: FONT_MONO, marginBottom: 6 }}>{caseStudyEntry.source}</div>
            <h1 style={{ margin: "0 0 18px", fontSize: 28, fontWeight: 700 }}>{caseStudyEntry.title}</h1>

            {/* Impact statement — the headline result, up front */}
            <div
              style={{
                borderLeft: `3px solid ${PAPER.accent}`,
                paddingLeft: 16,
                margin: "0 0 32px",
                fontSize: 18,
                lineHeight: 1.5,
                fontWeight: 600,
                color: PAPER.textPrimary,
              }}
            >
              {caseStudyEntry.caseStudy.impact}
            </div>

            {/* Metrics band — the actual numbers, up front */}
            {caseStudyEntry.caseStudy.metrics && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: 14,
                  marginBottom: 28,
                  padding: "18px 20px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${PAPER.panelBorder}`,
                  borderRadius: 12,
                }}
              >
                {caseStudyEntry.caseStudy.metrics.map((m) => (
                  <div key={m.label}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: PAPER.accent }}>{m.value}</div>
                    <div style={{ fontSize: 11, color: PAPER.textMuted, marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tools used */}
            {caseStudyEntry.caseStudy.tools && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
                {caseStudyEntry.caseStudy.tools.map((tool) => (
                  <span
                    key={tool}
                    style={{
                      fontSize: 12,
                      color: PAPER.textMuted,
                      border: `1px solid ${PAPER.panelBorder}`,
                      borderRadius: 999,
                      padding: "4px 12px",
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}

            {/* The Challenge — Problem / Approach / Result */}
            {caseStudyEntry.caseStudy.challenge && (
              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 14px", color: PAPER.textPrimary }}>The Challenge</h2>
                <div
                  style={{
                    background: "rgba(79,168,255,0.06)",
                    border: `1px solid rgba(79,168,255,0.25)`,
                    borderRadius: 12,
                    padding: "18px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {[
                    { label: "Problem", text: caseStudyEntry.caseStudy.challenge.problem },
                    { label: "Approach", text: caseStudyEntry.caseStudy.challenge.approach },
                    { label: "Result", text: caseStudyEntry.caseStudy.challenge.result },
                  ].map((row) => (
                    <div key={row.label}>
                      <div style={{ fontSize: 10, color: PAPER.accent, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                        {row.label}
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: PAPER.textMuted }}>{row.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engineering process — numbered timeline */}
            {caseStudyEntry.caseStudy.process && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 14px", color: PAPER.textPrimary }}>Engineering Process</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {caseStudyEntry.caseStudy.process.map((step, i) => (
                    <div key={step.title} style={{ display: "flex", gap: 16, paddingBottom: i < caseStudyEntry.caseStudy.process.length - 1 ? 20 : 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: `1.5px solid ${PAPER.accent}`,
                            color: PAPER.accent,
                            fontSize: 12,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: FONT_MONO,
                          }}
                        >
                          {i + 1}
                        </div>
                        {i < caseStudyEntry.caseStudy.process.length - 1 && <div style={{ flex: 1, width: 1, background: PAPER.panelBorder, marginTop: 4 }} />}
                      </div>
                      <div style={{ paddingBottom: 4, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: PAPER.textPrimary, marginBottom: 4 }}>{step.title}</div>
                        <div style={{ fontSize: 13, lineHeight: 1.6, color: PAPER.textMuted, marginBottom: step.images ? 10 : 0 }}>{step.description}</div>
                        {step.images && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
                            {step.images.map((img) =>
                              img.src ? (
                                <div key={img.caption} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${PAPER.panelBorder}` }}>
                                  <img src={img.src} alt={img.caption} style={{ width: "100%", height: "auto", display: "block" }} />
                                  <div style={{ fontSize: 10.5, color: PAPER.textMuted, padding: "6px 8px", background: "rgba(255,255,255,0.03)" }}>{img.caption}</div>
                                </div>
                              ) : (
                                <div
                                  key={img.caption}
                                  style={{
                                    border: `1px dashed ${PAPER.panelBorder}`,
                                    borderRadius: 10,
                                    height: 110,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: PAPER.textMuted,
                                    fontSize: 11,
                                    textAlign: "center",
                                    padding: 10,
                                  }}
                                >
                                  {img.caption}
                                  <br />
                                  (coming soon)
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
