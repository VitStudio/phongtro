import React from 'react';
import { AlertTriangle, Map, DollarSign } from 'lucide-react';

const ProblemSection = () => {
  return (
    <section id="problems" aria-label="Vấn đề" className="section-padding" style={{ background: 'white' }}>
      <div className="container">
        <h2 className="section-title">Thực Trạng Khó Khăn</h2>
        <p className="section-subtitle">Việc tìm và cho thuê phòng trọ hiện nay đang gặp phải 3 vấn đề lớn khiến cả chủ trọ và sinh viên đều đau đầu.</p>
        
        <div className="feature-grid">
          
          <div className="glass-card animate-slide-up problem-card-center">
            <div className="icon-box-64" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', margin: '0 auto 24px auto' }}>
              <AlertTriangle size={32} />
            </div>
            <h3 className="heading-3 mb-4">Tin Rác & Lừa Đảo</h3>
            <p className="text-muted">Sinh viên liên tục gặp phải các tin đăng ảo trên Facebook, chuyển khoản cọc rồi bị chặn liên lạc, mất tiền oan.</p>
          </div>

          <div className="glass-card animate-slide-up problem-card-center" style={{ transitionDelay: '0.2s' }}>
            <div className="icon-box-64" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', margin: '0 auto 24px auto' }}>
              <Map size={32} />
            </div>
            <h3 className="heading-3 mb-4">Thông Tin Phân Mảnh</h3>
            <p className="text-muted">Thông tin phòng trọ nằm rải rác ở khắp các Group, thiếu bộ lọc rõ ràng, không có bản đồ số khiến việc tìm kiếm khó khăn.</p>
          </div>

          <div className="glass-card animate-slide-up problem-card-center" style={{ transitionDelay: '0.4s' }}>
            <div className="icon-box-64" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', margin: '0 auto 24px auto' }}>
              <DollarSign size={32} />
            </div>
            <h3 className="heading-3 mb-4">Chi Phí Môi Giới Cao</h3>
            <p className="text-muted">Chủ trọ tốn kém nhiều chi phí hoa hồng cho môi giới truyền thống nhưng phòng vẫn bị trống lâu, không tiếp cận đúng tệp sinh viên.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
