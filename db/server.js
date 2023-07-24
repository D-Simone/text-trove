const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const { Pool } = require('pg');

// Create a new pool with the appropriate credentials
const pool = new Pool({
  user: 'postgres', // Replace 'your_postgres_user' with your actual PostgreSQL username
  host: 'localhost',
  database: 'saved_templates', // Replace 'saved_templates' with the name of your PostgreSQL database
  password: 'postgres', // Replace 'your_postgres_password' with your actual PostgreSQL password
  port: 5432, // Default port for PostgreSQL is 5432
});

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

// Get templates from the database
app.get('/get-templates', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM templates');
    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch templates from the database:', error);
    res.status(500).json({ error: 'Failed to fetch templates from the database' });
  }
});

// Save a new template to the database
app.post('/submit-template', async (req, res) => {
  const { title, content } = req.body;

  // Validate input
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const result = await pool.query('INSERT INTO templates (title, content, is_default) VALUES ($1, $2, $3) RETURNING *', [title, content, false]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to save template to the database:', error);
    res.status(500).json({ error: 'Failed to save template to the database' });
  }
});

// Delete a template by its ID
app.delete('/delete-template/:id', async (req, res) => {
  const templateId = parseInt(req.params.id);

  try {
    // Check if the template exists in the database
    const result = await pool.query('SELECT * FROM templates WHERE id = $1', [templateId]);
    const template = result.rows[0];

    if (!template || template.is_default) {
      return res.status(404).json({ message: 'Template not found or cannot be deleted.' });
    }

    // Delete the template from the database
    await pool.query('DELETE FROM templates WHERE id = $1', [templateId]);

    return res.json({ message: 'Template deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete template from the database:', error);
    res.status(500).json({ error: 'Failed to delete template from the database' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
