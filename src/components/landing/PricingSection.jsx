import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Crown, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GlassModal from '../ui/GlassModal';
import {
  VIP_MONTHLY_PRICE, VIP_ANNUAL_PRICE,
  VIP_MONTHLY_DAYS, VIP_ANNUAL_DAYS,
  BASIC_LISTING_PRICE
} from '../../data/mockData';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [buyPlan, setBuyPlan] = useState('monthly');
  const [buySuccess, setBuySuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { currentUser, login, buySubscription, addTransaction } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleBuyVip = () => {
    if (!currentUser) {
      setShowVipModal(false);
      setShowLoginPrompt(true);
      return;
    }
    setBuyPlan(isAnnual ? 'annual' : 'monthly');
    setBuySuccess(false);
    setShowVipModal(true);
  };

  const handleConfirmBuy = () => {
    const success = buySubscription(currentUser.id, buyPlan);
    if (success) {
      const price = buyPlan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE;
      addTransaction({
        user_id: currentUser.id,
        type: 'deposit',
        amount: -price,
        method: 'vip_subscription',
        status: 'completed',
        description: `Mua gói VIP ${buyPlan === 'annual' ? 'Năm' : 'Tháng'} qua Landing`
      });
      setBuySuccess(true);
      setTimeout(() => {
        setShowVipModal(false);
        setBuySuccess(false);
      }, 2000);
      toast.success(`🎉 Kích hoạt VIP ${buyPlan === 'annual' ? 'Năm' : 'Tháng'} thành công!`);
    } else {
      toast.error('Số dư không đủ. Vui lòng nạp thêm tiền!');
    }
  };

  const f = (n) => (Number(n) || 0).toLocaleString('vi-VN');

  return (
    <section id="pricing" className="section-padding" style={{ background: 'var(--bg-color)' }}>
      <div className="container flex-col items-center">
        <h2 className="section-title">Bảng Giá Cho Chủ Trọ</h2>
        <p className="section-subtitle">Đầu tư nhỏ, tiếp cận hàng vạn sinh viên. Chọn gói phù hợp với nhu cầu của bạn.</p>

        <div className="flex items-center gap-4 mb-12">
          <span className={!isAnnual ? 'text-primary' : 'text-muted'} style={{ fontWeight: 600 }}>Tháng</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={isAnnual} onChange={() => setIsAnnual(!isAnnual)} />
            <span className="slider"></span>
          </label>
          <span className={isAnnual ? 'text-primary' : 'text-muted'} style={{ fontWeight: 600 }}>Năm <span className="badge badge-vip" style={{ marginLeft: 8 }}>Giảm 20%</span></span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', width: '100%', maxWidth: '1100px' }}>
          
          {/* Gói Thường */}
          <div className="glass-card flex-col" style={{ padding: '40px', background: 'white' }}>
            <h3 className="heading-3 mb-2">Tin Thường</h3>
            <p className="text-muted mb-6">Mức giá rẻ để lọc tin rác, phù hợp chủ nhà lâu lâu mới trống phòng.</p>
            <div className="heading-1 mb-8">{f(BASIC_LISTING_PRICE)}₫ <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ tin</span></div>
            <div className="flex-col gap-4 mb-8 flex-1">
              <div className="flex items-center gap-3"><Check className="text-success" size={20} /> <span className="text-muted">Hiển thị sau tin VIP</span></div>
              <div className="flex items-center gap-3"><Check className="text-success" size={20} /> <span className="text-muted">Tồn tại 30 ngày</span></div>
              <div className="flex items-center gap-3"><Check className="text-success" size={20} /> <span className="text-muted">Duyệt tin trong 24h</span></div>
            </div>
            <Link to="/landlord/create" className="btn btn-outline w-full justify-center" style={{ textDecoration: 'none' }}>Đăng Ký Ngay</Link>
          </div>

          {/* Gói VIP */}
          <div className="glass-card flex-col pricing-vip-card" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(236, 72, 153, 0.05))', border: '2px solid var(--primary)' }}>
            <div className="badge badge-vip mb-4" style={{ alignSelf: 'flex-start' }}>PHỔ BIẾN NHẤT</div>
            <h3 className="heading-3 mb-2">Gói VIP</h3>
            <p className="text-muted mb-6">Tiếp cận tối đa sinh viên. Phù hợp chủ nhà muốn lấp phòng gấp.</p>
            <div className="heading-1 text-gradient mb-8">
              {isAnnual ? `${f(VIP_ANNUAL_PRICE)}₫` : `${f(VIP_MONTHLY_PRICE)}₫`} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {isAnnual ? 'năm' : 'tháng'}</span>
            </div>
            <div className="flex-col gap-4 mb-8 flex-1">
              <div className="flex items-center gap-3"><Check className="text-primary" size={20} /> <span style={{ fontWeight: 600 }}>Ghim lên đầu trang tìm kiếm</span></div>
              <div className="flex items-center gap-3"><Check className="text-primary" size={20} /> <span style={{ fontWeight: 600 }}>Huy hiệu ĐỐI TÁC VIP</span></div>
              <div className="flex items-center gap-3"><Check className="text-primary" size={20} /> <span className="text-muted">Làm mới tin mỗi 4h</span></div>
              <div className="flex items-center gap-3"><Check className="text-primary" size={20} /> <span className="text-muted">Duyệt tin ưu tiên 1h</span></div>
              <div className="flex items-center gap-3"><Check className="text-primary" size={20} /> <span className="text-muted">Miễn phí đăng tin (VIP) {isAnnual ? '365' : '30'} ngày</span></div>
            </div>
            <button className="btn btn-primary w-full justify-center" onClick={handleBuyVip}>
              <Crown size={18} /> Mua Gói VIP
            </button>
          </div>

          {/* Subscription */}
          <div className="glass-card flex-col" style={{ padding: '40px', background: 'white' }}>
            <h3 className="heading-3 mb-2">Thuê Bao Chuyên Nghiệp</h3>
            <p className="text-muted mb-6">Dành cho môi giới BĐS, quản lý chuỗi chung cư mini nhiều phòng.</p>
            <div className="heading-1 mb-8">
              {isAnnual ? `${f(VIP_ANNUAL_PRICE)}₫` : `${f(VIP_MONTHLY_PRICE)}₫`} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}> + {f(BASIC_LISTING_PRICE)}₫/tin</span>
            </div>
            <div className="flex-col gap-4 mb-8 flex-1">
              <div className="flex items-center gap-3"><Check className="text-success" size={20} /> <span className="text-muted">Đăng không giới hạn (+15k/tin)</span></div>
              <div className="flex items-center gap-3"><Check className="text-success" size={20} /> <span className="text-muted">Dashboard quản lý riêng</span></div>
              <div className="flex items-center gap-3"><Check className="text-success" size={20} /> <span className="text-muted">Báo cáo lượt xem chi tiết</span></div>
            </div>
            <button className="btn btn-outline w-full justify-center" onClick={() => {
              document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>Liên Hệ Tư Vấn</button>
          </div>

        </div>
      </div>

      {/* ── Login Prompt Modal ── */}
      <GlassModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} title="Đăng nhập để mua VIP">
        <div className="flex-col gap-4" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔑</div>
          <p className="text-muted">Vui lòng đăng nhập với vai trò Chủ Trọ để mua gói VIP.</p>
          <div className="flex gap-3 justify-center flex-wrap mt-4">
            <button className="btn btn-primary" onClick={() => { login('u2'); setShowLoginPrompt(false); toast.success('Đã đăng nhập với tư cách Chủ Trọ!'); }}>
              <LogIn size={16} /> Đăng nhập Chủ Trọ
            </button>
            <button className="btn btn-outline" onClick={() => { setShowLoginPrompt(false); navigate('/search'); }}>
              Tìm phòng ngay
            </button>
          </div>
        </div>
      </GlassModal>

      {/* ── Buy VIP Modal ── */}
      <GlassModal isOpen={showVipModal} onClose={() => { if (!buySuccess) setShowVipModal(false); }} title="Mua Gói VIP">
        {buySuccess ? (
          <div className="flex-col gap-4" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <Check size={44} className="text-success" />
            </div>
            <h3 className="heading-3">Kích hoạt thành công! 🎉</h3>
            <p className="text-muted">Gói VIP đã được kích hoạt. Tận hưởng các quyền lợi đặc biệt!</p>
          </div>
        ) : (
          <div className="flex-col gap-4">
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Chọn gói phù hợp với nhu cầu của bạn.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div
                onClick={() => setBuyPlan('monthly')}
                style={{
                  padding: '20px', borderRadius: '14px', cursor: 'pointer', textAlign: 'center',
                  border: buyPlan === 'monthly' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                  background: buyPlan === 'monthly' ? 'rgba(99,102,241,0.04)' : 'white'
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Gói Tháng</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{f(VIP_MONTHLY_PRICE)}₫</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{VIP_MONTHLY_DAYS} ngày</div>
              </div>
              <div
                onClick={() => setBuyPlan('annual')}
                style={{
                  padding: '20px', borderRadius: '14px', cursor: 'pointer', textAlign: 'center', position: 'relative',
                  border: buyPlan === 'annual' ? '2px solid var(--warning)' : '1px solid var(--glass-border)',
                  background: buyPlan === 'annual' ? 'rgba(245,158,11,0.04)' : 'white'
                }}
              >
                <span className="badge badge-vip" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem' }}>-20%</span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Gói Năm</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, var(--warning), var(--danger))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{f(VIP_ANNUAL_PRICE)}₫</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{VIP_ANNUAL_DAYS} ngày</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Số dư ví:</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{f(currentUser?.wallet_balance)}₫</span>
            </div>

            {(currentUser?.wallet_balance || 0) < (buyPlan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE) && (
              <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>
                ⚠️ Số dư không đủ.{' '}
                <button onClick={() => { setShowVipModal(false); navigate('/wallet'); }} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Nạp tiền ngay
                </button>
              </div>
            )}

            <button
              className="btn btn-primary w-full justify-center"
              onClick={handleConfirmBuy}
              disabled={(currentUser?.wallet_balance || 0) < (buyPlan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE)}
              style={{ padding: '14px', opacity: (currentUser?.wallet_balance || 0) < (buyPlan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE) ? 0.5 : 1 }}
            >
              <Crown size={18} /> Thanh toán & Kích hoạt VIP
            </button>
          </div>
        )}
      </GlassModal>
    </section>
  );
};

export default PricingSection;
