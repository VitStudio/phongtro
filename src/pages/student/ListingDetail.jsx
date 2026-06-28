import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Maximize, Clock, ShieldCheck } from 'lucide-react';
import GlassModal from '../../components/ui/GlassModal';
import { useToast } from '../../context/ToastContext';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, users, currentUser, updateWallet, addAppointment, addTransaction } = useAuth();
  
  const listing = listings.find(l => l.id === id);
  
  // Check VIP via user subscription (with fallback)
  const isVip = useMemo(() => {
    if (!listing) return false;
    if (listing.is_vip) return true;
    const landlord = users.find(u => u.id === listing.landlord_id);
    return landlord?.subscription?.status === 'active';
  }, [listing, users]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const toast = useToast();

  if (!listing) return <div className="container mt-8 text-center heading-2">Không tìm thấy phòng</div>;

  const handleBooking = () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập với vai trò sinh viên!");
      return;
    }
    if (currentUser.role !== 'student') {
      toast.warning("Chỉ sinh viên mới có thể đặt cọc xem phòng.");
      return;
    }
    if (currentUser.wallet_balance < 200000) {
      toast.error("Số dư không đủ 200,000đ. Vui lòng nạp thêm tiền.");
      return;
    }
    if (!date) {
      toast.warning("Vui lòng chọn ngày xem phòng.");
      return;
    }

    // Process booking
    updateWallet(currentUser.id, -200000);
    addTransaction({
      user_id: currentUser.id,
      type: 'payment',
      amount: 200000,
      method: 'wallet',
      status: 'completed',
      txnId: `BOOK${Date.now()}`,
      description: `Đặt cọc xem phòng: ${listing.title?.slice(0, 30)}`
    });
    addAppointment({
      id: `a${Date.now()}`,
      student_id: currentUser.id,
      listing_id: listing.id,
      date,
      status: 'pending',
      deposit_amount: 200000
    });

    setIsModalOpen(false);
    toast.success("Đặt lịch thành công! Hệ thống đã tạm giữ 200k. Số tiền này sẽ hoàn lại sau khi bạn xem phòng.");
    navigate('/search');
  };

  return (
    <div className="flex-col gap-8 mb-8 mt-4">
      <div style={{ height: 'clamp(200px, 40vw, 400px)', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
        <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {isVip && (
          <div style={{ position: 'absolute', top: 20, right: 20, fontSize: '1rem' }} className="badge badge-vip">
            VIP - Đối tác uy tín
          </div>
        )}
      </div>

      <div className="grid-detail-responsive">
        <div className="flex-col gap-6">
          <h1 className="heading-1">{listing.title}</h1>
          <div className="text-gradient heading-2">{listing.price.toLocaleString()} VNĐ/tháng</div>
          
          <div className="flex gap-4 mb-4">
            <div className="badge badge-success flex items-center gap-1">
              <ShieldCheck size={16} /> Đã xác thực
            </div>
          </div>

          <div className="glass p-6" style={{ padding: '24px' }}>
            <h3 className="heading-3 mb-4">Thông tin chi tiết</h3>
            <div className="text-muted mb-4 flex-col gap-2">
              <div className="flex items-center gap-2"><MapPin size={20} /> {listing.address}</div>
              <div className="flex items-center gap-2"><Maximize size={20} /> Diện tích: {listing.area}m²</div>
              <div className="flex items-center gap-2"><Clock size={20} /> Đăng ngày: {new Date(listing.created_at).toLocaleDateString('vi-VN')}</div>
            </div>
            
            <h3 className="heading-3 mb-2 mt-6">Mô tả</h3>
            <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>{listing.description}</p>
          </div>
        </div>

        <div>
          <div className="glass" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
            <h3 className="heading-3 mb-4 text-center">Đặt lịch xem phòng</h3>
            <p className="text-muted text-center mb-6" style={{ fontSize: '0.9rem' }}>
              Cọc giữ chỗ 200k. Hoàn cọc 100% sau khi xem phòng dù bạn có thuê hay không. Chống boom hàng!
            </p>
            <button className="btn btn-primary w-full justify-center" onClick={() => setIsModalOpen(true)}>
              Đặt lịch & Cọc 200k
            </button>
          </div>
        </div>
      </div>

      <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Xác nhận đặt lịch">
        <div className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label">Chọn ngày xem phòng</label>
            <input 
              type="date" 
              className="input-field" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="glass" style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)' }}>
            <h4 style={{ color: 'var(--warning)', fontWeight: 600, marginBottom: '8px' }}>Lưu ý an toàn</h4>
            <ul className="text-muted" style={{ paddingLeft: '20px', fontSize: '0.9rem' }}>
              <li>Tiền cọc sẽ bị trừ từ Ví của bạn.</li>
              <li>Nhân viên sẽ xác nhận sau khi bạn tới xem phòng để hoàn tiền.</li>
              <li>Vui lòng đến đúng lịch hẹn.</li>
            </ul>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span style={{ fontWeight: 600 }}>Tổng thanh toán:</span>
            <span className="heading-3 text-gradient">200,000đ</span>
          </div>

          <button className="btn btn-primary w-full justify-center mt-4" onClick={handleBooking}>
            Xác nhận thanh toán
          </button>
        </div>
      </GlassModal>
    </div>
  );
};

export default ListingDetail;
