import React, { useRef, useEffect, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  lifetime: number;
  dx: number; 
  dy: number;
}

const MAX_LIFETIME = 40; 
const TRAIL_COLOR_RGB = [144, 238, 144]; // Light Green: #90EE90
const MAX_POINTS = 60; 
const MIN_POINT_DISTANCE = 5; 
const INITIAL_LINE_WIDTH = 5;

const MouseTrail: React.FC = () => {
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

    if (points.length < 2) { // Not enough points to draw anything significant
        return;
    }

    if (points.length < 3) { // Fallback to a simple line for 2 points
      const p0 = points[0];
      const p1 = points[1];
      const opacity = p0.lifetime / MAX_LIFETIME;
      const lineWidth = Math.max(0.1, INITIAL_LINE_WIDTH * (opacity * opacity));
      if (opacity > 0 && lineWidth > 0.1) {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(${TRAIL_COLOR_RGB[0]}, ${TRAIL_COLOR_RGB[1]}, ${TRAIL_COLOR_RGB[2]}, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      return;
    }

    // Draw using quadratic curves for 3 or more points
    for (let i = 0; i < points.length - 2; i++) {
      const p0 = points[i];     // Current point for styling, start of conceptual segment
      const p1 = points[i+1];   // Control point for the curve
      const p2 = points[i+2];   // Point influencing the end of the curve segment

      // Determine the start and end points for this curve segment
      const startX = (i === 0) ? p0.x : (p0.x + p1.x) / 2;
      const startY = (i === 0) ? p0.y : (p0.y + p1.y) / 2;
      
      const endX = (p1.x + p2.x) / 2;
      const endY = (p1.y + p2.y) / 2;

      // Style based on p0 (the point defining the "age" of this segment)
      const opacity = p0.lifetime / MAX_LIFETIME; 
      const lineWidth = Math.max(0.1, INITIAL_LINE_WIDTH * (opacity * opacity));

      if (opacity <= 0 || lineWidth <= 0.1) continue;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(p1.x, p1.y, endX, endY);
      
      ctx.strokeStyle = `rgba(${TRAIL_COLOR_RGB[0]}, ${TRAIL_COLOR_RGB[1]}, ${TRAIL_COLOR_RGB[2]}, ${opacity})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
    // Handle the very last "tail" piece if necessary, from the last midpoint to the last point.
    // This ensures the trail doesn't prematurely shorten with the quadratic curve logic above.
    if (points.length >= 2) { // This covers the case where points.length was exactly 2 earlier, or the tail for >=3
        const lastP = points[points.length-2]; // Second to last point from original list
        const veryLastP = points[points.length-1]; // Actual last point

        // Style for this tail segment, based on the second to last point's lifetime
        const opacity = lastP.lifetime / MAX_LIFETIME;
        const lineWidth = Math.max(0.1, INITIAL_LINE_WIDTH * (opacity * opacity));

        if (opacity > 0 && lineWidth > 0.1 && points.length > 2) { // Only if more than 2 points, as 2 points case is handled by line fallback
             // For point lists of 3+, the loop `i < points.length - 2` ends such that p1 is points[points.length-2]
             // and p2 is points[points.length-1]. The last curve ends at mid(p1,p2).
             // We need to draw from this mid(p1,p2) to p2 (veryLastP).
            const prevMidX = (lastP.x + veryLastP.x) / 2;
            const prevMidY = (lastP.y + veryLastP.y) / 2;
            
            ctx.beginPath();
            ctx.moveTo(prevMidX, prevMidY);
            ctx.lineTo(veryLastP.x, veryLastP.y); // Line to the very last point
            ctx.strokeStyle = `rgba(${TRAIL_COLOR_RGB[0]}, ${TRAIL_COLOR_RGB[1]}, ${TRAIL_COLOR_RGB[2]}, ${opacity})`;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }
    }


  }, []);

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

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      pointsRef.current = []; 
      lastMousePositionRef.current = null;
    };
  }, [handleMouseMove, animate]); 

  return <canvas id="mouse-trail-canvas" ref={canvasRef} aria-hidden="true" />;
};

export default MouseTrail;