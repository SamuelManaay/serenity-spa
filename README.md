# Spa Massage Application

## Database Migration: SQLite to Supabase PostgreSQL

This project has been migrated from SQLite to Supabase PostgreSQL for better performance and scalability.

### Setup Instructions

1. Set up your Supabase connection in Netlify:
   - Go to your Netlify site dashboard
   - Navigate to Site settings > Environment variables
   - Add a new variable:
     - Key: `SUPABASE_DATABASE_URL`
     - Value: `postgresql://postgres:[YOUR-PASSWORD]@db.vytmqxiyknrbvayljbyn.supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual Supabase database password

2. For local development, update the `netlify.toml` file:
   - Replace `[YOUR-PASSWORD]` in the SUPABASE_DATABASE_URL with your actual password

3. Deploy to Netlify:
   ```
   netlify deploy
   ```

### Changes Made

- Replaced SQLite with Supabase PostgreSQL
- Updated all database functions to use async/await with PostgreSQL
- Changed database schema to use SERIAL instead of AUTOINCREMENT for IDs
- Added proper parameterized queries for security