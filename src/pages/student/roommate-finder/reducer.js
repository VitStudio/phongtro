import { INITIAL_CARDS } from './constants';

const createDefaultFormData = (currentUser) => ({
  name: currentUser?.name || '',
  age: '20',
  gender: 'female',
  budget: '',
  district: '',
  interests: '',
  description: ''
});

export const createInitialState = (currentUser) => ({
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

export const roommateReducer = (state, action) => {
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

export const getSwipeLabel = (direction) => (direction === 'right' ? 'like' : direction === 'left' ? 'nope' : 'super');

export const getSwipeTarget = (direction) => {
  if (direction === 'right') return { x: 1000, y: 0 };
  if (direction === 'left') return { x: -1000, y: 0 };
  return { x: 0, y: -1000 };
};

export const parseInterests = (interests) => (
  interests
    ? interests.split(',').flatMap((item) => {
      const trimmed = item.trim();
      return trimmed ? [trimmed] : [];
    })
    : ['Bạn mới', 'Ở ghép']
);
