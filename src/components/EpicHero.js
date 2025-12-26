'use client';

import { useEffect, useRef, useState } from 'react';
import './EpicHero.css';
import './SoftwareInterfaceGraphic.css';

export default function EpicHero() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Visibility observer for lazy loading animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized particle system - only runs when visible
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let particles = [];
    let lastTime = 0;
    const fps = 30;
    const fpsInterval = 1000 / fps;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.speed = Math.random() * 0.5 + 0.2;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 184, 166, ${this.opacity})`;
        ctx.fill();
      }
    }

    const particleCount = window.innerWidth < 768 ? 25 : 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;

      lastTime = currentTime - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  // Optimized mouse tracking
  useEffect(() => {
    if (!isVisible) return;

    let ticking = false;

    const handleMouseMove = (e) => {
      if (!ticking && heroRef.current) {
        window.requestAnimationFrame(() => {
          const rect = heroRef.current.getBoundingClientRect();
          setMousePosition({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible]);

  // Stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, [statsAnimated]);

  const stats = [
    { value: 50, suffix: '+', label: 'Projects Delivered' },
    { value: 95, suffix: '%', label: 'On-Time Delivery' },
    { value: 40, suffix: '+', label: 'Global Partners' },
  ];

  return (
    <section ref={heroRef} className="epic-hero">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="grid-background" />

      {isVisible && (
        <div className="geometric-shapes">
          <div className="shape shape-1" style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }} />
          <div className="shape shape-2" style={{
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
          }} />
          <div className="shape shape-3" style={{
            transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * -20}px)`
          }} />
        </div>
      )}

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>Global Software Execution</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line title-line-1">You Bring</span>
            <span className="title-line title-line-2">
              <span className="gradient-text">Vision</span>
            </span>
            <span className="title-line title-line-3">We Obligate</span>
            <span className="title-line title-line-4">
              <span className="gradient-text-alt">Delivery</span>
            </span>
          </h1>

          <p className="hero-subtitle">
            Transform ideas into <strong>production-grade digital products</strong> with
            a delivery partner that makes execution <strong>non-negotiable</strong>.
          </p>

          <div className="hero-ctas">
            <button className="cta-primary">
              <span className="cta-text">Start Your Project</span>
              <span className="cta-arrow">→</span>
              <span className="cta-glow"></span>
            </button>
            <button className="cta-secondary">
              <span className="cta-text">Explore Partnership</span>
              <span className="cta-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
          </div>

          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-value">
                  {statsAnimated && (
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <SoftwareInterfaceGraphic isVisible={isVisible} />
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span className="scroll-text">Scroll to explore</span>
      </div>
    </section>
  );
}

function AnimatedCounter({ end, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const duration = 2000;
    let rafId;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [end]);

  return <>{count}{suffix}</>;
}

function SoftwareInterfaceGraphic({ isVisible }) {
  if (!isVisible) return <div className="software-graphic-container" />;

  return (
    <div className="software-graphic-container">
      <div className="laptop-device">
        {/* Screen */}
        <div className="laptop-screen">
          <div className="screen-content">
            {/* App Header */}
            <div className="app-header">
              <div className="header-controls">
                <div className="control-dot" />
                <div className="control-dot" />
                <div className="control-dot" />
              </div>
              <div className="branding-text">Powered by Obligate Solutions</div>
            </div>

            {/* App Body (Skeleton UI) */}
            <div className="app-body">
              {/* Sidebar */}
              <div className="app-sidebar">
                <div className="sidebar-item sidebar-item-active" />
                <div className="sidebar-item sidebar-item-short" />
                <div className="sidebar-item" />
                <div className="sidebar-item sidebar-item-short" />
              </div>

              {/* Main Content */}
              <div className="app-main">
                {/* Stats / Hero Area */}
                <div className="skeleton-card hero-skeleton">
                  <div className="shimmer-overlay" />
                </div>

                {/* Grid / List Area - Colorful Products */}
                <div className="grid-skeleton">
                  <div className="grid-item product-card-mobile">
                    <div className="product-icon">📱</div>
                    <div className="shimmer-overlay" style={{ animationDelay: '0.1s' }} />
                  </div>
                  <div className="grid-item product-card-web">
                    <div className="product-icon">💻</div>
                    <div className="shimmer-overlay" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <div className="grid-item product-card-dashboard">
                    <div className="product-icon">📊</div>
                    <div className="shimmer-overlay" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <div className="grid-item product-card-api">
                    <div className="product-icon">⚡</div>
                    <div className="shimmer-overlay" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <div className="grid-item product-card-cloud">
                    <div className="product-icon">☁️</div>
                    <div className="shimmer-overlay" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <div className="grid-item product-card-ai">
                    <div className="product-icon">🤖</div>
                    <div className="shimmer-overlay" style={{ animationDelay: '0.6s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop Base */}
        <div className="laptop-base" />

        {/* Trust Badges - 3 badges in triangular arrangement */}

        <div className="float-badge trust-badge-1">
          <svg className="trust-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 5V9C3 13.5 6 17.5 10 18.5C14 17.5 17 13.5 17 9V5L10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="badge-text">Secure Development</div>
        </div>

        <div className="float-badge trust-badge-2">
          <svg className="trust-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="badge-text">Verified Partner</div>
        </div>

        <div className="float-badge trust-badge-3">
          <svg className="trust-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C5.5 2 2 5.5 2 10C2 14.5 5.5 18 10 18C14.5 18 18 14.5 18 10C18 5.5 14.5 2 10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="badge-text">24/7 Support</div>
        </div>
      </div>
    </div>
  );
}
