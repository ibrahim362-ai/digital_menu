import prisma from '../config/database.js';

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
    const category = await prisma.category.create({ 
      data: { name, nameOr, nameAm, nameSo, nameAr } 
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, nameOr, nameAm, nameSo, nameAr } = req.body;
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name, nameOr, nameAm, nameSo, nameAr }
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
