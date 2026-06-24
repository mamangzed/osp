/**
 * OSP HTTP API Gateway
 *
 * Allows PHP/backends to use OSP via REST API
 * Translates HTTP requests to OSP protocol
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { OSPClient } from '@owl/osp-sdk';

dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// Initialize OSP client
const osp = new OSPClient({
  host: process.env.OSP_HOST || 'localhost',
  port: parseInt(process.env.OSP_PORT || '9420'),
  token: process.env.OSP_TOKEN || 'gateway-token'
});

// Connect to OSP on startup
let ospConnected = false;
(async () => {
  try {
    await osp.connect();
    ospConnected = true;
    console.log('[Gateway] Connected to OSP server');
  } catch (error) {
    console.error('[Gateway] Failed to connect to OSP:', error.message);
  }
})();

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    ospConnected,
    timestamp: Date.now()
  });
});

// Authentication middleware (optional - for securing gateway endpoints)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// POST /api/set - Create or update a record
app.post('/api/set', async (req, res) => {
  try {
    const { collection, recordId, fields } = req.body;

    if (!collection || !recordId || !fields) {
      return res.status(400).json({
        error: 'Missing required fields: collection, recordId, fields'
      });
    }

    if (!ospConnected) {
      return res.status(503).json({ error: 'OSP server not connected' });
    }

    await osp.set(collection, recordId, fields);

    res.json({
      success: true,
      message: 'Record updated',
      data: { collection, recordId }
    });

  } catch (error) {
    console.error('[Gateway] Error in /api/set:', error);
    res.status(500).json({
      error: 'Failed to update record',
      details: error.message
    });
  }
});

// DELETE /api/delete - Delete a record
app.delete('/api/delete', async (req, res) => {
  try {
    const { collection, recordId } = req.body;

    if (!collection || !recordId) {
      return res.status(400).json({
        error: 'Missing required fields: collection, recordId'
      });
    }

    if (!ospConnected) {
      return res.status(503).json({ error: 'OSP server not connected' });
    }

    await osp.delete(collection, recordId);

    res.json({
      success: true,
      message: 'Record deleted',
      data: { collection, recordId }
    });

  } catch (error) {
    console.error('[Gateway] Error in /api/delete:', error);
    res.status(500).json({
      error: 'Failed to delete record',
      details: error.message
    });
  }
});

// POST /api/restore - Restore a deleted record
app.post('/api/restore', async (req, res) => {
  try {
    const { collection, recordId } = req.body;

    if (!collection || !recordId) {
      return res.status(400).json({
        error: 'Missing required fields: collection, recordId'
      });
    }

    if (!ospConnected) {
      return res.status(503).json({ error: 'OSP server not connected' });
    }

    await osp.restore(collection, recordId);

    res.json({
      success: true,
      message: 'Record restored',
      data: { collection, recordId }
    });

  } catch (error) {
    console.error('[Gateway] Error in /api/restore:', error);
    res.status(500).json({
      error: 'Failed to restore record',
      details: error.message
    });
  }
});

// POST /api/subscribe - Subscribe to a collection
app.post('/api/subscribe', async (req, res) => {
  try {
    const { collection } = req.body;

    if (!collection) {
      return res.status(400).json({
        error: 'Missing required field: collection'
      });
    }

    if (!ospConnected) {
      return res.status(503).json({ error: 'OSP server not connected' });
    }

    await osp.subscribe(collection);

    res.json({
      success: true,
      message: 'Subscribed to collection',
      data: { collection }
    });

  } catch (error) {
    console.error('[Gateway] Error in /api/subscribe:', error);
    res.status(500).json({
      error: 'Failed to subscribe',
      details: error.message
    });
  }
});

// POST /api/unsubscribe - Unsubscribe from a collection
app.post('/api/unsubscribe', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        error: 'Missing required field: subscriptionId'
      });
    }

    if (!ospConnected) {
      return res.status(503).json({ error: 'OSP server not connected' });
    }

    await osp.unsubscribe(subscriptionId);

    res.json({
      success: true,
      message: 'Unsubscribed from collection',
      data: { subscriptionId }
    });

  } catch (error) {
    console.error('[Gateway] Error in /api/unsubscribe:', error);
    res.status(500).json({
      error: 'Failed to unsubscribe',
      details: error.message
    });
  }
});

// POST /api/auth/token - Generate JWT token (for securing gateway endpoints)
app.post('/api/auth/token', (req, res) => {
  const { userId, role } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: 'Missing required field: userId'
    });
  }

  const token = jwt.sign(
    { userId, role: role || 'user' },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    expiresIn: 86400 // 24 hours in seconds
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Gateway] Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Gateway] HTTP API Gateway running on http://localhost:${PORT}`);
  console.log(`[Gateway] OSP Server: ${process.env.OSP_HOST || 'localhost'}:${process.env.OSP_PORT || 9420}`);
});
