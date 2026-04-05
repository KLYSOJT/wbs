/**
 * Admin Authentication Guard
 * 
 * Reusable script for protecting admin pages with Supabase Auth
 * Checks session, verifies admin role, and handles redirects
 * 
 * Usage: Add this to the <head> or top of <body> in every admin page (except login.html)
 * <script src="../../js/supabase-config.js"></script>
 * <script src="../../js/authAdmin.js"></script>
 */

class AdminAuthGuard {
  constructor() {
    this.supabase = window.supabaseClient;
    this.isInitialized = false;
    this.currentUser = null;
    this.userRole = null;
  }

  /**
   * Initialize auth guard - run this on page load
   * This should be called before any protected page content loads
   */
  async init() {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session check error:', sessionError);
        this.redirectToLogin('Session error');
        return;
      }

      // No session - redirect to login
      if (!session) {
        console.log('No session found');
        this.redirectToLogin('No active session');
        return;
      }

      // Session exists - verify admin role
      this.currentUser = session.user;
      const isAdmin = await this.verifyAdminRole(session.user.id);

      if (!isAdmin) {
        console.warn('User is not an admin:', session.user.email);
        this.redirectToLogin('Unauthorized: Not an admin');
        return;
      }

      this.isInitialized = true;
      console.log('Admin auth verified for:', this.currentUser.email);
      document.body.classList.add('auth-verified');
      
      // Emit custom event for other scripts to listen to
      window.dispatchEvent(new CustomEvent('adminAuthVerified', { 
        detail: { user: this.currentUser, role: this.userRole } 
      }));

    } catch (error) {
      console.error('Auth initialization error:', error);
      this.redirectToLogin('Authentication error');
    }
  }

  /**
   * Verify if user has admin role in profiles table
   * @param {string} userId - The user's UUID
   * @returns {boolean} - True if user is admin
   */
  async verifyAdminRole(userId) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile query error:', error);
        return false;
      }

      if (!data || !data.role) {
        console.warn('No role found in profile');
        return false;
      }

      this.userRole = data.role;
      const isAdmin = data.role === 'admin';
      
      if (isAdmin) {
        console.log('Admin role verified');
      } else {
        console.warn('User role is:', data.role);
      }

      return isAdmin;
    } catch (error) {
      console.error('Error verifying admin role:', error);
      return false;
    }
  }

  /**
   * Logout current admin user
   */
  async logout() {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to logout?');
    if (!confirmed) {
      return; // User cancelled logout
    }

    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }

      console.log('Admin logged out successfully');
      
      // Clear any cached data
      this.currentUser = null;
      this.userRole = null;
      this.isInitialized = false;

      // Redirect to login
      window.location.href = './login.html';
      
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed: ' + error.message);
    }
  }

  /**
   * Get current authenticated user
   * @returns {object} - Current user object or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get current user's role
   * @returns {string} - User's role or null
   */
  getUserRole() {
    return this.userRole;
  }

  /**
   * Check if auth is verified
   * @returns {boolean} - True if auth is verified
   */
  isAuthenticated() {
    return this.isInitialized;
  }

  /**
   * Redirect to login page
   * @param {string} reason - Optional reason for redirect (logged in console)
   * @private
   */
  redirectToLogin(reason = '') {
    console.log('Redirecting to login:', reason);
    // Redirect to login.html - adjust path as needed for your structure
    window.location.href = './login.html';
  }
}

// Create global instance
const adminAuth = new AdminAuthGuard();

// Auto-initialize on page load if not on login page
document.addEventListener('DOMContentLoaded', async () => {
  // Don't run on login.html
  if (!window.location.pathname.includes('/login.html')) {
    await adminAuth.init();
  }
});

// Optional: Listen for auth state changes
if (window.supabaseClient) {
  window.supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    
    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      window.location.href = './login.html';
    }
  });
}
