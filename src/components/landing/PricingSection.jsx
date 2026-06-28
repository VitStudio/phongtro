import React, { useReducer, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Crown, LogIn } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import GlassModal from '../ui/GlassModal';
import VipPurchaseModal from '../ui/VipPurchaseModal';
import {
  VIP_MONTHLY_PRICE, VIP_ANNUAL_PRICE
} from '../../data/mockData';
import { formatCurrency } from '../../utils/format';

// ─── Reducer ────────────────────────────────────────────────────────────────

const initialPurchaseState = {
  showVipModal: false,
  buySuccess: false,
  showLoginPrompt: false,
};

const purchaseReducer = (state, action) => {
  switch (action.type) {
    case 'promptLogin':
      return { ...state, showLoginPrompt: true };
    case 'closeLoginPrompt':
      return { ...state, showLoginPrompt: false };
    case 'openVipModal':
      return { ...state, showVipModal: true, buySuccess: false };
    case 'purchaseSuccess':
      return { ...state, buySuccess: true };
    case 'closeVipModal':
      return { ...state, showVipModal: false, buySuccess: false };
    default:
      return state;
  }
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const FeatureItem = ({ iconClass = 'text-success', bold = false, children }) => (
  <li className="flex items-center gap-3">
    <Check className={iconClass} size={20} aria-hidden="true" />
    <span className={bold ? 'pricing-feat-bold' : 'text-muted'}>{children}</span>
  </li>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [purchaseState, dispatchPurchase] = useReducer(purchaseReducer, initialPurchaseState);
  const { showVipModal, buySuccess, showLoginPrompt } = purchaseState;

  const { currentUser, login, buySubscription, addTransaction } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleBuyVip = () => {
    if (!currentUser) {
      dispatchPurchase({ type: 'promptLogin' });
      return;
    }
    dispatchPurchase({ type: 'openVipModal', plan: isAnnual ? 'annual' : 'monthly' });
  };

  const handleConfirmBuy = (plan) => {
    const success = buySubscription(currentUser.id, plan);
    if (success) {
      const price = plan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE;
      addTransaction({
        user_id: currentUser.id,
        type: 'deposit',
        amount: -price,
        method: 'vip_subscription',
        status: 'completed',
        description: `Mua gói VIP ${plan === 'annual' ? 'Năm' : 'Tháng'} qua Landing`,
      });
      dispatchPurchase({ type: 'purchaseSuccess' });
      setTimeout(() => dispatchPurchase({ type: 'closeVipModal' }), 2000);
      toast.success(`🎉 Kích hoạt VIP ${plan === 'annual' ? 'Năm' : 'Tháng'} thành công!`);
    } else {
      toast.error('Số dư không đủ. Vui lòng nạp thêm tiền!');
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────

  const vipPrice = isAnnual ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE;
  const vipPeriodLabel = isAnnual ? 'năm' : 'tháng';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section id="pricing" aria-label="Bảng giá" className="section-padding">
      <div className="container flex-col items-center">

        {/* Header */}
        <h2 className="section-title">Bảng Giá Cho Chủ Trọ</h2>
        <p className="section-subtitle">
          Đầu tư nhỏ, tiếp cận hàng vạn sinh viên. Chọn gói phù hợp với nhu cầu của bạn.
        </p>

        {/* Monthly / Annual toggle */}
        <div className="pricing-toggle-row">
          <span className={!isAnnual ? 'text-primary' : 'text-muted'} style={{ fontWeight: 600 }}>
            Tháng
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isAnnual}
              onChange={() => setIsAnnual(!isAnnual)}
              aria-label="Chuyển đổi giá tháng/năm"
            />
            <span className="slider" />
          </label>
          <span className={isAnnual ? 'text-primary' : 'text-muted'} style={{ fontWeight: 600 }}>
            Năm{' '}
            <span className="badge badge-vip pricing-badge-pill">Giảm 20%</span>
          </span>
          {/* Live region for screen-readers */}
          <span aria-live="polite" className="sr-only">
            {isAnnual ? 'Đã chuyển sang giá năm' : 'Đã chuyển sang giá tháng'}
          </span>
        </div>

        {/* Pricing cards */}
        <div className="pricing-grid">

          {/* ── Gói Thường ── */}
          <div className="pricing-card">
            <h3 className="heading-3 mb-2">Tin Thường</h3>
            <p className="text-muted mb-6">
              Mức giá rẻ để lọc tin rác, phù hợp chủ nhà lâu lâu mới trống phòng.
            </p>
            <div className="heading-1 mb-8" style={{ fontSize: '1.75rem' }}>
              5% giá phòng{' '}
              <span className="pricing-price-unit">/ tin</span>
            </div>
            <ul className="pricing-feat-list flex-col gap-4 mb-8 flex-1">
              <FeatureItem>Bài đăng tồn tại trong 15 ngày</FeatureItem>
              <FeatureItem>100% Xác thực thực địa (On-site)</FeatureItem>
              <FeatureItem>Gắn nhãn "Đã xác thực"</FeatureItem>
              <FeatureItem>Tối đa 200.000₫ / tin</FeatureItem>
            </ul>
            <Link to="/landlord/create" className="btn btn-outline w-full justify-center">
              Đăng Ký Ngay
            </Link>
          </div>

          {/* ── Gói VIP ── */}
          <div className="pricing-card pricing-card--vip">
            <div className="badge badge-vip mb-4 pricing-badge-popular">PHỔ BIẾN NHẤT</div>
            <h3 className="heading-3 mb-2">Gói VIP</h3>
            <p className="text-muted mb-6">
              Tiếp cận tối đa sinh viên. Phù hợp chủ nhà muốn lấp phòng gấp.
            </p>
            <div className="heading-1 text-gradient mb-8" style={{ fontSize: '1.75rem' }}>
              {formatCurrency(vipPrice)}₫{' '}
              <span className="pricing-price-unit">/ {vipPeriodLabel}</span>
            </div>
            <ul className="pricing-feat-list flex-col gap-4 mb-8 flex-1">
              <FeatureItem iconClass="text-primary" bold>5% giá phòng / tin</FeatureItem>
              <FeatureItem iconClass="text-primary" bold>Được ghim lên đầu trang tìm kiếm</FeatureItem>
              <FeatureItem iconClass="text-primary">Làm mới tin mỗi 4h</FeatureItem>
              <FeatureItem iconClass="text-primary">100% Xác thực thực địa (On-site)</FeatureItem>
              <FeatureItem iconClass="text-primary">Tối đa 200.000₫ / tin</FeatureItem>
            </ul>
            <button type="button" className="btn btn-primary w-full justify-center" onClick={handleBuyVip}>
              <Crown size={18} aria-hidden="true" /> Mua Gói VIP
            </button>
          </div>

          {/* ── Thuê Bao Chuyên Nghiệp ── */}
          <div className="pricing-card pricing-card--pro">
            <h3 className="heading-3 mb-2">Thuê Bao Chuyên Nghiệp</h3>
            <p className="text-muted mb-6 flex-1">
              Dành cho môi giới BĐS, quản lý chuỗi chung cư mini nhiều phòng.
            </p>
            <button
              type="button"
              className="btn btn-outline w-full justify-center"
              onClick={() => document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Liên Hệ Tư Vấn
            </button>
          </div>

        </div>
      </div>

      {/* ── Login Prompt Modal ── */}
      <GlassModal
        isOpen={showLoginPrompt}
        onClose={() => dispatchPurchase({ type: 'closeLoginPrompt' })}
        title="Đăng nhập để mua VIP"
      >
        <div className="flex-col gap-4 pricing-login-centered">
          <div className="pricing-login-emoji">🔑</div>
          <p className="text-muted">Vui lòng đăng nhập với vai trò Chủ Trọ để mua gói VIP.</p>
          <div className="flex gap-3 justify-center flex-wrap mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                login('u2');
                dispatchPurchase({ type: 'closeLoginPrompt' });
                toast.success('Đã đăng nhập với tư cách Chủ Trọ!');
              }}
            >
              <LogIn size={16} aria-hidden="true" /> Đăng nhập Chủ Trọ
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => { dispatchPurchase({ type: 'closeLoginPrompt' }); navigate('/search'); }}
            >
              Tìm phòng ngay
            </button>
          </div>
        </div>
      </GlassModal>

      <VipPurchaseModal
        isOpen={showVipModal}
        onClose={() => dispatchPurchase({ type: 'closeVipModal' })}
        currentUser={currentUser}
        onConfirm={handleConfirmBuy}
        buySuccess={buySuccess}
      />
    </section>
  );
};

export default PricingSection;
