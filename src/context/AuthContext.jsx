import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { mockUsers, mockListings, mockAppointments, mockRoommates, DATA_VERSION, VIP_MONTHLY_PRICE, VIP_ANNUAL_PRICE, VIP_MONTHLY_DAYS, VIP_ANNUAL_DAYS } from '../data/mockData';
import localforage from 'localforage';
import { AuthContext } from './useAuth';

const initialAuthState = {
  isInitializing: true,
  users: [],
  listings: [],
  appointments: [],
  roommates: [],
  transactions: [],
  currentUser: null
};

const authReducer = (state, action) => {
  if (action.type === 'setData') {
    return { ...state, ...action.payload };
  }
  return state;
};

const persistItem = (key, value, label) => {
  localforage.setItem(key, value).catch(e => console.error(`localforage ${label} persist error:`, e));
};

const removePersistedItem = (key, label) => {
  localforage.removeItem(key).catch(e => console.error(`localforage ${label} remove error:`, e));
};

const applySubscriptionExpirations = (userList, now = new Date()) =>
  userList.map(u => {
    if (!u.subscription || u.subscription.status !== 'active') return u;
    if (new Date(u.subscription.expires_at) <= now) {
      return { ...u, subscription: { ...u.subscription, status: 'expired' } };
    }
    return u;
  });

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const { isInitializing, users, listings, appointments, roommates, transactions, currentUser } = state;

  const setData = useCallback((payload) => {
    dispatch({ type: 'setData', payload });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initDB = async () => {
      try {
        const storedVersion = await localforage.getItem('homie_data_version');
        const isStale = storedVersion !== DATA_VERSION;

        if (isStale) {
          await localforage.clear();
          await localforage.setItem('homie_data_version', DATA_VERSION);
        }

        const storedUsers = isStale ? null : await localforage.getItem('homie_users');
        const storedListings = isStale ? null : await localforage.getItem('homie_listings');
        const storedAppointments = isStale ? null : await localforage.getItem('homie_appointments');
        const storedRoommates = isStale ? null : await localforage.getItem('homie_roommates');
        const storedTransactions = isStale ? null : await localforage.getItem('homie_transactions');
        const storedCurrentUser = isStale ? null : await localforage.getItem('homie_current_user');

        const initialUsers = applySubscriptionExpirations(
          !storedUsers || storedUsers.length === 0 ? mockUsers : storedUsers
        );
        const initialListings = !storedListings || storedListings.length === 0 ? mockListings : storedListings;
        const initialAppointments = !storedAppointments || storedAppointments.length === 0 ? mockAppointments : storedAppointments;
        const initialRoommates = !storedRoommates || storedRoommates.length === 0 ? mockRoommates : storedRoommates;
        const initialTransactions = storedTransactions || [];

        let initialCurrentUser = null;
        if (storedCurrentUser) {
          initialCurrentUser = initialUsers.find(u => u.id === storedCurrentUser.id) || storedCurrentUser;
        } else {
          initialCurrentUser = initialUsers.find(u => u.id === 'u1') || null;
        }

        await Promise.all([
          localforage.setItem('homie_users', initialUsers),
          localforage.setItem('homie_listings', initialListings),
          localforage.setItem('homie_appointments', initialAppointments),
          localforage.setItem('homie_roommates', initialRoommates),
          localforage.setItem('homie_transactions', initialTransactions),
          initialCurrentUser
            ? localforage.setItem('homie_current_user', initialCurrentUser)
            : localforage.removeItem('homie_current_user')
        ]);

        if (isMounted) {
          setData({
            users: initialUsers,
            listings: initialListings,
            appointments: initialAppointments,
            roommates: initialRoommates,
            transactions: initialTransactions,
            currentUser: initialCurrentUser,
            isInitializing: false
          });
        }
      } catch (error) {
        console.error('Error initializing database from localforage:', error);
        if (isMounted) setData({ isInitializing: false });
      }
    };

    initDB();

    return () => {
      isMounted = false;
    };
  }, [setData]);

  const login = useCallback((userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    setData({ currentUser: user });
    persistItem('homie_current_user', user, 'currentUser');
  }, [setData, users]);

  const logout = useCallback(() => {
    setData({ currentUser: null });
    removePersistedItem('homie_current_user', 'currentUser');
  }, [setData]);

  const updateWallet = useCallback((userId, amount) => {
    const nextUsers = users.map(u =>
      u.id === userId ? { ...u, wallet_balance: u.wallet_balance + amount } : u
    );
    const nextCurrentUser = currentUser?.id === userId
      ? { ...currentUser, wallet_balance: (currentUser.wallet_balance || 0) + amount }
      : currentUser;

    setData({ users: nextUsers, currentUser: nextCurrentUser });
    persistItem('homie_users', nextUsers, 'users');
    if (nextCurrentUser) persistItem('homie_current_user', nextCurrentUser, 'currentUser');
  }, [currentUser, setData, users]);

  const addListing = useCallback((newListing) => {
    const nextListings = [newListing, ...listings];
    setData({ listings: nextListings });
    persistItem('homie_listings', nextListings, 'listings');
  }, [listings, setData]);

  const updateListingStatus = useCallback((id, status) => {
    const nextListings = listings.map(l => l.id === id ? { ...l, status } : l);
    setData({ listings: nextListings });
    persistItem('homie_listings', nextListings, 'listings');
  }, [listings, setData]);

  const addAppointment = useCallback((appointment) => {
    const nextAppointments = [...appointments, appointment];
    setData({ appointments: nextAppointments });
    persistItem('homie_appointments', nextAppointments, 'appointments');
  }, [appointments, setData]);

  const updateAppointmentStatus = useCallback((id, status) => {
    const nextAppointments = appointments.map(a => a.id === id ? { ...a, status } : a);
    setData({ appointments: nextAppointments });
    persistItem('homie_appointments', nextAppointments, 'appointments');
  }, [appointments, setData]);

  const checkSubscriptionStatus = useCallback(() => {
    const nextUsers = applySubscriptionExpirations(users);
    const nextCurrentUser = currentUser
      ? nextUsers.find(u => u.id === currentUser.id) || currentUser
      : null;

    setData({ users: nextUsers, currentUser: nextCurrentUser });
    persistItem('homie_users', nextUsers, 'users');
    if (nextCurrentUser) persistItem('homie_current_user', nextCurrentUser, 'currentUser');
  }, [currentUser, setData, users]);

  const buySubscription = useCallback((userId, planType = 'monthly') => {
    const isAnnual = planType === 'annual';
    const price = isAnnual ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE;
    const days = isAnnual ? VIP_ANNUAL_DAYS : VIP_MONTHLY_DAYS;

    const user = users.find(u => u.id === userId);
    if (!user) return false;
    if (user.wallet_balance < price) return false;

    const now = new Date();
    const currentExpiry = user.subscription?.expires_at
      ? new Date(user.subscription.expires_at)
      : now;
    const startFrom = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(startFrom.getTime() + days * 24 * 60 * 60 * 1000);
    const subscription = {
      plan: 'vip',
      status: 'active',
      started_at: now.toISOString(),
      expires_at: newExpiry.toISOString()
    };

    const nextUsers = users.map(u =>
      u.id === userId
        ? { ...u, wallet_balance: u.wallet_balance - price, subscription }
        : u
    );
    const nextCurrentUser = currentUser?.id === userId
      ? { ...currentUser, wallet_balance: (currentUser.wallet_balance || 0) - price, subscription }
      : currentUser;

    setData({ users: nextUsers, currentUser: nextCurrentUser });
    persistItem('homie_users', nextUsers, 'users');
    if (nextCurrentUser) persistItem('homie_current_user', nextCurrentUser, 'currentUser');

    return true;
  }, [currentUser, setData, users]);

  const updateUserProfile = useCallback((userId, updates) => {
    const nextUsers = users.map(u =>
      u.id === userId ? { ...u, ...updates } : u
    );
    const nextCurrentUser = currentUser?.id === userId
      ? { ...currentUser, ...updates }
      : currentUser;

    setData({ users: nextUsers, currentUser: nextCurrentUser });
    persistItem('homie_users', nextUsers, 'users');
    if (nextCurrentUser) persistItem('homie_current_user', nextCurrentUser, 'currentUser');
  }, [currentUser, setData, users]);

  const addRoommatePost = useCallback((post) => {
    const nextRoommates = [post, ...roommates];
    setData({ roommates: nextRoommates });
    persistItem('homie_roommates', nextRoommates, 'roommates');
  }, [roommates, setData]);

  const addTransaction = useCallback((transaction) => {
    const nextTransactions = [
      { id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, created_at: new Date().toISOString(), ...transaction },
      ...transactions
    ];
    setData({ transactions: nextTransactions });
    persistItem('homie_transactions', nextTransactions, 'transactions');
  }, [setData, transactions]);

  const value = useMemo(() => ({
    currentUser,
    login,
    logout,
    users,
    updateWallet,
    buySubscription,
    checkSubscriptionStatus,
    updateUserProfile,
    listings,
    addListing,
    updateListingStatus,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    roommates,
    addRoommatePost,
    transactions,
    addTransaction
  }), [
    addAppointment,
    addListing,
    addRoommatePost,
    addTransaction,
    appointments,
    buySubscription,
    checkSubscriptionStatus,
    currentUser,
    listings,
    login,
    logout,
    roommates,
    transactions,
    updateAppointmentStatus,
    updateListingStatus,
    updateUserProfile,
    updateWallet,
    users
  ]);

  if (isInitializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          width: '44px', height: '44px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#64748b', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Đang nạp dữ liệu...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
