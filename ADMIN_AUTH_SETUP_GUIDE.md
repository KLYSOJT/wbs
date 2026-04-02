# Admin Authentication Setup Guide

## Overview

This guide explains how to implement secure admin authentication using Supabase Auth and role-based access control in your vanilla JavaScript project.

---

## Files Created

### 1. **`/js/authAdmin.js`** - Authentication Guard
- Reusable class that protects admin pages
- Checks if user is authenticated
- Verifies `role = "admin"` in the profiles table
- Automatically redirects unauthorized users to login
- Handles session persistence
- Detects auth state changes

### 2. **`/js/admin-login.js`** - Login Form Handler
- Handles email + password authentication
- Validates admin role before granting access
- Logs out non-admin users immediately
- Shows error messages to users
- Redirects already logged-in users to dashboard

### 3. **Updated `/js/supabase-config.js`**
- Exposes `window.supabaseClient` globally
- Makes Supabase client accessible to auth scripts

---

## How It Works

### Authentication Flow

```
User visits admin page
    ↓
authAdmin.js runs (auto-init)
    ↓
Check if session exists
    ↓
If NO → Redirect to login.html
    ↓
If YES → Query profiles table for role
    ↓
If role ≠ "admin" → Redirect to login.html
    ↓
If role = "admin" → Allow page access ✓
    ↓
Listen for auth state changes
If user logs out → Redirect to login.html
```

---

## Setup Instructions

### Step 1: Update Admin Home Page

Add these scripts to `src/pages/admin/home.html` in the `<head>` section:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Home</title>
    
    <!-- Your existing stylesheets -->
    <link rel="stylesheet" href="../../css/admin/navbar.css">
    <link rel="stylesheet" href="../../css/admin/home.css">
    
    <!-- Supabase Auth (before authAdmin.js) -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../../js/supabase-config.js"></script>
    
    <!-- Authentication Guard (auto-initializes on load) -->
    <script src="../../js/authAdmin.js"></script>
</head>
<body>
    <!-- Your existing navbar and content -->
</body>
</html>
```

### Step 2: Apply to All Admin Pages (Except Login)

For **each protected admin page** (dashboard.html, students.html, settings.html, etc.), add the same three scripts to the `<head>`:

```html
<!-- Supabase Auth -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../../js/supabase-config.js"></script>

<!-- Authentication Guard -->
<script src="../../js/authAdmin.js"></script>
```

**DO NOT add these scripts to `admin/login.html`** - it has its own login script.

### Step 3: Add Logout Button to Navbar

Add a logout button to your admin navbar. Update your admin navbar template:

```html
<button id="logoutBtn" class="logout-btn">Logout</button>

<script>
  // Listen for admin auth verification
  window.addEventListener('adminAuthVerified', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to logout?')) {
          await adminAuth.logout();
        }
      });
    }
  });
</script>
```

Or use this simpler approach anywhere on the page:

```html
<button onclick="adminAuth.logout()">Logout</button>
```

---

## API Reference

### AdminAuthGuard Class

#### Methods

**`init()`** - Initialize authentication check
```javascript
await adminAuth.init();
// Called automatically on DOM load
```

**`logout()`** - Sign out current user and redirect to login
```javascript
await adminAuth.logout();
```

**`getCurrentUser()`** - Get current authenticated user object
```javascript
const user = adminAuth.getCurrentUser();
console.log(user.email); // 'admin@example.com'
```

**`getUserRole()`** - Get current user's role
```javascript
const role = adminAuth.getUserRole();
console.log(role); // 'admin'
```

**`isAuthenticated()`** - Check if auth is verified
```javascript
if (adminAuth.isAuthenticated()) {
  console.log('User is authenticated');
}
```

### Events

Listen for successful authentication:
```javascript
window.addEventListener('adminAuthVerified', (event) => {
  console.log('User:', event.detail.user);
  console.log('Role:', event.detail.role);
  // Update UI for authenticated user
});
```

Listen for auth state changes:
```javascript
window.supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User logged out');
  }
  if (event === 'SIGNED_IN') {
    console.log('User logged in');
  }
});
```

---

## Example: Protected Dashboard Page

Here's a complete example of a protected admin dashboard:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../../css/admin/dashboard.css">
    
    <!-- Auth Scripts (must be in head) -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../../js/supabase-config.js"></script>
    <script src="../../js/authAdmin.js"></script>
</head>
<body>
    <!-- Navbar with logout -->
    <nav class="navbar">
        <h1>Admin Dashboard</h1>
        <button onclick="adminAuth.logout()" class="logout-btn">Logout</button>
    </nav>

    <!-- Protected content -->
    <main class="dashboard-content">
        <h2>Welcome Admin</h2>
        <p id="userEmailDisplay"></p>
        
        <!-- Your dashboard content here -->
    </main>

    <!-- Script to display user info after auth verification -->
    <script>
      window.addEventListener('adminAuthVerified', () => {
        const user = adminAuth.getCurrentUser();
        document.getElementById('userEmailDisplay').textContent = 
          `Logged in as: ${user.email}`;
      });
    </script>
</body>
</html>
```

---

## Security Features

✅ **Session Persistence** - Sessions survive page refresh automatically via Supabase  
✅ **Role Verification** - All admin pages verify `role = "admin"` in profiles table  
✅ **Automatic Redirects** - Unauthorized users redirected to login immediately  
✅ **Auth State Monitoring** - Detects when users log out from other tabs  
✅ **Error Handling** - Graceful error messages for failed auth  
✅ **Console Logging** - Debug logs for auth flow (dev-friendly)

---

## Database Setup

Ensure your `profiles` table has these columns:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES auth.users(id)
);
```

Insert admin users:

```sql
INSERT INTO profiles (id, email, role)
VALUES ('{user_uuid}', 'admin@school.edu', 'admin');
```

---

## Common Use Cases

### Disable Page Access Until Authenticated

```html
<body style="display: none;">
    <!-- Content hidden by default -->
    <script src="../../js/authAdmin.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            await adminAuth.init();
            if (adminAuth.isAuthenticated()) {
                document.body.style.display = 'block';
            }
        });
    </script>
</body>
```

### Show Different Content Based on Role

```javascript
window.addEventListener('adminAuthVerified', () => {
    const role = adminAuth.getUserRole();
    
    // Show role-specific content
    if (role === 'admin') {
        document.getElementById('adminSection').style.display = 'block';
    }
});
```

### Logout with Confirmation

```javascript
async function logoutWithConfirm() {
    if (confirm('Are you sure you want to logout?')) {
        await adminAuth.logout();
    }
}
```

---

## Troubleshooting

### Issue: "Supabase client not found"
**Solution:** Make sure `supabase-config.js` is loaded BEFORE `authAdmin.js`

```html
<script src="../../js/supabase-config.js"></script>
<script src="../../js/authAdmin.js"></script>
```

### Issue: Auth guard doesn't redirect
**Solution:** Check browser console for errors. Ensure:
- User has a session (check with `adminAuth.getCurrentUser()`)
- User's profile has `role = 'admin'`
- profiles table is readable by authenticated users

### Issue: Sessions don't persist
**Solution:** Supabase caches sessions in localStorage automatically. Check:
- Browser allows localStorage
- No "Incognito" or "Private" mode
- Browser hasn't been cleared of site data

### Issue: Logout doesn't work
**Solution:** Ensure your button calls:
```javascript
await adminAuth.logout();
// or
await window.supabaseClient.auth.signOut();
```

---

## Best Practices

1. **Always put auth scripts in `<head>`** - Ensures auth loads before page content
2. **Never expose sensitive data in client JS** - Anon keys are public, use RLS policies
3. **Validate role on backend** - Use Supabase RLS for database security
4. **Handle token refresh** - Supabase automatically refreshes expired tokens
5. **Test with multiple browsers** - Sessions sync across tabs
6. **Use HTTPS in production** - Auth tokens require secure connections

---

## File Checklist

- [ ] `/js/authAdmin.js` created
- [ ] `/js/admin-login.js` created
- [ ] `/js/supabase-config.js` updated
- [ ] `/pages/admin/login.html` updated with script tags
- [ ] All protected admin pages have auth scripts in `<head>`
- [ ] Logout button added to admin navbar
- [ ] Profiles table has `role` column
- [ ] At least one user has `role = 'admin'`

---

## Next Steps

1. Test login with admin credentials
2. Verify session persists after refresh
3. Try accessing /admin/ URL directly (should redirect to login)
4. Test logout functionality
5. Verify non-admin users are rejected

For questions or issues, check browser console logs for detailed auth events.
