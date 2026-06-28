import React from 'react';
import { PlusCircle } from 'lucide-react';

const RoommateSidebar = ({ onOpenModal }) => (
  <div className="roommates-header-row">
    <div className="roommates-header-left">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <h1 className="heading-1 roommates-page-title" style={{ fontSize: '2rem', margin: 0, color: 'white', fontWeight: 800 }}>Homate</h1>
        
        <div className="roommates-capsule-badge">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }}></span>
          <span>Quanh đây: <strong style={{ color: 'var(--primary)' }}>142 SV</strong></span>
        </div>
      </div>
      <p className="text-muted roommates-page-subtitle" style={{ fontSize: '0.85rem', margin: '4px 0 0 0', width: '100%' }}>
        Tìm ngay <span style={{ color: '#ff7875', fontWeight: 600 }}>"destiny"</span> cho mình bạn nhé
      </p>
    </div>

    <button
      type="button"
      className="btn btn-primary roommates-header-btn"
      onClick={onOpenModal}
    >
      <PlusCircle size={18} /> Đăng Tin Miễn Phí
    </button>
  </div>
);

export default RoommateSidebar;
