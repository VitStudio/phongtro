import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { PlusCircle, MapPin, DollarSign, RotateCcw, X, Star, Heart, Zap, Sparkles, Send } from 'lucide-react';
import GlassModal from '../../components/ui/GlassModal';

// ─── Import Homate Profile Images from local assets ───────────────────────
import p1_1 from '../../assets/img/homate/p1 (1).jpg';
import p1_2 from '../../assets/img/homate/p1 (2).jpg';
import p1_3 from '../../assets/img/homate/p1 (3).jpg';
import p1_4 from '../../assets/img/homate/p1 (4).jpg';

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

const RoommateFinder = () => {
  const { currentUser } = useAuth();
  const toast = useToast();

  // ─── TINDER MOCK PROFILES (6 Profiles) ──────────────────────────────────
  const [cardsList, setCardsList] = useState([
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
  ]);

  // ── Swiper States ────────────────────────────────────────────────────────
  const [cardIndex, setCardIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [history, setHistory] = useState([]); // Array of { cardIndex, activeImgIndex }
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'like', 'nope', or 'super'
  const [isAnimating, setIsAnimating] = useState(false);

  // ── Match States ─────────────────────────────────────────────────────────
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // ── Modal Create Post States ─────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    age: '20',
    gender: 'female',
    budget: '',
    district: '',
    interests: '',
    description: ''
  });

  // Drag performance references
  const dragStart = useRef({ x: 0, y: 0, time: 0 });
  const activeProfile = cardsList[cardIndex];

  // Sync default name if user changes
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({ ...prev, name: currentUser.name }));
    }
  }, [currentUser]);

  // Reset active image index and bio expansion on card change
  useEffect(() => {
    setActiveImgIndex(0);
    setIsBioExpanded(false);
  }, [cardIndex]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePost = () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập với tư cách sinh viên để đăng tin.');
      return;
    }
    if (!formData.name || !formData.age || !formData.budget || !formData.district) {
      toast.warning('Vui lòng điền đủ các thông tin bắt buộc.');
      return;
    }

    // Parse comma-separated interests
    const parsedInterests = formData.interests
      ? formData.interests.split(',').map(s => s.trim()).filter(Boolean)
      : ['Bạn mới', 'Ở ghép'];

    // Insert new post as a card in the swiping stack!
    const newCard = {
      id: `rm_custom_${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age) || 20,
      images: [currentUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=HomateUser'],
      bio: formData.description || 'Tìm bạn chung phòng phù hợp',
      budget: parseInt(formData.budget) || 1500000,
      district: formData.district,
      gender: formData.gender,
      interests: parsedInterests,
      isMatchable: false
    };

    setCardsList(prev => [...prev.slice(0, cardIndex), newCard, ...prev.slice(cardIndex)]);
    setIsModalOpen(false);
    toast.success('Đăng tin tìm bạn ở ghép thành công! Thẻ của bạn đã được chèn vào lượt quẹt tiếp theo.');
    setFormData({
      name: currentUser?.name || '',
      age: '20',
      gender: 'female',
      budget: '',
      district: '',
      interests: '',
      description: ''
    });
  };

  // ── Swipe & Tap Physics Engine ───────────────────────────────────────────
  
  const handleDragStart = (e) => {
    if (isAnimating) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    dragStart.current = { x: clientX, y: clientY, time: Date.now() };
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!isDragging || isAnimating) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const x = clientX - dragStart.current.x;
    const y = clientY - dragStart.current.y;
    
    setDragOffset({ x, y });
    
    if (x > 50) {
      setSwipeDirection('like');
    } else if (x < -50) {
      setSwipeDirection('nope');
    } else if (y < -50 && Math.abs(y) > Math.abs(x)) {
      setSwipeDirection('super');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDragEnd = (e) => {
    if (!isDragging || isAnimating) return;
    setIsDragging(false);
    
    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || dragStart.current.x;
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || dragStart.current.y;
    
    const xDist = clientX - dragStart.current.x;
    const yDist = clientY - dragStart.current.y;
    const elapsed = Date.now() - dragStart.current.time;
    
    // ── Check if it is a Tap / Click (duration < 200ms and little movement) ───
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
      // Revert back to center
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    }
  };

  const handleCardTap = (e, clientX) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const isLeftTap = clickX < rect.width / 3;
    const imgCount = activeProfile.images.length;
    
    if (isLeftTap) {
      // Go to previous image
      setActiveImgIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else {
      // Go to next image
      setActiveImgIndex(prev => (prev < imgCount - 1 ? prev + 1 : prev));
    }
    
    // Reset drag offsets
    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
  };

  const executeSwipe = (direction) => {
    setIsAnimating(true);
    setSwipeDirection(direction === 'right' ? 'like' : direction === 'left' ? 'nope' : 'super');
    
    let targetX = 0;
    let targetY = 0;
    
    if (direction === 'right') targetX = 1000;
    if (direction === 'left') targetX = -1000;
    if (direction === 'up') targetY = -1000;
    
    setDragOffset({ x: targetX, y: targetY });
    
    setTimeout(() => {
      // Save state to history for rewind
      setHistory(prev => [...prev, { cardIndex, activeImgIndex }]);
      
      // Trigger Match Simulation
      if ((direction === 'right' || direction === 'up') && activeProfile?.isMatchable) {
        setMatchedProfile(activeProfile);
        setTimeout(() => {
          setShowMatchModal(true);
        }, 300);
      }
      
      // Advance to next card
      setCardIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleRewind = () => {
    if (history.length === 0 || isAnimating) return;
    setIsAnimating(true);
    
    const prevHistoryState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    
    // Slide card in from left off-screen
    setDragOffset({ x: -1000, y: 0 });
    setCardIndex(prevHistoryState.cardIndex);
    setActiveImgIndex(prevHistoryState.activeImgIndex);
    
    setTimeout(() => {
      setDragOffset({ x: 0, y: 0 });
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 50);
  };

  const handleBoost = () => {
    toast.success('⚡ Gói tăng tốc (Boost) đã được kích hoạt! Thẻ của bạn đã được ưu tiên hàng đầu.');
  };

  const getCardStyle = (index) => {
    if (index !== cardIndex) return {};
    
    const rotation = dragOffset.x / 12;
    const transition = isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.35s';
    
    return {
      transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`,
      transition,
      zIndex: 100
    };
  };

  const getStampOpacity = (type) => {
    if (swipeDirection !== type) return 0;
    const xDist = Math.abs(dragOffset.x);
    const yDist = Math.abs(dragOffset.y);
    const dist = type === 'super' ? yDist : xDist;
    return Math.min(dist / 120, 1);
  };

  return (
    <div className="roommates-app-container">
      {/* ─── Left Sidebar Dashboard ─── */}
      <div className="roommates-sidebar">
        <div className="roommates-sidebar-top">
          <div className="roommates-sidebar-title-section">
            <h1 className="heading-1" style={{ fontSize: '2rem', margin: 0, color: 'white' }}>Homate</h1>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
              tìm ngay “destiny” cho mình bạn nhé
            </p>
          </div>

          {/* Simple statistics in place of view toggle tabs */}
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', fontSize: '0.85rem' }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Đang tìm kiếm quanh đây</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>142 Sinh Viên</div>
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-primary w-full justify-center" 
            onClick={() => setIsModalOpen(true)}
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
      </div>

      {/* ─── Main Swipe View Area ─── */}
      <div className="roommates-main-content">
        {/* Mobile Header (Hidden on Desktop) */}
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
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle size={16} /> Đăng Tin
            </button>
          </div>
        </div>

        {/* Swipe Card Deck */}
        <div className="tinder-container">
          <div className="tinder-header-tabs">
            <button type="button" className="tinder-tab tinder-tab--active">Dành Cho Bạn</button>
            <button type="button" className="tinder-tab">Đại Học</button>
            <button type="button" className="tinder-tab">Mới Nhất</button>
          </div>

          <div className="tinder-card-deck">
            {cardIndex < cardsList.length ? (
              cardsList.map((profile, index) => {
                if (index < cardIndex || index > cardIndex + 1) return null;
                
                const isActive = index === cardIndex;
                
                return (
                  <div
                    key={profile.id}
                    className="tinder-card"
                    style={getCardStyle(index)}
                    onMouseDown={isActive ? handleDragStart : undefined}
                    onMouseMove={isActive ? handleDragMove : undefined}
                    onMouseUp={isActive ? handleDragEnd : undefined}
                    onMouseLeave={isActive ? handleDragEnd : undefined}
                    onTouchStart={isActive ? handleDragStart : undefined}
                    onTouchMove={isActive ? handleDragMove : undefined}
                    onTouchEnd={isActive ? handleDragEnd : undefined}
                  >
                    <div className="tinder-card-img-wrapper">
                      <img src={profile.images[isActive ? activeImgIndex : 0]} alt={profile.name} className="tinder-card-img" />
                      <div className="tinder-card-gradient" />
                      
                      {/* Story-style Progress Indicator Bars */}
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
                      
                      {/* Visual direction stamp overlays */}
                      {isActive && (
                        <>
                          <div className="tinder-stamp tinder-stamp--like" style={{ opacity: getStampOpacity('like') }}>THÍCH</div>
                          <div className="tinder-stamp tinder-stamp--nope" style={{ opacity: getStampOpacity('nope') }}>BỎ QUA</div>
                        </>
                      )}

                      <div className="tinder-card-info">
                        <div className="tinder-card-name-age">
                          {profile.name} <span className="tinder-card-age">{profile.age}</span>
                        </div>
                        <p 
                          className={`tinder-card-bio ${isBioExpanded ? 'tinder-card-bio--expanded' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsBioExpanded(!isBioExpanded);
                          }}
                          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        >
                          "{profile.bio}"
                        </p>
                        
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
                  </div>
                );
              }).reverse()
            ) : (
              <div className="tinder-deck-empty">
                <img 
                  src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=HomateUser"} 
                  alt="My profile avatar" 
                  className="tinder-empty-avatar" 
                />
                <h3 className="heading-3 mb-2" style={{ color: 'white' }}>Đã hết gợi ý hôm nay!</h3>
                <p className="text-muted mb-6">Hãy nâng cấp ví hoặc thay đổi bộ lọc khu vực để tìm thấy thêm nhiều roommates phù hợp nhé.</p>
                <button type="button" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }} onClick={() => setCardIndex(0)}>
                  Quẹt lại từ đầu
                </button>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="tinder-controls">
            <button 
              type="button" 
              className="tinder-btn tinder-btn--rewind" 
              onClick={handleRewind}
              disabled={history.length === 0}
              style={{ opacity: history.length === 0 ? 0.3 : 1 }}
              aria-label="Quay lại thẻ trước"
              title="Quay lại"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              type="button" 
              className="tinder-btn tinder-btn--nope" 
              onClick={() => executeSwipe('left')}
              disabled={cardIndex >= cardsList.length || isAnimating}
              aria-label="Bỏ qua"
              title="Bỏ qua"
            >
              <X size={28} />
            </button>
            <button 
              type="button" 
              className="tinder-btn tinder-btn--star" 
              onClick={() => executeSwipe('up')}
              disabled={cardIndex >= cardsList.length || isAnimating}
              aria-label="Cực kỳ thích"
              title="Cực thích"
            >
              <Star size={20} fill="currentColor" />
            </button>
            <button 
              type="button" 
              className="tinder-btn tinder-btn--like" 
              onClick={() => executeSwipe('right')}
              disabled={cardIndex >= cardsList.length || isAnimating}
              aria-label="Thích"
              title="Thích"
            >
              <Heart size={28} fill="currentColor" />
            </button>
            <button 
              type="button" 
              className="tinder-btn tinder-btn--boost" 
              onClick={handleBoost}
              aria-label="Tăng tốc tìm kiếm"
              title="Tăng tốc"
            >
              <Zap size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Modal Create Post ─── */}
      <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Đăng tin tìm ở ghép">
        <div className="flex-col gap-4">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }} className="grid-3col-responsive">
            <div className="input-group">
              <label className="input-label" htmlFor="rm-name">Tên hiển thị</label>
              <input id="rm-name" name="name" value={formData.name} className="input-field" placeholder="Tên của bạn" onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="rm-age">Tuổi</label>
              <input id="rm-age" name="age" type="number" value={formData.age} className="input-field" placeholder="20" onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="rm-gender">Giới tính</label>
              <select id="rm-gender" name="gender" value={formData.gender} className="input-field" onChange={handleChange} style={{ height: '42px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '0 12px' }}>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid-2col-responsive">
            <div className="input-group">
              <label className="input-label" htmlFor="rm-budget">Ngân sách (VNĐ/tháng)</label>
              <input id="rm-budget" name="budget" value={formData.budget} type="number" className="input-field" placeholder="1500000" onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="rm-district">Khu vực / Quận</label>
              <input id="rm-district" name="district" value={formData.district} className="input-field" placeholder="Thủ Đức, Bình Thạnh..." onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="rm-interests">Sở thích (Cách nhau bằng dấu phẩy)</label>
            <input id="rm-interests" name="interests" value={formData.interests} className="input-field" placeholder="VD: Nấu ăn, Xem phim, Đọc sách" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="rm-desc">Giới thiệu bản thân & Lối sống</label>
            <textarea id="rm-desc" name="description" value={formData.description} className="input-field" rows="3" placeholder="Ví dụ: Mình là sinh viên năm 2 sạch sẽ, mong muốn tìm bạn cùng phòng không hút thuốc..." onChange={handleChange}></textarea>
          </div>

          <button type="button" className="btn btn-primary w-full justify-center mt-2" onClick={handlePost}>
            Đăng Tin Ngay
          </button>
        </div>
      </GlassModal>

      {/* ─── Match Simulation Modal ─── */}
      {showMatchModal && matchedProfile && (
        <div className="tinder-match-overlay">
          <Sparkles size={48} className="text-warning mb-6" style={{ animation: 'bounce 1s infinite' }} />
          <h2 className="tinder-match-title">It's a Match!</h2>
          <p className="tinder-match-subtitle">Bạn và {matchedProfile.name} đã thích nhau.</p>
          
          <div className="tinder-match-avatars">
            <img 
              src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=HomateUser"} 
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
            onClick={() => {
              setShowMatchModal(false);
              toast.success(`📨 Đã kết nối hộp thoại chat với {matchedProfile.name}!`);
            }}
          >
            <Send size={18} /> Nhắn tin ngay
          </button>
          
          <button 
            type="button" 
            className="btn tinder-match-btn tinder-match-btn--keep"
            onClick={() => setShowMatchModal(false)}
          >
            Tiếp tục quẹt
          </button>
        </div>
      )}
    </div>
  );
};

export default RoommateFinder;
