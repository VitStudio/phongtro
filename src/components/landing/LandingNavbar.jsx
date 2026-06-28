import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/img/logo.png';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <nav className="landing-navbar" style={{
      background: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="nav-logo-link">
          <img src={logo} alt="Homie" className="nav-logo" />
          <span className="nav-logo-text">Homie</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-desktop-only nav-links-row">
          <a href="#problems" className="nav-link">Vấn đề</a>
          <a href="#solutions" className="nav-link">Giải pháp</a>
          <a href="#features" className="nav-link">Tính năng</a>
          <a href="#pricing" className="nav-link">Bảng giá</a>
          <Link to="/search" className="btn btn-primary">Tìm Phòng Ngay</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="nav-mobile-only nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="landing-overlay"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="glass landing-mobile-menu nav-mobile-drawer">
          <a href="#problems" onClick={() => setMobileMenuOpen(false)} className="nav-mobile-item">Vấn đề</a>
          <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="nav-mobile-item">Giải pháp</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="nav-mobile-item">Tính năng</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="nav-mobile-item">Bảng giá</a>
          <Link to="/search" className="btn btn-primary nav-mobile-cta" onClick={() => setMobileMenuOpen(false)}>Tìm Phòng Ngay</Link>
        </div>
      )}

    </nav>
  );
};

export default LandingNavbar;
