
import React, { useRef, useEffect, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  lifetime: number;
  dx: number; 
  dy: number;
}

interface MouseTrailProps {
  trailColorRGB: number[]; // e.g., [144, 238, 144] for light green
}

const MAX_LIFETIME = 55; 
const MAX_POINTS = 70; // Slightly increased max points for longer trail
const MIN_POINT_DISTANCE = 4; // Slightly decreased for more frequent points
const INITIAL_LINE_WIDTH = 6;

const MouseTrail: React.FC<MouseTrailProps> = ({ trailColorRGB }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastMousePositionRef = useRef<{ x: number; y: number } | null>(null);

  const addPoint = useCallback((x: number, y: number) => {
    let dx = 0;
    let dy = 0;

    if (lastMousePositionRef.current) {
      dx = x - lastMousePositionRef.current.x;
      dy = y - lastMousePositionRef.current.y;
    }
    
    const newPoint: Point = { x, y, lifetime: MAX_LIFETIME, dx, dy };
    pointsRef.current.unshift(newPoint); 

    if (pointsRef.current.length > MAX_POINTS) {
      pointsRef.current.pop(); 
    }
    lastMousePositionRef.current = { x, y };
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (lastMousePositionRef.current) {
      const distX = event.clientX - lastMousePositionRef.current.x;
      const distY = event.clientY - lastMousePositionRef.current.y;
      const distance = Math.sqrt(distX * distX + distY * distY);
      if (distance < MIN_POINT_DISTANCE) {
        return; 
      }
    }
    addPoint(event.clientX, event.clientY);
  }, [addPoint]);

  const drawTrail = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const points = pointsRef.current;

    if (points.length < 2) { 
        return;
    }
    
    const [r, g, b] = trailColorRGB;

    if (points.length < 3) { 
      const p0 = points[0];
      const p1 = points[1];
      const opacity = p0.lifetime / MAX_LIFETIME;
      const lineWidth = Math.max(0.1, INITIAL_LINE_WIDTH * opacity); // Changed falloff
      if (opacity > 0 && lineWidth > 0.1) {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      return;
    }

    for (let i = 0; i < points.length - 2; i++) {
      const p0 = points[i];     
      const p1 = points[i+1];   
      const p2 = points[i+2];   

      const startX = (i === 0) ? p0.x : (p0.x + p1.x) / 2;
      const startY = (i === 0) ? p0.y : (p0.y + p1.y) / 2;
      
      const endX = (p1.x + p2.x) / 2;
      const endY = (p1.y + p2.y) / 2;

      const opacity = p0.lifetime / MAX_LIFETIME; 
      const lineWidth = Math.max(0.1, INITIAL_LINE_WIDTH * opacity); // Changed falloff

      if (opacity <= 0 || lineWidth <= 0.1) continue;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(p1.x, p1.y, endX, endY);
      
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
    if (points.length >= 2) { 
        const lastP = points[points.length-2]; 
        const veryLastP = points[points.length-1]; 

        const opacity = lastP.lifetime / MAX_LIFETIME;
        const lineWidth = Math.max(0.1, INITIAL_LINE_WIDTH * opacity); // Changed falloff

        if (opacity > 0 && lineWidth > 0.1 && points.length > 2) { 
            const prevMidX = (lastP.x + veryLastP.x) / 2;
            const prevMidY = (lastP.y + veryLastP.y) / 2;
            
            ctx.beginPath();
            ctx.moveTo(prevMidX, prevMidY);
            ctx.lineTo(veryLastP.x, veryLastP.y); 
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }
    }
  }, [trailColorRGB]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    pointsRef.current = pointsRef.current.filter(p => {
      p.lifetime--;
      return p.lifetime > 0;
    });
    
    if (pointsRef.current.length < 2) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
        drawTrail(ctx);
    }
    
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [drawTrail]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    window.addEventListener('mousemove', handleMouseMove);

    // Clear existing points when trailColorRGB changes to prevent color mixing during transition
    pointsRef.current = [];
    lastMousePositionRef.current = null;
    if (canvas.getContext('2d')) {
      canvas.getContext('2d')?.clearRect(0,0, canvas.width, canvas.height);
    }


    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleMouseMove, animate, trailColorRGB]); 

  return <canvas id="mouse-trail-canvas" ref={canvasRef} aria-hidden="true" />;
};

export default MouseTrail;