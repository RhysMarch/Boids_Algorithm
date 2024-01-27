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
    numberOfBoids: 2,
    speed: 0.02,
    personalSpace: 1,
    maxSteeringForce: 0.0003,
    margin: 4,
    showPersonalSpace: false,
    showVisualRange: true,
    visualRange: 4,
};

class Boid {
    constructor() {

        // Boid Visualisation
        const geometry = new THREE.ConeGeometry(0.1, 0.2, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(geometry, material);
        const speed = settings.speed;
        this.velocity = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).normalize().multiplyScalar(speed);
        this.acceleration = new THREE.Vector3();
        geometry.rotateX(Math.PI / 2);

        // Personal space visualisation
        const personalSpaceGeometry = new THREE.SphereGeometry(settings.personalSpace, 16, 16);
        const personalSpaceMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
        this.personalSpaceMesh = new THREE.Mesh(personalSpaceGeometry, personalSpaceMaterial);
        this.mesh.add(this.personalSpaceMesh);

        // Visual range visualisation
        const visualRangeGeometry = new THREE.SphereGeometry(settings.visualRange, 16, 16);
        const visualRangeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.1 });
        this.visualRangeMesh = new THREE.Mesh(visualRangeGeometry, visualRangeMaterial);
        this.mesh.add(this.visualRangeMesh);


        // Creating scene boundaries for boids
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
        // Calculate distances from each boundary
        let distanceToLeft = this.mesh.position.x - this.bounds.xMin;
        let distanceToRight = this.bounds.xMax - this.mesh.position.x;
        let distanceToTop = this.bounds.yMax - this.mesh.position.y;
        let distanceToBottom = this.mesh.position.y - this.bounds.yMin;

        // Initialize a steering force vector
        let steeringForce = new THREE.Vector3();

        // Apply steering force when close to the boundaries
        if (distanceToLeft < settings.margin) {
            steeringForce.x += settings.maxSteeringForce * (1 - distanceToLeft / settings.margin);
        } else if (distanceToRight < settings.margin) {
            steeringForce.x -= settings.maxSteeringForce * (1 - distanceToRight / settings.margin);
        }

        if (distanceToBottom < settings.margin) {
            steeringForce.y += settings.maxSteeringForce * (1 - distanceToBottom / settings.margin);
        } else if (distanceToTop < settings.margin) {
            steeringForce.y -= settings.maxSteeringForce * (1 - distanceToTop / settings.margin);
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


        //* -------------------------------------------------*//
        //*                   Separation                    *//
        //* -----------------------------------------------*//
        let averageSteeringForce = new THREE.Vector3();
        let nearbyBoidsCount = 0;

        flock.forEach(otherBoid => {
            let distance = this.mesh.position.distanceTo(otherBoid.mesh.position);
            if (otherBoid !== this && distance < settings.personalSpace) {
                // Calculate vector pointing away from the neighbor
                let awayFromBoid = new THREE.Vector3().subVectors(this.mesh.position, otherBoid.mesh.position).normalize().divideScalar(distance);
                averageSteeringForce.add(awayFromBoid);
                nearbyBoidsCount++;
            }
        });

        if (nearbyBoidsCount > 0) {
            // Calculate the average steering force
            averageSteeringForce.divideScalar(nearbyBoidsCount);

            // Make sure the force is not greater than the max force allowed
            if (averageSteeringForce.length() > settings.maxSteeringForce) {
                averageSteeringForce.normalize().multiplyScalar(settings.maxSteeringForce);
            }

            // Apply the steering force to the boids acceleration for smooth turning
            this.acceleration.add(averageSteeringForce);

        } else { // If not close to other boids, ease speed back up
            let desiredVelocity = this.velocity.clone().normalize().multiplyScalar(this.maxSpeed);
            this.velocity.lerp(desiredVelocity, 0.1);
        }

        //* -------------------------------------------------*//
        //*                    Alignment                    *//
        //* -----------------------------------------------*//
        flock.forEach(otherBoid => {
            let distance = this.mesh.position.distanceTo(otherBoid.mesh.position);
            if (otherBoid !== this && distance < settings.visualRange) {

            }
        });





        //* -------------------------------------------------*//
        //*                     Cohesion                    *//
        //* -----------------------------------------------*//

    }

    togglePersonalSpaceVisibility(visible) {
        this.personalSpaceMesh.visible = visible;
    }
    toggleVisualRange(visible) {
        this.visualRangeMesh.visible = visible;
    }
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
        let newBoid = new Boid();
        newBoid.togglePersonalSpaceVisibility(settings.showPersonalSpace);
        newBoid.toggleVisualRange(settings.showVisualRange);
        flock.push(newBoid);
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
gui.add(settings, 'showPersonalSpace').name('Show Personal Space').onChange(value => {
    flock.forEach(boid => boid.togglePersonalSpaceVisibility(value));
});
gui.add(settings, 'showVisualRange').name('Show Visual Range').onChange(value => {
    flock.forEach(boid => boid.toggleVisualRange(value));
});


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
