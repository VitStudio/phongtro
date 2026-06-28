import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

const GlassModal = ({ isOpen, onClose, title, children }) => {
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const restoreFocusTimerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    triggerRef.current = document.activeElement;
    if (!dialog.open) dialog.showModal();

    const focusTimer = setTimeout(() => contentRef.current?.focus(), 50);

    return () => {
      clearTimeout(focusTimer);
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
    if (restoreFocusTimerRef.current) clearTimeout(restoreFocusTimerRef.current);
    restoreFocusTimerRef.current = setTimeout(() => triggerRef.current?.focus(), 50);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      className="modal-overlay"
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className="glass modal-content-box"
      >
        <button type="button"
          onClick={handleClose}
          aria-label="Đóng"
          style={{ position: 'absolute', top: 16, right: 16, color: 'var(--text-muted)', padding: 4, borderRadius: 8 }}
        >
          <X size={24} aria-hidden="true" />
        </button>

        <h2 className="heading-2 mb-6" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>{title}</h2>

        {children}
      </div>
    </dialog>
  );
};

export default GlassModal;
