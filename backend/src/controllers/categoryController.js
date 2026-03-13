import prisma from '../config/database.js';
import { generateSlug, generateUniqueSlug } from '../utils/seo.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, nameOr, nameAm, nameSo, nameAr } = req.body;
    
    // Generate SEO-friendly slug
    const baseSlug = generateSlug(name);
    const slug = await generateUniqueSlug(
      baseSlug,
      async (slug, excludeId) => {
        const existing = await prisma.category.findUnique({ where: { slug } });
        return existing !== null;
      }
    );
    
    const category = await prisma.category.create({ 
      data: { name, slug, nameOr, nameAm, nameSo, nameAr } 
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, nameOr, nameAm, nameSo, nameAr } = req.body;
    const categoryId = parseInt(req.params.id);
    
    // Generate new slug if name changed
    let slug;
    if (name) {
      const baseSlug = generateSlug(name);
      slug = await generateUniqueSlug(
        baseSlug,
        async (slug, excludeId) => {
          const existing = await prisma.category.findUnique({ where: { slug } });
          return existing !== null && existing.id !== excludeId;
        },
        categoryId
      );
    }
    
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug, nameOr, nameAm, nameSo, nameAr }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
