import React, { useState, useCallback, useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { ToastContext } from './useToast';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);
  const toastContextValue = useMemo(() => ({ success, error, warning, info }), [success, error, warning, info]);

  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map(toast => {
          let Icon = AlertCircle;
          let color = 'var(--text-main)';
          
          if (toast.type === 'success') { Icon = CheckCircle; color = 'var(--success)'; }
          if (toast.type === 'error') { Icon = XCircle; color = 'var(--danger)'; }
          if (toast.type === 'warning') { Icon = AlertCircle; color = 'var(--warning)'; }

          return (
            <div key={toast.id} role="alert" className="glass-card animate-fade-in-up" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 24px',
              minWidth: '300px',
              borderLeft: `4px solid ${color}`
            }}>
              <Icon color={color} size={24} aria-hidden="true" />
              <div style={{ flex: 1, fontWeight: 500 }}>{toast.message}</div>
              <button type="button" onClick={() => removeToast(toast.id)} aria-label="Đóng thông báo" style={{ color: 'var(--text-muted)', padding: 4, borderRadius: 8 }}>
                <X size={20} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
