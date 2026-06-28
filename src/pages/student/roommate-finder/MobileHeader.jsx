import React from 'react';
import { PlusCircle } from 'lucide-react';

const MobileHeader = ({ onOpenModal }) => (
  <div className="roommates-mobile-header">
    <div className="flex justify-between items-center w-full">
      <div>
        <h1 className="heading-1" style={{ fontSize: '1.75rem', margin: 0, color: 'white' }}>Homate</h1>
        <p className="text-muted mt-1" style={{ fontSize: '0.8rem', margin: 0 }}>
          Tìm ngay "destiny" cho mình nhé
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        onClick={onOpenModal}
      >
        <PlusCircle size={16} /> Đăng Tin
      </button>
    </div>
  </div>
);

export default MobileHeader;
