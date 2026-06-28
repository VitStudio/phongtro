import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Menu, X } from 'lucide-react';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: 'clamp(12px, 3vw, 20px) 0',
      transition: 'all 0.3s ease',
      background: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Home className="text-primary" size={28} />
          <span className="heading-2 text-gradient" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>HOMIE.VN</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#problems" style={{ fontWeight: 500, color: 'var(--text-main)' }}>Vấn đề</a>
          <a href="#solutions" style={{ fontWeight: 500, color: 'var(--text-main)' }}>Giải pháp</a>
          <a href="#features" style={{ fontWeight: 500, color: 'var(--text-main)' }}>Tính năng</a>
          <a href="#pricing" style={{ fontWeight: 500, color: 'var(--text-main)' }}>Bảng giá</a>
          <Link to="/search" className="btn btn-primary">Tìm Phòng Ngay</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="nav-mobile-only"
          style={{ display: 'none', padding: '8px', color: 'var(--text-main)' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 999
        }} onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="glass" style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
          background: 'rgba(255, 255, 255, 0.97)',
          borderBottom: '1px solid var(--glass-border)',
          zIndex: 1001
        }}>
          <a href="#problems" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 0', fontSize: '1.1rem', fontWeight: 500 }}>Vấn đề</a>
          <a href="#solutions" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 0', fontSize: '1.1rem', fontWeight: 500 }}>Giải pháp</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 0', fontSize: '1.1rem', fontWeight: 500 }}>Tính năng</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 0', fontSize: '1.1rem', fontWeight: 500 }}>Bảng giá</a>
          <Link to="/search" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '8px' }}>Tìm Phòng Ngay</Link>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .nav-desktop-only { display: flex !important; }
          .nav-mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .nav-mobile-only { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default LandingNavbar;
