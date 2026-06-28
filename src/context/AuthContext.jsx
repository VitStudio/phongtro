import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockUsers, mockListings, mockAppointments, mockRoommates, DATA_VERSION, VIP_MONTHLY_PRICE, VIP_ANNUAL_PRICE, VIP_MONTHLY_DAYS, VIP_ANNUAL_DAYS } from '../data/mockData';
import localforage from 'localforage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize data from IndexedDB, with version-based reset for fresh mock data
  useEffect(() => {
    const initDB = async () => {
      try {
        const storedVersion = await localforage.getItem('homie_data_version');
        const isStale = storedVersion !== DATA_VERSION;

        // Reset all data when version changes (new mock data available)
        if (isStale) {
          await localforage.clear();
          await localforage.setItem('homie_data_version', DATA_VERSION);
        }

        const storedUsers       = isStale ? null : await localforage.getItem('homie_users');
        const storedListings    = isStale ? null : await localforage.getItem('homie_listings');
        const storedAppointments = isStale ? null : await localforage.getItem('homie_appointments');        const storedRoommates   = isStale ? null : await localforage.getItem('homie_roommates');
        const storedTransactions = isStale ? null : await localforage.getItem('homie_transactions');
        const storedCurrentUser = isStale ? null : await localforage.getItem('homie_current_user');

        // --- Users ---
        if (!storedUsers || storedUsers.length === 0) {
          await localforage.setItem('homie_users', mockUsers);
          setUsers(mockUsers);
          // Auto-login as student on first load
          if (!storedCurrentUser) {
            const student = mockUsers.find(u => u.id === 'u1');
            if (student) {
              await localforage.setItem('homie_current_user', student);
              setCurrentUser(student);
            }
          } else {
            setCurrentUser(storedCurrentUser);
          }
        } else {
          setUsers(storedUsers);
          if (storedCurrentUser) setCurrentUser(storedCurrentUser);
        }

        // --- Listings ---
        if (!storedListings || storedListings.length === 0) {
          await localforage.setItem('homie_listings', mockListings);
          setListings(mockListings);
        } else {
          setListings(storedListings);
        }

        // --- Appointments ---
        if (!storedAppointments || storedAppointments.length === 0) {
          await localforage.setItem('homie_appointments', mockAppointments);
          setAppointments(mockAppointments);
        } else {
          setAppointments(storedAppointments);
        }

        // --- Roommates ---
        if (!storedRoommates || storedRoommates.length === 0) {
          await localforage.setItem('homie_roommates', mockRoommates);
          setRoommates(mockRoommates);
        } else {
          setRoommates(storedRoommates);
        }

        // --- Transactions ---
        if (!storedTransactions) {
          await localforage.setItem('homie_transactions', []);
          setTransactions([]);
        } else {
          setTransactions(storedTransactions);
        }
      } catch (error) {
        console.error('Error initializing database from localforage:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initDB();
  }, []);

  // Persist state to IndexedDB (only after initialization is done)
  useEffect(() => {
    if (!isInitializing) localforage.setItem('homie_users', users).catch(e => console.error('localforage users persist error:', e));
  }, [users, isInitializing]);

  useEffect(() => {
    if (!isInitializing) localforage.setItem('homie_listings', listings).catch(e => console.error('localforage listings persist error:', e));
  }, [listings, isInitializing]);

  useEffect(() => {
    if (!isInitializing) localforage.setItem('homie_appointments', appointments).catch(e => console.error('localforage appointments persist error:', e));
  }, [appointments, isInitializing]);

  useEffect(() => {
    if (!isInitializing) localforage.setItem('homie_roommates', roommates).catch(e => console.error('localforage roommates persist error:', e));
  }, [roommates, isInitializing]);

  useEffect(() => {
    if (!isInitializing) localforage.setItem('homie_transactions', transactions).catch(e => console.error('localforage transactions persist error:', e));
  }, [transactions, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      if (currentUser) {
        const latest = users.find(u => u.id === currentUser.id);
        localforage.setItem('homie_current_user', latest || currentUser).catch(e => console.error('localforage currentUser persist error:', e));
      } else {
        localforage.removeItem('homie_current_user').catch(e => console.error('localforage currentUser remove error:', e));
      }
    }
  }, [currentUser, users, isInitializing]);

  // ---------- Auth ----------
  const login = (userId) => {
    // Always find the freshest copy from the users array
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  // ---------- Wallet ----------
  /**
   * Update wallet balance for a user.
   * Also keeps currentUser in sync so navbar wallet display is always reactive.
   */
  const updateWallet = (userId, amount) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, wallet_balance: u.wallet_balance + amount } : u
    ));
    setCurrentUser(prev => {
      if (!prev || prev.id !== userId) return prev;
      return { ...prev, wallet_balance: (prev.wallet_balance || 0) + amount };
    });
  };

  // ---------- Listings ----------
  const addListing = (newListing) => setListings(prev => [newListing, ...prev]);

  const updateListingStatus = (id, status) =>
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));

  // ---------- Appointments ----------
  const addAppointment = (appointment) =>
    setAppointments(prev => [...prev, appointment]);

  const updateAppointmentStatus = (id, status) =>
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));

  // ---------- Subscription Management ----------

  /** Check all users for expired subscriptions (run on init) */
  const checkSubscriptionStatus = useCallback(() => {
    const now = new Date();
    setUsers(prev => prev.map(u => {
      if (!u.subscription || u.subscription.status !== 'active') return u;
      if (new Date(u.subscription.expires_at) <= now) {
        return { ...u, subscription: { ...u.subscription, status: 'expired' } };
      }
      return u;
    }));
  }, []);

  /** Buy or renew a VIP subscription */
  const buySubscription = useCallback((userId, planType = 'monthly') => {
    const isAnnual = planType === 'annual';
    const price = isAnnual ? VIP_ANNUAL_PRICE : VIP_MONTHLY_PRICE;
    const days = isAnnual ? VIP_ANNUAL_DAYS : VIP_MONTHLY_DAYS;

    const user = users.find(u => u.id === userId);
    if (!user) return false;
    if (user.wallet_balance < price) return false;

    // Calculate new expiry (additive stacking)
    const now = new Date();
    const currentExpiry = user.subscription?.expires_at
      ? new Date(user.subscription.expires_at)
      : now;
    // If already expired, start from now
    const startFrom = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(startFrom.getTime() + days * 24 * 60 * 60 * 1000);

    // Deduct wallet
    updateWallet(userId, -price);

    // Set subscription
    setUsers(prev => prev.map(u =>
      u.id === userId ? {
        ...u,
        wallet_balance: u.wallet_balance - price,
        subscription: {
          plan: 'vip',
          status: 'active',
          started_at: now.toISOString(),
          expires_at: newExpiry.toISOString()
        }
      } : u
    ));
    setCurrentUser(prev => {
      if (!prev || prev.id !== userId) return prev;
      return {
        ...prev,
        wallet_balance: prev.wallet_balance - price,
        subscription: {
          plan: 'vip',
          status: 'active',
          started_at: now.toISOString(),
          expires_at: newExpiry.toISOString()
        }
      };
    });

    return true;
  }, [users, updateWallet]);

  /** Update user profile fields */
  const updateUserProfile = useCallback((userId, updates) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, ...updates } : u
    ));
    setCurrentUser(prev => {
      if (!prev || prev.id !== userId) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  // ---------- Roommates ----------
  const addRoommatePost = (post) => setRoommates(prev => [post, ...prev]);

  // ---------- Transactions ----------
  const addTransaction = (transaction) =>
    setTransactions(prev => [
      { id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, created_at: new Date().toISOString(), ...transaction },
      ...prev
    ]);

  // Run subscription check on init
  useEffect(() => {
    if (!isInitializing) {
      checkSubscriptionStatus();
    }
  }, [isInitializing, checkSubscriptionStatus]);

  const value = {
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
  };

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
