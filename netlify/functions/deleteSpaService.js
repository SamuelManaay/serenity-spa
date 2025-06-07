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
    const { id } = JSON.parse(event.body);

    // Validate required fields
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing service ID' })
      };
    }

    // Delete the service from the spa_services table
    const result = await db.query('DELETE FROM spa_services WHERE id = $1', [id]);

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
      body: JSON.stringify({ message: 'Service deleted successfully' })
    };
  } catch (error) {
    console.error('Error deleting service:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete service' })
    };
  }
};