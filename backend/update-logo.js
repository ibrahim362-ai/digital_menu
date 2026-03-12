import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateLogo() {
  try {
    console.log('🔄 Updating restaurant logo...\n');

    // Find existing settings
    let settings = await prisma.restaurantSettings.findFirst();

    if (settings) {
      // Update existing settings
      await prisma.restaurantSettings.update({
        where: { id: settings.id },
        data: { logo: '/logo.png' }
      });
      console.log('✅ Logo updated successfully!');
    } else {
      // Create new settings with logo
      await prisma.restaurantSettings.create({
        data: {
          name: 'Restaurant',
          subname: 'Delicious Food',
          browserTitle: 'Restaurant Management',
          primaryColor: '#d97706',
          logo: '/logo.png'
        }
      });
      console.log('✅ Settings created with logo!');
    }

    console.log('\n📝 Logo path: /logo.png');
    console.log('🔄 Please refresh your browser to see the changes.\n');
  } catch (error) {
    console.error('❌ Failed to update logo:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateLogo();
