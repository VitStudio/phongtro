// ═══════════════════════════════════════════════════════════════════════════
// Admin Dashboard — lightweight shell (chart.js loaded lazily in AdminCharts)
// ═══════════════════════════════════════════════════════════════════════════
import React, { lazy, Suspense, useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import {
  Check, X, ClipboardList, DollarSign, Users,
  Eye, MousePointerClick, Crown, ArrowUpRight, ArrowDownLeft,
  BarChart3
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';

// chart.js is lazy-loaded so it doesn't slow the initial page load
const AdminChartsSection = lazy(() => import('./AdminCharts'));

// ─── StatCard — presentational only, no chart.js ──────────────────────────
const StatCard = ({ icon, label, value, subValue, color }) => (
  <div className="glass" style={{
    padding: '24px', display: 'flex', alignItems: 'center', gap: '16px'
  }}>
    <div style={{
      padding: '12px', borderRadius: '14px',
      background: `rgba(${color}, 0.1)`, color: `rgb(${color})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {icon}
    </div>
    <div style={{ minWidth: 0 }}>
      <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '2px', fontWeight: 500 }}>
        {label}
      </div>
      <div className="heading-2" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', lineHeight: 1.2 }}>
        {value}
      </div>
      {subValue && (
        <div style={{ fontSize: '0.78rem', marginTop: '4px', opacity: 0.8 }}>{subValue}</div>
      )}
    </div>
  </div>
);

// ─── PendingListingsTable — approval actions ─────────────────────────────
const PendingListingsTable = ({ listings, onApprove, onReject }) => {
  if (listings.length === 0) {
    return (
      <div className="glass table-wrapper" style={{ textAlign: 'center', padding: '48px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
        <span className="text-muted">Không có tin đăng nào cần duyệt.</span>
      </div>
    );
  }

  return (
    <div className="glass table-wrapper" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr className="data-table-header-row">
            <th className="data-head">Thời gian</th>
            <th className="data-head">Thông tin phòng</th>
            <th className="data-head">Loại tin</th>
            <th className="data-head">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {listings.map(listing => (
            <tr key={listing.id} className="data-row">
              <td className="data-cell">
                <div style={{ fontWeight: 500, marginBottom: '4px', fontSize: '0.875rem' }}>
                  {new Date(listing.created_at).toLocaleDateString('vi-VN')}
                </div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {new Date(listing.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </td>
              <td className="data-cell">
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{listing.title}</div>
                <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                  {listing.price.toLocaleString()}₫/tháng &bull; {listing.area}m²
                </div>
                <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>{listing.address}</div>
              </td>
              <td className="data-cell">
                {listing.is_vip
                  ? <span className="badge badge-vip">VIP</span>
                  : <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>Thường</span>}
              </td>
              <td className="data-cell">
                <div className="flex gap-2">
                  <button type="button"
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '0.875rem', color: 'var(--success)', borderColor: 'var(--success)', gap: '6px' }}
                    onClick={() => onApprove(listing.id)}>
                    <Check size={16} /> Duyệt
                  </button>
                  <button type="button"
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '0.875rem', color: 'var(--danger)', borderColor: 'var(--danger)', gap: '6px' }}
                    onClick={() => onReject(listing.id)}>
                    <X size={16} /> Từ chối
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── AllListingsTable — reviewed listings overview ────────────────────────
const AllListingsTable = ({ listings }) => (
  <div className="glass table-wrapper" style={{ overflowX: 'auto' }}>
    <table className="data-table">
      <thead>
        <tr className="data-table-header-row">
          <th className="data-head">Tiêu đề</th>
          <th className="data-head">Giá</th>
          <th className="data-head">Loại</th>
          <th className="data-head">Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {listings.map(listing => (
          <tr key={listing.id} className="data-row">
            <td className="data-cell" style={{ fontWeight: 500 }}>{listing.title}</td>
            <td className="data-cell text-muted">{listing.price.toLocaleString()}₫</td>
            <td className="data-cell">
              {listing.is_vip
                ? <span className="badge badge-vip">VIP</span>
                : <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>Thường</span>}
            </td>
            <td className="data-cell">
              <span className={`badge ${listing.status === 'approved' ? 'badge-success' : ''}`}
                style={listing.status === 'rejected' ? { background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' } : {}}>
                {listing.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── TransactionTable — recent transactions ───────────────────────────────
const TransactionTable = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass table-wrapper" style={{ textAlign: 'center', padding: '48px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</div>
        <span className="text-muted">Chưa có giao dịch nào.</span>
      </div>
    );
  }

  return (
    <div className="glass table-wrapper">
      <table className="data-table">
        <thead>
          <tr className="data-table-header-row">
            <th className="data-head">Mã GD</th>
            <th className="data-head">Loại</th>
            <th className="data-head">Số tiền</th>
            <th className="data-head">Phương thức</th>
            <th className="data-head">Trạng thái</th>
            <th className="data-head">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 15).map(txn => (
            <tr key={txn.id} className="data-row">
              <td className="data-cell">
                <div className="table-id">{txn.txnId || txn.id?.slice(0, 12)}</div>
              </td>
              <td className="data-cell">
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontWeight: 600, fontSize: '0.85rem',
                  color: txn.type === 'deposit' ? 'var(--success)' : 'var(--danger)'
                }}>
                  {txn.type === 'deposit'
                    ? <><ArrowDownLeft size={14} /> Nạp tiền</>
                    : <><ArrowUpRight size={14} /> Chi</>}
                </span>
                {txn.description && (
                  <div className="text-muted" style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                    {txn.description}
                  </div>
                )}
              </td>
              <td className="data-cell">
                <span style={{
                  fontWeight: 700, fontSize: '0.9rem',
                  color: txn.type === 'deposit' ? 'var(--success)' : 'var(--danger)'
                }}>
                  {txn.type === 'deposit' ? '+' : '-'}{formatCurrency(txn.amount)}₫
                </span>
              </td>
              <td className="data-cell">
                <span className="badge" style={{
                  background: txn.method === 'vietqr' ? 'rgba(99,102,241,0.1)' :
                    txn.method === 'refund' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  color: txn.method === 'vietqr' ? 'var(--primary)' :
                    txn.method === 'refund' ? 'var(--success)' : 'var(--warning)',
                  fontSize: '0.7rem'
                }}>
                  {txn.method === 'vietqr' ? 'VietQR' : txn.method === 'refund' ? 'Hoàn tiền' : txn.method || 'Ví'}
                </span>
              </td>
              <td className="data-cell">
                <span className={`badge ${txn.status === 'completed' ? 'badge-success' : txn.status === 'pending' ? 'badge-warning' : 'badge-danger-soft'}`}
                  style={{ fontSize: '0.7rem' }}>
                  {txn.status === 'completed' ? 'Hoàn tất' : txn.status === 'pending' ? 'Chờ' : 'Lỗi'}
                </span>
              </td>
              <td className="data-cell">
                <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                  {txn.created_at ? new Date(txn.created_at).toLocaleDateString('vi-VN') : '-'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── ChartsSpinner — fallback while charts lazy-load ──────────────────────
const ChartsSpinner = () => (
  <div className="glass" style={{
    padding: '60px', textAlign: 'center', color: 'var(--text-muted)'
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      border: '3px solid var(--glass-border)',
      borderTopColor: 'var(--primary)',
      animation: 'spin 0.7s linear infinite',
      margin: '0 auto 12px'
    }} />
    <span style={{ fontSize: '0.88rem' }}>Đang tải biểu đồ...</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// Approval (main component — now ~180 lines, well under the 300-line limit)
// ═══════════════════════════════════════════════════════════════════════════
const Approval = () => {
  // Context values (listings, users, transactions) are memoized at the provider
  // so they only change when data actually changes — no recreated intermediaries.
  const { listings, users, transactions, updateListingStatus } = useAuth();
  const toast = useToast();

  // ── Stable memoized derivations using context values as deps ────────────
  const pendingListings = useMemo(
    () => (listings || []).filter(l => l.status === 'pending'),
    [listings]
  );
  const approvedListings = useMemo(
    () => (listings || []).filter(l => l.status === 'approved'),
    [listings]
  );
  const rejectedListings = useMemo(
    () => (listings || []).filter(l => l.status === 'rejected'),
    [listings]
  );
  const landlords = useMemo(
    () => (users || []).filter(u => u.role === 'landlord'),
    [users]
  );
  const students = useMemo(
    () => (users || []).filter(u => u.role === 'student'),
    [users]
  );

  const totalRevenue = useMemo(
    () => (transactions || [])
      .filter(t => t.status === 'completed' && (t.type === 'deposit' || t.method === 'vip'))
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    [transactions]
  );

  const activeVipCount = useMemo(
    () => (users || []).filter(u => u.subscription?.status === 'active').length,
    [users]
  );

  const totalAdSpend = useMemo(() => {
    // Derived from mock ad data — in production from an API
    const marketingSpend = [3_200_000, 4_000_000, 2_800_000, 4_500_000, 5_200_000, 4_800_000];
    return marketingSpend.reduce((a, b) => a + b, 0);
  }, []);

  // ── State ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleApprove = (id) => {
    updateListingStatus(id, 'approved');
    toast.success('Đã duyệt tin đăng. Tin sẽ xuất hiện ngay trên trang tìm phòng.');
  };
  const handleReject = (id) => {
    updateListingStatus(id, 'rejected');
    toast.error('Đã từ chối tin đăng.');
  };

  const reviewedListings = useMemo(
    () => [...approvedListings, ...rejectedListings],
    [approvedListings, rejectedListings]
  );

  return (
    <div className="flex-col gap-6 mb-8 mt-4">
      {/* ────── Header ────── */}
      <div className="dashboard-header">
        <div>
          <h1 className="heading-1" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
            Admin Dashboard
          </h1>
          <p className="text-muted mt-2" style={{ fontSize: '0.95rem' }}>
            Tổng quan doanh thu, quảng cáo và kiểm duyệt nội dung.
          </p>
        </div>
      </div>

      {/* ────── Stats Row ────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '14px'
      }}>
        <StatCard icon={<ClipboardList size={22} />} color="99, 102, 241"
          label="Tổng tin đăng" value={(listings || []).length}
          subValue={`${approvedListings.length} đã duyệt`} />
        <StatCard icon={<Eye size={22} />} color="245, 158, 11"
          label="Chờ duyệt" value={pendingListings.length}
          subValue="Cần xử lý" />
        <StatCard icon={<Users size={22} />} color="16, 185, 129"
          label="Người dùng" value={(users || []).length}
          subValue={`${landlords.length} chủ trọ · ${students.length} SV`} />
        <StatCard icon={<DollarSign size={22} />} color="236, 72, 153"
          label="Doanh thu" value={`${(totalRevenue / 1_000_000).toFixed(0)}tr`}
          subValue={`${formatCurrency(totalRevenue)}₫`} />
        <StatCard icon={<Crown size={22} />} color="245, 158, 11"
          label="VIP Active" value={activeVipCount}
          subValue="Thuê bao đang hoạt động" />
        <StatCard icon={<MousePointerClick size={22} />} color="139, 92, 246"
          label="Quảng cáo" value={`${formatCurrency(totalAdSpend)}₫`}
          subValue="Tổng chi ADS" />
      </div>

      {/* ────── Charts (lazy-loaded — chart.js loaded on demand) ──────── */}
      <Suspense fallback={<ChartsSpinner />}>
        <AdminChartsSection transactions={transactions} />
      </Suspense>

      {/* ────── Tabs ────── */}
      <div className="tab-bar-bottom">
        <button type="button"
          className={`btn tab-btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('overview')}>
          <BarChart3 size={16} /> Dashboard
        </button>
        <button type="button"
          className={`btn tab-btn ${activeTab === 'approval' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('approval')}>
          <ClipboardList size={16} /> Duyệt tin ({pendingListings.length})
        </button>
      </div>

      {/* ────── Tab: Overview (recent transactions) ────── */}
      {activeTab === 'overview' && (
        <TransactionTable transactions={transactions} />
      )}

      {/* ────── Tab: Approval ────── */}
      {activeTab === 'approval' && (
        <>
          {/* Pending listings */}
          <div>
            <h2 className="heading-2 mb-4" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.75rem)' }}>
              Tin đăng chờ duyệt
              {pendingListings.length > 0 && (
                <span className="badge badge-warning" style={{ marginLeft: '12px', fontSize: '0.8rem', verticalAlign: 'middle' }}>
                  {pendingListings.length} tin
                </span>
              )}
            </h2>
            <PendingListingsTable
              listings={pendingListings}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>

          {/* All reviewed listings */}
          {reviewedListings.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h2 className="heading-2 mb-4" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.75rem)' }}>
                Tổng quan tất cả tin đăng
              </h2>
              <AllListingsTable listings={reviewedListings} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Approval;
