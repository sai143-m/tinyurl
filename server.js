import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Initialize database
async function initializeDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        short_code VARCHAR(8) UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        clicks INT DEFAULT 0,
        last_clicked TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_short_code ON links(short_code);
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// URL validation helper
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Generate short code (6 alphanumeric characters)
function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Create shortened link
app.post('/api/links', async (req, res) => {
  try {
    const { original_url, custom_code } = req.body;

    if (!original_url || !isValidUrl(original_url)) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    let short_code = custom_code || generateShortCode();

    if (custom_code && !/^[a-zA-Z0-9]{6,8}$/.test(custom_code)) {
      return res.status(400).json({ error: 'Custom code must be 6-8 alphanumeric characters' });
    }

    const existing = await pool.query(
      'SELECT * FROM links WHERE short_code = $1',
      [short_code]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Short code already exists' });
    }

    const result = await pool.query(
      'INSERT INTO links (short_code, original_url) VALUES ($1, $2) RETURNING *',
      [short_code, original_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all links
app.get('/api/links', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, short_code, original_url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific link stats
app.get('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query(
      'SELECT * FROM links WHERE short_code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete link
app.delete('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query(
      'DELETE FROM links WHERE short_code = $1 RETURNING *',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect endpoint - increment clicks and redirect
// CRITICAL: Redirect endpoint - MUST be LAST
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    console.log(`🔗 Redirect request for code: ${code}`);
    
    const result = await pool.query(
      'SELECT * FROM links WHERE short_code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      console.log(`❌ Code not found: ${code}`);
      return res.status(404).json({ error: 'Link not found' });
    }

    const link = result.rows[0];

    // Update click count
    await pool.query(
      'UPDATE links SET clicks = clicks + 1, last_clicked = NOW(), updated_at = NOW() WHERE id = $1',
      [link.id]
    );

    console.log(`✅ Redirecting to: ${link.original_url}`);
    
    // CRITICAL: Use 302 redirect
    return res.redirect(302, link.original_url);
    
  } catch (error) {
    console.error('❌ Error in redirect:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Initialize and start server
initializeDb().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;