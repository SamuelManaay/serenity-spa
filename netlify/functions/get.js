const db = require('../../db');

exports.handler = async (event) => {
  console.log('Get appointments function called');
  
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // Get all appointments
    const result = await db.query('SELECT * FROM appointments ORDER BY datetime DESC');
    const appointments = result.rows;
    console.log(`Retrieved ${appointments.length} appointments`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        data: appointments.map(appointment => ({
          document: appointment,
          _id: appointment.id.toString(),
          _lastmodified: new Date().toISOString()
        }))
      })
    };
  } catch (err) {
    console.error('Error fetching appointments:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};