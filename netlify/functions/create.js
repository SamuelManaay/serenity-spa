const db = require('../../db');

exports.handler = async (event) => {
  console.log('Create appointment function called');
  
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
    const { name, email, contact_number, service, datetime, request } = JSON.parse(event.body);
    console.log('Creating appointment for:', name);
    
    // Insert appointment
    const result = await db.query(
      `INSERT INTO appointments (name, email, contact_number, service, datetime, request)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, email, contact_number, service, datetime, request]
    );
    console.log('Appointment created successfully, result:', result.rows[0]);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Appointment saved' })
    };
  } catch (err) {
    console.error('Error saving appointment:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};