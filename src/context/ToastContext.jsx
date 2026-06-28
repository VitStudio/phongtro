import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

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

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const success = (msg) => addToast(msg, 'success');
  const error = (msg) => addToast(msg, 'error');
  const warning = (msg) => addToast(msg, 'warning');
  const info = (msg) => addToast(msg, 'info');

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
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
          let bg = 'white';
          
          if (toast.type === 'success') { Icon = CheckCircle; color = 'var(--success)'; }
          if (toast.type === 'error') { Icon = XCircle; color = 'var(--danger)'; }
          if (toast.type === 'warning') { Icon = AlertCircle; color = 'var(--warning)'; }

          return (
            <div key={toast.id} className="glass-card animate-fade-in-up" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 24px',
              minWidth: '300px',
              borderLeft: `4px solid ${color}`
            }}>
              <Icon color={color} size={24} />
              <div style={{ flex: 1, fontWeight: 500 }}>{toast.message}</div>
              <button onClick={() => removeToast(toast.id)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
