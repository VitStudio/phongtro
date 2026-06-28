import React from 'react';
import { CheckCircle, MapPin } from 'lucide-react';

const SolutionSection = () => {
  return (
    <section id="solutions" className="section-padding" style={{ background: 'var(--bg-color)' }}>
      <div className="container flex-col items-center">
        <h2 className="section-title">Giải Pháp Từ HOMIE.VN</h2>
        <p className="section-subtitle">Tập hợp thông tin rõ ràng, thuật toán bản đồ số và kiểm duyệt chặt chẽ.</p>
        
        <div className="grid-responsive animate-slide-left" style={{ gap: '48px', alignItems: 'center', width: '100%' }}>
          <div className="glass" style={{ padding: 'clamp(16px, 4vw, 32px)', borderRadius: '24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, background: 'var(--success)', filter: 'blur(50px)', opacity: 0.2 }}></div>
            <img 
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800" 
              alt="Map UI" 
              style={{ width: '100%', height: 'auto', borderRadius: '16px' }}
            />
            <div className="glass-card" style={{ position: 'absolute', bottom: 'clamp(-10px, -2vw, -20px)', right: 'clamp(-10px, -2vw, -20px)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin className="text-primary" size={32} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 'clamp(0.875rem, 3vw, 1rem)' }}>Bản đồ số thông minh</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Tìm phòng quanh trường học</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="heading-2 mb-6 text-gradient">Chuẩn hóa trải nghiệm thuê phòng</h3>
            <p className="text-muted mb-8" style={{ fontSize: '1.125rem' }}>
              Chúng tôi thay đổi hoàn toàn cách sinh viên tìm phòng và cách chủ nhà tiếp cận khách hàng thông qua công nghệ.
            </p>
            
            <div className="flex-col gap-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-success mt-1" size={24} />
                <div>
                  <h4 className="heading-3 mb-1" style={{ fontSize: '1.25rem' }}>Kiểm duyệt 100%</h4>
                  <p className="text-muted">Đội ngũ admin xác thực từng bài đăng trước khi hiển thị.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-success mt-1" size={24} />
                <div>
                  <h4 className="heading-3 mb-1" style={{ fontSize: '1.25rem' }}>Cọc giữ chỗ qua nền tảng</h4>
                  <p className="text-muted">Giao dịch 200k an toàn qua cổng thanh toán, hoàn trả sau khi xem.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-success mt-1" size={24} />
                <div>
                  <h4 className="heading-3 mb-1" style={{ fontSize: '1.25rem' }}>Tiếp cận tệp Sinh viên chất lượng</h4>
                  <p className="text-muted">Giúp chủ trọ tăng tỷ lệ lấp đầy phòng trống nhanh chóng.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-success mt-1" size={24} />
                <div>
                  <h4 className="heading-3 mb-1" style={{ fontSize: '1.25rem' }}>Thuật toán đẩy tin vàng</h4>
                  <p className="text-muted">Tự động ưu tiên hiển thị bài đăng vào khung giờ sinh viên hay tìm phòng.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
