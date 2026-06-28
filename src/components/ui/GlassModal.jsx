import React from 'react';
import { X } from 'lucide-react';

const GlassModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 'clamp(16px, 4vw, 0px)',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="glass"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: 'clamp(20px, 5vw, 32px)',
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          margin: 'auto'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>

        <h2 className="heading-2 mb-6" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>{title}</h2>

        {children}
      </div>
    </div>
  );
};

export default GlassModal;
