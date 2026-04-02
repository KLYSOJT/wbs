# Admin Auth Implementation Checklist

Quick reference for updating your existing admin pages with authentication protection.

## Overview

You need to add **3 script tags** to the `<head>` of each admin page (except login.html):

```html
<!-- In <head> of every admin page except login.html -->

<!-- 1. Supabase Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- 2. Config (creates window.supabaseClient) -->
<script src="../../js/supabase-config.js"></script>

<!-- 3. Auth Guard (auto-protects page) -->
<script src="../../js/authAdmin.js"></script>
```

---

## Page-by-Page Setup

### ✅ `/admin/login.html`

**Status:** Already updated ✓

Scripts added:
- ✓ Supabase JS library
- ✓ supabase-config.js
- ✓ admin-login.js

**No changes needed.**

---

### `/admin/home.html`

Add these to `<head>`:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Home</title>
    
    <!-- Existing stylesheets -->
    <link rel="stylesheet" href="../../css/admin/navbar.css">
    <link rel="stylesheet" href="../../css/admin/home.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- ADD THESE THREE SCRIPTS -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../../js/supabase-config.js"></script>
    <script src="../../js/authAdmin.js"></script>
</head>
<body>
    <!-- Your existing content -->
</body>
```

---

### `/admin/award-contracts.html`

Same pattern - add to `<head>`:

```html
<!-- Existing stylesheets -->
<link rel="stylesheet" href="../../css/admin/...">

<!-- ADD THESE THREE SCRIPTS -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../../js/supabase-config.js"></script>
<script src="../../js/authAdmin.js"></script>
```

---

### Other Admin Pages

**Apply the same 3 scripts to ALL of these:**

- [ ] `/admin/bac.html`
- [ ] `/admin/bid-bulletin.html`
- [ ] `/admin/bsp.html`
- [ ] `/admin/deped-order.html`
- [ ] `/admin/division-memo.html`
- [ ] `/admin/gsp.html`
- [ ] `/admin/invitation-bid.html`
- [ ] `/admin/mooe.html`
- [ ] `/admin/organizational-structure.html`
- [ ] `/admin/philgeps.html`
- [ ] `/admin/procurement-reports.html`
- [ ] `/admin/recognized-structure.html`
- [ ] `/admin/redcross.html`
- [ ] `/admin/research.html`
- [ ] `/admin/school-memo.html`
- [ ] `/admin/spta.html`
- [ ] `/admin/sslg.html`
- [ ] `/admin/tr.html`

---

## Quick Template

Copy this template to all admin pages:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Page Title</title>
    
    <!-- Your existing stylesheets -->
    <link rel="stylesheet" href="../../css/admin/navbar.css">
    <link rel="stylesheet" href="../../css/admin/page-specific.css">
    
    <!-- 🔐 AUTHENTICATION SCRIPTS -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../../js/supabase-config.js"></script>
    <script src="../../js/authAdmin.js"></script>
</head>
<body>
    <!-- Your existing navbar -->
    <nav class="navbar">
        <!-- ... navbar content ... -->
        <button onclick="adminAuth.logout()" class="logout-btn">Logout</button>
    </nav>

    <!-- Your existing page content -->
    <main>
        <!-- ... page content ... -->
    </main>

    <!-- Your existing scripts -->
    <script src="../../js/navbar.js"></script>
    <!-- ... other scripts ... -->
</body>
</html>
```

---

## Logout Button

Add logout to your navbar. Example:

```html
<!-- In navbar -->
<button onclick="adminAuth.logout()" class="logout-btn">
    Logout
</button>

<!-- Or with a dropdown menu -->
<div class="navbar-menu">
    <button onclick="toggleMenu()" class="menu-btn">Menu</button>
    <div id="menu" class="dropdown" style="display: none;">
        <a href="#" onclick="event.preventDefault(); adminAuth.logout();">
            🚪 Logout
        </a>
    </div>
</div>
```

---

## Testing After Setup

For each page you update, test these scenarios:

### Test 1: Direct URL Access (Not Logged In)
```
1. Close browser or logout
2. Manually type: http://localhost/admin/home.html
3. Should redirect to login.html
✓ Expected: Login page loads
```

### Test 2: Login with Admin Account
```
1. Enter admin email and password
2. Click "Access Admin"
✓ Expected: Redirected to home.html successfully
```

### Test 3: Login with Non-Admin Account
```
1. Enter non-admin email and password
2. Click "Access Admin"
✓ Expected: Error message "not have admin privileges"
```

### Test 4: Session Persists
```
1. Login as admin
2. Refresh page (Ctrl+R or Cmd+R)
✓ Expected: Still logged in, page loads normally
```

### Test 5: Logout Works
```
1. Login as admin
2. Click logout button
✓ Expected: Redirected to login.html, session cleared
```

### Test 6: Cross-Tab Sync
```
1. Login on one tab
2. Open admin page in another tab
✓ Expected: Already logged in on 2nd tab
```

---

## Troubleshooting

### Problem: "supabaseClient is not defined"
**Fix:** Make sure script loading order is:
1. Supabase JS library
2. supabase-config.js
3. authAdmin.js

### Problem: Can't login
**Fix:** Check:
- User exists in auth.users
- User has profile with role = 'admin'
- Email is correct
- Password is correct

### Problem: Login works but still redirected
**Fix:** User authenticated but doesn't have admin role. Check profiles table:
```sql
SELECT id, email, role FROM profiles WHERE role = 'admin';
```

### Problem: Page shows but no content
**Fix:** Content might be hidden. Add this to watch auth:
```javascript
window.addEventListener('adminAuthVerified', () => {
    document.getElementById('content').style.display = 'block';
});
```

---

## File Summary

### Created Files
- ✅ `/js/authAdmin.js` - Auth guard (auto-protects pages)
- ✅ `/js/admin-login.js` - Login form handler
- ✅ `/pages/admin/dashboard-example.html` - Example protected page

### Updated Files
- ✅ `/js/supabase-config.js` - Expose supabaseClient globally
- ✅ `/pages/admin/login.html` - Add script tags

### Documentation
- ✅ `ADMIN_AUTH_SETUP_GUIDE.md` - Complete setup guide
- ✅ `VANILLA_JS_AUTH_BEST_PRACTICES.md` - Architecture & patterns
- ✅ `ADMIN_AUTH_IMPLEMENTATION_CHECKLIST.md` - This file

---

## Simple Test

Try this in browser console after logging in:

```javascript
// Check if authenticated
console.log(adminAuth.isAuthenticated());  // Should be: true

// Get current user
console.log(adminAuth.getCurrentUser());   // Should show email

// Get user role
console.log(adminAuth.getUserRole());      // Should be: admin
```

---

## Next Steps

1. **Update all admin pages** with the 3 script tags
2. **Add logout button** to navbar
3. **Test login** with admin account
4. **Test unauthorized access** with non-admin account
5. **Verify session persistence** after refresh
6. **Check console logs** for any errors

---

## Command Line Setup (Optional)

If updating many files, here's a template for bulk updates:

### For Windows (PowerShell):
```powershell
# Add scripts to all admin pages (except login.html)
Get-ChildItem "src/pages/admin/*.html" | 
  Where-Object { $_.Name -ne "login.html" } |
  ForEach-Object {
    # Your update command here
  }
```

### For Mac/Linux (Bash):
```bash
# Add scripts to all admin pages (except login.html)
for file in src/pages/admin/*.html; do
  if [[ "$file" != *"login.html"* ]]; then
    # Your update command here
  fi
done
```

---

## Success Indicators

✅ All of these should be true:

- Admin pages redirect to login when not authenticated
- Admin login works with correct credentials
- Non-admin accounts can't access /admin/
- Session persists after page refresh
- Logout button works and clears session
- No JavaScript errors in console
- User can navigate between admin pages without re-logging in

---

For detailed documentation, see:
- [ADMIN_AUTH_SETUP_GUIDE.md](../ADMIN_AUTH_SETUP_GUIDE.md)
- [VANILLA_JS_AUTH_BEST_PRACTICES.md](../VANILLA_JS_AUTH_BEST_PRACTICES.md)
