import React from 'react';
import { UploadCloud, Filter, CalendarCheck, Users, Shield, CreditCard } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    { icon: <UploadCloud size={32}/>, title: "Đăng Tin Dễ Dàng", desc: "Quản lý phòng trọ, tải ảnh sắc nét và theo dõi lượt xem chi tiết dành cho chủ nhà." },
    { icon: <Filter size={32}/>, title: "Bộ Lọc Thông Minh", desc: "Sinh viên dễ dàng tìm phòng theo giá cả, diện tích, tiện ích và vị trí bản đồ số." },
    { icon: <CalendarCheck size={32}/>, title: "Đặt Lịch Xem Phòng", desc: "Cọc 200k an toàn trên hệ thống. Tránh boom hàng, đảm bảo uy tín hai bên." },
    { icon: <Users size={32}/>, title: "Tìm Bạn Ở Ghép", desc: "Công cụ kết nối miễn phí giúp sinh viên tự tìm roommate phù hợp lối sống." },
    { icon: <Shield size={32}/>, title: "Kiểm Duyệt Khắt Khe", desc: "Gắn huy hiệu 'Chủ trọ uy tín' & 'Phòng đã xác thực' để loại bỏ 100% tin rác." },
    { icon: <CreditCard size={32}/>, title: "Thanh Toán Nhanh", desc: "Tích hợp ví điện tử, nạp tiền tự động mua các gói đẩy tin VIP." }
  ];

  return (
    <section id="features" className="section-padding" style={{ background: 'white' }}>
      <div className="container">
        <h2 className="section-title">Tính Năng Nổi Bật</h2>
        <p className="section-subtitle">Mọi công cụ bạn cần để cho thuê phòng nhanh hơn và tìm phòng an toàn hơn.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {features.map((item, index) => (
            <div key={index} className="glass-card animate-fade-in-up" style={{ padding: '32px', transitionDelay: `${index * 0.1}s` }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '16px', 
                background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: '24px' 
              }}>
                {item.icon}
              </div>
              <h3 className="heading-3 mb-4">{item.title}</h3>
              <p className="text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
