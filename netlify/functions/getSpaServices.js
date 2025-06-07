const db = require('../../db');

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
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
    // Get all services from the spa_services table
    const result = await db.query('SELECT * FROM spa_services ORDER BY name');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data: result.rows })
    };
  } catch (error) {
    console.error('Error fetching services:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch services' })
    };
  }
};