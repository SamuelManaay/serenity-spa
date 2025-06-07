const db = require('../../db');

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight call successful' })
    };
  }

  try {
    // Parse the request body
    const { id, service } = JSON.parse(event.body);

    // Validate required fields
    if (!id || !service || !service.name || !service.duration || service.price === undefined || !service.description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Update the service in the spa_services table
    const result = await db.query(
      `UPDATE spa_services 
       SET name = $1, duration = $2, price = $3, description = $4, active = $5, icon = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        service.name,
        service.duration,
        service.price,
        service.description,
        service.active !== undefined ? service.active : true,
        service.icon || 'fa-spa',
        id
      ]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Service not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Service updated successfully', data: result.rows[0] })
    };
  } catch (error) {
    console.error('Error updating service:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update service' })
    };
  }
};