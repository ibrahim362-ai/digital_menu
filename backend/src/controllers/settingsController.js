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

// Get Restaurant Settings
export const getRestaurantSettings = async (req, res) => {
  try {
    let settings = await prisma.restaurantSettings.findFirst();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {
          name: 'My Restaurant',
          subname: 'Delicious Food & Great Service',
          primaryColor: '#d97706'
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant settings' });
  }
};

// Update Restaurant Settings
export const updateRestaurantSettings = async (req, res) => {
  try {
    const { 
      name, 
      subname, 
      logo, 
      favicon, 
      browserTitle, 
      primaryColor,
      seoKeywords,
      seoDescription,
      location,
      city,
      country
    } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ error: 'Restaurant name is required' });
    }

    // Get or create settings
    let settings = await prisma.restaurantSettings.findFirst();
    
    const updateData = {
      name,
      subname: subname || null,
      browserTitle: browserTitle || name, // Auto-use restaurant name if no browser title
      primaryColor: primaryColor || '#d97706',
      seoKeywords: seoKeywords || null,
      seoDescription: seoDescription || null,
      location: location || null,
      city: city || null,
      country: country || null
    };

    // Only update logo if provided
    if (logo !== undefined) {
      updateData.logo = logo;
    }

    // Only update favicon if provided
    if (favicon !== undefined) {
      updateData.favicon = favicon;
    }

    if (settings) {
      settings = await prisma.restaurantSettings.update({
        where: { id: settings.id },
        data: updateData
      });
    } else {
      settings = await prisma.restaurantSettings.create({
        data: updateData
      });
    }

    res.json({ 
      message: 'Restaurant settings updated successfully', 
      settings 
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update restaurant settings' });
  }
};
