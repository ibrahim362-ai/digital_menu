import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';

// Update Admin credentials
export const updateAdminCredentials = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const adminId = req.user.id; // Fixed: use req.user.id from enhancedAuth middleware

    // Validate input
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const updateData = { email, name };
    
    // Only hash and update password if it's provided and not empty
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
      updateData.passwordChangedAt = new Date();
    }

    const admin = await prisma.admin.update({
      where: { id: adminId },
      data: updateData,
      select: { id: true, email: true, name: true }
    });

    res.json({ 
      message: 'Admin credentials updated successfully', 
      admin: { id: admin.id, email: admin.email, name: admin.name } 
    });
  } catch (error) {
    console.error('Update admin error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to update admin credentials' });
  }
};
