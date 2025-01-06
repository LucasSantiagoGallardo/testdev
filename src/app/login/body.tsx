import React from 'react';
import Particles from 'react-tsparticles';

export default function Home() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Particles
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 50, density: { enable: true, area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 5 } },
            move: { enable: true, speed: 2 }
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" }
            }
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
      <h1 style={{ color: 'white', textAlign: 'center', paddingTop: '50vh' }}>Bienvenido a la página principal</h1>
    </div>
  );
}
