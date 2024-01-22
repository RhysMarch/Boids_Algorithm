import * as THREE from 'three';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const canvas = document.getElementById('scene');
const centerBox = document.querySelector('.center-box');

// Camera setup with initial aspect ratio
const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer setup with initial size
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

// Add a cone to the scene
const geometry = new THREE.ConeGeometry( 1, 2, 50 );
const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
const cone = new THREE.Mesh(geometry, material ); scene.add( cone );
scene.add(cone);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
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
