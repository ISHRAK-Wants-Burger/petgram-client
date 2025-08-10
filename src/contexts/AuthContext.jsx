// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getIdTokenResult
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

// Custom hook to consume the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);        // <-- role state
  const [loading, setLoading] = useState(true);

  // Helper to refresh role from the ID token (forceRefresh optional)
  async function refreshRole(forceRefresh = false) {
    try {
      const user = auth.currentUser;
      if (!user) {
        setRole(null);
        return null;
      }
      const tokenResult = await getIdTokenResult(user, forceRefresh);
      const newRole = tokenResult?.claims?.role || 'consumer';
      setRole(newRole);
      return tokenResult;
    } catch (err) {
      console.error('refreshRole error:', err);
      setRole('consumer');
      return null;
    }
  }

  useEffect(() => {
    // Listen for auth state changes and read custom claims (role)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      setCurrentUser(user);

      // read claims asynchronously
      (async () => {
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }
        try {
          // Try to get token result (no forced refresh by default)
          const tokenResult = await getIdTokenResult(user);
          setRole(tokenResult?.claims?.role || 'consumer');
        } catch (err) {
          console.error('Failed to read ID token claims on auth change:', err);
          setRole('consumer');
        } finally {
          setLoading(false);
        }
      })();
    });

    return unsubscribe;
  }, []);

  // Authentication functions
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    role,
    setRole,      
    refreshRole,  
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
