# Supabase Setup Guide for Admin Authentication

Complete step-by-step guide to set up Supabase authentication and database for your admin system.

---

## Part 1: Create the Profiles Table

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com
2. Log in to your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Create Profiles Table

Copy and paste this SQL into the SQL editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'user',
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Add comment
COMMENT ON TABLE profiles IS 'User profiles with role-based access control';
COMMENT ON COLUMN profiles.role IS 'User role - values: admin, moderator, user';
```

Click **Run** (or press Ctrl+Enter).

---

## Part 2: Create an Admin User

### Step 1: Create User in Auth

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **"Add user"** button
3. Enter:
   - **Email:** `admin@school.edu` (use your actual admin email)
   - **Password:** Create a strong password
4. Click **"Create user"**

**Copy the User ID (UUID)** - you'll need it for the next step.

### Step 2: Create Admin Profile

1. Go to **SQL Editor** 
2. Create a new query and run:

```sql
-- Replace 'YOUR_USER_ID' with the UUID from Step 1
INSERT INTO profiles (id, email, role, full_name)
VALUES (
  'YOUR_USER_ID',
  'admin@school.edu',
  'admin',
  'Admin User'
);
```

**Example with actual UUID:**
```sql
INSERT INTO profiles (id, email, role, full_name)
VALUES (
  'a1234567-b890-c123-d456-e78901234567',
  'admin@school.edu',
  'admin',
  'School Administrator'
);
```

Click **Run**.

---

## Part 3: Enable Row Level Security (RLS)

RLS policies protect your data - only authenticated users can access what they should.

### Step 1: Enable RLS on Profiles Table

1. Go to **Authentication** → **Policies** (or **Table Editor**)
2. Click on the **profiles** table
3. Click **Enable RLS** button
4. You'll see a warning - click **Enable** to confirm

### Step 2: Add RLS Policies

Copy and paste each policy into SQL Editor and run:

**Policy 1: Users can read their own profile**
```sql
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);
```

**Policy 2: Authenticated users can read their own profile (alternative)**
```sql
CREATE POLICY "Authenticated users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);
```

**Policy 3: Service role can do everything (for backend)**
```sql
CREATE POLICY "Service role has full access"
  ON profiles
  USING (auth.role() = 'service_role');
```

---

## Part 4: Configure Email Provider (Optional but Recommended)

### Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Click **Email**
3. Toggle **Enable Email provider** ON
4. Configure:
   - **Confirm email** - Toggle ON (users must verify email)
   - **Double confirm change** - Toggle OFF (for testing, enable in production)

### Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize confirmation and reset emails as needed

---

## Part 5: Test the Setup

### Test 1: Verify User Created

1. Go to **Authentication** → **Users**
2. You should see your admin user listed
3. Click on the user to see details

### Test 2: Verify Profile Record

1. Go to **Table Editor**
2. Click on **profiles** table
3. You should see your admin user with `role = 'admin'`

### Test 3: Test Login (Optional)

1. Open your login page: `http://localhost/admin/login.html`
2. Enter:
   - **Email:** `admin@school.edu`
   - **Password:** The password you created
3. Click **Access Admin**
4. Should redirect to dashboard if everything works

---

## Part 6: Create Additional Users (Optional)

### Create a Non-Admin User (for testing)

```sql
-- First, create user in Auth dashboard with email: test@school.edu
-- Then insert profile with role = 'user'
INSERT INTO profiles (id, email, role, full_name)
VALUES (
  'test-user-uuid-here',
  'test@school.edu',
  'user',
  'Test User'
);
```

This user will be denied access to `/admin/` pages.

---

## Part 7: Verify RLS Policies

### Check Policies Applied

1. Go to **Authentication** → **Policies**
2. Or go to **Table Editor** → **profiles** → **RLS** tab
3. You should see the policies listed

### Test Policy with SQL

```sql
-- This tests if RLS is working
-- When you execute as authenticated user, you'll only see YOUR profile
SELECT * FROM profiles;
```

---

## Database Schema Summary

Your profiles table structure:

```
profiles
├── id (UUID) - Primary Key, references auth.users.id
├── email (VARCHAR) - User email
├── role (VARCHAR) - 'admin', 'moderator', 'user', etc.
├── full_name (VARCHAR) - User's full name
├── created_at (TIMESTAMP) - Account creation date
└── updated_at (TIMESTAMP) - Last update date
```

---

## Common Supabase Settings

### CORS Configuration

If you get CORS errors, configure CORS:

1. Go to **Project Settings** → **API**
2. Under **API Preferences**, find **CORS** section
3. Add your domain:
   - Development: `http://localhost:3000`
   - Production: `https://yourschool.edu`

### Authentication Settings

1. Go to **Authentication** → **Providers** → **Email**
2. Configure:
   - Confirm email: ON (user must verify)
   - Redirect URL: Your admin page URL
   - Max frequency: 1 request per 60 seconds

---

## Verify Everything is Working

### Checklist

- [ ] Profiles table created
- [ ] Admin user created in Auth
- [ ] Admin profile record inserted (role = 'admin')
- [ ] RLS enabled on profiles table
- [ ] RLS policies created (at least 1)
- [ ] Login page has auth scripts
- [ ] Admin pages have auth scripts

### Test Login

1. Visit `/admin/login.html`
2. Enter admin username and password
3. Should see "Verifying..." then redirect to dashboard
4. Should NOT see "Not an admin" error

### Test Non-Admin (if created)

1. Visit `/admin/login.html`
2. Enter non-admin email/password
3. Should see error: "does not have admin privileges"

---

## Troubleshooting

### "User not found" error

**Cause:** Email doesn't exist in auth.users  
**Fix:** Create user in Supabase Auth first (Authentication → Users)

### "Profile not found" error

**Cause:** Profile record not in profiles table  
**Fix:** Insert profile record with correct user ID using SQL

### "Access denied" or "RLS policy error"

**Cause:** RLS policy preventing access  
**Fix:** Check RLS policies - ensure one allows read access

### Login page works but can't access other admin pages

**Cause:** Auth scripts not added to pages  
**Fix:** Add these 3 scripts to `<head>` of each admin page:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../../js/supabase-config.js"></script>
<script src="../../js/authAdmin.js"></script>
```

### "role is undefined" in console

**Cause:** Profile doesn't have role column populated  
**Fix:** Update profile with: `UPDATE profiles SET role = 'admin' WHERE id = 'user_id'`

---

## Next Steps

Once Supabase is set up:

1. Test login with admin credentials
2. Add 3 auth scripts to all admin pages (see ADMIN_AUTH_SETUP_GUIDE.md)
3. Add logout button to navbar
4. Test accessing `/admin/` without login (should redirect)
5. Test logout functionality

---

## SQL Cheat Sheet

### View all users
```sql
SELECT id, email, created_at FROM auth.users;
```

### View all profiles
```sql
SELECT id, email, role, created_at FROM profiles ORDER BY created_at DESC;
```

### View all admins
```sql
SELECT id, email, role, created_at FROM profiles WHERE role = 'admin';
```

### Add a new admin
```sql
INSERT INTO profiles (id, email, role, full_name)
VALUES ('user-uuid', 'admin@school.edu', 'admin', 'Admin Name');
```

### Change user role
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'user@school.edu';
```

### Remove user
```sql
DELETE FROM profiles WHERE id = 'user-uuid';
```

### Check RLS policies
```sql
SELECT * FROM information_schema.table_privileges WHERE table_name = 'profiles';
```

---

## Security Best Practices

✅ **DO:**
- Enable email verification
- Use strong passwords
- Enable RLS on all tables
- Use row-level policies
- Only expose anon key in client code
- Use service_role key on backend only

❌ **DON'T:**
- Disable RLS in production
- Expose service_role key
- Put secrets in client code
- Store passwords in profiles table
- Skip email verification

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Auth Setup:** https://supabase.com/docs/guides/auth
- **RLS Policies:** https://supabase.com/docs/guides/auth/row-level-security
- **SQL Editor:** https://supabase.com/docs/guides/database/sql-editor

---

## Quick Setup Checklist

```
SUPABASE SETUP CHECKLIST
========================

STEP 1: Create Table & Users
  ☐ Run SQL to create profiles table
  ☐ Create admin user in Auth
  ☐ Insert admin profile record
  
STEP 2: Configure Security
  ☐ Enable RLS on profiles
  ☐ Add RLS policies
  ☐ Enable email provider
  
STEP 3: Test
  ☐ Verify admin user exists
  ☐ Verify admin profile exists
  ☐ Test login page works
  
STEP 4: Deploy
  ☐ Add auth scripts to all admin pages
  ☐ Add logout button to navbar
  ☐ Test end-to-end authentication

DONE! ✓
```

---

For questions about specific SQL or Supabase features, check the Supabase documentation.
