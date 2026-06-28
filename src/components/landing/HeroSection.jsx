import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import heroMainImg from '../../assets/img/Ảnh trang chu.png';
import ads1 from '../../assets/ads/ads1.jpg';
import ads2 from '../../assets/ads/ads2.jpg';

const HeroSection = () => {
  return (
    <section aria-label="Giới thiệu" className="hero-section-wrap">
      {/* Decorative background blobs — hidden on small screens */}
      <div className="desktop-only hero-blob" style={{ top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--primary)' }}></div>
      <div className="desktop-only hero-blob" style={{ bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'var(--secondary)' }}></div>

      <div className="hero-ad-layout">
        <aside className="hero-ad hero-ad--left" aria-label="Quảng cáo dịch vụ chuyển trọ 247 Express">
          <img src={ads1} alt="247 Express - Dịch vụ chuyển trọ" loading="lazy" />
        </aside>

        <div className="container flex-col items-center justify-center animate-fade-in-up hero-content">
          
          <div className="badge hero-badge mb-6">
            <Star size={16} style={{ marginRight: 8 }} /> Nền tảng tìm phòng số 1 cho Sinh Viên
          </div>
          
          <h1 className="heading-1 hero-title mb-6">
            Tìm phòng trọ GenZ. <br/>
            <span className="text-gradient">Nhanh chóng & An toàn.</span>
          </h1>
          
          <p className="text-muted hero-subtitle mb-10">
            Đập tan nỗi lo lừa đảo, cọc ảo. HOMIE.VN mang đến hàng ngàn phòng trọ xác thực, hỗ trợ đặt lịch dễ dàng và hoàn cọc 100% nếu không ưng ý.
          </p>
          
          <div className="hero-cta-row">
            <Link to="/search" className="btn btn-primary hero-btn">
              Tìm phòng ngay <ArrowRight size={20} />
            </Link>
            <a href="#pricing" className="btn btn-outline hero-btn" style={{ background: 'white' }}>
              Dành cho Chủ Trọ
            </a>
          </div>
          
          {/* Mockup / Stats */}
          <div className="glass hero-card">
            <img 
              src={heroMainImg} 
              alt="Giao diện ứng dụng tìm phòng trọ" 
              className="hero-main-img"
            />
            
            <div className="hero-stats">
              <div>
                <div className="heading-2 text-primary" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: 4 }}>1000+</div>
                <div className="text-muted" style={{ fontWeight: 500, fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>Phòng Trọ Đã Xác Thực</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', padding: '0 8px' }} className="stats-border">
                <div className="heading-2 text-secondary" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: 4 }}>10,000+</div>
                <div className="text-muted" style={{ fontWeight: 500, fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>Sinh Viên Tin Dùng</div>
              </div>
              <div>
                <div className="heading-2 text-success" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: 4 }}>100%</div>
                <div className="text-muted" style={{ fontWeight: 500, fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>Bảo Đảm Hoàn Cọc</div>
              </div>
            </div>
          </div>

        </div>

        <aside className="hero-ad hero-ad--right" aria-label="Quảng cáo dịch vụ chuyển nhà Ahamove">
          <img src={ads2} alt="Ahamove - Dịch vụ chuyển nhà" loading="lazy" />
        </aside>
      </div>
    </section>
  );
};

export default HeroSection;
