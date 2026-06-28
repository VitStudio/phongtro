import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section style={{ 
      paddingTop: 'clamp(80px, 20vw, 160px)', 
      paddingBottom: 'clamp(40px, 10vw, 100px)', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
    }}>
      {/* Abstract Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'var(--secondary)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }}></div>

      <div className="container flex-col items-center justify-center animate-fade-in-up" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        <div className="badge badge-success mb-6" style={{ padding: '8px 16px', fontSize: '0.875rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
          <Star size={16} style={{ marginRight: 8 }} /> Nền tảng tìm phòng số 1 cho Sinh Viên
        </div>
        
        <h1 className="heading-1 mb-6" style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)', maxWidth: '900px', lineHeight: 1.1 }}>
          Tìm phòng trọ GenZ. <br/>
          <span className="text-gradient">Nhanh chóng & An toàn.</span>
        </h1>
        
        <p className="text-muted mb-10" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Đập tan nỗi lo lừa đảo, cọc ảo. HOMIE.VN mang đến hàng ngàn phòng trọ xác thực, hỗ trợ đặt lịch dễ dàng và hoàn cọc 100% nếu không ưng ý.
        </p>
        
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          <Link to="/search" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
            Tìm phòng ngay <ArrowRight size={20} />
          </Link>
          <a href="#pricing" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.125rem', background: 'white' }}>
            Dành cho Chủ Trọ
          </a>
        </div>
        
        {/* Mockup / Stats */}
        <div className="glass" style={{ padding: 'clamp(16px, 4vw, 32px)', borderRadius: '32px', width: '100%', maxWidth: '1000px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
          <img 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200" 
            alt="App Mockup" 
            style={{ width: '100%', height: 'clamp(200px, 40vw, 400px)', objectFit: 'cover', borderRadius: '16px', marginBottom: '32px' }} 
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <div>
              <div className="heading-2 text-primary mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>10,000+</div>
              <div className="text-muted" style={{ fontWeight: 500 }}>Phòng Trọ Đã Xác Thực</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', padding: '0 12px' }} className="stats-border">
              <div className="heading-2 text-secondary mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>50,000+</div>
              <div className="text-muted" style={{ fontWeight: 500 }}>Sinh Viên Tin Dùng</div>
            </div>
            <div>
              <div className="heading-2 text-success mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>100%</div>
              <div className="text-muted" style={{ fontWeight: 500 }}>Bảo Đảm Hoàn Cọc</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
