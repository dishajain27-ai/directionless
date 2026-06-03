import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer with high performance settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particles Geometry
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color('#D4AF37');
    const violetColor = new THREE.Color('#7A5CFF');
    const darkGrayColor = new THREE.Color('#33333e');

    for (let i = 0; i < particleCount; i++) {
      // Spread particles in space
      positions[i * 3] = (Math.random() - 0.5) * 12;     // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z

      // Color blending (golds, violets, and deep ambient grays)
      const rand = Math.random();
      let mixedColor;
      if (rand < 0.25) {
        mixedColor = goldColor.clone().multiplyScalar(0.7 + Math.random() * 0.3);
      } else if (rand < 0.5) {
        mixedColor = violetColor.clone().multiplyScalar(0.6 + Math.random() * 0.4);
      } else {
        mixedColor = darkGrayColor.clone().multiplyScalar(0.5 + Math.random() * 0.5);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      // Varied particle sizes
      sizes[i] = Math.random() * 2 + 0.5;

      // Bubble velocities (wandering movement vectors)
      velocities[i * 3] = (Math.random() - 0.5) * 0.007;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.007;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.007;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader material or basic canvas-drawn texture mapping
    // We will generate a soft circular texture programmatically
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.25, // Enlarged to look like floating ambient bokeh bubbles
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse movement state
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 100;
      mouseY = (event.clientY - window.innerHeight / 2) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation
      particles.rotation.y = elapsedTime * 0.01;
      particles.rotation.x = elapsedTime * 0.005;

      // Move individual bubbles coordinates dynamically
      const positionsArr = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positionsArr[i * 3] += velocities[i * 3];
        positionsArr[i * 3 + 1] += velocities[i * 3 + 1];
        positionsArr[i * 3 + 2] += velocities[i * 3 + 2];

        // Boundary bounce check (X: -7 to 7, Y: -7 to 7, Z: -10 to 5)
        if (Math.abs(positionsArr[i * 3]) > 7) velocities[i * 3] *= -1;
        if (Math.abs(positionsArr[i * 3 + 1]) > 7) velocities[i * 3 + 1] *= -1;
        if (positionsArr[i * 3 + 2] > 5 || positionsArr[i * 3 + 2] < -10) {
          velocities[i * 3 + 2] *= -1;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Mouse interactive parallax with lerp smoothing
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particles.position.x = targetX * 0.5;
      particles.position.y = -targetY * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="three-bg-canvas-wrapper"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        flexShrink: 0
      }} 
    />
  );
}
