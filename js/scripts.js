import * as THREE from 'three';
import { GUI } from 'dat.gui'

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const canvas = document.getElementById('scene');
const centerBox = document.querySelector('.center-box');

// Camera setup with initial aspect ratio
const frustumSize = 10;
const aspect = canvas.offsetWidth / canvas.offsetHeight;
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    1000
);
camera.position.z = 5;

// Renderer setup with initial size
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

const settings = {
    numberOfBoids: 50,
    speed: 0.04
};

class Boid {
    constructor() {
        const geometry = new THREE.ConeGeometry(0.1, 0.2, 32);
        geometry.rotateX(Math.PI / 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(geometry, material);
        const speed = 0.04;
        this.velocity = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).normalize().multiplyScalar(speed);
        this.acceleration = new THREE.Vector3();

        // Creating boundaries for boids
        this.bounds = {
            xMin: frustumSize * aspect / -2, // Left Boundary
            xMax: frustumSize * aspect / 2, // Right Boundary
            yMin: frustumSize / -2,        // Bottom Boundary
            yMax: frustumSize / 2         // Top Boundary
        };

        this.maxSpeed = speed;

        this.mesh.position.set(
            (Math.random() - 0.5) * frustumSize * aspect,
            (Math.random() - 0.5) * frustumSize,
            0
        );

        scene.add(this.mesh);
    }

    update(){

        const margin = 3; // Distance from the boundary where steering starts
        const maxSteeringForce = 0.0005; // Maximum steering force

        // Calculate distances from each boundary
        let distanceToLeft = this.mesh.position.x - this.bounds.xMin;
        let distanceToRight = this.bounds.xMax - this.mesh.position.x;
        let distanceToTop = this.bounds.yMax - this.mesh.position.y;
        let distanceToBottom = this.mesh.position.y - this.bounds.yMin;

        // Initialize a steering force vector
        let steeringForce = new THREE.Vector3();

        // Apply steering force when close to the boundaries
        if (distanceToLeft < margin) {
            steeringForce.x += maxSteeringForce * (1 - distanceToLeft / margin);
        } else if (distanceToRight < margin) {
            steeringForce.x -= maxSteeringForce * (1 - distanceToRight / margin);
        }

        if (distanceToBottom < margin) {
            steeringForce.y += maxSteeringForce * (1 - distanceToBottom / margin);
        } else if (distanceToTop < margin) {
            steeringForce.y -= maxSteeringForce * (1 - distanceToTop / margin);
        }

        // Apply the steering force to the acceleration
        this.acceleration.add(steeringForce);

        // Update velocity with acceleration and clamp to maximum speed
        this.velocity.add(this.acceleration);
        this.velocity.clampLength(0, this.maxSpeed);

        // Update position with the velocity
        this.mesh.position.add(this.velocity);

        // Reset acceleration for the next frame
        this.acceleration.set(0, 0, 0);

        // Orient the boid to face in the direction of movement
        const direction = new THREE.Vector3().copy(this.velocity).add(this.mesh.position);
        this.mesh.lookAt(direction);
    }

    // Add methods for behaviors here (Separation, Alignment, Cohesion)
}

let flock = [];
initializeBoids();

function initializeBoids() {
    // Clear the existing flock
    flock.forEach(boid => {
        scene.remove(boid.mesh);
    });
    flock = [];

    // Create a new flock based on the current settings
    for (let i = 0; i < settings.numberOfBoids; i++) {
        flock.push(new Boid());
    }
}

function updateBoidSpeed() {
    // Update the speed of each boid in the flock
    flock.forEach(boid => {
        boid.velocity.setLength(settings.speed);
        boid.maxSpeed = settings.speed;
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    flock.forEach(boid => {
        boid.update()
    })

    renderer.render(scene, camera);
}

// GUI Controls
const gui = new GUI();
gui.add(settings, 'numberOfBoids', 1, 1000).step(1).name('Number of Boids').onChange(initializeBoids);
gui.add(settings, 'speed', 0.01, 0.1).name('Boid Speed').onChange(updateBoidSpeed);

// Handle window resizing
function resizeRenderer() {
    const boxStyles = window.getComputedStyle(centerBox);
    const paddingWidth = parseFloat(boxStyles.paddingLeft) + parseFloat(boxStyles.paddingRight);
    const paddingHeight = parseFloat(boxStyles.paddingTop) + parseFloat(boxStyles.paddingBottom);

    const newWidth = centerBox.clientWidth - paddingWidth;
    const newHeight = centerBox.clientHeight - paddingHeight;

    // Update camera aspect ratio and renderer size
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
}

// Resize event listener
window.addEventListener('resize', resizeRenderer);

// Initial call to set everything up
resizeRenderer();
animate();
