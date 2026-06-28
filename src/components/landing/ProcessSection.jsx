import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { ImagePlus, Rocket, ShieldCheck, UserPlus } from 'lucide-react';
import ads1 from '../../assets/ads/ads1.jpg';
import ads2 from '../../assets/ads/ads2.jpg';

const STEPS = [
  {
    icon: <UserPlus size={28}/>,
    title: "1. Đăng ký tài khoản",
    desc: "Tạo tài khoản Chủ trọ/Môi giới trong 1 phút.",
    story: "Bạn bắt đầu từ một căn phòng còn trống và một nhóm sinh viên đang cần chỗ ở thật."
  },
  {
    icon: <ImagePlus size={28}/>,
    title: "2. Đăng tin & Chọn gói",
    desc: "Nhập thông tin phòng, up ảnh và chọn gói Tin Thường/VIP.",
    story: "Hình ảnh, giá và tiện ích được gom lại thành một tin rõ ràng, dễ tin."
  },
  {
    icon: <ShieldCheck size={28}/>,
    title: "3. Chờ kiểm duyệt",
    desc: "Admin của HOMIE.VN xác thực thông tin nhanh chóng.",
    story: "Tin được kiểm tra trước khi xuất hiện để người thuê không phải đoán đâu là phòng thật."
  },
  {
    icon: <Rocket size={28}/>,
    title: "4. Tiếp cận sinh viên",
    desc: "Phòng của bạn xuất hiện trên bản đồ số, sinh viên đặt lịch ngay.",
    story: "Từ đó, phòng không chỉ được đăng lên, mà đi đúng tới người đang tìm."
  }
];

const ProcessSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const animations = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      const headlineAnimation = animate(section.querySelectorAll('.process-story-copy, .process-story-pill'), {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 720,
        delay: stagger(90),
        ease: 'outCubic'
      });

      const stepAnimation = animate(section.querySelectorAll('.process-step-card'), {
        opacity: [0, 1],
        translateX: [-22, 0],
        scale: [0.97, 1],
        duration: 780,
        delay: stagger(120, { start: 180 }),
        ease: 'outBack(1.3)'
      });

      const adAnimation = animate(section.querySelectorAll('.process-ad'), {
        opacity: [0, 1],
        translateY: [28, 0],
        scale: [0.94, 1],
        duration: 860,
        delay: stagger(140, { start: 360 }),
        ease: 'outCubic'
      });

      animations.push(headlineAnimation, stepAnimation, adAnimation);
      observer.disconnect();
    }, { threshold: 0.28 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} id="process" aria-label="Quy trình" className="section-padding" style={{ background: 'white' }}>
      <div className="container">
        <h2 className="section-title">Quy Trình Đơn Giản</h2>
        <p className="section-subtitle">Chỉ với 4 bước, phòng của bạn sẽ tiếp cận ngay hàng vạn sinh viên đang có nhu cầu thực sự.</p>
        <div className="process-story-copy">
          <span className="process-story-pill">Câu chuyện Homie</span>
          <p>Một phòng trống không tự tìm được người thuê. Homie biến nó thành một hành trình rõ ràng: đăng nhanh, duyệt thật, rồi gặp đúng sinh viên cần phòng.</p>
        </div>

        <div className="process-ad-layout">
          <aside className="process-ad process-ad--left" aria-label="Quảng cáo dịch vụ chuyển nhà Ahamove">
            <img src={ads1} alt="Ahamove - Dịch vụ chuyển nhà" loading="lazy" />
          </aside>

          <div className="process-steps">
            {/* Vertical connecting line */}
            <div className="desktop-only" style={{ position: 'absolute', left: 'clamp(30px, 5vw, 40px)', top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, var(--primary), var(--accent), transparent)', opacity: 0.3 }}></div>
            {STEPS.map((step) => (
              <div key={step.title} className="glass step-card process-step-card" style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
                <div className="step-icon-box">
                  {step.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="heading-3 mb-1">{step.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>{step.desc}</p>
                  <p className="process-step-story">{step.story}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="process-ad process-ad--right" aria-label="Quảng cáo nội thất phòng trọ">
            <img src={ads2} alt="Nội thất Tân Á - Combo nội thất phòng trọ" loading="lazy" />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
