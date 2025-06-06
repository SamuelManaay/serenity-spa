const bcrypt = require('bcrypt');
const db = require('./db');

async function initializeDatabase() {
  try {
    console.log('Dropping existing tables if they exist...');
    await db.query(`
      DROP TABLE IF EXISTS admins;
      DROP TABLE IF EXISTS appointments;
    `);
    
    console.log('Creating tables...');
    await db.query(`
      CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255)
      );
    `);
    
    await db.query(`
      CREATE TABLE appointments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        contact_number VARCHAR(255),
        service VARCHAR(255),
        datetime VARCHAR(255),
        request TEXT
      );
    `);
    console.log('Database tables created');
    
    console.log('Creating default admin user: admin/admin');
    const hash = await bcrypt.hash('admin', 10);
    await db.query(
      'INSERT INTO admins (username, password) VALUES ($1, $2)',
      ['admin', hash]
    );
    console.log('Default admin created');
    
    console.log('Database initialization complete');
  } catch (err) {
    console.error('Database initialization error:', err);
  } finally {
    // Close the pool
    db.pool.end();
  }
}

// Run initialization
initializeDatabase();