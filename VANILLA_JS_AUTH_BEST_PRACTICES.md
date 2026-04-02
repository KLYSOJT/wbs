# Vanilla JS Admin Authentication - Best Practices

A comprehensive guide for implementing secure folder-based authentication in vanilla JavaScript projects without frameworks.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Security Implementation](#security-implementation)
3. [Folder Structure](#folder-structure)
4. [Integration Patterns](#integration-patterns)
5. [Session Management](#session-management)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Deployment Considerations](#deployment-considerations)

---

## Architecture

### Reusable Guard Pattern

Instead of duplicating auth logic in every page, use a **centralized guard class** (`authAdmin.js`) that:

```
Single Source of Truth
        ↓
authAdmin.js (centralized logic)
        ↓
Loaded in every protected page <head>
        ↓
Auto-initializes on DOM load
        ↓
Redirects if unauthorized
```

**Benefits:**
- ✅ Single place to update auth logic
- ✅ Consistent behavior across all admin pages
- ✅ Easier to maintain and debug
- ✅ No duplication of code

### Guard Lifecycle

```javascript
Page Load
  ↓
<head> loads authAdmin.js
  ↓
DOM Content Loaded
  ↓
adminAuth.init() auto-runs
  ↓
Check session → Query role → Allow/Redirect
  ↓
Page either shows or user sent to login
  ↓
Listen for auth state changes
```

---

## Security Implementation

### 1. Client-Side Protection

**What it does:**
- Checks if user has a valid session (Supabase manages JWT tokens)
- Verifies user role in profiles table
- Prevents direct URL access to /admin/ pages

**What it doesn't protect:**
- Database queries (use RLS policies for that)
- API endpoints (need server-side validation)
- Sensitive business logic

### 2. Database-Level Protection (RLS)

Always add Row Level Security (RLS) policies to your tables:

```sql
-- Example: Profiles table - only admins can read
CREATE POLICY "Profiles - admins can view all"
  ON profiles
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Example: Sensitive data table
CREATE POLICY "Sensitive - admin access only"
  ON sensitive_data
  FOR SELECT
  USING (
    (auth.jwt() ->> 'custom_claims')::jsonb ->> 'role' = 'admin'
  );
```

### 3. Token Security

**Supabase handles automatically:**
- JWT token generation and signing
- Token refresh (extends expired tokens)
- Token storage in browser localStorage
- Secure cookies for HTTPOnly tokens (with proper config)

**You should ensure:**
- Use HTTPS only in production
- Never expose tokens in URLs
- Never log tokens in console (production)
- Validate tokens on backend for sensitive operations

### 4. Environment Variables

Never hardcode secrets in client-side code:

```javascript
// ❌ WRONG - Visible to everyone
const API_KEY = 'sk_live_abc123xyz...';

// ✅ CORRECT - Use public anon key (it's meant to be public)
const SUPABASE_ANON_KEY = 'eyJhbGc...';
// ^ This is intentionally public - RLS policies protect data
```

---

## Folder Structure

### Recommended Organization

```
project/
├── src/
│   ├── js/
│   │   ├── supabase-config.js          (config - load first)
│   │   ├── supabase-helpers.js         (database helpers)
│   │   ├── authAdmin.js                (auth guard - load 2nd)
│   │   ├── admin-login.js              (login logic only)
│   │   ├── navbar.js                   (shared UI logic)
│   │   └── utils.js                    (general helpers)
│   │
│   ├── css/
│   │   ├── admin/
│   │   │   ├── login.css
│   │   │   ├── navbar.css
│   │   │   └── ...
│   │   └── user/
│   │       └── ...
│   │
│   ├── pages/
│   │   ├── admin/                      (Protected by authAdmin.js)
│   │   │   ├── login.html              (NO auth scripts!)
│   │   │   ├── home.html               (has auth scripts)
│   │   │   ├── dashboard.html          (has auth scripts)
│   │   │   ├── students.html           (has auth scripts)
│   │   │   └── settings.html           (has auth scripts)
│   │   │
│   │   └── user/                       (Public pages)
│   │       ├── index.html
│   │       ├── home.html
│   │       └── ...
│   │
│   └── database/
│       └── migrations/
│           └── 001_create_profiles.sql
│
└── ADMIN_AUTH_SETUP_GUIDE.md           (implementation guide)
```

### Script Loading Order

**CRITICAL: Load in this order:**

```html
<!-- 1. Supabase library (global) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- 2. Configuration (creates window.supabaseClient) -->
<script src="../../js/supabase-config.js"></script>

<!-- 3. Auth guard (uses window.supabaseClient) -->
<script src="../../js/authAdmin.js"></script>

<!-- 4. Your page-specific scripts -->
<script src="../../js/navbar.js"></script>
```

**Wrong order = "supabaseClient is undefined" error**

---

## Integration Patterns

### Pattern 1: Basic Protection

**Minimal implementation** - just prevent unauthorized access:

```html
<head>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../../js/supabase-config.js"></script>
    <script src="../../js/authAdmin.js"></script>
</head>
<body>
    <!-- Page content automatically protected -->
    <h1>Admin Page</h1>
</body>
```

### Pattern 2: Conditional Display

**Show/hide content based on auth state:**

```html
<body style="display: none;">
    <h1>Admin Page</h1>
    
    <script src="../../js/authAdmin.js"></script>
    <script>
        window.addEventListener('adminAuthVerified', () => {
            document.body.style.display = 'block';
        });
    </script>
</body>
```

### Pattern 3: Role-Based Sections

**Show different content for different roles:**

```javascript
window.addEventListener('adminAuthVerified', () => {
    const role = adminAuth.getUserRole();
    
    if (role === 'admin') {
        document.getElementById('superAdminSection').style.display = 'block';
    }
    
    if (['admin', 'moderator'].includes(role)) {
        document.getElementById('modSection').style.display = 'block';
    }
});
```

### Pattern 4: Dynamic Admin UI Updates

**Personalize UI with user info:**

```javascript
window.addEventListener('adminAuthVerified', () => {
    const user = adminAuth.getCurrentUser();
    
    document.getElementById('adminName').textContent = 
        user.user_metadata?.full_name || user.email;
    
    document.getElementById('lastLogin').textContent = 
        new Date(user.last_sign_in_at).toLocaleString();
});
```

### Pattern 5: Logout Functionality

**Multiple ways to implement logout:**

```html
<!-- Simple button -->
<button onclick="adminAuth.logout()">Logout</button>

<!-- With confirmation -->
<button onclick="logoutWithConfirm()">Logout</button>
<script>
    function logoutWithConfirm() {
        if (confirm('Are you sure?')) {
            adminAuth.logout();
        }
    }
</script>

<!-- On dropdown menu -->
<nav class="navbar">
    <div class="dropdown">
        <button class="dropdown-btn">👤 Admin</button>
        <div class="dropdown-menu">
            <a href="#" onclick="event.preventDefault(); adminAuth.logout()">
                Logout
            </a>
        </div>
    </div>
</nav>
```

---

## Session Management

### How Sessions Work

1. **Login**: User enters email + password
2. **Auth Response**: Supabase returns JWT + Refresh Token
3. **Browser Storage**: Tokens stored in localStorage
4. **Persistence**: Next page load, tokens automatically used
5. **Refresh**: Expired tokens automatically refreshed

### Checking Session Status

```javascript
// Get current session
const { data: { session } } = await window.supabaseClient.auth.getSession();

if (session) {
    console.log('User logged in');
    console.log('Email:', session.user.email);
    console.log('Token expires:', session.expires_at);
} else {
    console.log('No session');
}
```

### Monitoring Session Changes

```javascript
// Runs whenever auth state changes
// Called on: login, logout, token refresh, etc.
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    switch(event) {
        case 'INITIAL_SESSION':
            console.log('Initial session loaded');
            break;
        case 'SIGNED_IN':
            console.log('User signed in');
            break;
        case 'SIGNED_OUT':
            console.log('User signed out');
            window.location.href = '../login.html';
            break;
        case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
    }
});
```

### Handling Session Expiry

Sessions expire when:
- User explicitly logs out
- Token refresh fails (more than 24 hours offline)
- Admin manually revokes session in Supabase dashboard

**Handled automatically:** User is redirected to login when session expires.

---

## Error Handling

### Login Errors

```javascript
// Get specific error messages
const { data, error } = await supabase.auth.signInWithPassword({
    email, password
});

if (error) {
    if (error.status === 400) {
        // Invalid credentials
        showError('Invalid email or password');
    } else if (error.status === 429) {
        // Too many attempts
        showError('Too many login attempts. Try again later.');
    } else if (error.message.includes('Email not confirmed')) {
        // Email not verified
        showError('Please verify your email first');
    } else {
        // Other errors
        showError(error.message);
    }
}
```

### Auth Guard Errors

```javascript
// Check console for detailed logs
// adminAuth.js logs:
// - Session checks
// - Role verification
// - Redirect reasons
// - Auth state changes
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "supabaseClient undefined" | Script loading order | Load supabase-config.js before authAdmin.js |
| "User not found" | Wrong table name | Check profiles table exists and has role column |
| "Not an admin" | Wrong role value | Ensure role = 'admin' (case-sensitive) |
| Session doesn't persist | localStorage disabled | Check browser settings |
| Redirect loop | Session keeps failing | Check network tab for auth errors |

---

## Testing

### Manual Testing Checklist

```
LOGIN FLOW
☐ Login with admin credentials succeeds
☐ Login with wrong password fails with error
☐ Login with non-admin account redirects to login
☐ Page refreshes during login work correctly

PROTECTED PAGES
☐ Direct URL access to /admin/ redirects to login
☐ Visiting protected page without session redirects to login
☐ Valid admin can view protected page
☐ Invalid admin redirected to login
☐ Page loads faster after cached session

SESSION PERSISTENCE
☐ Session persists after page refresh
☐ Session persists after browser close/reopen
☐ Session persists in multiple tabs
☐ Token refresh works (invisible to user)

LOGOUT
☐ Logout button works
☐ Logout redirects to login page
☐ After logout, can't access /admin
☐ After logout, login works again

AUTH STATE CHANGES
☐ Logout in one tab logs out other tabs
☐ Browser shows correct user across tabs
☐ Error handling shows proper messages
```

### Automated Testing Example

```javascript
// Test auth guard initialization
async function testAuthGuard() {
    // Test with valid session
    const { data: { session } } = 
        await window.supabaseClient.auth.getSession();
    
    if (session) {
        const isAdmin = await adminAuth.verifyAdminRole(session.user.id);
        console.assert(isAdmin, 'User should be admin');
    }
    
    // Test redirect on invalid role
    const user = adminAuth.getCurrentUser();
    console.assert(user !== null, 'Current user should exist');
    
    console.log('✅ Auth guard tests passed');
}

// Run test
testAuthGuard().catch(console.error);
```

---

## Deployment Considerations

### Before Going Live

```
SECURITY CHECKLIST
☐ RLS policies enabled on all tables
☐ Anon key only has read/insert on profiles
☐ Admin operations use service_role key (backend)
☐ HTTPS enabled in production
☐ CSP headers prevent XSS

CODE CHECKLIST
☐ Remove console.log() statements
☐ Test in incognito/private mode
☐ Test across browsers (Chrome, Firefox, Safari, Edge)
☐ Test on mobile devices
☐ Check for memory leaks

DATABASE CHECKLIST
☐ Profiles table exists with id, email, role
☐ RLS policies active
☐ At least one admin user created
☐ Backup taken

PERFORMANCE CHECKLIST
☐ Supabase region matches user location
☐ Auth scripts cached by CDN
☐ No N+1 queries on page load
☐ Sessions load <200ms
```

### Production Environment Variables

Use a `.env` file (never commit to git):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
```

Then load in config:

```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### Monitoring & Logging

```javascript
// Log auth events for debugging
function logAuthEvent(event, data) {
    console.log(`[AUTH] ${event}`, data);
    
    // In production, send to logging service
    // fetch('/api/logs', {
    //     method: 'POST',
    //     body: JSON.stringify({ event, data, timestamp: new Date() })
    // });
}

window.supabaseClient.auth.onAuthStateChange((event, session) => {
    logAuthEvent('AuthStateChange', { event, hasSession: !!session });
});
```

---

## Summary

### Key Principles

1. **Centralize auth logic** - Use `authAdmin.js` for all pages
2. **Load scripts in order** - Config → Auth Guard → Page Logic
3. **Protect at multiple levels** - Client + Database RLS + Backend validation
4. **Handle errors gracefully** - Show user-friendly messages
5. **Test thoroughly** - Manual testing + edge cases
6. **Monitor in production** - Log auth events for debugging

### This Implementation Provides

✅ **Session persistence** - Survives refresh & browser close  
✅ **Role-based access** - Verified against profiles table  
✅ **Automatic redirects** - Unauthorized users sent to login  
✅ **Multiple tab protection** - Logs out when session invalid  
✅ **Error handling** - Graceful failures with messages  
✅ **Zero framework** - Vanilla JavaScript + HTML + CSS  
✅ **Maintainable** - Single source of truth for auth logic  

---

**For setup instructions, see:** [ADMIN_AUTH_SETUP_GUIDE.md](ADMIN_AUTH_SETUP_GUIDE.md)
