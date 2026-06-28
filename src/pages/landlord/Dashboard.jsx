import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { PlusCircle, TrendingUp, Eye, DollarSign, Calendar, CheckCircle, Clock, Crown } from 'lucide-react';
import GlassModal from '../../components/ui/GlassModal';

const ConfirmViewedModal = ({ appointment, onClose, onConfirm }) => (
  <GlassModal
    isOpen={!!appointment}
    onClose={onClose}
    title="Xác nhận sinh viên đã xem phòng"
  >
    <div className="flex-col gap-4 modal-centered">
      <CheckCircle size={64} className="dashboard-modal-success-icon" />
      <h3 className="heading-3">Sinh viên đã đến xem phòng?</h3>
      <p className="text-muted mb-2">
        Hệ thống sẽ hoàn lại{' '}
        <strong className="success-strong">
          {appointment?.deposit_amount.toLocaleString()}đ
        </strong>{' '}
        tiền cọc giữ chỗ vào Ví của sinh viên ngay lập tức.
      </p>

      {appointment && (
        <div className="glass refund-summary">
          <div className="refund-row refund-row-spaced">
            <span className="text-muted text-sm">Ngày hẹn:</span>
            <span className="refund-value">
              {new Date(appointment.date + 'T00:00:00').toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="refund-row">
            <span className="text-muted text-sm">Tiền hoàn trả:</span>
            <span className="refund-amount">
              +{appointment.deposit_amount.toLocaleString()}đ
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-2">
        <button type="button" className="btn btn-outline w-full justify-center" onClick={onClose}>
          Hủy
        </button>
        <button type="button" className="btn btn-primary w-full justify-center" onClick={onConfirm}>
          Xác nhận & Hoàn tiền
        </button>
      </div>
    </div>
  </GlassModal>
);

const Dashboard = () => {
  const { listings, currentUser, appointments, updateAppointmentStatus, updateWallet, addTransaction } = useAuth();
  const toast = useToast();

  const sub = currentUser?.subscription;
  const isVip = sub?.status === 'active';
  const daysLeft = isVip ? Math.max(0, Math.ceil((new Date(sub.expires_at) - new Date()) / (1000 * 60 * 60 * 24))) : 0;

  const myListings = listings.filter(l => l.landlord_id === currentUser.id);
  const myListingIds = myListings.map(l => l.id);

  // Appointments for this landlord's listings
  const myAppointments = appointments.filter(a => myListingIds.includes(a.listing_id));
  const pendingAppointments = myAppointments.filter(a => a.status === 'pending');

  const [activeTab, setActiveTab] = useState('listings');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleConfirmViewed = () => {
    if (!selectedAppointment) return;
    updateAppointmentStatus(selectedAppointment.id, 'viewed');
    // Refund deposit back to student
    updateWallet(selectedAppointment.student_id, selectedAppointment.deposit_amount);
    // Record refund transaction
    addTransaction({
      user_id: selectedAppointment.student_id,
      type: 'deposit',
      amount: selectedAppointment.deposit_amount,
      method: 'refund',
      status: 'completed',
      txnId: `REF${Date.now()}`,
      description: `Hoàn cọc xem phòng - đã xác nhận bởi chủ trọ`
    });
    setSelectedAppointment(null);
    toast.success(`Đã xác nhận! ${selectedAppointment.deposit_amount.toLocaleString()}đ tiền cọc đã được hoàn trả cho sinh viên.`);
  };

  return (
    <div className="flex-col gap-8 mb-8 mt-4">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="heading-1">Dashboard Chủ Trọ</h1>
        <Link to="/landlord/create" className="btn btn-primary">
          <PlusCircle size={20} /> Đăng tin mới
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="glass stat-card">
          <div className="stat-icon-box stat-icon-primary">
            <TrendingUp size={28} />
          </div>
          <div>
            <div className="text-muted stat-label">Tổng bài đăng</div>
            <div className="heading-2">{myListings.length}</div>
          </div>
        </div>

        <div className="glass stat-card">
          <div className="stat-icon-box stat-icon-success">
            <Eye size={28} />
          </div>
          <div>
            <div className="text-muted stat-label">Lượt xem (dự kiến)</div>
            <div className="heading-2">1,204</div>
          </div>
        </div>

        <div className="glass stat-card">
          <div className="stat-icon-box stat-icon-warning">
            <Calendar size={28} />
          </div>
          <div>
            <div className="text-muted stat-label">Lịch hẹn chờ</div>
            <div className="heading-2">{pendingAppointments.length}</div>
          </div>
        </div>

        <div className="glass stat-card">
          <div className="stat-icon-box stat-icon-secondary">
            <DollarSign size={28} />
          </div>
          <div>
            <div className="text-muted stat-label">Số dư ví</div>
            <div className="heading-2">{currentUser.wallet_balance.toLocaleString()}đ</div>
          </div>
        </div>

        <Link to="/profile" className="glass stat-card stat-link-card">
          <div className={`stat-icon-box ${isVip ? 'stat-icon-vip' : 'stat-icon-primary'}`}>
            <Crown size={28} />
          </div>
          <div>
            <div className="text-muted stat-label">
              {isVip ? 'Gói VIP' : 'Gói dịch vụ'}
            </div>
            <div className="heading-2 stat-service-title">
              {isVip ? (
                <span className="text-warning">Còn {daysLeft} ngày</span>
              ) : (
                <span className="text-primary">Chưa có</span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Tabs */}
      <div className="tab-bar-bottom">
        <button type="button"
          className={`btn tab-btn ${activeTab === 'listings' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('listings')}
        >
          <TrendingUp size={16} /> Tin đăng ({myListings.length})
        </button>
        <button type="button"
          className={`btn tab-btn tab-btn-notified ${activeTab === 'appointments' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={16} /> Lịch xem phòng ({myAppointments.length})
          {pendingAppointments.length > 0 && (
            <span className="notification-dot">
              {pendingAppointments.length}
            </span>
          )}
        </button>
      </div>

      {/* --- Tab: Listings --- */}
      {activeTab === 'listings' && (
        <div className="glass table-wrapper">
          <table className="data-table">
            <thead>
              <tr className="data-table-header-row">
                <th className="data-head">Tiêu đề</th>
                <th className="data-head">Trạng thái</th>
                <th className="data-head">Gói</th>
                <th className="data-head">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {myListings.map(listing => (
                <tr key={listing.id} className="data-row">
                  <td className="data-cell">
                    <div className="table-title">{listing.title}</div>
                    <div className="text-muted text-sm">{listing.price.toLocaleString()}đ/tháng</div>
                  </td>
                  <td className="data-cell">
                    <span className={`badge ${listing.status === 'approved' ? 'badge-success' : listing.status === 'rejected' ? 'badge-danger-soft' : 'badge-warning'}`}>
                      {listing.status === 'approved' ? 'Đã duyệt' : listing.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="data-cell">
                    {listing.is_vip
                      ? <span className="badge badge-vip">VIP</span>
                      : <span className="badge badge-plain">Thường</span>}
                  </td>
                  <td className="data-cell">
                    <button type="button" className="btn btn-outline small-action-btn">Đẩy tin</button>
                  </td>
                </tr>
              ))}
              {myListings.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-muted empty-table-cell">
                    <div className="empty-icon">🏠</div>
                    Bạn chưa có bài đăng nào.{' '}
                    <Link to="/landlord/create" className="primary-text-link">Đăng ngay!</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Tab: Appointments --- */}
      {activeTab === 'appointments' && (
        <div className="flex-col gap-4">
          <div className="glass warning-callout">
            <p className="warning-copy">
              💡 Khi sinh viên đến xem phòng, bạn (chủ trọ) xác nhận để hệ thống hoàn tiền cọc 200k cho họ.
            </p>
          </div>

          <div className="glass table-wrapper">
            <table className="data-table">
              <thead>
                <tr className="data-table-header-row">
                  <th className="data-head">Mã lịch</th>
                  <th className="data-head">Phòng</th>
                  <th className="data-head">Ngày hẹn</th>
                  <th className="data-head">Tiền cọc</th>
                  <th className="data-head">Trạng thái</th>
                  <th className="data-head">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {myAppointments.map(app => {
                  const listing = listings.find(l => l.id === app.listing_id);
                  return (
                    <tr key={app.id} className="data-row">
                      <td className="data-cell">
                        <div className="table-id">#{app.id}</div>
                        <div className="text-muted table-secondary">SV: {app.student_id}</div>
                      </td>
                      <td className="data-cell">
                        <div className="font-medium">{listing?.title}</div>
                        <div className="text-muted table-secondary">{listing?.address}</div>
                      </td>
                      <td className="data-cell">
                        <div className="appointment-date">
                          <Calendar size={14} className="text-primary" />
                          {new Date(app.date + 'T00:00:00').toLocaleDateString('vi-VN', {
                            weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="data-cell">
                        <span className="badge badge-warning">{app.deposit_amount.toLocaleString()}đ</span>
                      </td>
                      <td className="data-cell">
                        {app.status === 'pending'
                          ? <span className="flex items-center gap-1 badge badge-warning"><Clock size={12} /> Chờ xem</span>
                          : <span className="flex items-center gap-1 badge badge-success"><CheckCircle size={12} /> Đã xem</span>}
                      </td>
                      <td className="data-cell">
                        {app.status === 'pending' ? (
                          <button type="button"
                            className="btn btn-outline confirm-viewed-btn"
                            onClick={() => setSelectedAppointment(app)}
                          >
                            <CheckCircle size={15} /> Xác nhận đã xem
                          </button>
                        ) : (
                          <span className="text-muted text-sm">Hoàn tất</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {myAppointments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-muted empty-table-cell">
                      <div className="empty-icon">📅</div>
                      Chưa có lịch xem phòng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmViewedModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onConfirm={handleConfirmViewed}
      />
    </div>
  );
};

export default Dashboard;
