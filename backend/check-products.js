import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    });
    
    console.log('\n📦 Products in Database:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (products.length === 0) {
      console.log('❌ No products found in database!');
      console.log('\nTo add products:');
      console.log('1. Start the backend server: npm start');
      console.log('2. Login to admin panel at http://localhost:5173/admin');
      console.log('3. Add products with images');
    } else {
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Category: ${product.category?.name || 'N/A'}`);
        console.log(`   Image: ${product.image || '❌ NO IMAGE'}`);
        console.log(`   Show in Menu: ${product.showInMenu ? '✅' : '❌'}`);
      });
      
      const productsWithImages = products.filter(p => p.image);
      const productsInMenu = products.filter(p => p.showInMenu);
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n📊 Summary:`);
      console.log(`   Total Products: ${products.length}`);
      console.log(`   With Images: ${productsWithImages.length}`);
      console.log(`   Visible in Menu: ${productsInMenu.length}`);
    }
    
    console.log('\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
