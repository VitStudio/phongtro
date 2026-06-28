import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Building2, ClipboardList } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Approval = () => {
  const { listings, updateListingStatus } = useAuth();
  const toast = useToast();

  const pendingListings = listings.filter(l => l.status === 'pending');
  const approvedListings = listings.filter(l => l.status === 'approved');
  const rejectedListings = listings.filter(l => l.status === 'rejected');

  const handleApprove = (id) => {
    updateListingStatus(id, 'approved');
    toast.success('Đã duyệt tin đăng. Tin sẽ xuất hiện ngay trên trang tìm phòng.');
  };

  const handleReject = (id) => {
    updateListingStatus(id, 'rejected');
    toast.error('Đã từ chối tin đăng.');
  };

  return (
    <div className="flex-col gap-8 mb-8 mt-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-1" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>Admin Control Panel</h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>
            Kiểm duyệt nội dung tin đăng phòng trọ trước khi hiển thị công khai.
          </p>
        </div>
      </div>

      {/* Stats summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div className="glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px', color: 'var(--warning)' }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Chờ duyệt</div>
            <div className="heading-2" style={{ fontSize: '1.75rem' }}>{pendingListings.length}</div>
          </div>
        </div>
        <div className="glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', color: 'var(--success)' }}>
            <Check size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Đã duyệt</div>
            <div className="heading-2" style={{ fontSize: '1.75rem' }}>{approvedListings.length}</div>
          </div>
        </div>
        <div className="glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
            <X size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Từ chối</div>
            <div className="heading-2" style={{ fontSize: '1.75rem' }}>{rejectedListings.length}</div>
          </div>
        </div>
        <div className="glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Tổng tin</div>
            <div className="heading-2" style={{ fontSize: '1.75rem' }}>{listings.length}</div>
          </div>
        </div>
      </div>

      {/* Pending listings table */}
      <div>
        <h2 className="heading-2 mb-4" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.75rem)' }}>
          Tin đăng chờ duyệt
          {pendingListings.length > 0 && (
            <span className="badge badge-warning" style={{ marginLeft: '12px', fontSize: '0.8rem', verticalAlign: 'middle' }}>
              {pendingListings.length} tin
            </span>
          )}
        </h2>
        <div className="glass table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Thời gian</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Thông tin phòng</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Loại tin</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pendingListings.map(listing => (
                <tr key={listing.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 500, marginBottom: '4px', fontSize: '0.875rem' }}>
                      {new Date(listing.created_at).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                      {new Date(listing.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{listing.title}</div>
                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                      {listing.price.toLocaleString()}đ/tháng &bull; {listing.area}m²
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>{listing.address}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {listing.is_vip
                      ? <span className="badge badge-vip">VIP</span>
                      : <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>Thường</span>}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: '0.875rem', color: 'var(--success)', borderColor: 'var(--success)', gap: '6px' }}
                        onClick={() => handleApprove(listing.id)}
                      >
                        <Check size={16} /> Duyệt
                      </button>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: '0.875rem', color: 'var(--danger)', borderColor: 'var(--danger)', gap: '6px' }}
                        onClick={() => handleReject(listing.id)}
                      >
                        <X size={16} /> Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingListings.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '48px', textAlign: 'center' }} className="text-muted">
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
                    Không có tin đăng nào cần duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All listings overview */}
      {listings.filter(l => l.status !== 'pending').length > 0 && (
        <div>
          <h2 className="heading-2 mb-4" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.75rem)' }}>Tổng quan tất cả tin đăng</h2>
          <div className="glass table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                  <th style={{ padding: '14px 24px', fontWeight: 600 }}>Tiêu đề</th>
                  <th style={{ padding: '14px 24px', fontWeight: 600 }}>Giá</th>
                  <th style={{ padding: '14px 24px', fontWeight: 600 }}>Loại</th>
                  <th style={{ padding: '14px 24px', fontWeight: 600 }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {listings.filter(l => l.status !== 'pending').map(listing => (
                  <tr key={listing.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '14px 24px', fontWeight: 500 }}>{listing.title}</td>
                    <td style={{ padding: '14px 24px' }} className="text-muted">{listing.price.toLocaleString()}đ</td>
                    <td style={{ padding: '14px 24px' }}>
                      {listing.is_vip
                        ? <span className="badge badge-vip">VIP</span>
                        : <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>Thường</span>}
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span className={`badge ${listing.status === 'approved' ? 'badge-success' : 'badge-danger'}`}
                        style={listing.status === 'rejected' ? { background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' } : {}}>
                        {listing.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approval;
