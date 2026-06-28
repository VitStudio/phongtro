import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '../../assets/img/logo.png';

const Facebook = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Footer = () => {
  return (
    <footer id="footer-contact" aria-label="Liên hệ" style={{ background: 'var(--dark-bg)', color: 'var(--dark-text)', paddingTop: 'clamp(40px, 10vw, 80px)', paddingBottom: 'clamp(24px, 6vw, 40px)' }}>
      <div className="container">
        {/* CTA Section */}
        <div className="glass-card flex-col items-center justify-center animate-fade-in-up" style={{ padding: 'clamp(24px, 6vw, 48px)', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', borderRadius: '32px', marginBottom: '80px', textAlign: 'center' }}>
          <h2 className="heading-2 mb-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Sẵn sàng để phòng của bạn luôn kín chỗ?</h2>
          <p className="mb-8" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.125rem)', opacity: 0.9, maxWidth: '600px' }}>
            Tham gia cùng hàng ngàn chủ trọ khác đang sử dụng HOMIE.VN để tối ưu hóa hiệu quả kinh doanh.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/search" className="btn" style={{ background: 'white', color: 'var(--primary)' }}>Tìm Phòng Ngay</Link>
            <Link to="/landlord" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Đăng Tin Ngay</Link>
          </div>
        </div>

        {/* Footer Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
          <div>
            <Link to="/" className="flex items-center mb-6">
              <img src={logo} alt="HOMIE.VN" style={{ height: 52, width: 'auto' }} />
            </Link>
            <p className="text-muted mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>Nền tảng công nghệ kết nối Chủ Trọ và Sinh Viên nhanh chóng, an toàn và minh bạch số 1 Việt Nam.</p>
            <div className="flex gap-4">
              <button type="button" aria-label="Facebook" className="text-muted" style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}><Facebook size={24}/></button>
              <button type="button" aria-label="Instagram" className="text-muted" style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}><Instagram size={24}/></button>
            </div>
          </div>

          <div>
            <h4 className="heading-3 mb-6" style={{ fontSize: '1.25rem' }}>Dịch Vụ</h4>
            <ul className="flex-col gap-4" style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/search" style={{ color: 'rgba(255,255,255,0.6)' }}>Dành cho Sinh Viên</Link></li>
              <li><Link to="/landlord" style={{ color: 'rgba(255,255,255,0.6)' }}>Dành cho Chủ Trọ</Link></li>
              <li><a href="#pricing" style={{ color: 'rgba(255,255,255,0.6)' }}>Bảng giá dịch vụ</a></li>
              <li><Link to="/student/roommate-finder" style={{ color: 'rgba(255,255,255,0.6)' }}>Tìm bạn ở ghép</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="heading-3 mb-6" style={{ fontSize: '1.25rem' }}>Liên Hệ</h4>
            <ul className="flex-col gap-4" style={{ listStyle: 'none', padding: 0 }}>
              <li className="flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Phone size={20} /> Hotline: 1900 15xx
              </li>
              <li className="flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Mail size={20} /> cskh@homie.vn
              </li>
              <li className="flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <MapPin size={20} /> 123 Đường XYZ, TP. Thủ Đức, HCM
              </li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
          <span suppressHydrationWarning>{new Date().getFullYear()}</span> HOMIE.VN. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
