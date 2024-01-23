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


class Boid {
    constructor() {
        const geometry = new THREE.ConeGeometry(0.1, 0.25, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(geometry, material);
        const speed = 0.05; // Adjust this value as needed for desired speed
        this.velocity = new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(speed);
        this.acceleration = new THREE.Vector2();

        this.mesh.position.set(
            (Math.random() - 0.5) * frustumSize * aspect,
            (Math.random() - 0.5) * frustumSize,
            0
        );

        scene.add(this.mesh);

        // Creating boundaries for boids
        this.bounds = {
            xMin: frustumSize * aspect / -2,
            xMax: frustumSize * aspect / 2,
            yMin: frustumSize / -2,
            yMax: frustumSize / 2
        };

        this.maxSpeed = speed;
    }

    update(){
        // Check 2D boundaries and reverse velocity if a boid is about to fly out of view
        if (this.mesh.position.x < this.bounds.xMin || this.mesh.position.x > this.bounds.xMax) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.mesh.position.y < this.bounds.yMin || this.mesh.position.y > this.bounds.yMax) {
            this.velocity.y = -this.velocity.y;
        }

        // Clamp the 2D velocity to ensure it does not exceed the maximum speed
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.setLength(this.maxSpeed);
        }

        // Apply the velocity
        this.mesh.position.x += this.velocity.x;
        this.mesh.position.y += this.velocity.y;

        // Reset acceleration for the next frame
        this.acceleration.set(0, 0);
    }

    // Add methods for behaviors here (Separation, Alignment, Cohesion)


}

const flock = [];
const numberOfBoids = 10;

for (let i = 0; i < numberOfBoids; i++) {
    flock.push(new Boid());
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    flock.forEach(boid => {
        boid.update()
    })

    renderer.render(scene, camera);
}

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
