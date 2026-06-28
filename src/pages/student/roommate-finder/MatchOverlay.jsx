import React from 'react';
import { Sparkles, Heart, Send } from 'lucide-react';

const MatchOverlay = ({ currentUser, matchedProfile, onChat, onKeepSwiping }) => (
  <div className="tinder-match-overlay">
    <Sparkles size={48} className="text-warning mb-6" />
    <h2 className="tinder-match-title">It's a Match!</h2>
    <p className="tinder-match-subtitle">Bạn và {matchedProfile.name} đã thích nhau.</p>

    <div className="tinder-match-avatars">
      <img
        src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=HomateUser'}
        alt="My avatar"
        className="tinder-match-avatar"
      />
      <Heart size={36} fill="currentColor" className="tinder-match-heart" />
      <img
        src={matchedProfile.images[0]}
        alt={matchedProfile.name}
        className="tinder-match-avatar"
      />
    </div>

    <button
      type="button"
      className="btn tinder-match-btn tinder-match-btn--chat"
      onClick={onChat}
    >
      <Send size={18} /> Nhắn tin ngay
    </button>

    <button
      type="button"
      className="btn tinder-match-btn tinder-match-btn--keep"
      onClick={onKeepSwiping}
    >
      Tiếp tục quẹt
    </button>
  </div>
);

export default MatchOverlay;
