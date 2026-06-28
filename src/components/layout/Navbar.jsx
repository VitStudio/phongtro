import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wallet, LogOut, LayoutDashboard, Home, CheckSquare, Menu, X, PlusCircle, User, Crown } from 'lucide-react';

const Navbar = () => {
  const { currentUser, login, logout, users } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayUser = currentUser
    ? (users.find(u => u.id === currentUser.id) || currentUser)
    : null;

  const handleLogout = () => {
    logout();
    navigate('/search');
    setMobileOpen(false);
  };

  const handleNav = () => setMobileOpen(false);

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '14px 0', marginBottom: '32px' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <Home size={26} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            PhongTroGenZ
          </span>
        </Link>

        {!displayUser ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => login('u1')}>
              👨‍🎓 Student
            </button>
            <button className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => login('u2')}>
              🏠 Landlord
            </button>
            <button className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => login('u3')}>
              🛡️ Admin
            </button>
          </div>
        ) : (
          <>
            {/* Desktop nav */}
            <div className="nav-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <Link to="/search" style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Tìm Phòng</Link>
                <Link to="/roommates" style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Ở Ghép</Link>
                <Link to="/wallet" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                  <PlusCircle size={14} /> Nạp Tiền
                </Link>
                {displayUser.role === 'landlord' && (
                  <Link to="/landlord" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                )}
                {displayUser.role === 'admin' && (
                  <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                    <CheckSquare size={16} /> Duyệt Tin
                  </Link>
                )}
              </div>
              <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)' }} />
              <Link to="/wallet" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '9999px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>
                <Wallet size={14} />
                <span>{displayUser.wallet_balance.toLocaleString()}đ</span>
              </Link>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <div style={{ position: 'relative' }}>
                  <img src={displayUser.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--primary)', flexShrink: 0 }} />
                  {displayUser.subscription?.status === 'active' && (
                    <div style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, background: 'var(--warning)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>
                      <Crown size={8} color="white" />
                    </div>
                  )}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>{displayUser.name}</span>
              </Link>
              <button onClick={handleLogout} title="Đăng xuất" style={{ display: 'flex', alignItems: 'center', padding: '6px', color: 'var(--danger)', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <LogOut size={18} />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button className="nav-mobile-only" onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', padding: '8px', color: 'var(--text-main)' }}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && displayUser && (
        <div className="glass" style={{ position: 'absolute', top: '100%', left: 0, right: 0, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.95)', borderTop: 'none', zIndex: 51 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--glass-border)', marginBottom: '8px' }}>
            <img src={displayUser.avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--primary)' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{displayUser.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700 }}>
                <Wallet size={12} /> {displayUser.wallet_balance.toLocaleString()}đ
              </div>
            </div>
          </div>
          <Link to="/search" onClick={handleNav} style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', padding: '8px 0' }}>🏠 Tìm Phòng</Link>
          <Link to="/roommates" onClick={handleNav} style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', padding: '8px 0' }}>👥 Ở Ghép</Link>
          <Link to="/wallet" onClick={handleNav} style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', padding: '8px 0' }}>💰 Nạp Tiền</Link>
          <Link to="/profile" onClick={handleNav} style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', padding: '8px 0' }}>👤 Cá Nhân</Link>
          {displayUser.role === 'landlord' && (
            <Link to="/landlord" onClick={handleNav} style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', padding: '8px 0' }}>📊 Dashboard</Link>
          )}
          {displayUser.role === 'admin' && (
            <Link to="/admin" onClick={handleNav} style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', padding: '8px 0' }}>✅ Duyệt Tin</Link>
          )}
          <button onClick={handleLogout} style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--danger)', padding: '8px 0', textAlign: 'left' }}>🚪 Đăng xuất</button>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .nav-mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .nav-mobile-only { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
