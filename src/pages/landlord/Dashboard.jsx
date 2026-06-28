import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PlusCircle, TrendingUp, Eye, DollarSign, Calendar, CheckCircle, Clock, Crown } from 'lucide-react';
import GlassModal from '../../components/ui/GlassModal';

const Dashboard = () => {
  const { listings, currentUser, appointments, updateAppointmentStatus, updateWallet, addTransaction } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const sub = currentUser?.subscription;
  const isVip = sub?.status === 'active';
  const daysLeft = isVip ? Math.max(0, Math.ceil((new Date(sub.expires_at) - new Date()) / (1000 * 60 * 60 * 24))) : 0;

  const myListings = listings.filter(l => l.landlord_id === currentUser.id);
  const myListingIds = myListings.map(l => l.id);

  // Appointments for this landlord's listings
  const myAppointments = appointments.filter(a => myListingIds.includes(a.listing_id));
  const pendingAppointments = myAppointments.filter(a => a.status === 'pending');
  const completedAppointments = myAppointments.filter(a => a.status === 'viewed');

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
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <h1 className="heading-1" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>Dashboard Chủ Trọ</h1>
        <Link to="/landlord/create" className="btn btn-primary">
          <PlusCircle size={20} /> Đăng tin mới
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(99,102,241,0.1)', borderRadius: '14px', color: 'var(--primary)' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <div className="text-muted" style={{ marginBottom: '4px', fontSize: '0.875rem' }}>Tổng bài đăng</div>
            <div className="heading-2">{myListings.length}</div>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(16,185,129,0.1)', borderRadius: '14px', color: 'var(--success)' }}>
            <Eye size={28} />
          </div>
          <div>
            <div className="text-muted" style={{ marginBottom: '4px', fontSize: '0.875rem' }}>Lượt xem (dự kiến)</div>
            <div className="heading-2">1,204</div>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(245,158,11,0.1)', borderRadius: '14px', color: 'var(--warning)' }}>
            <Calendar size={28} />
          </div>
          <div>
            <div className="text-muted" style={{ marginBottom: '4px', fontSize: '0.875rem' }}>Lịch hẹn chờ</div>
            <div className="heading-2">{pendingAppointments.length}</div>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(236,72,153,0.1)', borderRadius: '14px', color: 'var(--secondary)' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <div className="text-muted" style={{ marginBottom: '4px', fontSize: '0.875rem' }}>Số dư ví</div>
            <div className="heading-2">{currentUser.wallet_balance.toLocaleString()}đ</div>
          </div>
        </div>

        <Link to="/profile" className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
          <div style={{ padding: '14px', background: isVip ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.1)', borderRadius: '14px', color: isVip ? 'var(--warning)' : 'var(--primary)' }}>
            <Crown size={28} />
          </div>
          <div>
            <div className="text-muted" style={{ marginBottom: '4px', fontSize: '0.875rem' }}>
              {isVip ? 'Gói VIP' : 'Gói dịch vụ'}
            </div>
            <div className="heading-2" style={{ fontSize: '1.5rem' }}>
              {isVip ? (
                <span style={{ color: 'var(--warning)' }}>Còn {daysLeft} ngày</span>
              ) : (
                <span style={{ color: 'var(--primary)' }}>Chưa có</span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid var(--glass-border)', paddingBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'listings' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          onClick={() => setActiveTab('listings')}
        >
          <TrendingUp size={16} /> Tin đăng ({myListings.length})
        </button>
        <button
          className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '10px 20px', fontSize: '0.9rem', position: 'relative' }}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={16} /> Lịch xem phòng ({myAppointments.length})
          {pendingAppointments.length > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-6px',
              background: 'var(--danger)', color: 'white',
              borderRadius: '50%', width: '20px', height: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700
            }}>
              {pendingAppointments.length}
            </span>
          )}
        </button>
      </div>

      {/* --- Tab: Listings --- */}
      {activeTab === 'listings' && (
        <div className="glass table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Tiêu đề</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Trạng thái</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Gói</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {myListings.map(listing => (
                <tr key={listing.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{listing.title}</div>
                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>{listing.price.toLocaleString()}đ/tháng</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`badge ${listing.status === 'approved' ? 'badge-success' : listing.status === 'rejected' ? '' : 'badge-warning'}`}
                      style={listing.status === 'rejected' ? { background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' } : {}}>
                      {listing.status === 'approved' ? 'Đã duyệt' : listing.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {listing.is_vip
                      ? <span className="badge badge-vip">VIP</span>
                      : <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>Thường</span>}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>Đẩy tin</button>
                  </td>
                </tr>
              ))}
              {myListings.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '48px', textAlign: 'center' }} className="text-muted">
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏠</div>
                    Bạn chưa có bài đăng nào.{' '}
                    <Link to="/landlord/create" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng ngay!</Link>
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
          <div className="glass" style={{ padding: '16px 24px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <p style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.9rem' }}>
              💡 Khi sinh viên đến xem phòng, bạn (chủ trọ) xác nhận để hệ thống hoàn tiền cọc 200k cho họ.
            </p>
          </div>

          <div className="glass table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Mã lịch</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Phòng</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Ngày hẹn</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Tiền cọc</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Trạng thái</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {myAppointments.map(app => {
                  const listing = listings.find(l => l.id === app.listing_id);
                  return (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>#{app.id}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>SV: {app.student_id}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 500 }}>{listing?.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{listing?.address}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} style={{ color: 'var(--primary)' }} />
                          {new Date(app.date + 'T00:00:00').toLocaleDateString('vi-VN', {
                            weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit'
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className="badge badge-warning">{app.deposit_amount.toLocaleString()}đ</span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {app.status === 'pending'
                          ? <span className="flex items-center gap-1 badge badge-warning"><Clock size={12} /> Chờ xem</span>
                          : <span className="flex items-center gap-1 badge badge-success"><CheckCircle size={12} /> Đã xem</span>}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {app.status === 'pending' ? (
                          <button
                            className="btn btn-outline"
                            style={{ padding: '8px 14px', fontSize: '0.875rem', borderColor: 'var(--success)', color: 'var(--success)', gap: '6px' }}
                            onClick={() => setSelectedAppointment(app)}
                          >
                            <CheckCircle size={15} /> Xác nhận đã xem
                          </button>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.875rem' }}>Hoàn tất</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {myAppointments.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '48px', textAlign: 'center' }} className="text-muted">
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</div>
                      Chưa có lịch xem phòng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      <GlassModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Xác nhận sinh viên đã xem phòng"
      >
        <div className="flex-col gap-4" style={{ textAlign: 'center' }}>
          <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto' }} />
          <h3 className="heading-3">Sinh viên đã đến xem phòng?</h3>
          <p className="text-muted" style={{ marginBottom: '8px' }}>
            Hệ thống sẽ hoàn lại{' '}
            <strong style={{ color: 'var(--success)' }}>
              {selectedAppointment?.deposit_amount.toLocaleString()}đ
            </strong>{' '}
            tiền cọc giữ chỗ vào Ví của sinh viên ngay lập tức.
          </p>

          {selectedAppointment && (
            <div className="glass" style={{ padding: '16px', textAlign: 'left', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Ngày hẹn:</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {new Date(selectedAppointment.date + 'T00:00:00').toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Tiền hoàn trả:</span>
                <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.875rem' }}>
                  +{selectedAppointment.deposit_amount.toLocaleString()}đ
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-4" style={{ marginTop: '8px' }}>
            <button className="btn btn-outline w-full justify-center" onClick={() => setSelectedAppointment(null)}>
              Hủy
            </button>
            <button className="btn btn-primary w-full justify-center" onClick={handleConfirmViewed}>
              Xác nhận & Hoàn tiền
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

export default Dashboard;
