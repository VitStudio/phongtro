import React from 'react';
import { RotateCcw, X, Star, Heart, Zap } from 'lucide-react';

const SwipeControls = ({ canRewind, isDisabled, onRewind, onSwipe, onBoost }) => (
  <div className="tinder-controls">
    <button
      type="button"
      className="tinder-btn tinder-btn--rewind"
      onClick={onRewind}
      disabled={!canRewind}
      style={{ opacity: canRewind ? 1 : 0.3 }}
      aria-label="Quay lại thẻ trước"
      title="Quay lại"
    >
      <RotateCcw size={20} />
    </button>
    <button
      type="button"
      className="tinder-btn tinder-btn--nope"
      onClick={() => onSwipe('left')}
      disabled={isDisabled}
      aria-label="Bỏ qua"
      title="Bỏ qua"
    >
      <X size={28} />
    </button>
    <button
      type="button"
      className="tinder-btn tinder-btn--star"
      onClick={() => onSwipe('up')}
      disabled={isDisabled}
      aria-label="Cực kỳ thích"
      title="Cực thích"
    >
      <Star size={20} fill="currentColor" />
    </button>
    <button
      type="button"
      className="tinder-btn tinder-btn--like"
      onClick={() => onSwipe('right')}
      disabled={isDisabled}
      aria-label="Thích"
      title="Thích"
    >
      <Heart size={28} fill="currentColor" />
    </button>
    <button
      type="button"
      className="tinder-btn tinder-btn--boost"
      onClick={onBoost}
      aria-label="Tăng tốc tìm kiếm"
      title="Tăng tốc"
    >
      <Zap size={20} fill="currentColor" />
    </button>
  </div>
);

export default SwipeControls;
