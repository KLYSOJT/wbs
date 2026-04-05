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
    this.passwordToggle = document.getElementById('passwordToggle');
    this.errorBox = document.getElementById('errorBox');
    this.isLoading = false;

    if (!this.form || !this.emailInput || !this.passwordInput) {
      console.error('Admin login form elements are missing.');
      return;
    }

    if (!this.supabase?.auth) {
      console.error('Supabase client is not available on the login page.');
      this.showError('Authentication is unavailable right now. Please refresh and try again.');
      return;
    }

    this.setupEventListeners();
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

    if (this.passwordToggle) {
      this.passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
    }
  }

  togglePasswordVisibility() {
    const isPasswordVisible = this.passwordInput.type === 'text';
    this.passwordInput.type = isPasswordVisible ? 'password' : 'text';

    if (this.passwordToggle) {
      this.passwordToggle.setAttribute('aria-pressed', String(!isPasswordVisible));
      this.passwordToggle.setAttribute(
        'aria-label',
        isPasswordVisible ? 'Show password' : 'Hide password'
      );
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
    this.hideError();

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
      const session = data?.session;
      if (!session?.user?.id) {
        this.showError('Login succeeded but no active session was returned.');
        this.setLoading(false);
        return;
      }

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
      return;

    } catch (error) {
      console.error('Unexpected login error:', error);
      this.showError('An unexpected error occurred. Please try again.');
    } finally {
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
