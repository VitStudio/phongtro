import React from 'react';
import { UserPlus, ImagePlus, ShieldCheck, Rocket } from 'lucide-react';
import ads1 from '../../assets/ads/ads1.jpg';
import ads2 from '../../assets/ads/ads2.jpg';

const STEPS = [
  { icon: <UserPlus size={28}/>, title: "1. Đăng ký tài khoản", desc: "Tạo tài khoản Chủ trọ/Môi giới trong 1 phút." },
  { icon: <ImagePlus size={28}/>, title: "2. Đăng tin & Chọn gói", desc: "Nhập thông tin phòng, up ảnh và chọn gói Tin Thường/VIP." },
  { icon: <ShieldCheck size={28}/>, title: "3. Chờ kiểm duyệt", desc: "Admin của HOMIE.VN xác thực thông tin nhanh chóng." },
  { icon: <Rocket size={28}/>, title: "4. Tiếp cận sinh viên", desc: "Phòng của bạn xuất hiện trên bản đồ số, sinh viên đặt lịch ngay." }
];

const ProcessSection = () => {
  return (
    <section id="process" aria-label="Quy trình" className="section-padding" style={{ background: 'white' }}>
      <div className="container">
        <h2 className="section-title">Quy Trình Đơn Giản</h2>
        <p className="section-subtitle">Chỉ với 4 bước, phòng của bạn sẽ tiếp cận ngay hàng vạn sinh viên đang có nhu cầu thực sự.</p>

        <div className="process-ad-layout">
          <aside className="process-ad process-ad--left" aria-label="Quảng cáo dịch vụ chuyển trọ 247 Express">
            <img src={ads1} alt="247 Express - Dịch vụ chuyển trọ" loading="lazy" />
          </aside>

          <div className="process-steps">
            {/* Vertical connecting line */}
            <div className="desktop-only" style={{ position: 'absolute', left: 'clamp(30px, 5vw, 40px)', top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, var(--primary), var(--accent), transparent)', opacity: 0.3 }}></div>
            {STEPS.map((step, index) => (
              <div key={step.title} className="glass step-card" style={{ padding: 'clamp(16px, 3vw, 24px)', animation: 'fadeInUp 0.6s ease-out forwards', animationDelay: `${index * 0.15}s`, opacity: 0 }}>
                <div className="step-icon-box">
                  {step.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="heading-3 mb-1">{step.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="process-ad process-ad--right" aria-label="Quảng cáo dịch vụ chuyển nhà Ahamove">
            <img src={ads2} alt="Ahamove - Dịch vụ chuyển nhà" loading="lazy" />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
