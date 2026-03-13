import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'ibrahimkamil362@gmail.com' },
    update: {
      password: hashedPassword,
      isActive: true,
    },
    create: {
      email: 'ibrahimkamil362@gmail.com',
      password: hashedPassword,
      name: 'Admin User',
      isActive: true,
    }
  });
  console.log('✅ Admin user created');

  // Create restaurant settings
  const settings = await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {
      logo: '/logo.png',
      seoKeywords: 'Cafe Dire Dawa, ethiopia, simoo cafe, coffee shop dire dawa, restaurant dire dawa, best cafe ethiopia, ethiopian coffee, dire dawa restaurants',
      seoDescription: 'Simoo Cafe - Experience the finest coffee and delicious food in Dire Dawa, Ethiopia. Your favorite local cafe for authentic Ethiopian cuisine and premium coffee.',
      location: 'Dire Dawa',
      city: 'Dire Dawa',
      country: 'Ethiopia',
    },
    create: {
      name: 'Simoo Cafe',
      subname: 'Best Coffee & Food in Dire Dawa',
      browserTitle: 'Simoo Cafe - Dire Dawa, Ethiopia',
      primaryColor: '#d97706',
      logo: '/logo.png',
      seoKeywords: 'Cafe Dire Dawa, ethiopia, simoo cafe, coffee shop dire dawa, restaurant dire dawa, best cafe ethiopia, ethiopian coffee, dire dawa restaurants',
      seoDescription: 'Simoo Cafe - Experience the finest coffee and delicious food in Dire Dawa, Ethiopia. Your favorite local cafe for authentic Ethiopian cuisine and premium coffee.',
      location: 'Dire Dawa',
      city: 'Dire Dawa',
      country: 'Ethiopia',
    }
  });
  console.log('✅ Restaurant settings created with SEO data');

  // Create categories
  const beverages = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Beverages',
      nameOr: 'Dhugaatii',
      nameAm: 'መጠጦች',
      nameSo: 'Cabitaanno',
      nameAr: 'مشروبات',
    }
  });

  const food = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Food',
      nameOr: 'Nyaata',
      nameAm: 'ምግብ',
      nameSo: 'Cunto',
      nameAr: 'طعام',
    }
  });
  console.log('✅ Categories created');

  // Create sample products
  await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Coffee',
      nameOr: 'Buna',
      nameAm: 'ቡና',
      nameSo: 'Qaxwe',
      nameAr: 'قهوة',
      description: 'Fresh brewed coffee',
      descriptionOr: 'Buna haaraa',
      descriptionAm: 'ትኩስ የተጠበሰ ቡና',
      descriptionSo: 'Qaxwe cusub',
      descriptionAr: 'قهوة طازجة',
      price: 25.00,
      categoryId: beverages.id,
      showInMenu: true,
    }
  });

  await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Tea',
      nameOr: 'Shaayii',
      nameAm: 'ሻይ',
      nameSo: 'Shaah',
      nameAr: 'شاي',
      description: 'Hot tea with milk',
      price: 20.00,
      categoryId: beverages.id,
      showInMenu: true,
    }
  });

  await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Burger',
      nameOr: 'Burger',
      nameAm: 'በርገር',
      nameSo: 'Burger',
      nameAr: 'برجر',
      description: 'Beef burger with cheese',
      price: 80.00,
      categoryId: food.id,
      showInMenu: true,
    }
  });

  await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Pizza',
      nameOr: 'Pizza',
      nameAm: 'ፒዛ',
      nameSo: 'Pizza',
      nameAr: 'بيتزا',
      description: 'Margherita pizza',
      price: 120.00,
      categoryId: food.id,
      showInMenu: true,
    }
  });
  console.log('✅ Sample products created');

  console.log('\n✅ Seed completed successfully!\n');
  console.log('📝 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email:    ibrahimkamil362@gmail.com');
  console.log('Password: Admin@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n⚠️  IMPORTANT: Change these credentials in production!\n');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
