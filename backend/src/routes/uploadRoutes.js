import express from 'express';
import { upload } from '../middleware/upload.js';
import { adminAuth } from '../middleware/enhancedAuth.js';

const router = express.Router();

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

export default router;
