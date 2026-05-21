# Supabase Database Fixes

## Fix dashboard `GET 500` errors

If the admin dashboard logs this response:

```text
42P17: infinite recursion detected in policy for relation "profiles"
```

run `repair_profiles_rls.sql` in the Supabase SQL Editor for the project.

The error is caused by a database RLS policy that reads `public.profiles` while
Supabase is already evaluating an RLS policy on `public.profiles`. React cannot
hide or catch this as a normal UI error because the browser receives a real HTTP
500 from Supabase.
