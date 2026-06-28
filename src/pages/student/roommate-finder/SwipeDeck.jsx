import React from 'react';
import ProfileCard from './ProfileCard';
import EmptyDeck from './EmptyDeck';

const SwipeDeck = ({
  state,
  currentUser,
  getCardStyle,
  getStampOpacity,
  onDragStart,
  onDragMove,
  onDragEnd,
  onCardKeyDown,
  onToggleBio,
  onRestartDeck
}) => (
  <section className="tinder-container">
    <div className="tinder-card-deck">
      {state.cardIndex < state.cardsList.length ? (
        <CardStack
          state={state}
          getCardStyle={getCardStyle}
          getStampOpacity={getStampOpacity}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onCardKeyDown={onCardKeyDown}
          onToggleBio={onToggleBio}
        />
      ) : (
        <EmptyDeck currentUser={currentUser} onRestartDeck={onRestartDeck} />
      )}
    </div>
  </section>
);

const CardStack = ({ state, getCardStyle, getStampOpacity, onDragStart, onDragMove, onDragEnd, onCardKeyDown, onToggleBio }) => (
  <>
    {state.cardsList.map((profile, index) => {
      if (index < state.cardIndex || index > state.cardIndex + 1) return null;

      const isActive = index === state.cardIndex;

      return (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isActive={isActive}
          activeImgIndex={state.activeImgIndex}
          isBioExpanded={state.isBioExpanded}
          cardStyle={getCardStyle(index)}
          likeOpacity={getStampOpacity('like')}
          nopeOpacity={getStampOpacity('nope')}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onCardKeyDown={onCardKeyDown}
          onToggleBio={onToggleBio}
        />
      );
    }).reverse()}
  </>
);

export default SwipeDeck;
