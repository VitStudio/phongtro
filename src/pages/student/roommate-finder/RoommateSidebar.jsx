import React from 'react';
import { PlusCircle } from 'lucide-react';

const RoommateSidebar = ({ currentUser, onOpenModal }) => (
  <aside className="roommates-sidebar">
    <div className="roommates-sidebar-top">
      <div className="roommates-sidebar-title-section">
        <h1 className="heading-1" style={{ fontSize: '2rem', margin: 0, color: 'white' }}>Homate</h1>
        <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
          tìm ngay "destiny" cho mình bạn nhé
        </p>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', fontSize: '0.85rem' }}>
          <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Đang tìm kiếm quanh đây</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>142 Sinh Viên</div>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary w-full justify-center"
        onClick={onOpenModal}
        style={{ marginTop: '12px' }}
      >
        <PlusCircle size={18} /> Đăng Tin Miễn Phí
      </button>
    </div>

    {currentUser && (
      <div className="roommates-sidebar-profile">
        <img src={currentUser.avatar} alt="avatar" className="roommates-sidebar-avatar" />
        <div className="roommates-sidebar-user-info">
          <span className="roommates-sidebar-user-name">{currentUser.name}</span>
          <span className="roommates-sidebar-user-balance">Ví: {currentUser.wallet_balance.toLocaleString()}đ</span>
        </div>
      </div>
    )}
  </aside>
);

export default RoommateSidebar;
