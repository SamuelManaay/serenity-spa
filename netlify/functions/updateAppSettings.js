const db = require('../../db');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Preflight call successful' }) };
  }

  try {
    const settings = JSON.parse(event.body);

    // Check if settings exist
    const existing = await db.query('SELECT id FROM app_settings LIMIT 1');
    
    let result;
    if (existing.rows.length > 0) {
      // Update existing settings
      result = await db.query(
        `UPDATE app_settings SET 
         color_theme = $1, contact_number = $2, app_name = $3, 
         app_desc = $4, email = $5, app_logo = $6 
         WHERE id = $7 RETURNING *`,
        [settings.color_theme, settings.contact_number, settings.app_name, 
         settings.app_desc, settings.email, settings.app_logo, existing.rows[0].id]
      );
    } else {
      // Insert new settings
      result = await db.query(
        `INSERT INTO app_settings (color_theme, contact_number, app_name, app_desc, email, app_logo) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [settings.color_theme, settings.contact_number, settings.app_name, 
         settings.app_desc, settings.email, settings.app_logo]
      );
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Settings updated successfully', data: result.rows[0] })
    };
  } catch (error) {
    console.error('Error updating app settings:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update app settings' })
    };
  }
};