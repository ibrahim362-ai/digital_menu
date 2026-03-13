import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSEO() {
  try {
    console.log('🔍 Seeding SEO data...');

    // Update or create restaurant settings with SEO data
    let settings = await prisma.restaurantSettings.findFirst();

    const seoData = {
      name: 'Simoo Cafe',
      subname: 'Best Coffee & Food in Dire Dawa',
      browserTitle: 'Simoo Cafe - Dire Dawa, Ethiopia',
      seoKeywords: 'Cafe Dire Dawa, ethiopia, simoo cafe, coffee shop dire dawa, restaurant dire dawa, best cafe ethiopia, ethiopian coffee, dire dawa restaurants',
      seoDescription: 'Simoo Cafe - Experience the finest coffee and delicious food in Dire Dawa, Ethiopia. Your favorite local cafe for authentic Ethiopian cuisine and premium coffee.',
      location: 'Dire Dawa',
      city: 'Dire Dawa',
      country: 'Ethiopia',
      primaryColor: '#d97706'
    };

    if (settings) {
      settings = await prisma.restaurantSettings.update({
        where: { id: settings.id },
        data: seoData
      });
      console.log('✅ Restaurant settings updated with SEO data');
    } else {
      settings = await prisma.restaurantSettings.create({
        data: seoData
      });
      console.log('✅ Restaurant settings created with SEO data');
    }

    console.log('\n📊 SEO Settings:');
    console.log('Name:', settings.name);
    console.log('Location:', settings.city + ', ' + settings.country);
    console.log('Keywords:', settings.seoKeywords);
    console.log('Description:', settings.seoDescription);

    console.log('\n✨ SEO data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding SEO data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedSEO();
