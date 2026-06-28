import React from 'react';
import { PlusCircle } from 'lucide-react';

const RoommateSidebar = ({ currentUser, onOpenModal }) => (
  <aside className="roommates-sidebar">
    <div className="roommates-sidebar-top">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <h1 className="heading-1" style={{ fontSize: '2rem', margin: 0, color: 'white' }}>Homate</h1>
          
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '4px 10px', 
            background: 'rgba(99, 102, 241, 0.15)', 
            border: '1px solid rgba(99, 102, 241, 0.3)', 
            borderRadius: '9999px', 
            fontSize: '0.72rem',
            color: 'white',
            fontWeight: 500,
            whiteSpace: 'nowrap'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }}></span>
            <span>Quanh đây: <strong style={{ color: 'var(--primary)' }}>142 SV</strong></span>
          </div>
        </div>
        
        <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
          Tìm ngay "destiny" cho mình bạn nhé
        </p>
      </div>

      <button
        type="button"
        className="btn btn-primary w-full justify-center"
        onClick={onOpenModal}
        style={{ marginTop: '4px' }}
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
