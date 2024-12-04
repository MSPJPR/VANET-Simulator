// Select DOM elements
const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');
const metricsDisplay = document.getElementById('metrics');
const startButton = document.getElementById('start-simulation');
const threeJsContainer = document.getElementById('threejs-container');

// Canvas dimensions
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Simulation variables
let vehicles = [];
let messagesSent = 0;
let totalLatency = 0;
let energyConsumed = 0;

// Initialize 3D Scene (Three.js)
let scene, camera, renderer;
function initialize3DVisualization() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    threeJsContainer.offsetWidth / threeJsContainer.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(
    threeJsContainer.offsetWidth,
    threeJsContainer.offsetHeight
  );
  threeJsContainer.appendChild(renderer.domElement);

  // Add a grid
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);

  // Add lighting
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(5, 5, 5);
  scene.add(light);
}

// Add a 3D Vehicle
function add3DVehicle(x, y) {
  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshBasicMaterial({ color: 0x3498db });
  const vehicle = new THREE.Mesh(geometry, material);
  vehicle.position.set(x, 0, y);
  scene.add(vehicle);
  return vehicle;
}

// Generate Vehicles
function generateVehicles(count) {
  vehicles = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    // Add to 2D simulation
    vehicles.push({ x, y, dx: Math.random() - 0.5, dy: Math.random() - 0.5 });

    // Add to 3D simulation
    add3DVehicle((x / canvas.width) * 10 - 5, (y / canvas.height) * 10 - 5);
  }
}

// Update Vehicles
function updateVehicles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  vehicles.forEach((vehicle) => {
    vehicle.x += vehicle.dx * 2;
    vehicle.y += vehicle.dy * 2;

    // Bounce off edges
    if (vehicle.x <= 0 || vehicle.x >= canvas.width) vehicle.dx *= -1;
    if (vehicle.y <= 0 || vehicle.y >= canvas.height) vehicle.dy *= -1;

    // Draw vehicle
    ctx.beginPath();
    ctx.arc(vehicle.x, vehicle.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.closePath();
  });

  // Update 3D Visualization
  renderer.render(scene, camera);
}

// Calculate Metrics
function calculateMetrics() {
  messagesSent++;
  totalLatency += Math.random() * 50; // Random latency between 0-50ms
  energyConsumed += vehicles.length * 0.01; // Energy consumption per vehicle

  metricsDisplay.innerHTML = `
    Metrics:<br>
    Messages Sent: ${messagesSent}<br>
    Average Latency: ${(totalLatency / messagesSent).toFixed(2)} ms<br>
    Total Energy Consumed: ${energyConsumed.toFixed(2)}%
  `;
}

// Start Simulation
function startSimulation() {
  generateVehicles(20); // Generate 20 vehicles
  setInterval(() => {
    updateVehicles();
    calculateMetrics();
  }, 100); // Update every 100ms
}

// Initialize
startButton.addEventListener('click', startSimulation);
initialize3DVisualization();
