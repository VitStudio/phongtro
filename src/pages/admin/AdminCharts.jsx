// ═══════════════════════════════════════════════════════════════════════════
// AdminCharts — lazy-loaded chart components (chart.js kept out of main bundle)
// ═══════════════════════════════════════════════════════════════════════════
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  BarChart3, Wallet, TrendingUp, Eye, MousePointerClick,
  DollarSign, RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';

// ─── Register Chart.js once (module scope, only when this chunk loads) ────
ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
);
ChartJS.defaults.color = '#64748b';
ChartJS.defaults.font.family = 'Inter, sans-serif';
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.padding = 12;

// ─── Mock chart data (stable, module-scoped) ───────────────────────────────
const MONTHS_LABELS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

const MOCK_REVENUE = {
  vipSubscriptions: [12_000_000, 15_000_000, 11_000_000, 18_000_000, 22_000_000, 19_000_000],
  adRevenue: [8_000_000, 9_500_000, 7_200_000, 11_000_000, 14_000_000, 12_500_000],
  platformCosts: [5_000_000, 5_800_000, 4_500_000, 6_200_000, 7_500_000, 6_800_000],
  marketingSpend: [3_200_000, 4_000_000, 2_800_000, 4_500_000, 5_200_000, 4_800_000]
};

const MOCK_DAILY_TXNS = Array.from({ length: 30 }, (_, i) => ({
  day: `N${i + 1}`,
  count: Math.floor(Math.random() * 20) + 5,
  volume: Math.floor(Math.random() * 15_000_000) + 2_000_000
}));

// ─── ChartCard presentational wrapper ──────────────────────────────────────
const ChartCard = ({ title, subtitle, icon, children, height = 'auto' }) => (
  <div className="glass" style={{ padding: '24px', height }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <div style={{ color: 'var(--primary)', display: 'flex' }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</div>
        {subtitle && <div className="text-muted" style={{ fontSize: '0.78rem' }}>{subtitle}</div>}
      </div>
    </div>
    {children}
  </div>
);

// ─── Ad Performance Card ──────────────────────────────────────────────────
const AdPerformanceCard = () => {
  const adStats = useMemo(() => ({
    impressions: 128_450,
    clicks: 8_920,
    ctr: ((8_920 / 128_450) * 100).toFixed(1),
    avgCpc: 2_500,
    totalAdSpend: MOCK_REVENUE.marketingSpend.reduce((a, b) => a + b, 0)
  }), []);

  const rows = [
    { label: 'Lượt hiển thị', value: adStats.impressions.toLocaleString('vi-VN'), icon: <Eye size={16} />, color: 'var(--primary)' },
    { label: 'Lượt nhấp', value: adStats.clicks.toLocaleString('vi-VN'), icon: <MousePointerClick size={16} />, color: 'var(--success)' },
    { label: 'CTR', value: `${adStats.ctr}%`, icon: <TrendingUp size={16} />, color: 'var(--warning)' },
    { label: 'CPC trung bình', value: `${formatCurrency(adStats.avgCpc)}₫`, icon: <DollarSign size={16} />, color: 'var(--secondary)' },
  ];

  return (
    <div className="glass" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ color: 'var(--primary)', display: 'flex' }}><TrendingUp size={20} /></div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Hiệu suất Quảng cáo</div>
          <div className="text-muted" style={{ fontSize: '0.78rem' }}>ADS campaign metrics</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {rows.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: item.color, display: 'flex' }}>{item.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Charts Section (main export) ─────────────────────────────────────────
const AdminChartsSection = ({ transactions }) => {
  // ── Computed data ──────────────────────────────────────────────────────
  const totalVip = useMemo(() => MOCK_REVENUE.vipSubscriptions.reduce((a, b) => a + b, 0), []);
  const totalAd = useMemo(() => MOCK_REVENUE.adRevenue.reduce((a, b) => a + b, 0), []);
  const totalDeposits = useMemo(() =>
    (transactions || [])
      .filter(t => t.status === 'completed' && t.method === 'vietqr')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    [transactions]);

  const monthlyIncome = useMemo(
    () => MOCK_REVENUE.vipSubscriptions.map((v, i) => v + MOCK_REVENUE.adRevenue[i]),
    []
  );
  const monthlySpending = useMemo(
    () => MOCK_REVENUE.platformCosts.map((c, i) => c + MOCK_REVENUE.marketingSpend[i]),
    []
  );
  const netProfit = useMemo(
    () => monthlyIncome.map((inc, i) => inc - monthlySpending[i]),
    [monthlyIncome, monthlySpending]
  );

  // ── Bar: Revenue vs costs ─────────────────────────────────────────────
  const revenueBar = {
    labels: MONTHS_LABELS,
    datasets: [
      {
        label: 'Thu nhập (VIP + Quảng cáo)', data: monthlyIncome,
        backgroundColor: 'rgba(99, 102, 241, 0.7)', borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1, borderRadius: 6, barPercentage: 0.6
      },
      {
        label: 'Chi phí vận hành', data: monthlySpending,
        backgroundColor: 'rgba(239, 68, 68, 0.5)', borderColor: 'rgba(239, 68, 68, 0.8)',
        borderWidth: 1, borderRadius: 6, barPercentage: 0.6
      },
      {
        label: 'Lợi nhuận ròng', data: netProfit,
        backgroundColor: 'rgba(16, 185, 129, 0.5)', borderColor: 'rgba(16, 185, 129, 0.8)',
        borderWidth: 1, borderRadius: 6, barPercentage: 0.6
      }
    ]
  };

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, usePointStyle: true, font: { size: 11 } } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString('vi-VN')}₫` } }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: { callback: (v) => `${(Number(v) / 1_000_000).toFixed(0)}tr` },
        grid: { color: 'rgba(0,0,0,0.04)' }
      }
    }
  };

  // ── Doughnut: Revenue breakdown ────────────────────────────────────────
  const doughnut = {
    labels: ['Gói Đẩy tin', 'Quảng cáo', 'Nạp tiền ví', 'Phí dịch vụ'],
    datasets: [{
      data: [Math.max(totalVip, 100_000), Math.max(totalAd, 50_000),
      Math.max(totalDeposits || 15_000_000, 100_000), 3_500_000],
      backgroundColor: [
        'rgba(245, 158, 11, 0.8)', 'rgba(99, 102, 241, 0.8)',
        'rgba(16, 185, 129, 0.8)', 'rgba(236, 72, 153, 0.8)'
      ],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 2,
    }]
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false, cutout: '60%',
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, usePointStyle: true, font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const vals = ctx.dataset.data.map(Number);
            const total = vals.reduce((a, b) => a + b, 0);
            const val = Number(ctx.raw);
            return `${ctx.label}: ${val.toLocaleString('vi-VN')}₫ (${((val / total) * 100).toFixed(1)}%)`;
          }
        }
      }
    }
  };

  // ── Line: Daily transactions ──────────────────────────────────────────
  const dailyLine = {
    labels: MOCK_DAILY_TXNS.map(d => d.day),
    datasets: [{
      label: 'Số giao dịch',
      data: MOCK_DAILY_TXNS.map(d => d.count),
      borderColor: 'rgba(99, 102, 241, 0.8)',
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      fill: true, tension: 0.4,
      pointRadius: 3, pointHoverRadius: 6,
      pointBackgroundColor: 'rgba(99, 102, 241, 1)',
    }]
  };

  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.raw} giao dịch` } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
      y: { ticks: { stepSize: 5 }, grid: { color: 'rgba(0,0,0,0.04)' } }
    }
  };

  return (
    <>
      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        <ChartCard title="Thu nhập & Chi phí" subtitle="6 tháng gần nhất (VNĐ)"
          icon={<BarChart3 size={20} />} height="340px">
          <div style={{ height: '240px' }}><Bar data={revenueBar} options={barOptions} /></div>
        </ChartCard>

        <ChartCard title="Cơ cấu doanh thu" subtitle="Phân bổ theo nguồn"
          icon={<Wallet size={20} />} height="340px">
          <div style={{ height: '240px' }}><Doughnut data={doughnut} options={doughnutOptions} /></div>
        </ChartCard>
      </div>

      {/* Ad Performance + Daily Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px' }}>
        <AdPerformanceCard />

        <ChartCard title="Giao dịch hằng ngày" subtitle="30 ngày gần nhất"
          icon={<RefreshCw size={20} />} height="340px">
          <div style={{ height: '240px' }}><Line data={dailyLine} options={lineOptions} /></div>
        </ChartCard>
      </div>
    </>
  );
};

export default AdminChartsSection;
