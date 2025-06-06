const bcrypt = require('bcrypt');
const db = require('../../db');

exports.handler = async (event) => {
  console.log('Register function called');
  
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    console.log('Registering user:', username);
    
    // Check if username already exists
    const checkResult = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (checkResult.rows.length > 0) {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Username already exists' })
      };
    }
    
    const hash = await bcrypt.hash(password, 10);
    console.log('Password hashed');
    
    // Insert new admin
    const result = await db.query(
      'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id',
      [username, hash]
    );
    console.log('Admin inserted into database, result:', result.rows[0]);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Admin registered' })
    };
  } catch (err) {
    console.error('Registration error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};