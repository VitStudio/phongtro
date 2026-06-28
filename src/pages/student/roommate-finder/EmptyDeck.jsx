import React from 'react';

const EmptyDeck = ({ currentUser, onRestartDeck }) => (
  <div className="tinder-deck-empty">
    <img
      src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=HomateUser'}
      alt="My profile avatar"
      className="tinder-empty-avatar"
    />
    <h3 className="heading-3 mb-2" style={{ color: 'white' }}>Đã hết gợi ý hôm nay!</h3>
    <p className="text-muted mb-6">Hãy nâng cấp ví hoặc thay đổi bộ lọc khu vực để tìm thấy thêm nhiều roommates phù hợp nhé.</p>
    <button type="button" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }} onClick={onRestartDeck}>
      Quẹt lại từ đầu
    </button>
  </div>
);

export default EmptyDeck;
