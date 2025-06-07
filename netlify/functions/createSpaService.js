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
    const serviceData = JSON.parse(event.body);

    // Validate required fields
    if (!serviceData.name || !serviceData.duration || serviceData.price === undefined || !serviceData.description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Insert the service into the spa_services table
    const result = await db.query(
      `INSERT INTO spa_services (name, duration, price, description, active, icon)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        serviceData.name,
        serviceData.duration,
        serviceData.price,
        serviceData.description,
        serviceData.active !== undefined ? serviceData.active : true,
        serviceData.icon || 'fa-spa'
      ]
    );

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: 'Service created successfully', data: result.rows[0] })
    };
  } catch (error) {
    console.error('Error creating service:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create service' })
    };
  }
};