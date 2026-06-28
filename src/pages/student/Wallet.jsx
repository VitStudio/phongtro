import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
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

import { formatCurrency } from '../../utils/format';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const DEPOSIT_INITIAL_STATE = {
  isDepositModalOpen: false,
  depositAmount: '',
  customAmount: '',
  depositStep: 'form',
  copiedField: null,
  isVerifying: false,
  verifyProgress: 0,
  isProcessing: false,
  qrLoading: true,
  qrFailed: false
};

const resetDepositState = (state) => ({
  ...state,
  depositStep: 'form',
  copiedField: null,
  isVerifying: false,
  verifyProgress: 0,
  isProcessing: false,
  qrLoading: true,
  qrFailed: false
});

const depositReducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return resetDepositState(state);
    case 'open_with_amount':
      return {
        ...state,
        isDepositModalOpen: true,
        depositAmount: action.amount,
        customAmount: '',
        depositStep: 'qr',
        copiedField: null,
        qrLoading: true,
        qrFailed: false
      };
    case 'open_form':
      return {
        ...resetDepositState(state),
        isDepositModalOpen: true,
        depositAmount: '',
        customAmount: ''
      };
    case 'close':
      return { ...state, isDepositModalOpen: false };
    case 'select_amount':
      return { ...state, depositAmount: action.amount, customAmount: '' };
    case 'set_custom_amount':
      return { ...state, customAmount: action.amount, depositAmount: 'custom' };
    case 'show_qr':
      return { ...state, depositStep: 'qr', qrLoading: true, qrFailed: false };
    case 'back_to_form':
      return { ...state, depositStep: 'form', copiedField: null };
    case 'copy':
      return { ...state, copiedField: action.field };
    case 'clear_copy':
      return { ...state, copiedField: null };
    case 'confirm_transfer':
      return {
        ...state,
        isProcessing: true,
        isVerifying: true,
        verifyProgress: 0,
        depositStep: 'confirm'
      };
    case 'set_verifying':
      return { ...state, isVerifying: action.value };
    case 'advance_progress':
      return { ...state, verifyProgress: Math.min(state.verifyProgress + 5, 100) };
    case 'qr_loaded':
      return { ...state, qrLoading: false };
    case 'qr_failed':
      return { ...state, qrLoading: false, qrFailed: true };
    default:
      return state;
  }
};

const StatusBadge = ({ status }) => {
  if (status === 'completed' || status === 'approved') {
    return <span className="badge badge-success">Hoàn tất</span>;
  }
  if (status === 'pending') {
    return <span className="badge badge-warning">Chờ xử lý</span>;
  }
  return <span className="badge wallet-status-default">{status}</span>;
};

const TransactionHistory = ({ transactions }) => (
  <div className="glass table-wrapper">
    <table className="wallet-table">
      <thead>
        <tr className="wallet-table-head-row">
          <th className="wallet-th">Mã GD</th>
          <th className="wallet-th">Loại</th>
          <th className="wallet-th">Số tiền</th>
          <th className="wallet-th">Phương thức</th>
          <th className="wallet-th">Trạng thái</th>
          <th className="wallet-th">Thời gian</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map(txn => (
            <tr key={txn.id} className="wallet-table-row">
              <td className="wallet-td wallet-td-sm">
                <span style={{ fontWeight: 500 }}>{txn.txnId || txn.id.slice(0, 12)}</span>
              </td>
              <td className="wallet-td">
                <div className={`wallet-transaction-type ${txn.type === 'deposit' ? 'wallet-transaction-in' : 'wallet-transaction-out'}`}>
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
              <td className="wallet-td">
                <span className={`wallet-transaction-amount ${txn.type === 'deposit' ? 'wallet-transaction-in' : 'wallet-transaction-out'}`}>
                  {txn.type === 'deposit' ? '+' : '-'}{formatCurrency(txn.amount)}₫
                </span>
              </td>
              <td className="wallet-td wallet-td-sm">
                <span className={`badge wallet-method-badge wallet-method-${txn.method || 'wallet'}`}>
                  {txn.method === 'vietqr' ? 'VietQR' : txn.method === 'refund' ? 'Hoàn tiền' : txn.method || 'Ví'}
                </span>
              </td>
              <td className="wallet-td">
                <StatusBadge status={txn.status} />
              </td>
              <td className="wallet-td wallet-td-time text-muted">
                {formatDate(txn.created_at)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="wallet-empty-cell text-muted">
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
);

const WalletDepositModal = ({
  isOpen,
  depositStep,
  isVerifying,
  depositAmount,
  customAmount,
  finalAmount,
  copiedField,
  qrLoading,
  qrFailed,
  isProcessing,
  verifyProgress,
  currentUser,
  dispatchDeposit,
  handleCopy,
  handleContinueToQR,
  handleConfirmTransfer
}) => (
  <GlassModal
    isOpen={isOpen}
    onClose={() => {
      if (depositStep === 'confirm' && isVerifying) return;
      dispatchDeposit({ type: 'close' });
    }}
    title={depositStep === 'form' ? 'Nạp tiền qua VietQR' : 'Quét mã VietQR'}
  >
    {depositStep === 'form' && (
      <div className="flex-col gap-4">
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          Vui lòng chọn hoặc nhập số tiền bạn muốn nạp vào Ví.
        </p>

        <div className="flex gap-2 wallet-modal-preset-row">
          {PRESET_AMOUNTS.map(amount => (
            <button type="button"
              key={amount}
              className={`btn wallet-modal-preset-btn ${depositAmount === String(amount) ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                dispatchDeposit({ type: 'select_amount', amount: String(amount) });
              }}
            >
              {formatCurrency(amount)}₫
            </button>
          ))}
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="wallet-modal-custom-amount">Số tiền khác</label>
          <div className="wallet-modal-input-row">
            <input
              id="wallet-modal-custom-amount"
              type="number"
              className="input-field"
              placeholder="Nhập số tiền..."
              value={customAmount}
              onChange={(e) => {
                dispatchDeposit({ type: 'set_custom_amount', amount: e.target.value });
              }}
              style={{ flex: 1 }}
              min="0"
            />
            <span className="wallet-modal-currency-label">VNĐ</span>
          </div>
        </div>

        {finalAmount > 0 && (
          <div className="wallet-deposit-summary">
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Số tiền nạp:</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)' }}>
              {formatCurrency(finalAmount)}₫
            </span>
          </div>
        )}

        <button type="button"
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

        <div className="glass wallet-warning-box">
          <p style={{ color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 500 }}>
            💡 Số tiền sẽ được cộng vào Ví ngay sau khi hệ thống xác nhận giao dịch thành công.
          </p>
        </div>
      </div>
    )}

    {depositStep === 'qr' && (
      <div className="flex-col gap-6 wallet-modal-centered">
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          Quét mã QR bên dưới bằng ứng dụng ngân hàng để thanh toán.
        </p>

        <div className="glass wallet-qr-box">
          {qrLoading && !qrFailed && (
            <div className="wallet-qr-loading">
              <div className="wallet-spinner" />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                Đang tạo mã QR...
              </span>
            </div>
          )}

          {qrFailed ? (
            <div className="wallet-qr-fallback">
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
              className={qrLoading ? 'wallet-qr-image wallet-qr-image-hidden' : 'wallet-qr-image'}
              onLoad={() => dispatchDeposit({ type: 'qr_loaded' })}
              onError={() => {
                dispatchDeposit({ type: 'qr_failed' });
              }}
            />
          )}
        </div>

        <div className="wallet-payment-summary">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Ngân hàng:</span>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{BANK_INFO.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Số tài khoản:</span>
            <div className="wallet-payment-copy-row">
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{BANK_INFO.accountNo}</span>
              <button type="button"
                onClick={() => handleCopy(BANK_INFO.accountNo, 'modalAccount')}
                className={`wallet-copy-btn ${copiedField === 'modalAccount' ? 'wallet-copy-btn-active' : ''}`}
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
              {formatCurrency(finalAmount)}₫
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
          <button type="button"
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
          <button type="button"
            className="btn btn-outline w-full justify-center"
            onClick={() => dispatchDeposit({ type: 'back_to_form' })}
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

    {depositStep === 'confirm' && (
      <div className="flex-col gap-6 wallet-confirm-panel">
        {verifyProgress < 100 ? (
          <>
            <div className="wallet-confirm-icon">
              <Loader2 size={40} className="wallet-loading-icon" />
            </div>

            <h3 className="heading-3">Đang xác nhận giao dịch...</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Hệ thống đang kiểm tra giao dịch từ ngân hàng. Vui lòng chờ trong giây lát.
            </p>

            <div className="wallet-progress-track">
              <div className="wallet-progress-fill" style={{ width: `${verifyProgress}%` }} />
            </div>

            <div className="glass wallet-warning-box wallet-warning-full">
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
);

const WalletHeader = ({ onDeposit }) => (
  <>
    <div className="wallet-demo-banner">
      <AlertTriangle size={22} />
      <span className="wallet-banner-message">
        🚧 <strong>Môi trường Demo</strong> — Đây là giao diện mô phỏng. Không có giao dịch thật nào được thực hiện.
        Mọi số dư và giao dịch chỉ mang tính chất minh họa.
      </span>
    </div>

    <div className="wallet-page-header">
      <h1 className="heading-1 wallet-page-title">
        💰 Ví Tiền
      </h1>
      <button type="button" className="btn btn-primary" onClick={onDeposit}>
        <CreditCard size={18} /> Nạp tiền
      </button>
    </div>
  </>
);

const WalletPage = () => {
  const { currentUser, transactions, addTransaction, updateWallet } = useAuth();
  const toast = useToast();

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState('deposit');

  // ── Deposit modal state ──
  const [depositState, dispatchDeposit] = useReducer(depositReducer, DEPOSIT_INITIAL_STATE);
  const {
    isDepositModalOpen,
    depositAmount,
    customAmount,
    depositStep,
    copiedField,
    isVerifying,
    verifyProgress,
    isProcessing,
    qrLoading,
    qrFailed
  } = depositState;

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
      dispatchDeposit({ type: 'advance_progress' });
    }, 600);
    return () => clearTimeout(timer);
  }, [verifyProgress, depositStep]);

  // ── Reset deposit modal ──
  const resetDepositModal = useCallback(() => {
    dispatchDeposit({ type: 'reset' });
  }, []);

  // ── Open modal (from page button — passes pre-selected amount) ──
  const handleOpenDeposit = (preselected) => {
    if (preselected && parseDepositAmount(preselected) >= MIN_DEPOSIT) {
      // User already picked an amount on the page → skip to QR step
      dispatchDeposit({ type: 'open_with_amount', amount: preselected });
    } else {
      // No preselected amount → start at form step
      dispatchDeposit({ type: 'open_form' });
    }
  };

  // ── Validate & proceed to QR ──
  const handleContinueToQR = () => {
    if (finalAmount < MIN_DEPOSIT) {
      toast.warning(`Số tiền nạp tối thiểu là ${formatCurrency(MIN_DEPOSIT)}đ`);
      return;
    }
    if (finalAmount > MAX_DEPOSIT) {
      toast.warning(`Số tiền nạp tối đa là ${formatCurrency(MAX_DEPOSIT)}đ`);
      return;
    }
    dispatchDeposit({ type: 'show_qr' });
  };

  // ── Copy to clipboard ──
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).catch(() => {});
    dispatchDeposit({ type: 'copy', field });
    setTimeout(() => dispatchDeposit({ type: 'clear_copy' }), 2000);
  };

  // ── User confirms they transferred → start verification ──
  const handleConfirmTransfer = () => {
    if (isProcessing) return; // idempotency guard
    dispatchDeposit({ type: 'confirm_transfer' });
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

    dispatchDeposit({ type: 'close' });
    resetDepositModal();
    toast.success(`Nạp thành công ${formatCurrency(amount)}₫ vào Ví!`);
  }, [finalAmount, currentUser, addTransaction, updateWallet, resetDepositModal, toast]);

  // When progress hits 100 → automatically complete
  useEffect(() => {
    if (verifyProgress >= 100 && depositStep === 'confirm') {
      dispatchDeposit({ type: 'set_verifying', value: false });
      completeDeposit();
    }
  }, [verifyProgress, depositStep, completeDeposit]);

  // ── Render ──
  return (
    <div className="flex-col gap-8 mb-8 mt-4">
      <WalletHeader onDeposit={() => handleOpenDeposit(depositAmount)} />

      {/* Balance Card */}
      <div className="glass wallet-balance-card">
        <div className="wallet-balance-blob wallet-balance-blob-top" />
        <div className="wallet-balance-blob wallet-balance-blob-bottom" />

        <div className="wallet-balance-content">
          <div className="wallet-balance-label-row">
            <Wallet size={22} />
            <span className="wallet-balance-label">Số dư khả dụng</span>
          </div>
          <div className="wallet-balance-amount">
            {f(balance)}<span className="wallet-balance-currency">₫</span>
          </div>
          <div className="wallet-balance-stats">
            <div className="wallet-balance-stat">
              <Banknote size={16} /> Đã nạp: {formatCurrency(
                myTransactions.filter(t => t.type === 'deposit' && t.status === 'completed')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}₫
            </div>
            <div className="wallet-balance-stat">
              <ArrowUpRight size={16} /> Đã chi: {formatCurrency(
                myTransactions.filter(t => t.type === 'payment' || (t.type === 'deposit' && t.amount < 0))
                  .reduce((sum, t) => sum + Math.abs(t.amount < 0 ? t.amount : 0), 0)
              )}₫
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar-bottom">
        <button type="button"
          className={`btn wallet-tab-btn ${activeTab === 'deposit' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('deposit')}
        >
          <CreditCard size={16} /> Nạp tiền
        </button>
        <button type="button"
          className={`btn wallet-tab-btn ${activeTab === 'history' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={16} /> Lịch sử giao dịch
        </button>
      </div>

      {/* ────── Tab: Deposit Guide ────── */}
      {activeTab === 'deposit' && (
        <div className="flex-col gap-6">
          {/* Quick deposit methods */}
          <div className="glass wallet-panel">
            <h3 className="heading-3 mb-6">Nạp tiền ngay</h3>
            <p className="text-muted mb-6" style={{ fontSize: '0.9rem' }}>
              Chọn số tiền hoặc nhập số tiền mong muốn, sau đó quét mã VietQR bằng ứng dụng ngân hàng để thanh toán.
            </p>

            <div className="flex gap-3 wallet-preset-row">
              {PRESET_AMOUNTS.map(amount => (
                <button type="button"
                  key={amount}
                  className={`btn wallet-preset-btn ${depositAmount === String(amount) ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => {
                    dispatchDeposit({ type: 'select_amount', amount: String(amount) });
                  }}
                >
                  {formatCurrency(amount)}₫
                </button>
              ))}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="wallet-custom-amount">Hoặc nhập số tiền khác</label>
              <div className="wallet-input-row">
                <input
                  id="wallet-custom-amount"
                  type="number"
                  className="input-field"
                  placeholder="VD: 150000"
                  value={customAmount}
                  onChange={(e) => {
                    dispatchDeposit({ type: 'set_custom_amount', amount: e.target.value });
                  }}
                  min="0"
                  style={{ flex: 1 }}
                />
                <span className="wallet-currency-label">VNĐ</span>
              </div>
            </div>

            <button type="button"
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
          <div className="glass wallet-panel">
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
                <div key={item.key} className="wallet-bank-row">
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>{item.label}</span>
                  <div className="wallet-bank-value-row">
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>{item.value}</span>
                    {item.copyable && (
                      <button type="button"
                        onClick={() => handleCopy(item.value, item.key)}
                        className={`wallet-copy-btn ${copiedField === item.key ? 'wallet-copy-btn-active' : ''}`}
                        title="Sao chép"
                      >
                        {copiedField === item.key ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass wallet-warning-box wallet-warning-spaced">
              <p style={{ color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 500 }}>
                ⚠️ Nội dung chuyển khoản ghi rõ <strong>Mã số sinh viên</strong> để hệ thống đối soát tự động.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ────── Tab: Transaction History ────── */}
      {activeTab === 'history' && (
        <TransactionHistory transactions={myTransactions} />
      )}

      <WalletDepositModal
        isOpen={isDepositModalOpen}
        depositStep={depositStep}
        isVerifying={isVerifying}
        depositAmount={depositAmount}
        customAmount={customAmount}
        finalAmount={finalAmount}
        copiedField={copiedField}
        qrLoading={qrLoading}
        qrFailed={qrFailed}
        isProcessing={isProcessing}
        verifyProgress={verifyProgress}
        currentUser={currentUser}
        dispatchDeposit={dispatchDeposit}
        handleCopy={handleCopy}
        handleContinueToQR={handleContinueToQR}
        handleConfirmTransfer={handleConfirmTransfer}
      />
    </div>
  );
};

export default WalletPage;
