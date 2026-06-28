import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';

const ProfileCard = ({
  profile,
  isActive,
  activeImgIndex,
  isBioExpanded,
  cardStyle,
  likeOpacity,
  nopeOpacity,
  onDragStart,
  onDragMove,
  onDragEnd,
  onCardKeyDown,
  onToggleBio
}) => (
  <div
    className="tinder-card"
    style={cardStyle}
  >
    <button
      type="button"
      className="tinder-card-hit-area"
      tabIndex={isActive ? 0 : -1}
      aria-label={`${profile.name}, dùng phím mũi tên trái hoặc phải để đổi ảnh`}
      onMouseDown={isActive ? onDragStart : undefined}
      onMouseMove={isActive ? onDragMove : undefined}
      onMouseUp={isActive ? onDragEnd : undefined}
      onMouseLeave={isActive ? onDragEnd : undefined}
      onTouchStart={isActive ? onDragStart : undefined}
      onTouchMove={isActive ? onDragMove : undefined}
      onTouchEnd={isActive ? onDragEnd : undefined}
      onKeyDown={isActive ? onCardKeyDown : undefined}
    >
      <div className="tinder-card-img-wrapper">
        <img src={profile.images[isActive ? activeImgIndex : 0]} alt={profile.name} className="tinder-card-img" />
        <div className="tinder-card-gradient" />

        {profile.images.length > 1 && (
          <div className="tinder-card-indicators">
            {profile.images.map((_, barIdx) => (
              <div
                key={barIdx}
                className={`tinder-card-indicator-bar ${isActive && barIdx === activeImgIndex ? 'tinder-card-indicator-bar--active' : ''}`}
              />
            ))}
          </div>
        )}

        {isActive && (
          <>
            <div className="tinder-stamp tinder-stamp--like" style={{ opacity: likeOpacity }}>THÍCH</div>
            <div className="tinder-stamp tinder-stamp--nope" style={{ opacity: nopeOpacity }}>BỎ QUA</div>
          </>
        )}
      </div>
    </button>

    <div className="tinder-card-info">
      <div className="tinder-card-name-age">
        {profile.name} <span className="tinder-card-age">{profile.age}</span>
      </div>
      <button
        type="button"
        className={`tinder-card-bio ${isBioExpanded ? 'tinder-card-bio--expanded' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleBio();
        }}
        style={{ pointerEvents: 'auto', cursor: 'pointer', background: 'transparent', border: 0, color: 'inherit', padding: 0, textAlign: 'left' }}
      >
        "{profile.bio}"
      </button>

      <div className="tinder-card-meta">
        <div className="tinder-meta-badge">
          <MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> {profile.district}
        </div>
        <div className="tinder-meta-badge">
          <DollarSign size={12} style={{ display: 'inline', marginRight: 2, verticalAlign: 'middle' }} /> ~{profile.budget.toLocaleString()}đ
        </div>
      </div>
    </div>
  </div>
);

export default ProfileCard;
