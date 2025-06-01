
import React, { useRef, useEffect, useCallback } from 'react';

interface Raindrop {
  id: number;
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

interface Droplet {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  maxRadius: number;
  lifetime: number;
  maxLifetime: number;
}

const RAIN_COLOR = 'rgba(100, 220, 100, 0.5)'; // Kept for reference, but opacity is per drop
const DROPLET_COLOR = 'rgba(150, 255, 150, 0.7)';
const NUM_RAINDROPS = 80;
const MIN_SPEED = 1.5;
const MAX_SPEED = 4;
const MIN_LENGTH = 25; // Increased
const MAX_LENGTH = 45; // Increased

const DROPLET_INITIAL_RADIUS = 1;
const DROPLET_MAX_RADIUS_BASE = 6;
const DROPLET_MAX_LIFETIME = 25; // frames

let raindropIdCounter = 0;
let dropletIdCounter = 0;

const GreenRainEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raindropsRef = useRef<Raindrop[]>([]);
  const dropletsRef = useRef<Droplet[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  const initializeRaindrop = (raindrop?: Raindrop): Raindrop => {
    const newX = Math.random() * (canvasRef.current?.width || window.innerWidth);
    const newY = raindrop ? -Math.random() * 200 - raindrop.length : -Math.random() * (canvasRef.current?.height || window.innerHeight);
    const newSpeed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    const newLength = MIN_LENGTH + Math.random() * (MAX_LENGTH - MIN_LENGTH);
    
    if (raindrop) {
      raindrop.x = newX;
      raindrop.y = newY;
      raindrop.speed = newSpeed;
      raindrop.length = newLength;
      raindrop.opacity = 0.2 + Math.random() * 0.5; // slightly lower opacity for softer streaks
      return raindrop;
    }
    return {
      id: raindropIdCounter++,
      x: newX,
      y: newY,
      length: newLength,
      speed: newSpeed,
      opacity: 0.2 + Math.random() * 0.5, // slightly lower opacity for softer streaks
    };
  };

  const addDroplet = (x: number, y: number) => {
    dropletsRef.current.push({
      id: dropletIdCounter++,
      x,
      y,
      radius: DROPLET_INITIAL_RADIUS,
      opacity: 1,
      maxRadius: DROPLET_MAX_RADIUS_BASE + Math.random() * 4 - 2, // some variation
      lifetime: 0,
      maxLifetime: DROPLET_MAX_LIFETIME,
    });
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw raindrops
    raindropsRef.current.forEach(drop => {
      drop.y += drop.speed;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.strokeStyle = `rgba(100, 220, 100, ${drop.opacity})`;
      ctx.lineWidth = 1.5 + Math.random() * 1; // Increased lineWidth
      ctx.stroke();

      if (drop.y > canvas.height) {
        addDroplet(drop.x, canvas.height - Math.random() * 5); // Splash near bottom
        initializeRaindrop(drop); // Reset this raindrop
      }
    });

    // Update and draw droplets
    dropletsRef.current = dropletsRef.current.filter(droplet => {
      droplet.lifetime++;
      if (droplet.lifetime >= droplet.maxLifetime) {
        return false;
      }

      const progress = droplet.lifetime / droplet.maxLifetime;
      droplet.radius = DROPLET_INITIAL_RADIUS + (droplet.maxRadius - DROPLET_INITIAL_RADIUS) * Math.sin(progress * Math.PI / 2); // Ease out expansion
      droplet.opacity = 1 - progress * progress; // Fade out faster

      ctx.beginPath();
      ctx.arc(droplet.x, droplet.y, droplet.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 255, 150, ${droplet.opacity * 0.7})`;
      ctx.fill();
      return true;
    });

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    if (raindropsRef.current.length === 0) {
        for (let i = 0; i < NUM_RAINDROPS; i++) {
            raindropsRef.current.push(initializeRaindrop());
        }
    }
    
    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0, 
        pointerEvents: 'none', 
      }}
      aria-hidden="true"
    />
  );
};

export default GreenRainEffect;