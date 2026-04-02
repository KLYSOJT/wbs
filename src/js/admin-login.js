/**
 * Admin Login Logic
 * 
 * Handles email/password authentication using Supabase Auth v2
 * Checks user role before allowing access
 * 
 * Usage: Add this script to admin/login.html at the end of body
 * <script src="../../js/supabase-config.js"></script>
 * <script src="admin-login.js"></script>
 */

class AdminLogin {
  constructor() {
    this.supabase = window.supabaseClient;
    this.form = document.getElementById('adminForm');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.errorBox = document.getElementById('errorBox');
    this.isLoading = false;

    this.setupEventListeners();
    this.checkExistingSession();
  }

  /**
   * Setup form event listeners
   */
  setupEventListeners() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Clear error message when user starts typing
    if (this.emailInput) {
      this.emailInput.addEventListener('input', () => this.hideError());
    }
    if (this.passwordInput) {
      this.passwordInput.addEventListener('input', () => this.hideError());
    }
  }

  /**
   * Check if user already has a valid session
   * If yes, redirect to dashboard
   */
  async checkExistingSession() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (session) {
        // Session exists - verify admin role
        const isAdmin = await this.verifyAdminRole(session.user.id);
        if (isAdmin) {
          console.log('User already logged in, redirecting to dashboard');
          window.location.href = 'home.html';
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  }

  /**
   * Handle login form submission
   */
  async handleLogin(e) {
    e.preventDefault();

    if (this.isLoading) return;

    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;

    // Validate inputs
    if (!email || !password) {
      this.showError('Please enter email and password');
      return;
    }

    this.setLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          this.showError('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          this.showError('Please verify your email before logging in');
        } else {
          this.showError(error.message || 'Login failed. Please try again.');
        }
        
        this.setLoading(false);
        return;
      }

      // Login successful - now verify admin role
      const session = data.session;
      const isAdmin = await this.verifyAdminRole(session.user.id);

      if (!isAdmin) {
        // User authenticated but not an admin - logout and show error
        await this.supabase.auth.signOut();
        this.showError('Your account does not have admin privileges');
        this.setLoading(false);
        return;
      }

      // Authentication and authorization successful
      console.log('Admin logged in successfully:', session.user.email);
      
      // Redirect to admin dashboard
      window.location.href = 'home.html';

    } catch (error) {
      console.error('Unexpected login error:', error);
      this.showError('An unexpected error occurred. Please try again.');
      this.setLoading(false);
    }
  }

  /**
   * Verify if user has admin role in profiles table
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

      if (!data || data.role !== 'admin') {
        console.warn('User role is not admin:', data?.role);
        return false;
      }

      console.log('Admin role verified');
      return true;

    } catch (error) {
      console.error('Error verifying admin role:', error);
      return false;
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    if (this.errorBox) {
      this.errorBox.textContent = message;
      this.errorBox.style.display = 'block';
    } else {
      alert(message);
    }
  }

  /**
   * Hide error message
   */
  hideError() {
    if (this.errorBox) {
      this.errorBox.style.display = 'none';
    }
  }

  /**
   * Set loading state
   */
  setLoading(isLoading) {
    this.isLoading = isLoading;
    
    if (this.form) {
      const submitBtn = this.form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = isLoading;
        submitBtn.style.opacity = isLoading ? '0.6' : '1';
        submitBtn.style.cursor = isLoading ? 'not-allowed' : 'pointer';
        
        if (isLoading) {
          submitBtn.innerHTML = '<span>Verifying...</span>';
        } else {
          submitBtn.innerHTML = '<span>Access Admin</span>';
        }
      }
    }
  }
}

// Initialize login when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AdminLogin();
});
