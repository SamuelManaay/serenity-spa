const db = require('../../db');

exports.handler = async (event) => {
  console.log('Update appointment function called');
  
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
    const { id, booking } = JSON.parse(event.body);
    console.log('Updating appointment with ID:', id);
    
    // Update the appointment
    await db.query(
      `UPDATE appointments SET 
        name = $1, 
        email = $2, 
        contact_number = $3, 
        service = $4, 
        datetime = $5, 
        request = $6
      WHERE id = $7`,
      [
        booking.name, 
        booking.email, 
        booking.contact_number, 
        booking.service, 
        booking.datetime, 
        booking.request, 
        id
      ]
    );
    
    console.log('Appointment updated successfully');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Appointment updated successfully' })
    };
  } catch (err) {
    console.error('Error updating appointment:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};