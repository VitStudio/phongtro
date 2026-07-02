import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Wallet, LogOut, LayoutDashboard, BarChart3, Menu, X, PlusCircle, Crown } from 'lucide-react';
import logo from '../../assets/img/logo.png';

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
    <nav className="glass navbar-app">
      <div className="container nav-container-row">
        {/* Logo */}
        <Link to="/" className="nav-logo-link">
          <img src={logo} alt="Homie" className="nav-logo-img" />
          <span className="nav-logo-text">Homie</span>
        </Link>

        {!displayUser ? (
          <div className="nav-login-row">
            <button type="button" className="btn btn-outline nav-login-btn" onClick={() => login('u1')}>
              👨‍🎓 Sinh viên
            </button>
            <button type="button" className="btn btn-outline nav-login-btn" onClick={() => login('u2')}>
              🏠 Chủ Trọ
            </button>
            <button type="button" className="btn btn-outline nav-login-btn" onClick={() => login('u3')}>
              🛡️ Admin
            </button>
          </div>
        ) : (
          <>
            {/* Desktop nav */}
            <div className="nav-desktop-only">
              <div className="nav-link-row">
                <Link to="/search" className="nav-app-link">Tìm Phòng</Link>
                <Link to="/roommates" className="nav-app-link">Roommate</Link>
                <Link to="/chat" className="nav-app-link">Tin Nhắn</Link>
                <Link to="/wallet" className="nav-app-link-icon">
                  <PlusCircle size={14} /> Nạp Tiền
                </Link>
                {displayUser.role === 'landlord' && (
                  <Link to="/landlord" className="nav-app-link-icon">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                )}
                {displayUser.role === 'admin' && (
                  <Link to="/admin" className="nav-app-link-icon">
                    <BarChart3 size={16} /> Quản Trị
                  </Link>
                )}
              </div>
              <div className="nav-divider" />
              <Link to="/wallet" className="wallet-badge-link">
                <Wallet size={14} />
                <span>{displayUser.wallet_balance.toLocaleString()}đ</span>
              </Link>
              <Link to="/profile" className="nav-profile-link">
                <div className="avatar-wrap">
                  <img src={displayUser.avatar} alt="avatar" className="nav-avatar" />
                  {displayUser.subscription?.status === 'active' && (
                    <div className="nav-crown-dot">
                      <Crown size={8} color="white" />
                    </div>
                  )}
                </div>
                <span className="nav-user-name">{displayUser.name}</span>
              </Link>
              <button type="button" onClick={handleLogout} aria-label="Đăng xuất" title="Đăng xuất" className="nav-logout-btn">
                <LogOut size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button type="button" className="nav-mobile-only nav-app-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && displayUser && (
        <div className="glass nav-mobile-menu">
          <div className="user-row-mobile">
            <img src={displayUser.avatar} alt="avatar" className="nav-mobile-avatar" />
            <div>
              <div className="nav-mobile-name">{displayUser.name}</div>
              <div className="nav-mobile-balance">
                <Wallet size={12} /> {displayUser.wallet_balance.toLocaleString()}đ
              </div>
            </div>
          </div>
          <Link to="/search" onClick={handleNav} className="nav-mobile-link">🏠 Tìm Phòng</Link>
          <Link to="/roommates" onClick={handleNav} className="nav-mobile-link">👥 Roommate</Link>
          <Link to="/chat" onClick={handleNav} className="nav-mobile-link">💬 Tin Nhắn</Link>
          <Link to="/wallet" onClick={handleNav} className="nav-mobile-link">💰 Nạp Tiền</Link>
          <Link to="/profile" onClick={handleNav} className="nav-mobile-link">👤 Cá Nhân</Link>
          {displayUser.role === 'landlord' && (
            <Link to="/landlord" onClick={handleNav} className="nav-mobile-link">📊 Dashboard</Link>
          )}
          {displayUser.role === 'admin' && (
            <Link to="/admin" onClick={handleNav} className="nav-mobile-link">📊 Quản Trị</Link>
          )}
          <button type="button" onClick={handleLogout} className="nav-mobile-logout">🚪 Đăng xuất</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
