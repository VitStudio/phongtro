import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GlassModal from '../../components/ui/GlassModal';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Copy,
  Check,
  Clock,
  ExternalLink,
  Banknote,
  QrCode,
  Loader2,
  AlertTriangle
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────
const BANK_INFO = {
  bin: '970436',
  shortName: 'VCB',
  name: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
  accountNo: '1010101010',
  accountName: 'CONG TY TNHH PHONGTROGENZ',
  branch: 'Hồ Chí Minh'
};

const PRESET_AMOUNTS = [100000, 200000, 500000, 1000000, 2000000, 5000000];
const MIN_DEPOSIT = 10000;
const MAX_DEPOSIT = 100_000_000;

/** Parse user input into a safe deposit amount */
const parseDepositAmount = (value) => {
  if (!value || value === 'custom') return 0;
  const num = Number(value);
  // Reject NaN, negative, infinity, scientific notation artifacts
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.floor(num); // only whole VND
};

const WalletPage = () => {
  const { currentUser, transactions, addTransaction, updateWallet, users } = useAuth();
  const toast = useToast();

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState('deposit');

  // ── Deposit modal state ──
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');     // '' | String(num) | 'custom'
  const [customAmount, setCustomAmount] = useState('');
  const [depositStep, setDepositStep] = useState('form');     // form | qr | confirm
  const [copiedField, setCopiedField] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);    // anti-double-click
  const [qrLoading, setQrLoading] = useState(true);
  const [qrFailed, setQrFailed] = useState(false);

  const myTransactions = transactions.filter(t => t.user_id === currentUser?.id);
  const balance = currentUser?.wallet_balance || 0;

  // ── Computed ──
  const finalAmount = depositAmount === 'custom'
    ? parseDepositAmount(customAmount)
    : parseDepositAmount(depositAmount);

  // ── Simulated 30s verification countdown ──
  useEffect(() => {
    if (depositStep !== 'confirm' || verifyProgress >= 100) return;
    const timer = setTimeout(() => {
      setVerifyProgress(prev => Math.min(prev + 5, 100));
    }, 600);
    return () => clearTimeout(timer);
  }, [verifyProgress, depositStep]);

  // ── Reset deposit modal ──
  const resetDepositModal = useCallback(() => {
    setDepositStep('form');
    setCopiedField(null);
    setIsVerifying(false);
    setVerifyProgress(0);
    setIsProcessing(false);
    setQrLoading(true);
    setQrFailed(false);
  }, []);

  // ── Open modal (from page button — passes pre-selected amount) ──
  const handleOpenDeposit = (preselected) => {
    if (preselected && parseDepositAmount(preselected) >= MIN_DEPOSIT) {
      // User already picked an amount on the page → skip to QR step
      setDepositAmount(preselected);
      setCustomAmount('');
      setDepositStep('qr');
      setQrLoading(true);
      setQrFailed(false);
    } else {
      // No preselected amount → start at form step
      setDepositAmount('');
      setCustomAmount('');
      resetDepositModal();
    }
    setCopiedField(null);
    setIsDepositModalOpen(true);
  };

  // ── Validate & proceed to QR ──
  const handleContinueToQR = () => {
    if (finalAmount < MIN_DEPOSIT) {
      toast.warning(`Số tiền nạp tối thiểu là ${MIN_DEPOSIT.toLocaleString('vi-VN')}đ`);
      return;
    }
    if (finalAmount > MAX_DEPOSIT) {
      toast.warning(`Số tiền nạp tối đa là ${MAX_DEPOSIT.toLocaleString('vi-VN')}đ`);
      return;
    }
    setDepositStep('qr');
    setQrLoading(true);
    setQrFailed(false);
  };

  // ── Copy to clipboard ──
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // ── User confirms they transferred → start verification ──
  const handleConfirmTransfer = () => {
    if (isProcessing) return; // idempotency guard
    setIsProcessing(true);
    setIsVerifying(true);
    setVerifyProgress(0);
    setDepositStep('confirm');
  };

  // ── Atomic deposit: record transaction + update balance ──
  const completeDeposit = useCallback(() => {
    const amount = finalAmount;
    if (amount <= 0) return;

    const txnId = `TXN${Date.now()}`;
    addTransaction({
      user_id: currentUser.id,
      type: 'deposit',
      amount,
      method: 'vietqr',
      bank: BANK_INFO.shortName,
      status: 'completed',
      txnId,
      description: `Nạp tiền qua VietQR - ${BANK_INFO.shortName}`
    });
    updateWallet(currentUser.id, amount);

    setIsDepositModalOpen(false);
    resetDepositModal();
    toast.success(`Nạp thành công ${amount.toLocaleString('vi-VN')}₫ vào Ví!`);
  }, [finalAmount, currentUser, addTransaction, updateWallet, resetDepositModal, toast]);

  // When progress hits 100 → automatically complete
  useEffect(() => {
    if (verifyProgress >= 100 && depositStep === 'confirm') {
      setIsVerifying(false);
      completeDeposit();
    }
  }, [verifyProgress, depositStep, completeDeposit]);

  // ── Format helpers ──
  const f = (amount) => (Number(amount) || 0).toLocaleString('vi-VN');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      hour: '2-digit', minute: '2-digit',
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const StatusBadge = ({ status }) => {
    if (status === 'completed' || status === 'approved') {
      return <span className="badge badge-success">Hoàn tất</span>;
    }
    if (status === 'pending') {
      return <span className="badge badge-warning">Chờ xử lý</span>;
    }
    return <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>{status}</span>;
  };

  // ── Render ──
  return (
    <div className="flex-col gap-8 mb-8 mt-4">
      {/* 🚧 Demo Banner */}
      <div style={{
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        borderRadius: '16px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.85rem',
        fontWeight: 600,
        flexWrap: 'wrap'
      }}>
        <AlertTriangle size={22} />
        <span style={{ flex: 1 }}>
          🚧 <strong>Môi trường Demo</strong> — Đây là giao diện mô phỏng. Không có giao dịch thật nào được thực hiện.
          Mọi số dư và giao dịch chỉ mang tính chất minh họa.
        </span>
      </div>

      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between', alignItems: 'center', gap: '16px'
      }}>
        <h1 className="heading-1" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
          💰 Ví Tiền
        </h1>
        <button className="btn btn-primary" onClick={() => handleOpenDeposit(depositAmount)}>
          <CreditCard size={18} /> Nạp tiền
        </button>
      </div>

      {/* Balance Card */}
      <div className="glass" style={{
        padding: 'clamp(24px, 5vw, 40px)',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', opacity: 0.9 }}>
            <Wallet size={22} />
            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Số dư khả dụng</span>
          </div>
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            {f(balance)}<span style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.8, marginLeft: '4px' }}>₫</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8, fontSize: '0.85rem' }}>
              <Banknote size={16} /> Đã nạp: {f(
                myTransactions.filter(t => t.type === 'deposit' && t.status === 'completed')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}₫
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8, fontSize: '0.85rem' }}>
              <ArrowUpRight size={16} /> Đã chi: {f(
                myTransactions.filter(t => t.type === 'payment' || (t.type === 'deposit' && t.amount < 0))
                  .reduce((sum, t) => sum + Math.abs(t.amount < 0 ? t.amount : 0), 0)
              )}₫
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom: '2px solid var(--glass-border)', paddingBottom: '16px',
        display: 'flex', gap: '12px', flexWrap: 'wrap'
      }}>
        <button
          className={`btn ${activeTab === 'deposit' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          onClick={() => setActiveTab('deposit')}
        >
          <CreditCard size={16} /> Nạp tiền
        </button>
        <button
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={16} /> Lịch sử giao dịch
        </button>
      </div>

      {/* ────── Tab: Deposit Guide ────── */}
      {activeTab === 'deposit' && (
        <div className="flex-col gap-6">
          {/* Quick deposit methods */}
          <div className="glass" style={{ padding: 'clamp(20px, 5vw, 32px)' }}>
            <h3 className="heading-3 mb-6">Nạp tiền ngay</h3>
            <p className="text-muted mb-6" style={{ fontSize: '0.9rem' }}>
              Chọn số tiền hoặc nhập số tiền mong muốn, sau đó quét mã VietQR bằng ứng dụng ngân hàng để thanh toán.
            </p>

            <div className="flex gap-3" style={{ flexWrap: 'wrap', marginBottom: '16px' }}>
              {PRESET_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  className={`btn ${depositAmount === String(amount) ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    padding: '10px 18px', fontSize: '0.85rem',
                    borderColor: depositAmount === String(amount) ? 'transparent' : 'var(--primary)',
                    flex: '1 1 auto', minWidth: '100px'
                  }}
                  onClick={() => {
                    setDepositAmount(String(amount));
                    setCustomAmount('');
                  }}
                >
                  {f(amount)}₫
                </button>
              ))}
            </div>

            <div className="input-group">
              <label className="input-label">Hoặc nhập số tiền khác</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="input-field"
                  placeholder="VD: 150000"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setDepositAmount('custom');
                  }}
                  min="0"
                  style={{ flex: 1 }}
                />
                <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>VNĐ</span>
              </div>
            </div>

            <button
              className="btn btn-primary w-full justify-center mt-6"
              onClick={() => handleOpenDeposit(depositAmount)}
              disabled={finalAmount < MIN_DEPOSIT}
              style={{
                padding: '14px',
                opacity: finalAmount < MIN_DEPOSIT ? 0.5 : 1
              }}
            >
              <QrCode size={20} /> Tạo mã VietQR
            </button>
          </div>

          {/* Bank info */}
          <div className="glass" style={{ padding: 'clamp(20px, 5vw, 32px)' }}>
            <h3 className="heading-3 mb-4">Thông tin chuyển khoản</h3>
            <p className="text-muted mb-6" style={{ fontSize: '0.9rem' }}>
              Bạn có thể chuyển khoản trực tiếp đến tài khoản công ty của chúng tôi.
            </p>

            <div className="flex-col gap-4">
              {[
                { label: 'Ngân hàng', value: BANK_INFO.name, key: 'bank' },
                { label: 'Số tài khoản', value: BANK_INFO.accountNo, key: 'accountNo', copyable: true },
                { label: 'Chủ tài khoản', value: BANK_INFO.accountName, key: 'accountName' },
                { label: 'Chi nhánh', value: BANK_INFO.branch, key: 'branch' },
              ].map(item => (
                <div key={item.key} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '12px 0',
                  borderBottom: '1px solid var(--glass-border)'
                }}>
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>{item.value}</span>
                    {item.copyable && (
                      <button
                        onClick={() => handleCopy(item.value, item.key)}
                        style={{
                          padding: '8px', borderRadius: '8px',
                          color: copiedField === item.key ? 'var(--success)' : 'var(--text-muted)',
                          transition: 'all 0.2s',
                          minWidth: '32px', minHeight: '32px'
                        }}
                        title="Sao chép"
                      >
                        {copiedField === item.key ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass" style={{
              marginTop: '16px', padding: '12px 16px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '12px'
            }}>
              <p style={{ color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 500 }}>
                ⚠️ Nội dung chuyển khoản ghi rõ <strong>Mã số sinh viên</strong> để hệ thống đối soát tự động.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ────── Tab: Transaction History ────── */}
      {activeTab === 'history' && (
        <div className="glass table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem' }}>Mã GD</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem' }}>Loại</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem' }}>Số tiền</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem' }}>Phương thức</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem' }}>Trạng thái</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem' }}>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {myTransactions.length > 0 ? (
                myTransactions.map(txn => (
                  <tr key={txn.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 500 }}>{txn.txnId || txn.id.slice(0, 12)}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: txn.type === 'deposit' ? 'var(--success)' : 'var(--danger)',
                        fontWeight: 600, fontSize: '0.85rem'
                      }}>
                        {txn.type === 'deposit' ? (
                          <><ArrowDownLeft size={14} /> Nạp tiền</>
                        ) : (
                          <><ArrowUpRight size={14} /> Thanh toán</>
                        )}
                      </div>
                      {txn.description && (
                        <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                          {txn.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        fontWeight: 700, fontSize: '0.9rem',
                        color: txn.type === 'deposit' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {txn.type === 'deposit' ? '+' : '-'}{f(txn.amount)}₫
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem' }}>
                      <span className="badge" style={{
                        background: txn.method === 'vietqr'
                          ? 'rgba(99, 102, 241, 0.1)'
                          : txn.method === 'refund'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        color: txn.method === 'vietqr' ? 'var(--primary)' : txn.method === 'refund' ? 'var(--success)' : 'var(--warning)',
                        fontSize: '0.75rem'
                      }}>
                        {txn.method === 'vietqr' ? 'VietQR' : txn.method === 'refund' ? 'Hoàn tiền' : txn.method || 'Ví'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <StatusBadge status={txn.status} />
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.8rem' }} className="text-muted">
                      {formatDate(txn.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '48px', textAlign: 'center' }} className="text-muted">
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
                    <div style={{ fontWeight: 500 }}>Chưa có giao dịch nào.</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                      Hãy nạp tiền lần đầu để bắt đầu sử dụng dịch vụ!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════ VIETQR DEPOSIT MODAL ══════════ */}
      <GlassModal
        isOpen={isDepositModalOpen}
        onClose={() => {
          if (depositStep === 'confirm' && isVerifying) return;
          setIsDepositModalOpen(false);
        }}
        title={depositStep === 'form' ? 'Nạp tiền qua VietQR' : 'Quét mã VietQR'}
      >
        {/* Step 1: Only shown when user opened modal WITHOUT preselected amount */}
        {depositStep === 'form' && (
          <div className="flex-col gap-4">
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Vui lòng chọn hoặc nhập số tiền bạn muốn nạp vào Ví.
            </p>

            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {PRESET_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  className={`btn ${depositAmount === String(amount) ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    padding: '10px 16px', fontSize: '0.8rem',
                    flex: '1 1 auto', minWidth: '80px'
                  }}
                  onClick={() => {
                    setDepositAmount(String(amount));
                    setCustomAmount('');
                  }}
                >
                  {f(amount)}₫
                </button>
              ))}
            </div>

            <div className="input-group">
              <label className="input-label">Số tiền khác</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Nhập số tiền..."
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setDepositAmount('custom');
                  }}
                  style={{ flex: 1 }}
                  min="0"
                />
                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>VNĐ</span>
              </div>
            </div>

            {finalAmount > 0 && (
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '14px 16px',
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: '12px', marginTop: '8px'
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Số tiền nạp:</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)' }}>
                  {f(finalAmount)}₫
                </span>
              </div>
            )}

            <button
              className="btn btn-primary w-full justify-center mt-4"
              onClick={handleContinueToQR}
              disabled={finalAmount < MIN_DEPOSIT}
              style={{
                padding: '14px',
                opacity: finalAmount < MIN_DEPOSIT ? 0.5 : 1
              }}
            >
              Tiếp tục <ExternalLink size={18} />
            </button>

            <div className="glass" style={{
              padding: '12px 16px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '12px'
            }}>
              <p style={{ color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 500 }}>
                💡 Số tiền sẽ được cộng vào Ví ngay sau khi hệ thống xác nhận giao dịch thành công.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: QR Code Display */}
        {depositStep === 'qr' && (
          <div className="flex-col gap-6" style={{ textAlign: 'center' }}>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Quét mã QR bên dưới bằng ứng dụng ngân hàng để thanh toán.
            </p>

            {/* VietQR Code */}
            <div className="glass" style={{
              padding: '16px',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              borderRadius: '16px',
              background: 'white',
              minHeight: 'clamp(200px, 60vw, 280px)',
              minWidth: 'clamp(200px, 60vw, 280px)',
              position: 'relative'
            }}>
              {/* Loading skeleton */}
              {qrLoading && !qrFailed && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '48px', height: '48px',
                    border: '3px solid #e2e8f0',
                    borderTop: '3px solid var(--primary)',
                    borderRadius: '50%',
                    animation: 'walletSpin 0.8s linear infinite'
                  }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                    Đang tạo mã QR...
                  </span>
                </div>
              )}

              {/* QR image or fallback */}
              {qrFailed ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏦</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>
                    Chuyển khoản thủ công
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
                    Vui lòng chuyển khoản đến tài khoản bên dưới
                  </div>
                </div>
              ) : (
                <img
                  src={`https://img.vietqr.io/image/${BANK_INFO.bin}-${BANK_INFO.accountNo}-print.jpg?amount=${finalAmount}&addInfo=NapTienVi_${currentUser?.id || ''}`}
                  alt="VietQR Code"
                  style={{
                    width: 'clamp(200px, 60vw, 280px)',
                    height: 'clamp(200px, 60vw, 280px)',
                    borderRadius: '8px',
                    objectFit: 'contain',
                    display: qrLoading ? 'none' : 'block'
                  }}
                  onLoad={() => setQrLoading(false)}
                  onError={() => {
                    setQrLoading(false);
                    setQrFailed(true);
                  }}
                />
              )}
            </div>

            {/* Payment Summary */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.06)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Ngân hàng:</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{BANK_INFO.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Số tài khoản:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{BANK_INFO.accountNo}</span>
                  <button
                    onClick={() => handleCopy(BANK_INFO.accountNo, 'modalAccount')}
                    style={{
                      padding: '8px', borderRadius: '8px',
                      color: copiedField === 'modalAccount' ? 'var(--success)' : 'var(--text-muted)',
                      minWidth: '32px', minHeight: '32px'
                    }}
                    title="Sao chép"
                  >
                    {copiedField === 'modalAccount' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Chủ tài khoản:</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{BANK_INFO.accountName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Số tiền:</span>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--success)' }}>
                  {f(finalAmount)}₫
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Nội dung CK:</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
                  NapTienVi_{currentUser?.id || ''}
                </span>
              </div>
            </div>

            <div className="flex-col gap-3" style={{ marginTop: '8px' }}>
              <button
                className="btn btn-primary w-full justify-center"
                onClick={handleConfirmTransfer}
                disabled={isProcessing}
                style={{
                  padding: '14px',
                  opacity: isProcessing ? 0.6 : 1
                }}
              >
                <Check size={20} /> Tôi đã chuyển khoản
              </button>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                Sau khi nhấn, hệ thống sẽ xác nhận giao dịch (dự kiến 30-60 giây).
                Vui lòng không đóng cửa sổ này.
              </p>
              <button
                className="btn btn-outline w-full justify-center"
                onClick={() => { setDepositStep('form'); setCopiedField(null); }}
                disabled={isProcessing}
                style={{
                  padding: '12px',
                  opacity: isProcessing ? 0.5 : 1
                }}
              >
                Quay lại
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verifying Payment */}
        {depositStep === 'confirm' && (
          <div className="flex-col gap-6" style={{ textAlign: 'center', alignItems: 'center' }}>
            {verifyProgress < 100 ? (
              <>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <Loader2 size={40} style={{ color: 'var(--primary)', animation: 'walletSpin 1s linear infinite' }} />
                </div>

                <h3 className="heading-3">Đang xác nhận giao dịch...</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  Hệ thống đang kiểm tra giao dịch từ ngân hàng. Vui lòng chờ trong giây lát.
                </p>

                <div style={{
                  width: '100%', height: '8px',
                  background: '#e2e8f0', borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${verifyProgress}%`, height: '100%',
                    background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <div className="glass" style={{
                  padding: '12px 16px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                  width: '100%'
                }}>
                  <p style={{ color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 500 }}>
                    ⏱️ Quá trình này thường mất 30-60 giây.
                    Vui lòng không đóng cửa sổ này.
                  </p>
                </div>
              </>
            ) : null}
          </div>
        )}

        <style>{`@keyframes walletSpin { to { transform: rotate(360deg); } }`}</style>
      </GlassModal>
    </div>
  );
};

export default WalletPage;
