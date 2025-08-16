const db = require('../../db');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Preflight call successful' }) };
  }

  try {
    const result = await db.query('SELECT * FROM app_settings ORDER BY id DESC LIMIT 1');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data: result.rows[0] || null })
    };
  } catch (error) {
    console.error('Error fetching app settings:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch app settings' })
    };
  }
};