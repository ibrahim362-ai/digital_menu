import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(text) {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function generateUniqueSlug(baseSlug, model, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma[model].findUnique({ where: { slug } });
    if (!existing || (excludeId && existing.id === excludeId)) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

async function generateSlugsForCategories() {
  console.log('Generating slugs for categories...');
  const categories = await prisma.category.findMany();
  
  for (const category of categories) {
    if (!category.slug) {
      const baseSlug = generateSlug(category.name);
      const slug = await generateUniqueSlug(baseSlug, 'category', category.id);
      
      await prisma.category.update({
        where: { id: category.id },
        data: { slug }
      });
      
      console.log(`✓ Category "${category.name}" → slug: "${slug}"`);
    }
  }
}

async function generateSlugsForProducts() {
  console.log('\nGenerating slugs for products...');
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    if (!product.slug) {
      const baseSlug = generateSlug(product.name);
      const slug = await generateUniqueSlug(baseSlug, 'product', product.id);
      
      await prisma.product.update({
        where: { id: product.id },
        data: { slug }
      });
      
      console.log(`✓ Product "${product.name}" → slug: "${slug}"`);
    }
  }
}

async function main() {
  try {
    await generateSlugsForCategories();
    await generateSlugsForProducts();
    console.log('\n✅ All slugs generated successfully!');
  } catch (error) {
    console.error('❌ Error generating slugs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
