import React, { useReducer, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Wallet, Crown,
  Save, Shuffle, CheckCircle, Clock, ArrowRight,
  Shield
} from 'lucide-react';
import { VIP_MONTHLY_PRICE, VIP_ANNUAL_PRICE, VIP_MONTHLY_DAYS, VIP_ANNUAL_DAYS } from '../../data/mockData';
import GlassModal from '../../components/ui/GlassModal';

const f = (n) => (Number(n) || 0).toLocaleString('vi-VN');

const initialVipPurchaseState = {
  showBuyModal: false,
  buyPlan: 'monthly',
  buySuccess: false
};

const vipPurchaseReducer = (state, action) => {
  switch (action.type) {
    case 'open':
      return { showBuyModal: true, buyPlan: action.plan, buySuccess: false };
    case 'setPlan':
      return { ...state, buyPlan: action.plan };
    case 'purchaseSuccess':
      return { ...state, buySuccess: true };
    case 'close':
      return { ...state, showBuyModal: false, buySuccess: false };
    default:
      return state;
  }
};

const RecentTransactions = ({ transactions, onViewAll }) => (
  <div className="glass" style={{ padding: 'clamp(20px, 5vw, 32px)' }}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="heading-3">Giao Dịch Gần Đây</h3>
      <button type="button" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={onViewAll}>
        Xem tất cả
      </button>
    </div>
    {transactions.length > 0 ? (
      <div className="flex-col gap-3">
        {transactions.map(txn => (
          <div key={txn.id} className="transaction-row">
            <div>
              <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{txn.description || 'Giao dịch'}</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(txn.created_at).toLocaleDateString('vi-VN')}</div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontWeight: 700, color: txn.amount > 0 ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem' }}>
                {txn.amount > 0 ? '+' : '-'}{f(Math.abs(txn.amount))}₫
              </span>
              {txn.status === 'completed' ? <CheckCircle size={14} className="text-success" /> : <Clock size={14} className="text-warning" />}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>Chưa có giao dịch nào.</div>
    )}
  </div>
);

const ProfilePage = () => {
  const { currentUser, updateUserProfile, buySubscription, addTransaction, transactions } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    avatarSeed: (currentUser?.avatar || '').split('seed=')[1] || 'User'
  });
  const [vipPurchaseState, dispatchVipPurchase] = useReducer(vipPurchaseReducer, initialVipPurchaseState);
  const { showBuyModal, buyPlan, buySuccess } = vipPurchaseState;

  const sub = currentUser?.subscription;
  const isVip = sub?.status === 'active';
  const daysLeft = isVip
    ? Math.max(0, Math.ceil((new Date(sub.expires_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const myTxns = transactions.filter(t => t.user_id === currentUser?.id).slice(0, 10);

  const handleSave = () => {
    if (!form.name.trim()) { toast.warning('Tên không được để trống'); return; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.warning('Email không hợp lệ'); return;
    }
    if (form.phone && !/^(0|\+84)[3-9][0-9]{8}$/.test(form.phone.replace(/\s/g, ''))) {
      toast.warning('Số điện thoại không hợp lệ'); return;
    }
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.avatarSeed || 'User')}`;
    updateUserProfile(currentUser.id, {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      avatar: newAvatar
    });
    setEditing(false);
    toast.success('Cập nhật thông tin thành công!');
  };

  const handleRandomAvatar = () => {
    const seeds = ['Sunny', 'Rainbow', 'Moon', 'Star', 'Cloud', 'Wave', 'Leaf', 'Pixel', 'Neon', 'Crystal'];
    const seed = seeds[Math.floor(Math.random() * seeds.length)];
    setForm(prev => ({ ...prev, avatarSeed: seed }));
  };

  const handleBuySubscription = () => {
    const success = buySubscription(currentUser.id, buyPlan);
    if (success) {
      const price = buyPlan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE;
      addTransaction({
        user_id: currentUser.id,
        type: 'deposit',
        amount: -price,
        method: 'vip_subscription',
        status: 'completed',
        description: `Mua gói VIP ${buyPlan === 'annual' ? 'Năm' : 'Tháng'}`
      });
      dispatchVipPurchase({ type: 'purchaseSuccess' });
      setTimeout(() => {
        dispatchVipPurchase({ type: 'close' });
      }, 2000);
      toast.success(`🎉 Kích hoạt gói VIP ${buyPlan === 'annual' ? 'Năm' : 'Tháng'} thành công!`);
    } else {
      toast.error('Số dư không đủ. Vui lòng nạp thêm tiền!');
    }
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto 64px auto' }} className="flex-col gap-8 mt-4">
      <h1 className="heading-1" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>👤 Trang Cá Nhân</h1>

      {/* Profile Card */}
      <div className="glass" style={{ padding: 'clamp(24px, 5vw, 40px)' }}>
        <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 32px)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={currentUser?.avatar}
                alt="avatar"
                style={{ width: 120, height: 120, borderRadius: '50%', border: `4px solid ${isVip ? 'var(--warning)' : 'var(--primary)'}`, objectFit: 'cover' }}
              />
              {isVip && (
                <div className="profile-vip-avatar-badge">
                  <Crown size={16} color="white" />
                </div>
              )}
            </div>
            {editing && (
              <div className="flex gap-2 justify-center mt-3">
                <label htmlFor="avatar-seed" style={{ display: 'none' }}>Avatar seed</label>
                <input
                  id="avatar-seed"
                  className="input-field"
                  value={form.avatarSeed}
                  onChange={e => setForm(prev => ({ ...prev, avatarSeed: e.target.value }))}
                  style={{ width: 100, padding: '6px 10px', fontSize: '0.8rem', textAlign: 'center' }}
                  placeholder="seed"
                  aria-label="Avatar seed"
                />
                <button type="button" onClick={handleRandomAvatar} className="btn btn-outline" style={{ padding: '6px 10px' }} aria-label="Random avatar" title="Random">
                  <Shuffle size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            {editing ? (
              <div className="flex-col gap-4">
                <div className="input-group">
                  <label className="input-label" htmlFor="profile-name">Họ tên</label>
                  <input id="profile-name" className="input-field" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid-2col-responsive">
                  <div className="input-group">
                    <label className="input-label" htmlFor="profile-email">Email</label>
                    <input id="profile-email" className="input-field" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="profile-phone">Số điện thoại</label>
                    <input id="profile-phone" className="input-field" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" className="btn btn-primary" onClick={handleSave}><Save size={16} /> Lưu</button>
                  <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Hủy</button>
                </div>
              </div>
            ) : (
              <div className="flex-col gap-4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h2 className="heading-2" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>{currentUser?.name}</h2>
                  {isVip && <span className="badge badge-vip"><Crown size={12} /> VIP</span>}
                  <span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                    {currentUser?.role === 'student' ? '🎓 Sinh Viên' : currentUser?.role === 'landlord' ? '🏠 Chủ Trọ' : '🛡️ Admin'}
                  </span>
                </div>
                <div className="flex-col gap-2 text-muted" style={{ fontSize: '0.9rem' }}>
                  <div className="flex items-center gap-2"><Mail size={16} /> {currentUser?.email}</div>
                  <div className="flex items-center gap-2"><Phone size={16} /> {currentUser?.phone}</div>
                </div>
                <button type="button" className="btn btn-outline" style={{ alignSelf: 'flex-start', padding: '8px 18px' }} onClick={() => setEditing(true)}>
                  <User size={16} /> Chỉnh sửa thông tin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="glass" style={{ padding: 'clamp(20px, 5vw, 32px)' }}>
        <h3 className="heading-3 mb-4 flex items-center gap-2"><Crown size={20} className="text-warning" /> Gói Dịch Vụ</h3>
        {isVip ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center gap-4">
              <div style={{ padding: '14px', background: 'rgba(245,158,11,0.1)', borderRadius: '14px', color: 'var(--warning)' }}>
                <Crown size={32} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>VIP Member</div>
                <div className="flex items-center gap-2 text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                  <Clock size={14} /> Còn <strong style={{ color: daysLeft <= 3 ? 'var(--danger)' : 'var(--success)' }}>{daysLeft} ngày</strong>
                </div>
              </div>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => dispatchVipPurchase({ type: 'open', plan: 'monthly' })}>
              <Crown size={16} /> Gia hạn VIP
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center gap-4">
              <div style={{ padding: '14px', background: 'rgba(99,102,241,0.1)', borderRadius: '14px', color: 'var(--text-muted)' }}>
                <Shield size={32} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Thành viên Thường</div>
                <div className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                  Nâng cấp VIP để ghim tin lên đầu trang
                </div>
              </div>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => dispatchVipPurchase({ type: 'open', plan: 'monthly' })}>
              <Crown size={16} /> Nâng cấp VIP
            </button>
          </div>
        )}
      </div>

      {/* Wallet Summary */}
      <div className="glass" style={{ padding: 'clamp(20px, 5vw, 32px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', color: 'var(--success)' }}>
              <Wallet size={28} />
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>Số dư ví</div>
              <div className="heading-2">{f(currentUser?.wallet_balance)}₫</div>
            </div>
          </div>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/wallet')}>
            <Wallet size={16} /> Quản lý ví <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <RecentTransactions transactions={myTxns} onViewAll={() => navigate('/wallet')} />

      {/* ── Buy VIP Modal ── */}
      <GlassModal isOpen={showBuyModal} onClose={() => { if (!buySuccess) dispatchVipPurchase({ type: 'close' }); }} title="Mua Gói VIP">
        {buySuccess ? (
          <div className="flex-col gap-4" style={{ textAlign: 'center', padding: '20px' }}>
            <div className="modal-success-icon">
              <CheckCircle size={44} className="text-success" />
            </div>
            <h3 className="heading-3">Kích hoạt thành công! 🎉</h3>
            <p className="text-muted">Gói VIP đã được kích hoạt. Tận hưởng các quyền lợi đặc biệt!</p>
          </div>
        ) : (
          <div className="flex-col gap-4">
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Chọn gói phù hợp với nhu cầu của bạn.</p>

            {/* Plan selector */}
            <div className="vip-plan-grid">
              <button
                type="button"
                aria-pressed={buyPlan === 'monthly'}
                onClick={() => dispatchVipPurchase({ type: 'setPlan', plan: 'monthly' })}
                className="vip-plan-option"
                style={{
                  border: buyPlan === 'monthly' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                  background: buyPlan === 'monthly' ? 'rgba(99,102,241,0.04)' : 'white'
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Gói Tháng</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{f(VIP_MONTHLY_PRICE)}₫</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{VIP_MONTHLY_DAYS} ngày</div>
              </button>
              <button
                type="button"
                aria-pressed={buyPlan === 'annual'}
                onClick={() => dispatchVipPurchase({ type: 'setPlan', plan: 'annual' })}
                className="vip-plan-option vip-plan-option-annual"
                style={{
                  border: buyPlan === 'annual' ? '2px solid var(--warning)' : '1px solid var(--glass-border)',
                  background: buyPlan === 'annual' ? 'rgba(245,158,11,0.04)' : 'white'
                }}
              >
                <span className="badge badge-vip" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem' }}>
                  -20%
                </span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Gói Năm</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, var(--warning), var(--danger))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {f(VIP_ANNUAL_PRICE)}₫
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{VIP_ANNUAL_DAYS} ngày</div>
              </button>
            </div>

            {/* Wallet + Confirm */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Số dư ví:</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{f(currentUser?.wallet_balance)}₫</span>
            </div>

            {(currentUser?.wallet_balance || 0) < (buyPlan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE) && (
              <div className="insufficient-funds-box">
                ⚠️ Số dư không đủ.{' '}
                <button type="button" onClick={() => { dispatchVipPurchase({ type: 'close' }); navigate('/wallet'); }} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Nạp tiền ngay
                </button>
              </div>
            )}

            <button type="button"
              className="btn btn-primary w-full justify-center"
              onClick={handleBuySubscription}
              disabled={(currentUser?.wallet_balance || 0) < (buyPlan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE)}
              style={{ padding: '14px', opacity: (currentUser?.wallet_balance || 0) < (buyPlan === 'annual' ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE) ? 0.5 : 1 }}
            >
              <Crown size={18} /> Thanh toán & Kích hoạt VIP
            </button>
          </div>
        )}
      </GlassModal>
    </div>
  );
};

export default ProfilePage;
