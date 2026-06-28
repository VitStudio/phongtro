import React from 'react';
import { CheckCircle, MapPin } from 'lucide-react';

const SolutionSection = () => {
  return (
    <section id="solutions" aria-label="Giải pháp" className="section-padding solution-section-bg">
      <div className="container flex-col items-center">
        <h2 className="section-title">Giải Pháp Từ HOMIE.VN</h2>
        <p className="section-subtitle">Tập hợp thông tin rõ ràng, thuật toán bản đồ số và kiểm duyệt chặt chẽ.</p>
        <div className="grid-responsive animate-slide-left solution-grid">
          <div className="glass solution-image-card">
            <div className="desktop-only solution-blur-spot"></div>
            <img 
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800" 
              alt="Giao diện bản đồ số" 
              className="solution-image"
            />
            <div className="glass-card solution-map-card">
              <MapPin className="text-primary shrink-0" size={28} />
              <div className="min-w-0">
                <div className="solution-map-title">Bản đồ số thông minh</div>
                <div className="text-muted text-xs">Tìm phòng quanh trường học</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="heading-2 mb-6 text-gradient">Chuẩn hóa trải nghiệm thuê phòng</h3>
            <p className="text-muted mb-8 text-lg">
              Chúng tôi thay đổi hoàn toàn cách sinh viên tìm phòng và cách chủ nhà tiếp cận khách hàng thông qua công nghệ.
            </p>
            
            <div className="flex-col gap-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-success mt-1" size={24} />
                <div>
                  <h4 className="heading-3 mb-1 solution-feature-title">Kiểm duyệt 100%</h4>
                  <p className="text-muted">Đội ngũ admin xác thực từng bài đăng trước khi hiển thị.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-success mt-1" size={24} />
                <div>
                  <h4 className="heading-3 mb-1 solution-feature-title">Cọc giữ chỗ qua nền tảng</h4>
                  <p className="text-muted">Giao dịch 200k an toàn qua cổng thanh toán, hoàn trả sau khi xem.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-success mt-1" size={24} />
                <div>
                  <h4 className="heading-3 mb-1 solution-feature-title">Tiếp cận tệp Sinh viên chất lượng</h4>
                  <p className="text-muted">Giúp chủ trọ tăng tỷ lệ lấp đầy phòng trống nhanh chóng.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-success mt-1" size={24} />
                <div>
                  <h4 className="heading-3 mb-1 solution-feature-title">Thuật toán đẩy tin vàng</h4>
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
