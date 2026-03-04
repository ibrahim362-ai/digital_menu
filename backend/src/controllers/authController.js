import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;
    
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }
    
    // Find admin by email or name (username)
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: identifier },
          { name: identifier },
        ],
      },
    });
    
    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.adminId } });
    res.json({ id: admin.id, email: admin.email, name: admin.name });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
