import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check } from 'lucide-react';
import GlassModal from './GlassModal';
import { formatCurrency } from '../../utils/format';
import { VIP_MONTHLY_PRICE, VIP_ANNUAL_PRICE, VIP_MONTHLY_DAYS, VIP_ANNUAL_DAYS } from '../../data/mockData';

const VipPurchaseModal = ({ isOpen, onClose, currentUser, onConfirm, buySuccess }) => {
  const [buyPlan, setBuyPlan] = useState('monthly');
  const navigate = useNavigate();

  const walletBalance = currentUser?.wallet_balance || 0;
  const requiredPrice = buyPlan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE;
  const isInsufficient = walletBalance < requiredPrice;

  const handleClose = () => {
    if (!buySuccess) {
      setBuyPlan('monthly');
      onClose();
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Mua Gói Đẩy tin"
    >
      {buySuccess ? (
        <div className="flex-col gap-4" style={{ textAlign: 'center', padding: '20px' }}>
          <div className="modal-success-icon">
            <Check size={44} className="text-success" />
          </div>
          <h3 className="heading-3">Kích hoạt thành công! 🎉</h3>
          <p className="text-muted">Gói Đẩy tin đã được kích hoạt. Tận hưởng các quyền lợi đặc biệt!</p>
        </div>
      ) : (
        <div className="flex-col gap-4">
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Chọn gói phù hợp với nhu cầu của bạn.
          </p>

          {/* Plan selector */}
          <div className="vip-plan-grid" aria-label="Chọn Gói Đẩy tin">
            <button
              type="button"
              aria-pressed={buyPlan === 'monthly'}
              onClick={() => setBuyPlan('monthly')}
              className={`vip-plan-option ${buyPlan === 'monthly' ? 'vip-plan-option--monthly' : ''}`}
              style={buyPlan !== 'monthly' ? { border: '1px solid var(--glass-border)', background: 'white' } : undefined}
            >
              <div className="vip-plan-option__label">Gói Tháng</div>
              <div className="vip-plan-option__price">{formatCurrency(VIP_MONTHLY_PRICE)}₫</div>
              <div className="vip-plan-option__days">{VIP_MONTHLY_DAYS} ngày</div>
            </button>

            <button
              type="button"
              aria-pressed={buyPlan === 'annual'}
              onClick={() => setBuyPlan('annual')}
              className={`vip-plan-option ${buyPlan === 'annual' ? 'vip-plan-option--annual' : ''}`}
              style={buyPlan !== 'annual' ? { border: '1px solid var(--glass-border)', background: 'white' } : undefined}
            >
              <span className="badge badge-vip vip-plan-badge-annual">-20%</span>
              <div className="vip-plan-option__label">Gói Năm</div>
              <div className={`vip-plan-option__price ${buyPlan === 'annual' ? 'vip-plan-option__price--annual' : ''}`}>
                {formatCurrency(VIP_ANNUAL_PRICE)}₫
              </div>
              <div className="vip-plan-option__days">{VIP_ANNUAL_DAYS} ngày</div>
            </button>
          </div>

          {/* Wallet balance */}
          <div className="vip-wallet-row">
            <span className="vip-wallet-label">Số dư ví:</span>
            <span className="vip-wallet-amount">{formatCurrency(walletBalance)}₫</span>
          </div>

          {/* Insufficient funds warning */}
          {isInsufficient && (
            <div id="insufficient-funds-desc" className="insufficient-funds-box">
              ⚠️ Số dư không đủ.{' '}
              <button
                type="button"
                onClick={() => { handleClose(); navigate('/wallet'); }}
                style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Nạp tiền ngay
              </button>
            </div>
          )}

          {/* Confirm button */}
          <button
            type="button"
            className="btn btn-primary pricing-modal-confirm"
            onClick={() => onConfirm(buyPlan)}
            disabled={isInsufficient}
            aria-describedby={isInsufficient ? 'insufficient-funds-desc' : undefined}
            style={{ opacity: isInsufficient ? 0.5 : 1 }}
          >
            <Crown size={18} aria-hidden="true" /> Thanh toán &amp; Kích hoạt VIP
          </button>
        </div>
      )}
    </GlassModal>
  );
};

export default VipPurchaseModal;
