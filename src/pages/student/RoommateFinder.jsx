import React, { useReducer, useRef } from 'react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { PlusCircle, MapPin, DollarSign, RotateCcw, X, Star, Heart, Zap, Sparkles, Send } from 'lucide-react';
import GlassModal from '../../components/ui/GlassModal';

// ─── Import Homate Profile Images from local assets ───────────────────────
import p1_1 from '../../assets/img/homate/p1 (4).jpg';
import p1_2 from '../../assets/img/homate/p1 (2).jpg';
import p1_3 from '../../assets/img/homate/p1 (3).jpg';
import p1_4 from '../../assets/img/homate/p1 (1).jpg';

import p2_1 from '../../assets/img/homate/p2 (1).jpg';
import p2_2 from '../../assets/img/homate/p2 (2).jpg';
import p2_3 from '../../assets/img/homate/p2 (3).jpg';

import p3_1 from '../../assets/img/homate/p3 (1).jpg';
import p3_2 from '../../assets/img/homate/p3 (2).jpg';
import p3_3 from '../../assets/img/homate/p3 (3).jpg';

import p4_1 from '../../assets/img/homate/p4 (1).jpg';
import p4_2 from '../../assets/img/homate/p4 (2).jpg';
import p4_3 from '../../assets/img/homate/p4 (3).jpg';

import p5_1 from '../../assets/img/homate/p5 (1).jpg';
import p5_2 from '../../assets/img/homate/p5 (2).jpg';
import p5_3 from '../../assets/img/homate/p5 (3).jpg';

import p6_1 from '../../assets/img/homate/p6 (1).jpg';
import p6_2 from '../../assets/img/homate/p6 (2).jpg';
import p6_3 from '../../assets/img/homate/p6 (3).jpg';

const INITIAL_CARDS = [
  {
    id: 'rm_p1',
    name: 'nf',
    age: 20,
    images: [p1_1, p1_2, p1_3, p1_4],
    bio: 'Mình là nf, iu chó, nhưng k có duyên nuôi, thích sống về đêm nhưng hoạt động ban ngày, bạn nào buổi tối cũng thích cú đêm thức khuya coi phim thì tụi mình hợp nhao lắm á, mình mới 20 tủi hoi nên tâm hồn còn trẻ lắm hehe. Mình cũng k gọn gàng mấy nma đừng ở dơ quá nha mấy cục dàng.',
    budget: 1500000,
    district: 'Thủ Đức',
    gender: 'female',
    interests: ['Cú đêm', 'Iu chó', 'Xem phim'],
    isMatchable: true
  },
  {
    id: 'rm_p2',
    name: 'Hưng',
    age: 18,
    images: [p2_1, p2_2, p2_3],
    bio: 'Mình là Hưng cutee 18 tuổi chập chững mới lên sài gòn tìm bạn nam ở chung chỉ cần gọn gàng và sạch sẽ mình dễ tính nên các bạn thoải mái.',
    budget: 1600000,
    district: 'Bình Thạnh',
    gender: 'male',
    interests: ['Sạch sẽ', 'Dễ tính', 'Học tập'],
    isMatchable: false
  },
  {
    id: 'rm_p3',
    name: 'Thuỳ',
    age: 21,
    images: [p3_1, p3_2, p3_3],
    bio: 'mình là thuỳ, mình rất đáng iu, mình hoạt động chủ íu về đêm, buổi sáng k đi học thì mình ngủ, sở thích của mình là ngủ và xem phim và hẹn hò, mình 2x tuổi (x tiểu học), hiện tại là sinh viên. Mình k quá gọn gàng và cầu toàn nhưng ý thức lắm nên có thể bảo ban nhau nè',
    budget: 1800000,
    district: 'Quận 10',
    gender: 'female',
    interests: ['Ngủ', 'Xem phim', 'Hẹn hò'],
    isMatchable: true
  },
  {
    id: 'rm_p4',
    name: 'Thắng',
    age: 19,
    images: [p4_1, p4_2, p4_3],
    bio: 'Hi, mình là Thắng, 19 tuổi, đang tuyển một người đồng hành gánh tiền nhà. Mình thích chơi thể thao, đi ăn, cà phê, lâu lâu bật nhạc rồi hát như đang concert dù hàng xóm không xin vé, và đặc biệt là ăn trứng như gà (1 ngày 5 quả là chuyện thường). Mình sống dễ tính, ít drama, không cắn người (trừ khi giành miếng gà cuối cùng ). Chỉ cần bạn ở sạch, đúng hạn tiền nhà và chịu được mấy câu nói nhảm thì mình nghĩ tụi mình sẽ thành roommate quốc dân.',
    budget: 2000000,
    district: 'Tân Bình',
    gender: 'male',
    interests: ['Thể thao', 'Singing', 'Ăn uống'],
    isMatchable: false
  },
  {
    id: 'rm_p5',
    name: 'Trí',
    age: 20,
    images: [p5_1, p5_2, p5_3],
    bio: 'Hellu, mình là Trí, 20tủi. Cần tìm bạn cùng phòng. Mình không quá kĩ tính nhưng mình cần tìm bạn gọn gàng sạch sẽ là được, tiền phòng các thứ share đều. Thi thoảng mình có đi làm đêm về muộn nên mong bạn có thể thông cảm hoặc có lối sống cú đêm giống mình hehe',
    budget: 1700000,
    district: 'Quận 7',
    gender: 'male',
    interests: ['Cú đêm', 'Đi làm', 'Sạch sẽ'],
    isMatchable: false
  },
  {
    id: 'rm_p6',
    name: 'Thành Vỹ',
    age: 21,
    images: [p6_1, p6_2, p6_3],
    bio: 'Mình là Thành Vỹ. Mình đẹp trai (theo lời mọi người nha 😌), tháo vác, học cũng khá ổn nên thường xuyên được học bổng. Hiện tại mình là sinh viên. Mình sống khá thoải mái, không quá cầu toàn nhưng có trách nhiệm, biết ý và sẵn sàng hỗ trợ nhau trong sinh hoạt. Sở thích của mình là xem phim, đi cà phê, khám phá đồ ăn ngon và lâu lâu chơi thể thao. Nếu ở chung thì cứ góp ý thẳng thắn với nhau, mình luôn sẵn sàng lắng nghe để cả hai có không gian sống thoải mái nhất.',
    budget: 2200000,
    district: 'Quận 3',
    gender: 'male',
    interests: ['Xem phim', 'Học bổng', 'Cà phê'],
    isMatchable: true
  }
];

const createDefaultFormData = (currentUser) => ({
  name: currentUser?.name || '',
  age: '20',
  gender: 'female',
  budget: '',
  district: '',
  interests: '',
  description: ''
});

const createInitialState = (currentUser) => ({
  cardsList: INITIAL_CARDS,
  cardIndex: 0,
  activeImgIndex: 0,
  isBioExpanded: false,
  history: [],
  dragOffset: { x: 0, y: 0 },
  isDragging: false,
  swipeDirection: null,
  isAnimating: false,
  matchedProfile: null,
  showMatchModal: false,
  isModalOpen: false,
  formData: createDefaultFormData(currentUser)
});

const roommateReducer = (state, action) => {
  switch (action.type) {
    case 'openModal':
      return {
        ...state,
        isModalOpen: true,
        formData: {
          ...state.formData,
          name: state.formData.name || action.defaultName || ''
        }
      };
    case 'closeModal':
      return { ...state, isModalOpen: false };
    case 'changeFormField':
      return {
        ...state,
        formData: { ...state.formData, [action.name]: action.value }
      };
    case 'postCard':
      return {
        ...state,
        cardsList: [
          ...state.cardsList.slice(0, state.cardIndex),
          action.card,
          ...state.cardsList.slice(state.cardIndex)
        ],
        isModalOpen: false,
        formData: createDefaultFormData(action.currentUser)
      };
    case 'startDrag':
      return { ...state, isDragging: true };
    case 'moveDrag':
      return {
        ...state,
        dragOffset: action.offset,
        swipeDirection: action.swipeDirection
      };
    case 'endDrag':
      return { ...state, isDragging: false };
    case 'resetDrag':
      return {
        ...state,
        dragOffset: { x: 0, y: 0 },
        swipeDirection: null
      };
    case 'tapImage':
      return {
        ...state,
        activeImgIndex: action.nextImgIndex,
        dragOffset: { x: 0, y: 0 },
        swipeDirection: null
      };
    case 'startSwipe':
      return {
        ...state,
        isAnimating: true,
        swipeDirection: action.swipeDirection,
        dragOffset: action.dragOffset
      };
    case 'completeSwipe':
      return {
        ...state,
        history: [...state.history, { cardIndex: state.cardIndex, activeImgIndex: state.activeImgIndex }],
        matchedProfile: action.matchedProfile || state.matchedProfile,
        cardIndex: state.cardIndex + 1,
        activeImgIndex: 0,
        isBioExpanded: false,
        dragOffset: { x: 0, y: 0 },
        swipeDirection: null,
        isAnimating: false
      };
    case 'showMatchModal':
      return { ...state, showMatchModal: true };
    case 'closeMatchModal':
      return { ...state, showMatchModal: false };
    case 'toggleBio':
      return { ...state, isBioExpanded: !state.isBioExpanded };
    case 'startRewind': {
      const prevHistoryState = state.history[state.history.length - 1];
      return {
        ...state,
        isAnimating: true,
        history: state.history.slice(0, -1),
        dragOffset: { x: -1000, y: 0 },
        cardIndex: prevHistoryState.cardIndex,
        activeImgIndex: prevHistoryState.activeImgIndex,
        isBioExpanded: false,
        swipeDirection: null
      };
    }
    case 'settleRewind':
      return { ...state, dragOffset: { x: 0, y: 0 } };
    case 'finishAnimation':
      return { ...state, isAnimating: false };
    case 'restartDeck':
      return {
        ...state,
        cardIndex: 0,
        activeImgIndex: 0,
        isBioExpanded: false,
        history: [],
        dragOffset: { x: 0, y: 0 },
        swipeDirection: null
      };
    default:
      return state;
  }
};

const getSwipeLabel = (direction) => (direction === 'right' ? 'like' : direction === 'left' ? 'nope' : 'super');

const getSwipeTarget = (direction) => {
  if (direction === 'right') return { x: 1000, y: 0 };
  if (direction === 'left') return { x: -1000, y: 0 };
  return { x: 0, y: -1000 };
};

const parseInterests = (interests) => (
  interests
    ? interests.split(',').flatMap((item) => {
      const trimmed = item.trim();
      return trimmed ? [trimmed] : [];
    })
    : ['Bạn mới', 'Ở ghép']
);

const RoommateFinder = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [state, dispatch] = useReducer(roommateReducer, currentUser, createInitialState);
  const dragStart = useRef({ x: 0, y: 0, time: 0 });

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

const RoommateSidebar = ({ currentUser, onOpenModal }) => (
  <aside className="roommates-sidebar">
    <div className="roommates-sidebar-top">
      <div className="roommates-sidebar-title-section">
        <h1 className="heading-1" style={{ fontSize: '2rem', margin: 0, color: 'white' }}>Homate</h1>
        <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
          tìm ngay “destiny” cho mình bạn nhé
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

const MobileHeader = ({ onOpenModal }) => (
  <div className="roommates-mobile-header">
    <div className="flex justify-between items-center w-full">
      <div>
        <h1 className="heading-1" style={{ fontSize: '1.75rem', margin: 0, color: 'white' }}>Homate</h1>
        <p className="text-muted mt-1" style={{ fontSize: '0.8rem', margin: 0 }}>
          tìm ngay “destiny” cho mình nhé
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

const CreatePostModal = ({ isOpen, formData, onClose, onChange, onPost }) => (
  <GlassModal isOpen={isOpen} onClose={onClose} title="Đăng tin tìm ở ghép">
    <div className="flex-col gap-4">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }} className="grid-3col-responsive">
        <div className="input-group">
          <label className="input-label" htmlFor="rm-name">Tên hiển thị</label>
          <input id="rm-name" name="name" value={formData.name} className="input-field" placeholder="Tên của bạn" onChange={onChange} />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="rm-age">Tuổi</label>
          <input id="rm-age" name="age" type="number" value={formData.age} className="input-field" placeholder="20" onChange={onChange} />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="rm-gender">Giới tính</label>
          <select id="rm-gender" name="gender" value={formData.gender} className="input-field" onChange={onChange} style={{ height: '42px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '0 12px' }}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid-2col-responsive">
        <div className="input-group">
          <label className="input-label" htmlFor="rm-budget">Ngân sách (VNĐ/tháng)</label>
          <input id="rm-budget" name="budget" value={formData.budget} type="number" className="input-field" placeholder="1500000" onChange={onChange} />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="rm-district">Khu vực / Quận</label>
          <input id="rm-district" name="district" value={formData.district} className="input-field" placeholder="Thủ Đức, Bình Thạnh..." onChange={onChange} />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label" htmlFor="rm-interests">Sở thích (Cách nhau bằng dấu phẩy)</label>
        <input id="rm-interests" name="interests" value={formData.interests} className="input-field" placeholder="VD: Nấu ăn, Xem phim, Đọc sách" onChange={onChange} />
      </div>

      <div className="input-group">
        <label className="input-label" htmlFor="rm-desc">Giới thiệu bản thân & Lối sống</label>
        <textarea id="rm-desc" name="description" value={formData.description} className="input-field" rows="3" placeholder="Ví dụ: Mình là sinh viên năm 2 sạch sẽ, mong muốn tìm bạn cùng phòng không hút thuốc..." onChange={onChange}></textarea>
      </div>

      <button type="button" className="btn btn-primary w-full justify-center mt-2" onClick={onPost}>
        Đăng Tin Ngay
      </button>
    </div>
  </GlassModal>
);

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

export default RoommateFinder;
