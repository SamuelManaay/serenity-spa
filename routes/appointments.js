import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    service TEXT NOT NULL,
    datetime TIMESTAMP NOT NULL,
    request TEXT
  )
`);

router.post('/', async (req, res) => {
  const { name, email, contact_number, service, datetime, request } = req.body;
  try {
    await pool.query(
      `INSERT INTO appointments (name, email, contact_number, service, datetime, request)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, contact_number, service, datetime, request]
    );
    res.status(201).json({ message: 'Appointment created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert appointment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments ORDER BY datetime DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

export default router;
