const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL || 'postgresql://postgres:S@m072394@db.vytmqxiyknrbvayljbyn.supabase.co:5432/postgres?sslmode=require'
});

// Initialize database tables
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
      );
      
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        contact_number TEXT,
        service TEXT,
        datetime TEXT,
        request TEXT
      );
    `);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Helper functions
module.exports = {
  pool,
  initDb,
  
  getAdminByUsername: async (username) => {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    return result.rows[0];
  },
  
  getAllAdmins: async () => {
    const result = await pool.query('SELECT * FROM admins');
    return result.rows;
  },
  
  createAdmin: async (username, hashedPassword) => {
    try {
      const result = await pool.query(
        'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id',
        [username, hashedPassword]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error creating admin:', err);
      throw err;
    }
  },
  
  getAllAppointments: async () => {
    const result = await pool.query('SELECT * FROM appointments ORDER BY datetime DESC');
    return result.rows;
  },
  
  createAppointment: async (name, email, contact_number, service, datetime, request) => {
    try {
      const result = await pool.query(
        `INSERT INTO appointments (name, email, contact_number, service, datetime, request)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [name, email, contact_number, service, datetime, request]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error creating appointment:', err);
      throw err;
    }
  }
};