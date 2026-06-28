import React from 'react';
import { UserPlus, ImagePlus, ShieldCheck, Rocket } from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    { icon: <UserPlus size={28}/>, title: "1. Đăng ký tài khoản", desc: "Tạo tài khoản Chủ trọ/Môi giới trong 1 phút." },
    { icon: <ImagePlus size={28}/>, title: "2. Đăng tin & Chọn gói", desc: "Nhập thông tin phòng, up ảnh và chọn gói Tin Thường/VIP." },
    { icon: <ShieldCheck size={28}/>, title: "3. Chờ kiểm duyệt", desc: "Admin của HOMIE.VN xác thực thông tin nhanh chóng." },
    { icon: <Rocket size={28}/>, title: "4. Tiếp cận sinh viên", desc: "Phòng của bạn xuất hiện trên bản đồ số, sinh viên đặt lịch ngay." }
  ];

  return (
    <section id="process" className="section-padding" style={{ background: 'white' }}>
      <div className="container">
        <h2 className="section-title">Quy Trình Đơn Giản</h2>
        <p className="section-subtitle">Chỉ với 4 bước, phòng của bạn sẽ tiếp cận ngay hàng vạn sinh viên đang có nhu cầu thực sự.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
          {steps.map((step, index) => (
            <div key={index} className="glass flex-responsive gap-6" style={{ padding: '24px', borderRadius: '24px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {step.icon}
              </div>
              <div>
                <h3 className="heading-3 mb-2">{step.title}</h3>
                <p className="text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
