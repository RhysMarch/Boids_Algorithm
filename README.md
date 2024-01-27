# Boids Algorithm

This project is a 2D simulation of the Boids Algorithm,  rendered using Three.js and controlled interactively with Dat.GUI. The simulation illustrates the flocking behaviour of birds, an artificial life program known as "Boids."

The Boids Algorithm is a simulation of collective behavior, such as bird flocking or fish schooling. It consists of individual agents, called "Boids," following simple rules to achieve flocking behavior:

- **Alignment**: Boids align themselves with the average heading of their neighbors.
- **Separation**: Boids avoid getting too close to each other to prevent collisions.
- **Cohesion**: Boids steer towards the average position of their neighbors.

The term "Boids" represents a simulated flocking behaviour, which was originally developed by Craig Reynolds in 1986. You can read more about the Boids algorithm on its Wikipedia page.
https://en.wikipedia.org/wiki/Boids

<be>




# Demo

Visit the live demo at the link below:

[Live Demo](https://rhysmarch.github.io/Boids_Algorithm/)

The demo allows you to view a simulation of the Boids algorithm. Use the interactive controls to adjust various parameters and see how the Boids respond in real-time.

<br>




# Prerequisites

Before you begin, ensure you have the following:

- **Git**: You'll need Git, a version control system, to clone this project. You can download and install Git from the official website: [Git Downloads](https://git-scm.com/downloads)

- **Node.js and npm**: This project relies on Node.js, a JavaScript runtime, and npm (Node Package Manager) for managing dependencies and running the development server. You can download and install Node.js, which includes npm, from the official website: [Node.js Downloads](https://nodejs.org/)




# Cloning and Running the Project

To run this project locally, follow these steps:

1. Clone the project repository to your local machine using the following command:

   ```bash
   git clone https://github.com/RhysMarch/Boids_Algorithm
   ```

2. Navigate to the project directory:

    ```bash
    cd <project_directory>
    ```

3. Install the required dependencies (three and dat.gui) using npm:

   ```bash
   npm install three dat.gui
   ```

4. Start the development server using Vite:
   ```bash
   npx vite
   ```

5. Open your web browser and go to the provided localhost link in your terminal. You can now interact with and explore the Boids Algorithm simulation.

   
