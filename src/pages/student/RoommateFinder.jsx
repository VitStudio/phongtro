import React, { useReducer, useRef, useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { createInitialState, roommateReducer, getSwipeLabel, getSwipeTarget, parseInterests } from './roommate-finder/reducer';
import RoommateSidebar from './roommate-finder/RoommateSidebar';
import MobileHeader from './roommate-finder/MobileHeader';
import SwipeDeck from './roommate-finder/SwipeDeck';
import SwipeControls from './roommate-finder/SwipeControls';
import CreatePostModal from './roommate-finder/CreatePostModal';
import MatchOverlay from './roommate-finder/MatchOverlay';
import ads1 from '../../assets/ads/ads1.jpg';
import ads2 from '../../assets/ads/ads2.jpg';
import ads3 from '../../assets/ads/ads3.jpg';
import ads4 from '../../assets/ads/ads4.jpg';

const ADS = [ads1, ads2, ads3, ads4];

const RoommateFinder = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [state, dispatch] = useReducer(roommateReducer, currentUser, createInitialState);
  const dragStart = useRef({ x: 0, y: 0, time: 0 });

  const [leftAdIndex, setLeftAdIndex] = useState(0);
  const [rightAdIndex, setRightAdIndex] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeftAdIndex((prev) => (prev + 1) % ADS.length);
      setRightAdIndex((prev) => (prev + 1) % ADS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeProfile = state.cardsList[state.cardIndex];

  const openModal = () => {
    dispatch({ type: 'openModal', defaultName: currentUser?.name });
  };

  const handleChange = (e) => {
    dispatch({ type: 'changeFormField', name: e.target.name, value: e.target.value });
  };

  const handlePost = () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập với tư cách sinh viên để đăng tin.');
      return;
    }
    if (!state.formData.name || !state.formData.age || !state.formData.budget || !state.formData.district) {
      toast.warning('Vui lòng điền đủ các thông tin bắt buộc.');
      return;
    }

    const newCard = {
      id: `rm_custom_${Date.now()}`,
      name: state.formData.name,
      age: parseInt(state.formData.age) || 20,
      images: [currentUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=HomateUser'],
      bio: state.formData.description || 'Tìm bạn chung phòng phù hợp',
      budget: parseInt(state.formData.budget) || 1500000,
      district: state.formData.district,
      gender: state.formData.gender,
      interests: parseInterests(state.formData.interests),
      isMatchable: false
    };

    dispatch({ type: 'postCard', card: newCard, currentUser });
    toast.success('Đăng tin tìm bạn ở ghép thành công! Thẻ của bạn đã được chèn vào lượt quẹt tiếp theo.');
  };

  const handleDragStart = (e) => {
    if (state.isAnimating) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    dragStart.current = { x: clientX, y: clientY, time: Date.now() };
    dispatch({ type: 'startDrag' });
  };

  const handleDragMove = (e) => {
    if (!state.isDragging || state.isAnimating) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - dragStart.current.x;
    const y = clientY - dragStart.current.y;
    let swipeDirection = null;

    if (x > 50) {
      swipeDirection = 'like';
    } else if (x < -50) {
      swipeDirection = 'nope';
    } else if (y < -50 && Math.abs(y) > Math.abs(x)) {
      swipeDirection = 'super';
    }

    dispatch({ type: 'moveDrag', offset: { x, y }, swipeDirection });
  };

  const handleDragEnd = (e) => {
    if (!state.isDragging || state.isAnimating) return;
    dispatch({ type: 'endDrag' });

    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || dragStart.current.x;
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || dragStart.current.y;
    const xDist = clientX - dragStart.current.x;
    const yDist = clientY - dragStart.current.y;
    const elapsed = Date.now() - dragStart.current.time;

    if (elapsed < 200 && Math.abs(xDist) < 5 && Math.abs(yDist) < 5) {
      handleCardTap(e, clientX);
      return;
    }

    const threshold = 120;
    if (xDist > threshold) {
      executeSwipe('right');
    } else if (xDist < -threshold) {
      executeSwipe('left');
    } else if (yDist < -threshold && Math.abs(yDist) > Math.abs(xDist)) {
      executeSwipe('up');
    } else {
      dispatch({ type: 'resetDrag' });
    }
  };

  const handleCardTap = (e, clientX) => {
    if (!activeProfile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const isLeftTap = clickX < rect.width / 3;
    const imgCount = activeProfile.images.length;
    const nextImgIndex = isLeftTap
      ? Math.max(state.activeImgIndex - 1, 0)
      : Math.min(state.activeImgIndex + 1, imgCount - 1);

    dispatch({ type: 'tapImage', nextImgIndex });
  };

  const handleCardKeyDown = (e) => {
    if (!activeProfile) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      dispatch({ type: 'tapImage', nextImgIndex: Math.max(state.activeImgIndex - 1, 0) });
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      dispatch({
        type: 'tapImage',
        nextImgIndex: Math.min(state.activeImgIndex + 1, activeProfile.images.length - 1)
      });
    }
  };

  const executeSwipe = (direction) => {
    if (!activeProfile || state.isAnimating) return;
    dispatch({
      type: 'startSwipe',
      swipeDirection: getSwipeLabel(direction),
      dragOffset: getSwipeTarget(direction)
    });

    setTimeout(() => {
      const matchedProfile = (direction === 'right' || direction === 'up') && activeProfile.isMatchable
        ? activeProfile
        : null;

      dispatch({ type: 'completeSwipe', matchedProfile });
      if (matchedProfile) {
        setTimeout(() => dispatch({ type: 'showMatchModal' }), 300);
      }
    }, 300);
  };

  const handleRewind = () => {
    if (state.history.length === 0 || state.isAnimating) return;
    dispatch({ type: 'startRewind' });

    setTimeout(() => {
      dispatch({ type: 'settleRewind' });
      setTimeout(() => dispatch({ type: 'finishAnimation' }), 300);
    }, 50);
  };

  const handleBoost = () => {
    toast.success('⚡ Gói tăng tốc (Boost) đã được kích hoạt! Thẻ của bạn đã được ưu tiên hàng đầu.');
  };

  const getCardStyle = (index) => {
    if (index !== state.cardIndex) return {};

    const rotation = state.dragOffset.x / 12;
    const transition = state.isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.35s';

    return {
      transform: `translate3d(${state.dragOffset.x}px, ${state.dragOffset.y}px, 0) rotate(${rotation}deg)`,
      transition,
      zIndex: 100
    };
  };

  const getStampOpacity = (type) => {
    if (state.swipeDirection !== type) return 0;
    const xDist = Math.abs(state.dragOffset.x);
    const yDist = Math.abs(state.dragOffset.y);
    const dist = type === 'super' ? yDist : xDist;
    return Math.min(dist / 120, 1);
  };

  return (
    <div className="roommates-app-container">
      <RoommateSidebar currentUser={currentUser} onOpenModal={openModal} />
      <main className="roommates-main-content">
        <MobileHeader onOpenModal={openModal} />

        <div className="roommates-swipe-layout">
          <aside className="roommates-side-ad roommates-side-ad--left" aria-label="Quảng cáo tài trợ">
            <div className="roommates-side-ad-badge">QUẢNG CÁO</div>
            <img src={ADS[leftAdIndex]} alt="Quảng cáo tài trợ" key={`left-ad-${leftAdIndex}`} className="roommates-ad-image anim-fade" />
          </aside>

          <div className="roommates-swipe-center">
            <SwipeDeck
              state={state}
              currentUser={currentUser}
              getCardStyle={getCardStyle}
              getStampOpacity={getStampOpacity}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              onCardKeyDown={handleCardKeyDown}
              onToggleBio={() => dispatch({ type: 'toggleBio' })}
              onRestartDeck={() => dispatch({ type: 'restartDeck' })}
            />
            <SwipeControls
              canRewind={state.history.length > 0}
              isDisabled={state.cardIndex >= state.cardsList.length || state.isAnimating}
              onRewind={handleRewind}
              onSwipe={executeSwipe}
              onBoost={handleBoost}
            />
          </div>

          <aside className="roommates-side-ad roommates-side-ad--right" aria-label="Quảng cáo tài trợ">
            <div className="roommates-side-ad-badge">QUẢNG CÁO</div>
            <img src={ADS[rightAdIndex]} alt="Quảng cáo tài trợ" key={`right-ad-${rightAdIndex}`} className="roommates-ad-image anim-fade" />
          </aside>
        </div>
      </main>

      <CreatePostModal
        isOpen={state.isModalOpen}
        formData={state.formData}
        onClose={() => dispatch({ type: 'closeModal' })}
        onChange={handleChange}
        onPost={handlePost}
      />

      {state.showMatchModal && state.matchedProfile && (
        <MatchOverlay
          currentUser={currentUser}
          matchedProfile={state.matchedProfile}
          onChat={() => {
            dispatch({ type: 'closeMatchModal' });
            toast.success(`📨 Đã kết nối hộp thoại chat với ${state.matchedProfile.name}!`);
          }}
          onKeepSwiping={() => dispatch({ type: 'closeMatchModal' })}
        />
      )}
    </div>
  );
};

export default RoommateFinder;
