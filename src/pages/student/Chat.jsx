import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, ChevronLeft, ShieldCheck, UserCheck, MessageSquare } from 'lucide-react';
import { INITIAL_CARDS } from './roommate-finder/constants';

// Pre-defined mock messages for threads
const INITIAL_THREADS = [
  {
    id: 'rm_p1',
    name: 'nf',
    role: 'roommate',
    avatar: INITIAL_CARDS[0]?.images[0],
    isOnline: true,
    lastMsg: 'Hello! Cậu tìm được phòng Thủ Đức chưa?',
    messages: [
      { sender: 'them', text: 'Hi cậu! Mình thấy cậu cũng tìm phòng quanh Thủ Đức đúng không?', time: '23:30' },
      { sender: 'me', text: 'Đúng rồi cậu ơi, mình đang học Bách Khoa Thủ Đức nè.', time: '23:32' },
      { sender: 'them', text: 'Tiếc ghê mình học Kinh tế - Luật, nhưng ở ghép chung nhà nguyên căn vẫn ok á!', time: '23:35' },
      { sender: 'me', text: 'Ủa thế cũng gần nhau mà, cậu có tiêu chí gì cho roommate không?', time: '23:36' },
      { sender: 'them', text: 'Hello! Cậu tìm được phòng Thủ Đức chưa?', time: '23:40' }
    ]
  },
  {
    id: 'u2',
    name: 'Cô Lan Trọ',
    role: 'landlord',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LanTro',
    isOnline: true,
    lastMsg: 'Chào cháu, phòng ở Lý Thường Kiệt vẫn còn nhé.',
    messages: [
      { sender: 'them', text: 'Chào cháu, cháu muốn xem lịch hẹn vào ngày nào?', time: '14:20' },
      { sender: 'me', text: 'Dạ cháu định hẹn chủ nhật tuần này tầm 9h sáng được không cô?', time: '14:22' },
      { sender: 'them', text: 'Chào cháu, phòng ở Lý Thường Kiệt vẫn còn nhé.', time: '14:25' }
    ]
  },
  {
    id: 'rm_p6',
    name: 'Thành Vỹ',
    role: 'roommate',
    avatar: INITIAL_CARDS[5]?.images[0],
    isOnline: false,
    lastMsg: 'Hôm nào đi uống cà phê xem phòng thử nha.',
    messages: [
      { sender: 'them', text: 'Hi cậu, mình xem tin của cậu rồi, rất hợp cạ.', time: 'Hôm qua' },
      { sender: 'me', text: 'Kaka cảm ơn cậu nha, cậu ở khu nào?', time: 'Hôm qua' },
      { sender: 'them', text: 'Hôm nào đi uống cà phê xem phòng thử nha.', time: 'Hôm qua' }
    ]
  },
  {
    id: 'rm_p3',
    name: 'Thuỳ',
    role: 'roommate',
    avatar: INITIAL_CARDS[2]?.images[0],
    isOnline: true,
    lastMsg: 'Chào cậu, rất vui được làm quen!',
    messages: [
      { sender: 'them', text: 'Chào cậu, rất vui được làm quen!', time: '2 ngày trước' }
    ]
  }
];

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get query parameter e.g. /chat?contactId=rm_p1
  const queryParams = new URLSearchParams(location.search);
  const contactId = queryParams.get('contactId');

  const [threads, setThreads] = useState(() => {
    const saved = localStorage.getItem('homie_chat_threads');
    return saved ? JSON.parse(saved) : INITIAL_THREADS;
  });

  const [activeThreadId, setActiveThreadId] = useState(contactId || INITIAL_THREADS[0].id);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Automatically sync threads to local storage
  useEffect(() => {
    localStorage.setItem('homie_chat_threads', JSON.stringify(threads));
  }, [threads]);

  // Handle URL change or redirect from Swipes/Details
  useEffect(() => {
    if (contactId) {
      // Check if thread already exists
      const exists = threads.some(t => t.id === contactId);
      if (!exists) {
        // Create new thread dynamically
        let newContact = null;
        if (contactId === 'u2') {
          newContact = {
            id: 'u2',
            name: 'Cô Lan Trọ',
            role: 'landlord',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LanTro',
            isOnline: true,
            lastMsg: 'Bắt đầu cuộc trò chuyện',
            messages: []
          };
        } else {
          const profile = INITIAL_CARDS.find(c => c.id === contactId);
          newContact = {
            id: contactId,
            name: profile?.name || 'Bạn Ghép',
            role: 'roommate',
            avatar: profile?.images[0] || 'https://api.dicebear.com/7.x/avataaars/svg?seed=HomateUser',
            isOnline: true,
            lastMsg: 'Bắt đầu cuộc trò chuyện',
            messages: []
          };
        }

        if (newContact) {
          setThreads(prev => [newContact, ...prev]);
        }
      }
      setActiveThreadId(contactId);
    }
  }, [contactId, threads]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isTyping]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMessage = { sender: 'me', text: inputText.trim(), time: timestamp };

    // Update active thread with user's message
    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMsg: inputText.trim(),
          messages: [...t.messages, userMessage]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    setInputText('');

    // Trigger mock response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      let replyText = 'Chào cậu, mình đã nhận được tin nhắn!';
      if (activeThread.role === 'landlord') {
        replyText = 'Chào cháu, căn phòng này vẫn còn cháu nhé. Cháu có muốn cô đặt lịch hẹn hướng dẫn qua xem trực tiếp không?';
      } else if (activeThread.id === 'rm_p1') {
        replyText = 'Hihi oki nè, tiêu chí của mình là sạch sẽ, thoải mái và share chi phí đúng hạn. Cậu thấy hợp cạ không?';
      } else if (activeThread.id === 'rm_p3') {
        replyText = 'Dạ mình cũng đang tìm phòng khu Q.10, nếu cậu rảnh tụi mình cùng đi xem vài phòng nha!';
      } else if (activeThread.id === 'rm_p6') {
        replyText = 'Kaka chuẩn luôn! Cuối tuần này hẹn nhau ra Highland thảo luận thử coi sao heng.';
      } else {
        replyText = `Chào cậu, mình là ${activeThread.name}. Cảm ơn cậu đã nhắn tin nha, tụi mình làm quen nhé!`;
      }

      const botMessage = { sender: 'them', text: replyText, time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };

      setThreads(prevThreads => prevThreads.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMsg: replyText,
            messages: [...t.messages, botMessage]
          };
        }
        return t;
      }));
    }, 1500);
  };

  return (
    <div className="chat-portal-container">
      <div className="glass chat-shell">
        {/* --- Sidebar (Threads List) --- */}
        <div className={`chat-sidebar ${activeThreadId ? 'mobile-hidden' : ''}`}>
          <div className="chat-sidebar-header">
            <MessageSquare className="text-primary" size={24} />
            <h2 className="heading-3 chat-sidebar-title">Tin Nhắn</h2>
          </div>

          <div className="chat-threads-list">
            {threads.map(t => (
              <button
                type="button"
                key={t.id}
                onClick={() => {
                  setActiveThreadId(t.id);
                  navigate(`/chat?contactId=${t.id}`);
                }}
                className={`chat-thread-item ${t.id === activeThreadId ? 'active' : ''}`}
              >
                <div className="chat-thread-avatar-wrapper">
                  <img src={t.avatar} alt={t.name} className="chat-thread-avatar" />
                  {t.isOnline && <span className="chat-thread-online-dot"></span>}
                </div>
                
                <div className="chat-thread-info">
                  <div className="chat-thread-meta">
                    <span className="chat-thread-name">{t.name}</span>
                    {t.role === 'landlord' ? (
                      <span className="badge badge-success flex items-center gap-0.5" style={{ fontSize: '0.62rem', padding: '1px 4px' }}>
                        <ShieldCheck size={10} /> Chủ trọ
                      </span>
                    ) : (
                      <span className="badge badge-primary flex items-center gap-0.5" style={{ fontSize: '0.62rem', padding: '1px 4px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
                        <UserCheck size={10} /> Roommate
                      </span>
                    )}
                  </div>
                  <p className="chat-thread-last-msg">{t.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* --- Chat Main Box --- */}
        <div className={`chat-main ${!activeThreadId ? 'mobile-hidden' : ''}`}>
          {activeThread ? (
            <>
              {/* Header */}
              <div className="chat-main-header">
                <button
                  type="button"
                  className="chat-back-btn"
                  onClick={() => {
                    setActiveThreadId(null);
                    navigate('/chat');
                  }}
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="chat-active-user-info">
                  <div className="chat-thread-avatar-wrapper">
                    <img src={activeThread.avatar} alt={activeThread.name} className="chat-active-avatar" />
                    {activeThread.isOnline && <span className="chat-thread-online-dot"></span>}
                  </div>
                  <div>
                    <h3 className="chat-active-name">{activeThread.name}</h3>
                    <span className="chat-active-status">
                      {activeThread.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message log */}
              <div className="chat-messages-log">
                {activeThread.messages.length === 0 ? (
                  <div className="chat-empty-log">
                    <MessageSquare size={48} className="text-muted mb-4 opacity-50" />
                    <p className="text-muted">Gửi lời chào đầu tiên tới {activeThread.name}!</p>
                  </div>
                ) : (
                  activeThread.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`chat-message-bubble-wrapper ${m.sender === 'me' ? 'me' : 'them'}`}
                    >
                      {m.sender === 'them' && (
                        <img src={activeThread.avatar} alt="avatar" className="chat-bubble-avatar" />
                      )}
                      <div className="chat-message-bubble-content">
                        <div className="chat-message-bubble">
                          {m.text}
                        </div>
                        <span className="chat-message-time">{m.time}</span>
                      </div>
                    </div>
                  ))
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="chat-message-bubble-wrapper them">
                    <img src={activeThread.avatar} alt="avatar" className="chat-bubble-avatar" />
                    <div className="chat-message-bubble-content">
                      <div className="chat-message-bubble typing">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Form Input */}
              <form onSubmit={handleSend} className="chat-input-bar">
                <input
                  type="text"
                  className="input-field chat-input-field"
                  placeholder={`Nhập tin nhắn gửi tới ${activeThread.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="btn btn-primary chat-send-btn"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty-log">
              <MessageSquare size={64} className="text-primary mb-4 opacity-40 animate-pulse" />
              <h3 className="heading-2 mb-2">Hộp Thoại Nhắn Tin</h3>
              <p className="text-muted">Hãy chọn một cuộc hội thoại từ danh sách để bắt đầu trò chuyện ngay!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
