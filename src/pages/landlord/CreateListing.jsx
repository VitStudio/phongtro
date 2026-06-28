import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlassModal from '../../components/ui/GlassModal';
import { Upload, Sparkles, Star, Crown } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser, addListing, updateWallet } = useAuth();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sub = currentUser?.subscription;
  const isVipUser = sub?.status === 'active';
  const [plan, setPlan] = useState(isVipUser ? 'vip' : 'basic'); // basic | vip
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    area: '',
    address: '',
    description: ''
  });

  const cost = isVipUser ? 0 : (plan === 'vip' ? 0 : 20000);

  // Functional update to avoid stale closure on rapid typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    if (!formData.title.trim()) { toast.warning('Vui lòng nhập tiêu đề bài đăng.'); return; }
    if (!formData.price || isNaN(Number(formData.price))) { toast.warning('Vui lòng nhập giá hợp lệ.'); return; }
    if (!formData.area || isNaN(Number(formData.area))) { toast.warning('Vui lòng nhập diện tích hợp lệ.'); return; }
    if (!formData.address.trim()) { toast.warning('Vui lòng nhập địa chỉ.'); return; }
    setIsModalOpen(true);
  };

  const handleCheckout = () => {
    if (currentUser.wallet_balance < cost) {
      toast.error('Số dư không đủ để thanh toán. Vui lòng nạp thêm tiền!');
      return;
    }

    updateWallet(currentUser.id, -cost);

    addListing({
      id: `l${Date.now()}`,
      landlord_id: currentUser.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      area: Number(formData.area),
      address: formData.address.trim(),
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
      status: 'pending',
      is_vip: plan === 'vip',
      created_at: new Date().toISOString()
    });

    setIsModalOpen(false);
    toast.success('Đăng tin thành công! Tin đang chờ Admin duyệt, sẽ hiển thị sau vài phút.');
    navigate('/landlord');
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto 64px auto' }}>
      <h1 className="heading-1" style={{ textAlign: 'center', marginTop: '24px', marginBottom: '32px', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
        Đăng tin phòng trọ
      </h1>

      <div className="glass" style={{ padding: 'clamp(20px, 5vw, 40px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Title */}
          <div className="input-group">
            <label className="input-label">Tiêu đề bài đăng <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              name="title"
              value={formData.title}
              className="input-field"
              placeholder="VD: Phòng trọ Làng Đại Học sạch đẹp, full nội thất"
              onChange={handleChange}
            />
          </div>

          {/* Price + Area */}
          <div style={{ display: 'grid', gridTemplateColumns: "1fr 1fr", gap: '16px' }} className="grid-2col-responsive">
            <div className="input-group">
              <label className="input-label">Giá cho thuê (VNĐ/tháng) <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                name="price"
                type="number"
                min="0"
                value={formData.price}
                className="input-field"
                placeholder="2500000"
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Diện tích (m²) <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                name="area"
                type="number"
                min="0"
                value={formData.area}
                className="input-field"
                placeholder="25"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address */}
          <div className="input-group">
            <label className="input-label">Địa chỉ chi tiết <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              name="address"
              value={formData.address}
              className="input-field"
              placeholder="Số nhà, Tên đường, Phường, Quận..."
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={formData.description}
              className="input-field"
              rows="5"
              placeholder="Nội thất, giờ giấc, tiện ích xung quanh, điện nước..."
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Image upload (placeholder) */}
          <div className="input-group">
            <label className="input-label">Hình ảnh</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', border: '2px dashed var(--glass-border)', borderRadius: '14px', background: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }} className="text-muted">
                <Upload size={30} />
                <span style={{ fontSize: '0.9rem' }}>Nhấn để chọn ảnh (Demo — dùng ảnh mặc định)</span>
              </div>
            </div>
          </div>

          {/* Package selection */}
          <div>
            <h3 className="heading-3" style={{ marginBottom: '16px', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}>
              {isVipUser ? '⭐ Đăng tin với gói VIP (Miễn phí)' : 'Chọn gói đăng tin'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: "1fr 1fr", gap: '16px' }} className="grid-2col-responsive">
              <div
                onClick={() => !isVipUser && setPlan('basic')}
                style={{
                  padding: '24px', borderRadius: '16px', cursor: isVipUser ? 'default' : 'pointer', textAlign: 'center',
                  border: plan === 'basic' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                  background: plan === 'basic' ? 'rgba(99,102,241,0.04)' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s ease',
                  display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Tin thường</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>Hiển thị danh sách bình thường</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                  {isVipUser ? '0₫ (VIP)' : '20.000₫'}
                </div>
              </div>

              <div
                onClick={() => setPlan('vip')}
                style={{
                  padding: '24px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center',
                  border: plan === 'vip' ? '2px solid var(--warning)' : '1px solid var(--glass-border)',
                  background: plan === 'vip' ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s ease',
                  display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center'
                }}
              >
                <span className="badge badge-vip" style={{ fontSize: '0.75rem' }}>
                  <Sparkles size={12} /> {isVipUser ? 'VIP KÍCH HOẠT' : 'VIP TỐI ƯU'}
                </span>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Gói VIP</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>Ghim đầu trang, tiếp cận gấp 10×</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, var(--warning), var(--danger))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginTop: '4px' }}>
                  {isVipUser ? '0₫ (VIP)' : '100.000₫'}
                </div>
              </div>
            </div>
            {isVipUser && (
              <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 500 }}>
                <Crown size={14} style={{ marginRight: 6 }} />
                🎉 Bạn đang có gói VIP — đăng tin miễn phí và bài đăng tự động được gắn huy hiệu VIP!
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            style={{ marginTop: '12px', padding: '14px', fontSize: '1.05rem', width: '100%', justifyContent: 'center' }}
            onClick={handleOpenModal}
          >
            Tiếp tục thanh toán →
          </button>
        </div>
      </div>

      {/* Checkout modal */}
      <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Xác nhận thanh toán">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
            <span>Tiêu đề:</span>
            <span style={{ fontWeight: 600, maxWidth: '220px', textAlign: 'right', fontSize: '0.9rem' }}>{formData.title}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
            <span>Gói dịch vụ:</span>
            <span style={{ fontWeight: 600 }}>
              {plan === 'vip' ? '⭐ Gói Tin VIP' : 'Tin Thường'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
            <span>Số dư hiện tại:</span>
            <span style={{ fontWeight: 600 }}>{currentUser.wallet_balance.toLocaleString()}đ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>Tổng thanh toán:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {cost.toLocaleString()}đ
            </span>
          </div>

          {currentUser.wallet_balance < cost && (
            <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 500 }}>
              ⚠️ Số dư không đủ. Cần thêm {(cost - currentUser.wallet_balance).toLocaleString()}đ.
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '14px' }}
            onClick={handleCheckout}
            disabled={currentUser.wallet_balance < cost}
          >
            Xác nhận thanh toán &amp; Đăng tin
          </button>
        </div>
      </GlassModal>
    </div>
  );
};

export default CreateListing;
