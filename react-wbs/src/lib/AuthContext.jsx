import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { AuthContext } from './AuthContextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const verifyAdminRole = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const adminCheck = !error && data?.role === 'admin';
      setIsAdmin(adminCheck);
      return adminCheck;
    } catch (err) {
      console.error('Error verifying admin role:', err);
      setIsAdmin(false);
      return false;
    }
  }, []);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await verifyAdminRole(session.user.id);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Manual login/logout functions handle state synchronously, so we prevent double-handling
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        return;
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        await verifyAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [verifyAdminRole]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setLoading(false);
        throw error;
      }

      setUser(data.user);
      if (data.user) {
        await verifyAdminRole(data.user.id);
      }
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setIsAdmin(false);
      setUser(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
