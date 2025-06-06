const db = require('../../db');

exports.handler = async (event) => {
  console.log('Delete appointment function called');
  
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
    const { id } = JSON.parse(event.body);
    console.log('Deleting appointment with ID:', id);
    
    // Delete the appointment
    await db.query('DELETE FROM appointments WHERE id = $1', [id]);
    
    console.log('Appointment deleted successfully');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Appointment deleted successfully' })
    };
  } catch (err) {
    console.error('Error deleting appointment:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};