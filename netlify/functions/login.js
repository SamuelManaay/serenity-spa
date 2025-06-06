const bcrypt = require('bcrypt');
const db = require('../../db');

exports.handler = async (event) => {
  console.log('Login function called');
  
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
    console.log('Login attempt for user:', username);
    
    // Find admin by username
    const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];
    console.log('Admin found:', admin ? 'yes' : 'no');
    
    if (!admin) {
      return { 
        statusCode: 401, 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid credentials' }) 
      };
    }
    
    const passwordMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', passwordMatch);
    
    if (!passwordMatch) {
      return { 
        statusCode: 401, 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid credentials' }) 
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Login successful' })
    };
  } catch (err) {
    console.error('Login error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};