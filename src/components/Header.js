'use client';

import { useEffect, useState } from 'react';
import './Header.css';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Scroll detection for backdrop blur effect
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'HOME', href: '/' },
        { name: 'ABOUT', href: '#about' },
        { name: 'HOW WE WORK', href: '#how-we-work' },
        { name: 'SERVICES', href: '#services' },
        { name: 'PARTNERS', href: '#partners' },
        { name: 'CONTACT', href: '#contact' },
    ];

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
                <nav className="header-nav">
                    {/* Logo and Branding */}
                    <div className="logo-section">
                        <div className="logo-icon">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <path
                                    d="M20 4L8 10V18C8 26 13 33 20 36C27 33 32 26 32 18V10L20 4Z"
                                    stroke="url(#gradient1)"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <path
                                    d="M15 20L18 23L25 16"
                                    stroke="url(#gradient1)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <defs>
                                    <linearGradient id="gradient1" x1="8" y1="4" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#14B8A6" />
                                        <stop offset="1" stopColor="#0ea5e9" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="brand-text">
                            <h1 className="brand-name">Obligate Solutions</h1>
                            <p className="brand-tagline">Transform Vision into Delivery</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="nav-links desktop-nav">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="nav-link"
                                onClick={link.href.startsWith('#') ? handleLinkClick : undefined}
                            >
                                {link.name}
                            </a>
                        ))}
                        <ThemeToggle />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <nav className="mobile-nav-links">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="mobile-nav-link"
                                onClick={handleLinkClick}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Theme toggle in mobile menu */}
                    <div className="mobile-theme-toggle">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </>
    );
}
