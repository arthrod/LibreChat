import React, { useEffect, useRef } from 'react';

interface CanvasProps {
  className?: string;
}

export function Canvas({ className }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let circles: Array<{
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
    }> = [];

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createCircle = () => {
      if (!canvas) return;
      const radius = (Math.random() * 150 + 50) * 1.1;
      return {
        x: Math.random() * (canvas.width - 2 * radius) + radius,
        y: Math.random() * (canvas.height - 2 * radius) + radius,
        radius: radius,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
      };
    };

    const drawCircle = (circle: any) => {
      if (!ctx || !circle) return;
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        circle.x,
        circle.y,
        0,
        circle.x,
        circle.y,
        circle.radius
      );
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach((circle) => {
        if (!circle) return;
        circle.x += circle.dx;
        circle.y += circle.dy;
        if (circle.x + circle.radius > canvas.width || circle.x - circle.radius < 0)
          circle.dx *= -1;
        if (circle.y + circle.radius > canvas.height || circle.y - circle.radius < 0)
          circle.dy *= -1;
        drawCircle(circle);
      });
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    for (let i = 0; i < 5; i++) {
      const circle = createCircle();
      if (circle) circles.push(circle);
    }
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
    />
  );
}
