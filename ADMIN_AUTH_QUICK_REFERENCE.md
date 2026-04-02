# Admin Auth - Quick Reference

Copy & paste code snippets for common authentication tasks.

---

## Protect a Page (Simplest)

Add to `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../../js/supabase-config.js"></script>
<script src="../../js/authAdmin.js"></script>
```

That's it. Page is now protected.

---

## Logout Button

```html
<button onclick="adminAuth.logout()">Logout</button>
```

---

## Show User Email

```javascript
window.addEventListener('adminAuthVerified', () => {
    const user = adminAuth.getCurrentUser();
    document.getElementById('userEmail').textContent = user.email;
});
```

---

## Show/Hide Content Based on Auth

```html
<!-- Hidden by default -->
<div id="content" style="display: none;">
    <h1>Admin Dashboard</h1>
</div>

<script src="../../js/authAdmin.js"></script>
<script>
    // Show when auth verified
    window.addEventListener('adminAuthVerified', () => {
        document.getElementById('content').style.display = 'block';
    });
</script>
```

---

## Check Auth Status

```javascript
if (adminAuth.isAuthenticated()) {
    console.log('User is logged in');
} else {
    console.log('User is not logged in');
}
```

---

## Get User Info

```javascript
const user = adminAuth.getCurrentUser();
console.log(user.email);      // 'admin@example.com'
console.log(user.id);         // 'uuid-123-456'
console.log(user.user_metadata); // Custom metadata
```

---

## Get User Role

```javascript
const role = adminAuth.getUserRole();
console.log(role); // 'admin'
```

---

## Logout with Confirmation

```javascript
async function logoutWithConfirm() {
    if (confirm('Are you sure you want to logout?')) {
        await adminAuth.logout();
    }
}
```

```html
<button onclick="logoutWithConfirm()">Logout</button>
```

---

## Listen for Auth Changes

```javascript
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('User signed in');
        console.log(session.user.email);
    }
    
    if (event === 'SIGNED_OUT') {
        console.log('User signed out');
    }
});
```

---

## Check if User Already Logged In

```javascript
async function checkSession() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    
    if (session) {
        console.log('User is logged in:', session.user.email);
        return true;
    } else {
        console.log('No session found');
        return false;
    }
}

// Usage
if (await checkSession()) {
    // User is logged in
}
```

---

## Manual Redirect to Login

```javascript
window.location.href = '../login.html';
```

---

## Personalized Navbar

```html
<nav class="navbar">
    <h1>Admin Dashboard</h1>
    <div id="userSection" style="display: none;">
        <span id="userName">User</span>
        <button onclick="adminAuth.logout()">Logout</button>
    </div>
</nav>

<script src="../../js/authAdmin.js"></script>
<script>
    window.addEventListener('adminAuthVerified', () => {
        const user = adminAuth.getCurrentUser();
        document.getElementById('userName').textContent = user.email;
        document.getElementById('userSection').style.display = 'block';
    });
</script>
```

---

## Show Role-Based Content

```javascript
window.addEventListener('adminAuthVerified', () => {
    const role = adminAuth.getUserRole();
    
    // Show admin-only section
    if (role === 'admin') {
        document.getElementById('adminTools').style.display = 'block';
    }
});
```

```html
<div id="adminTools" style="display: none;">
    <!-- Admin-only features -->
</div>
```

---

## Redirect to Login if Not Admin

```javascript
window.addEventListener('adminAuthVerified', () => {
    const role = adminAuth.getUserRole();
    
    if (role !== 'admin') {
        alert('You do not have admin access');
        window.location.href = '../login.html';
    }
});
```

---

## Debug Auth Issues

```javascript
// Check everything
console.log('Is Authenticated:', adminAuth.isAuthenticated());
console.log('Current User:', adminAuth.getCurrentUser());
console.log('User Role:', adminAuth.getUserRole());

// Check session
const { data: { session } } = await window.supabaseClient.auth.getSession();
console.log('Session:', session);
```

Open browser DevTools (F12) and run these in the console.

---

## Loading Spinner While Checking Auth

```html
<body>
    <!-- Loading spinner -->
    <div id="loadingSpinner" class="spinner"></div>
    
    <!-- Main content (hidden until auth verified) -->
    <main id="mainContent" style="display: none;">
        <h1>Admin Dashboard</h1>
    </main>

    <script src="../../js/authAdmin.js"></script>
    <script>
        window.addEventListener('adminAuthVerified', () => {
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
        });
    </script>
</body>
```

---

## Error Message Display

```html
<div id="errorMsg" style="display: none; color: red;"></div>

<script>
    // Listen for errors (via console)
    const originalErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        if (message.includes('auth') || message.includes('profile')) {
            document.getElementById('errorMsg').textContent = 'Authentication error. Please refresh.';
            document.getElementById('errorMsg').style.display = 'block';
        }
        return originalErrorHandler ? originalErrorHandler(message, source, lineno, colno, error) : false;
    };
</script>
```

---

## Display Last Login Time

```javascript
window.addEventListener('adminAuthVerified', () => {
    const user = adminAuth.getCurrentUser();
    
    if (user.last_sign_in_at) {
        const lastLogin = new Date(user.last_sign_in_at);
        document.getElementById('lastLogin').textContent = 
            `Last login: ${lastLogin.toLocaleString()}`;
    }
});
```

---

## Monitor All Auth Events

```javascript
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log(`[AUTH EVENT] ${event}`, {
        hasSession: !!session,
        email: session?.user.email,
        timestamp: new Date().toISOString()
    });
});
```

Good for debugging - shows every auth action in console.

---

## Admin List Page Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Admins</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../../js/supabase-config.js"></script>
    <script src="../../js/authAdmin.js"></script>
</head>
<body>
    <h1>Admin Users</h1>
    <button onclick="adminAuth.logout()">Logout</button>
    
    <ul id="adminList"></ul>

    <script>
        window.addEventListener('adminAuthVerified', async () => {
            // Fetch all admins
            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select('email, created_at')
                .eq('role', 'admin');
            
            if (error) {
                console.error('Error:', error);
                return;
            }
            
            // Display list
            const html = data.map(admin => 
                `<li>${admin.email} (${new Date(admin.created_at).toLocaleDateString()})</li>`
            ).join('');
            
            document.getElementById('adminList').innerHTML = html;
        });
    </script>
</body>
</html>
```

---

## Prevent Caching of Admin Pages

Add to admin pages to prevent serving old content:

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

---

## Mobile-Friendly Logout

```html
<header class="mobile-header">
    <button id="hamburger" onclick="toggleMenu()">☰ Menu</button>
    <div id="menu" style="display: none; position: absolute; background: white; padding: 1rem;">
        <a href="#" onclick="event.preventDefault(); adminAuth.logout();">
            🚪 Logout
        </a>
    </div>
</header>

<script>
    function toggleMenu() {
        document.getElementById('menu').style.display = 
            document.getElementById('menu').style.display === 'none' ? 'block' : 'none';
    }
    
    // Close menu when clicking logout
    document.addEventListener('click', (e) => {
        if (!e.target.closest('header')) {
            document.getElementById('menu').style.display = 'none';
        }
    });
</script>
```

---

## API Response Authentication

Check auth before making API calls:

```javascript
async function fetchAdminData() {
    // Verify user is still admin
    if (!adminAuth.isAuthenticated()) {
        console.log('Not authenticated');
        window.location.href = '../login.html';
        return;
    }
    
    const user = adminAuth.getCurrentUser();
    
    // Your API call
    const response = await fetch('/api/admin/data', {
        headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response.json();
}
```

---

## Monitor Session Expiry

```javascript
let sessionCheckInterval;

function startSessionMonitoring() {
    sessionCheckInterval = setInterval(async () => {
        const { data: { session } } = 
            await window.supabaseClient.auth.getSession();
        
        if (!session) {
            console.log('Session expired');
            window.location.href = '../login.html';
            clearInterval(sessionCheckInterval);
        }
    }, 60000); // Check every 60 seconds
}

window.addEventListener('adminAuthVerified', startSessionMonitoring);
```

---

## Hide Sensitive Data Until Loaded

```html
<div id="sensitiveData" style="opacity: 0; pointer-events: none;">
    Your sensitive admin data
</div>

<script src="../../js/authAdmin.js"></script>
<script>
    window.addEventListener('adminAuthVerified', () => {
        // Show when auth is verified
        document.getElementById('sensitiveData').style.opacity = '1';
        document.getElementById('sensitiveData').style.pointerEvents = 'auto';
    });
</script>
```

---

## Quick Copy-Paste Complete Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Admin Page</title>
    <style>
        body { font-family: Arial; margin: 0; }
        .navbar { background: #333; color: white; padding: 1rem; display: flex; justify-content: space-between; }
        .content { padding: 2rem; display: none; }
        .loading { text-align: center; padding: 2rem; }
    </style>
    
    <!-- Auth Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../../js/supabase-config.js"></script>
    <script src="../../js/authAdmin.js"></script>
</head>
<body>
    <div class="navbar">
        <h1>🔐 Admin Panel</h1>
        <button onclick="adminAuth.logout()">Logout</button>
    </div>

    <div class="loading">Loading...</div>

    <div class="content" id="content">
        <h2>Welcome, <span id="email">Admin</span>!</h2>
        <p>This page is protected by admin authentication.</p>
    </div>

    <script>
        window.addEventListener('adminAuthVerified', () => {
            const user = adminAuth.getCurrentUser();
            document.getElementById('email').textContent = user.email;
            document.querySelector('.loading').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        });
    </script>
</body>
</html>
```

---

**Copy any snippet above directly into your code!**
