import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import GlassModal from '../../components/ui/GlassModal';
import { Upload, Sparkles, Crown } from 'lucide-react';
import { useToast } from '../../context/useToast';

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
    <div className="create-listing-page">
      <h1 className="heading-1 page-title-centered">
        Đăng tin phòng trọ
      </h1>

      <div className="glass form-shell">
        <div className="form-stack">

          {/* Title */}
          <div className="input-group">
            <label className="input-label" htmlFor="listing-title">Tiêu đề bài đăng <span className="required-mark">*</span></label>
            <input
              id="listing-title"
              name="title"
              value={formData.title}
              className="input-field"
              placeholder="VD: Phòng trọ Làng Đại Học sạch đẹp, full nội thất"
              onChange={handleChange}
            />
          </div>

          {/* Price + Area */}
          <div className="two-col-grid grid-2col-responsive">
            <div className="input-group">
              <label className="input-label" htmlFor="listing-price">Giá cho thuê (VNĐ/tháng) <span className="required-mark">*</span></label>
              <input
                id="listing-price"
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
              <label className="input-label" htmlFor="listing-area">Diện tích (m²) <span className="required-mark">*</span></label>
              <input
                id="listing-area"
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
            <label className="input-label" htmlFor="listing-address">Địa chỉ chi tiết <span className="required-mark">*</span></label>
            <input
              id="listing-address"
              name="address"
              value={formData.address}
              className="input-field"
              placeholder="Số nhà, Tên đường, Phường, Quận..."
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label" htmlFor="listing-description">Mô tả chi tiết</label>
            <textarea
              id="listing-description"
              name="description"
              value={formData.description}
              rows="5"
              placeholder="Nội thất, giờ giấc, tiện ích xung quanh, điện nước..."
              onChange={handleChange}
              className="input-field textarea-resize-vertical"
            />
          </div>

          {/* Image upload (placeholder) */}
          <div className="input-group">
            <div className="input-label" id="image-upload-label">Hình ảnh</div>
            <button
              type="button"
              aria-labelledby="image-upload-label"
              className="image-upload-box"
            >
              <div className="text-muted image-upload-content">
                <Upload size={30} aria-hidden="true" />
                <span className="text-base-soft">Nhấn để chọn ảnh (Demo — dùng ảnh mặc định)</span>
              </div>
            </button>
          </div>

          {/* Package selection */}
          <div>
            <h3 className="heading-3 package-heading">
              {isVipUser ? '⭐ Đăng tin với gói VIP (Miễn phí)' : 'Chọn gói đăng tin'}
            </h3>
            <div className="two-col-grid grid-2col-responsive">
              <button
                type="button"
                disabled={isVipUser}
                onClick={() => !isVipUser && setPlan('basic')}
                className={`plan-option-card plan-option-basic ${plan === 'basic' ? 'is-selected' : ''} ${isVipUser ? 'is-disabled' : ''}`}
              >
                <div className="plan-title">Tin thường</div>
                <div className="text-muted plan-desc">Hiển thị danh sách bình thường</div>
                <div className="plan-price plan-price-basic">
                  {isVipUser ? '0₫ (VIP)' : '20.000₫'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPlan('vip')}
                className={`plan-option-card plan-option-vip ${plan === 'vip' ? 'is-selected' : ''}`}
              >
                <span className="badge badge-vip text-xs">
                  <Sparkles size={12} /> {isVipUser ? 'VIP KÍCH HOẠT' : 'VIP TỐI ƯU'}
                </span>
                <div className="plan-title">Gói VIP</div>
                <div className="text-muted plan-desc">Ghim đầu trang, tiếp cận gấp 10×</div>
                <div className="plan-price plan-price-vip">
                  {isVipUser ? '0₫ (VIP)' : '100.000₫'}
                </div>
              </button>
            </div>
            {isVipUser && (
              <div className="vip-note">
                <Crown size={14} className="icon-spaced-right" />
                🎉 Bạn đang có gói VIP — đăng tin miễn phí và bài đăng tự động được gắn huy hiệu VIP!
              </div>
            )}
          </div>

          <button type="button"
            className="btn btn-primary full-submit-btn"
            onClick={handleOpenModal}
          >
            Tiếp tục thanh toán →
          </button>
        </div>
      </div>

      {/* Checkout modal */}
      <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Xác nhận thanh toán">
        <div className="modal-stack">
          <div className="modal-row modal-row-bordered">
            <span>Tiêu đề:</span>
            <span className="modal-value modal-title-value">{formData.title}</span>
          </div>
          <div className="modal-row modal-row-bordered">
            <span>Gói dịch vụ:</span>
            <span className="modal-value">
              {plan === 'vip' ? '⭐ Gói Tin VIP' : 'Tin Thường'}
            </span>
          </div>
          <div className="modal-row modal-row-bordered">
            <span>Số dư hiện tại:</span>
            <span className="modal-value">{currentUser.wallet_balance.toLocaleString()}đ</span>
          </div>
          <div className="modal-row">
            <span className="modal-label-strong">Tổng thanh toán:</span>
            <span className="payment-total-primary">
              {cost.toLocaleString()}đ
            </span>
          </div>

          {currentUser.wallet_balance < cost && (
            <div className="danger-callout">
              ⚠️ Số dư không đủ. Cần thêm {(cost - currentUser.wallet_balance).toLocaleString()}đ.
            </div>
          )}

          <button type="button"
            className="btn btn-primary modal-submit-btn"
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
