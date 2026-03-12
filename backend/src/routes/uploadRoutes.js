import express from 'express';
import { upload } from '../middleware/upload.js';
import { adminAuth } from '../middleware/enhancedAuth.js';

const router = express.Router();

// Single image upload
router.post('/', adminAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Multiple images upload (up to 10 images)
router.post('/multiple', adminAuth, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls: imageUrls });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
