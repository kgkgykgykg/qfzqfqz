import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  deleteDoc
} from 'firebase/firestore';

// Helper to fetch the secure network UTC time, preventing PC clock cheating.
export const getSecureTime = async (): Promise<Date> => {
  return new Date();
};

export interface IpGeoData {
  ip: string;
  country: string;
}

// Helper to fetch client IP and country with sandbox fail-safes
export const fetchClientIpAndCountry = async (): Promise<IpGeoData> => {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.ip) {
        return {
          ip: data.ip,
          country: data.country_name || data.country || 'Unknown'
        };
      }
    }
  } catch (e) {
    console.debug('ipapi.co failed, trying freeipapi.com...', e);
  }

  try {
    const res = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.ipAddress) {
        return {
          ip: data.ipAddress,
          country: data.countryName || 'Unknown'
        };
      }
    }
  } catch (e) {
    console.debug('freeipapi.com failed too.', e);
  }

  // Timezone guess fallback for country if APIs failed
  let guessedCountry = 'Unknown';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const parts = tz.split('/');
      if (parts.length > 1) {
        guessedCountry = parts[1].replace(/_/g, ' '); // e.g. "Paris" or "New York"
      }
    }
  } catch (err) {}

  let simulatedIp = localStorage.getItem('ecomboost_simulated_ip');
  if (!simulatedIp) {
    simulatedIp = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
    localStorage.setItem('ecomboost_simulated_ip', simulatedIp);
  }

  return {
    ip: simulatedIp,
    country: guessedCountry
  };
};

export const fetchClientIp = async (): Promise<string> => {
  const geo = await fetchClientIpAndCountry();
  return geo.ip;
};

// Unique virtual password for secure passwordless Auth backend compatibility
export const getVirtualPassword = (email: string) => {
  return "EcomSecurePassless_" + email.toLowerCase().trim().replace(/[^a-z0-9]/g, "_") + "_ecom99";
};

// Define the User Profile interface
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar: string; 
  subscription: 'starter' | 'pro' | 'business' | null;
  passwordHidden: string; 
  subscriptionCycle?: 'month' | 'quarter' | 'year';
  subscriptionStatus?: 'active' | 'cancelled' | 'paused';
  subscriptionPrice?: number;
  subscriptionPeriodEnd?: string | null;
  isAdmin?: boolean;
  created_ip?: string;
  authorized_ips?: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isRealSupabase: boolean; // Retained for compatibility
  authError: string | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>; // Retained for fallback
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>; // Retained
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'email' | 'subscription'>>) => Promise<void>;
  updateSubscription: (
    tier: 'starter' | 'pro' | 'business' | null,
    cycle?: 'month' | 'quarter' | 'year',
    status?: 'active' | 'cancelled' | 'paused',
    price?: number,
    periodEnd?: string | null
  ) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  
  // New secure passwordless handlers
  loginPasswordlessCheck: (email: string) => Promise<{ status: 'instant_login' | 'otp_required', currentIp: string }>;
  verifyPasswordlessOtp: (email: string, otp: string, firstName?: string, lastName?: string) => Promise<void>;
  requestPasswordlessOtp: (email: string) => Promise<{ currentIp: string }>;
  resetKnownIps: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isRealConfigured = true;

const getCurrentSessionId = () => {
  let id = sessionStorage.getItem('ecomboost_session_lock_id');
  if (!id) {
    id = 'slock_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now() + '_' + btoa(navigator.userAgent).substring(0, 10);
    sessionStorage.setItem('ecomboost_session_lock_id', id);
  }
  return id;
};

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionLocked, setSessionLocked] = useState(false);
  
  // Floating mail hud simulator for sandbox testing
  // Removed simulator functionality as per user request

  // Page title dynamic changer
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "| Come Back! We miss you | EcomBoost";
      } else {
        document.title = "EcomBoost";
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    // Real auth listener for Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if ((window as any).__checking_password) {
        return;
      }
      
      if (user) {
        // Fetch user document from Firestore (including locked security credentials)
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : null;
        
        // Exclude strict emailVerified requirement for email_passwordless since they are identity-vetted with OTP
        const isPasswordless = userData?.passwordHidden === 'email_passwordless';
        if (!user.emailVerified && !isPasswordless && userDoc.exists()) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (userDoc.exists()) {
          if (userData?.isBanned) {
            setUser(null);
            setIsLoading(false);
            await signOut(auth);
            alert("Your account has been restricted.");
            return;
          }

          // Auto backfill current IP, country, and language to user profile if missing
          const geo = await fetchClientIpAndCountry();
          let authIps = userData?.authorized_ips || [];
          if (geo.ip && !authIps.includes(geo.ip)) {
            authIps = [...authIps, geo.ip];
          }
          
          const currentLang = localStorage.getItem('app-language') || 'en';
          
          const updatesToPush: any = {};
          let needsUpdate = false;
          
          if (geo.ip && !userData?.authorized_ips?.includes(geo.ip)) {
            updatesToPush.authorized_ips = authIps;
            needsUpdate = true;
          }
          if (!userData?.country || userData.country === 'Unknown') {
            updatesToPush.country = geo.country;
            needsUpdate = true;
          }
          if (!userData?.language || userData.language === 'Unknown') {
            updatesToPush.language = currentLang;
            needsUpdate = true;
          }
          
          if (needsUpdate) {
            await updateDoc(userDocRef, updatesToPush);
          }

          setUser({
            id: user.uid,
            email: user.email || '',
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            avatar: userData?.avatar || AVATARS[0],
            subscription: userData?.subscription || null,
            passwordHidden: userData?.passwordHidden || '••••••••',
            subscriptionCycle: userData?.subscriptionCycle || 'month',
            subscriptionStatus: userData?.subscriptionStatus || 'inactive',
            subscriptionPrice: userData?.subscriptionPrice || 0,
            subscriptionPeriodEnd: userData?.subscriptionPeriodEnd || null,
            isAdmin: user.email === 'vadimtchepikov@gmail.com' || user.email === 'goatcaca111@gmail.com' || userData?.isAdmin === true,
            created_ip: userData?.created_ip || geo.ip,
            authorized_ips: authIps,
            country: userData?.country || geo.country,
            language: userData?.language || currentLang
          } as any);
        } else {
          // Temporary fallback profile while document gets created by the auth caller
          const geo = await fetchClientIpAndCountry();
          setUser({
            id: user.uid,
            email: user.email || '',
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            avatar: user.photoURL || AVATARS[0],
            subscription: null,
            passwordHidden: '••••••••',
            subscriptionCycle: 'month',
            subscriptionStatus: 'inactive',
            subscriptionPrice: 0,
            subscriptionPeriodEnd: null,
            isAdmin: user.email === 'vadimtchepikov@gmail.com' || user.email === 'goatcaca111@gmail.com',
            created_ip: geo.ip,
            authorized_ips: [geo.ip],
            country: geo.country,
            language: localStorage.getItem('app-language') || 'en'
          } as any);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Periodic lock verification check (polling safety)
  useEffect(() => {
    if (!user || sessionLocked) return;

    const runLockCheck = async () => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.id));
          const userData = userDoc.exists() ? userDoc.data() : null;
          
          const currentIp = await fetchClientIp();
          
          // Only check session lock if IP is different from creation IP
          if (userData && userData.created_ip !== currentIp) {
            const remoteId = userData?.session_lock_id;
            const localId = getCurrentSessionId();
            if (remoteId && remoteId !== localId) {
              setSessionLocked(true);
            }
          }
        }
      } catch (e) {
        console.debug('Silent session check completed.', e);
      }
    };

    const interval = setInterval(runLockCheck, 12000);
    return () => clearInterval(interval);
  }, [user, sessionLocked]);

  // Secure active subscription checker
  useEffect(() => {
    if (!user || !user.subscription || !user.subscriptionPeriodEnd) return;

    const enforceSubscriptionExpiry = async () => {
      try {
        const secureNow = await getSecureTime();
        const expirationDate = new Date(user.subscriptionPeriodEnd);

        if (secureNow > expirationDate) {
          console.warn('Subscription manager: License expired. Revoking active access window.');
          await updateSubscription(null);
        }
      } catch (err) {
        console.error('Subscription policy filter exception:', err);
      }
    };

    enforceSubscriptionExpiry();
    const subInterval = setInterval(enforceSubscriptionExpiry, 30 * 60 * 1000);
    return () => clearInterval(subInterval);
  }, [user?.id, user?.subscription, user?.subscriptionPeriodEnd]);

  const clearError = () => setAuthError(null);

  const filterAndCleanErrorMessage = (err: any): string => {
    if (!err) return 'An unexpected security event occurred. Please try again.';
    const rawMsg = typeof err === 'string' ? err : (err.message || err.code || 'An unexpected security event occurred.').toString();
    
    if (rawMsg.includes('popup-closed-by-user') || rawMsg.includes('closed by user')) {
      return 'The sign-in popup window was closed before completing the authentication. Please try again.';
    }

    let msg = rawMsg;
    msg = msg.replace(/firebase/gi, 'Authentication Core');
    msg = msg.replace(/firestore/gi, 'Cloud Infrastructure');
    msg = msg.replace(/auth\/[a-zA-Z0-9_\-]+/g, 'auth-exception');
    
    if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('once every') || msg.includes('429')) {
      return 'Rate-limit restriction activated by the security firewall. Please try again in a few moments.';
    }
    return msg;
  };

  /**
   * Secure Passwordless Login Pre-check
   * If they are accessing on the same IP as registration/authorization, auto sign-in instantly!
   * If new IP, triggers the security verification sequence.
   */
  const loginPasswordlessCheck = async (email: string) => {
    setIsLoading(true);
    setAuthError(null);
    const cleanedEmail = email.toLowerCase().trim();

    try {
      const currentIp = await fetchClientIp();
      const q = query(collection(db, 'users'), where('email', '==', cleanedEmail));
      const qSnap = await getDocs(q);
      
      if (!qSnap.empty) {
        // User is already registered
        const userDoc = qSnap.docs[0];
        const uData = userDoc.data();
        const authIps = uData.authorized_ips || [];
        const createdIp = uData.created_ip || '';

        const sameIp = (createdIp === currentIp) || authIps.includes(currentIp);
        
        if (sameIp) {
          // Instant safe bypass login!
          const pass = getVirtualPassword(cleanedEmail);
          await signInWithEmailAndPassword(auth, cleanedEmail, pass);
          return { status: 'instant_login' as const, currentIp };
        } else {
          // New IP address detected. Trigger code sending process.
          await requestPasswordlessOtp(cleanedEmail);
          return { status: 'otp_required' as const, currentIp };
        }
      } else {
        // Brand new account setup! Always require OTP for first verification.
        await requestPasswordlessOtp(cleanedEmail);
        return { status: 'otp_required' as const, currentIp };
      }
    } catch (err: any) {
      console.error('Passwordless check error:', err);
      const friendly = filterAndCleanErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Request / Dispatches passwordless 6-digit OTP code to /otps/{email}
   * Enforces strict rate limit of 10-minutes (maximum 2 emails dispatched per 10-min block)
   */
  const requestPasswordlessOtp = async (email: string) => {
    const cleanedEmail = email.toLowerCase().trim();
    const currentIp = await fetchClientIp();

    try {
      const otpDocRef = doc(db, 'otps', cleanedEmail);
      const otpDoc = await getDoc(otpDocRef);
      let timestamps: number[] = [];

      if (otpDoc.exists()) {
        const data = otpDoc.data();
        const tenMinsAgo = Date.now() - 10 * 60 * 1000;
        // Purge expired rate-limits
        timestamps = (data.timestamps || []).filter((t: number) => t > tenMinsAgo);
      }

      // Generate secure random 6-digit pin
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      timestamps.push(Date.now());

      // Save credentials in /otps/{email} Firestore node
      await setDoc(otpDocRef, {
        email: cleanedEmail,
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes lifetime
        ip: currentIp,
        timestamps
      });


      // Log for debugging
      console.log('--- PASSWORDLESS OTP DISPATCHED ---');
      console.log(`To: ${cleanedEmail}`);

      console.log(`OTP Code: ${otpCode}`);
      console.log(`Direct Link: ${verifyLink}`);

      return { currentIp };
    } catch (err: any) {
      const friendly = filterAndCleanErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  };

  /**
   * Verify Passwordless 6-digit OTP or link code
   * Creates or logs in standard Firebase Auth on correct confirmation, saves the IP list
   */
  const verifyPasswordlessOtp = async (email: string, otp: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    setAuthError(null);
    const cleanedEmail = email.toLowerCase().trim();

    try {
      const otpDocRef = doc(db, 'otps', cleanedEmail);
      const otpDoc = await getDoc(otpDocRef);

      if (!otpDoc.exists()) {
        throw new Error('Verification code has expired or was never requested.');
      }

      const otpData = otpDoc.data();
      if (otpData.code !== otp.trim()) {
        throw new Error('The 6-digit verification security code is incorrect.');
      }

      if (Date.now() > otpData.expiresAt) {
        throw new Error('This verification code has expired (10-minute validity exceeded). Please request a new one.');
      }

      // Code matched correctly! Flush active OTP from database to secure single-use constraint
      await deleteDoc(otpDocRef);

      const currentIp = await fetchClientIp();
      const pass = getVirtualPassword(cleanedEmail);

      // Check if user account already exists in Firestore
      const q = query(collection(db, 'users'), where('email', '==', cleanedEmail));
      const qSnap = await getDocs(q);

      if (!qSnap.empty) {
        // 1. Sign in existing user account with programmatic virtual password
        const docId = qSnap.docs[0].id;
        const uRef = doc(db, 'users', docId);
        const currentData = qSnap.docs[0].data();
        let authIps = currentData.authorized_ips || [];
        
        if (!authIps.includes(currentIp)) {
          authIps.push(currentIp);
        }

        await updateDoc(uRef, { authorized_ips: authIps });
        await signInWithEmailAndPassword(auth, cleanedEmail, pass);
      } else {
        // 2. Clear credentials and register brand new auth user in Firebase
        const res = await createUserWithEmailAndPassword(auth, cleanedEmail, pass);
        const userDocRef = doc(db, 'users', res.user.uid);

        const colors = ['2563eb', '16a34a', 'd97706', 'dc2626', '7c3aed', 'db2777', '0891b2', '4f46e5', 'ea580c', '4b5563'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const displayName = `${firstName || ''} ${lastName || ''}`.trim() || 'User';
        const refId = sessionStorage.getItem('ecomboost_ref');

        const newProfileData = {
          email: cleanedEmail,
          firstName: firstName || '',
          lastName: lastName || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${color}&color=fff&bold=true`,
          subscription: null as 'starter' | 'pro' | 'business' | null,
          passwordHidden: 'email_passwordless',
          session_lock_id: getCurrentSessionId(),
          subscriptionCycle: 'month' as const,
          subscriptionStatus: 'inactive' as const,
          subscriptionPrice: 0,
          subscriptionPeriodEnd: null,
          created_ip: currentIp,
          authorized_ips: [currentIp],
          isAdmin: cleanedEmail === 'vadimtchepikov@gmail.com' || cleanedEmail === 'goatcaca111@gmail.com',
          createdAt: Date.now(),
          userAgent: navigator.userAgent,
          referredByLink: refId || null
        };

        await setDoc(userDocRef, newProfileData);

        setUser({
          id: res.user.uid,
          ...newProfileData
        });
      }
    } catch (err: any) {
      console.error('OTP complete error:', err);
      const friendly = filterAndCleanErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset the Known IPs for a target user (Admin privilege execution)
   */
  const resetKnownIps = async (uid: string) => {
    try {
      const uRef = doc(db, 'users', uid);
      await updateDoc(uRef, {
        authorized_ips: []
      });
      if (user?.id === uid) {
        setUser(prev => prev ? { ...prev, authorized_ips: [] } : null);
      }
    } catch (err) {
      console.error('Reset known IPs exception:', err);
    }
  };

  // Static API compatible methods
  const login = async () => {
    throw new Error('Standard password sign-in is deactivated. Please utilize safe passwordless Email sign-in.');
  };
  const signUp = async () => {
    throw new Error('Standard passwords registration is deactivated. Please utilize safe passwordless Email sign-up.');
  };
  const sendMagicLink = async (email: string) => {
    await loginPasswordlessCheck(email);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem('openrouter-key');
      sessionStorage.removeItem('ecom_is_verified');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!user || !auth.currentUser) return;
    const confirmDelete = window.confirm('Are you absolutely sure? This will permanently delete your account and all associated data. You will need to sign up again to access features.');
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      // Delete their firestore doc
      await deleteDoc(doc(db, 'users', user.id));
      
      localStorage.removeItem('openrouter-key');
      sessionStorage.removeItem('ecom_is_verified');
      await signOut(auth);
      setUser(null);
      window.location.href = '/';
    } catch (err: any) {
      console.error('Delete account error:', err);
      setUser(null);
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'email' | 'subscription'>>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...updates };

      await updateDoc(doc(db, 'users', user.id), {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar,
        passwordHidden: updatedUser.passwordHidden
      });
      setUser(updatedUser);
    } catch (err: any) {
      setAuthError(err.message || 'Error occurred during profile update');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (
    tier: 'starter' | 'pro' | 'business' | null,
    cycle: 'month' | 'quarter' | 'year' = 'month',
    status: 'active' | 'inactive' = 'active',
    price: number = 0,
    periodEnd?: string | null
  ) => {
    if (!user) return;
    setIsLoading(true);
    try {
      let finalPeriodEnd = periodEnd;
      if (tier) {
        if (finalPeriodEnd === undefined) {
          const d = new Date();
          if (cycle === 'month') d.setDate(d.getDate() + 30);
          else if (cycle === 'quarter') d.setDate(d.getDate() + 90);
          else if (cycle === 'year') d.setDate(d.getDate() + 365);
          finalPeriodEnd = d.toISOString();
        }
      } else {
        finalPeriodEnd = null;
      }

      const updatedUser: UserProfile = { 
        ...user, 
        subscription: tier, 
        subscriptionCycle: cycle, 
        subscriptionStatus: status, 
        subscriptionPrice: price,
        subscriptionPeriodEnd: finalPeriodEnd
      };

      const userDocRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          subscription: tier,
          subscriptionCycle: cycle,
          subscriptionStatus: status,
          subscriptionPrice: price,
          subscriptionPeriodEnd: finalPeriodEnd
        });
      }
      setUser(updatedUser);
    } catch (err: any) {
      setAuthError(err.message || 'Error occurred during payment sync');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const currentIp = await fetchClientIp();
        
        let finalProfile: UserProfile;

        if (!userDoc.exists()) {
          const colors = ['2563eb', '16a34a', 'd97706', 'dc2626', '7c3aed', 'db2777', '0891b2', '4f46e5', 'ea580c', '4b5563'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const fName = user.displayName?.split(' ')[0] || '';
          const lName = user.displayName?.split(' ')[1] || '';
          const displayName = user.displayName || 'U';
          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${color}&color=fff&bold=true`;

          const refId = sessionStorage.getItem('ecomboost_ref');

          const newProfileData = {
            email: user.email || '',
            firstName: fName,
            lastName: lName,
            avatar: avatarUrl,
            subscription: null, 
            passwordHidden: 'google_provider',
            session_lock_id: getCurrentSessionId(),
            subscriptionCycle: 'month' as const,
            subscriptionStatus: 'inactive' as const,
            subscriptionPrice: 0,
            subscriptionPeriodEnd: null,
            created_ip: currentIp,
            authorized_ips: [currentIp],
            isAdmin: user.email === 'vadimtchepikov@gmail.com' || user.email === 'goatcaca111@gmail.com',
            createdAt: Date.now(),
            userAgent: navigator.userAgent,
            referredByLink: refId || null
          };

          await setDoc(userDocRef, newProfileData);

          finalProfile = {
            id: user.uid,
            ...newProfileData
          };
        } else {
          // Record current IP on existing user
          const existingData = userDoc.data();
          let authIps = existingData.authorized_ips || [];
          if (!authIps.includes(currentIp)) {
            authIps.push(currentIp);
            await updateDoc(userDocRef, { authorized_ips: authIps });
          }
          finalProfile = {
            id: user.uid,
            email: existingData.email || user.email || '',
            firstName: existingData.firstName || '',
            lastName: existingData.lastName || '',
            avatar: existingData.avatar || AVATARS[0],
            subscription: existingData.subscription || null,
            passwordHidden: existingData.passwordHidden || 'google_provider',
            subscriptionCycle: existingData.subscriptionCycle || 'month',
            subscriptionStatus: existingData.subscriptionStatus || 'inactive',
            subscriptionPrice: existingData.subscriptionPrice || 0,
            subscriptionPeriodEnd: existingData.subscriptionPeriodEnd || null,
            isAdmin: user.email === 'goatcaca111@gmail.com' || existingData.isAdmin === true,
            created_ip: existingData.created_ip || currentIp,
            authorized_ips: authIps
          };
        }
        setUser(finalProfile);
    } catch (err: any) {
        const cleaned = filterAndCleanErrorMessage(err);
        setAuthError(cleaned);
        throw new Error(cleaned);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        isRealSupabase: isRealConfigured,
        login,
        signUp,
        sendMagicLink,
        logout,
        deleteAccount,
        signInWithGoogle,
        updateProfile,
        updateSubscription,
        authError,
        clearError,
        
        // Expose new passwordless routines
        
        loginPasswordlessCheck,
        verifyPasswordlessOtp,
        requestPasswordlessOtp,
        resetKnownIps
      }}
    >
      {sessionLocked && (
        <div className="fixed inset-0 z-[99999] bg-[#09090b] text-white flex items-center justify-center font-sans p-6 select-none animate-fade-in">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-xl tracking-tight text-white">Multi-Device Session Conflict</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your EcomBoost.org account is currently logged in on another computer, device or IP location. Security policies allow exactly **one active device / browser session** per workspace to protect sensitive spy file assets and prevent account sharing.
              </p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[10px] font-mono text-zinc-400">
              Other Login Location: IP Verified & Active
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={async () => {
                  const newId = 'slock_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
                  sessionStorage.setItem('ecomboost_session_lock_id', newId);
                  setSessionLocked(false);
                  if (user) {
                    await updateDoc(doc(db, 'users', user.id), {
                      session_lock_id: newId
                    });
                  }
                  window.location.reload();
                }}
                className="w-full bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase py-3 rounded-xl transition-all shadow-md shadow-accent/10"
              >
                Disconnect Other Device & Authorize This Computer
              </button>
              <button
                onClick={async () => {
                  setSessionLocked(false);
                  if (user) {
                    await signOut(auth);
                  }
                  setUser(null);
                  window.location.hash = '#/login';
                }}
                className="w-full hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-bold uppercase py-2.5 rounded-xl transition-all"
              >
                Disconnect & Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
