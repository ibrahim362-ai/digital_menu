import prisma from '../config/database.js';

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, nameOr, nameAm, nameSo, nameAr, description, descriptionOr, descriptionAm, descriptionSo, descriptionAr, price, image, categoryId } = req.body;
    const product = await prisma.product.create({
      data: { 
        name, nameOr, nameAm, nameSo, nameAr,
        description, descriptionOr, descriptionAm, descriptionSo, descriptionAr,
        price: parseFloat(price), 
        image, 
        categoryId: parseInt(categoryId) 
      },
      include: { category: true }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, nameOr, nameAm, nameSo, nameAr, description, descriptionOr, descriptionAm, descriptionSo, descriptionAr, price, image, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        name, nameOr, nameAm, nameSo, nameAr,
        description, descriptionOr, descriptionAm, descriptionSo, descriptionAr,
        price: parseFloat(price), 
        image, 
        categoryId: parseInt(categoryId) 
      },
      include: { category: true }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getMenuProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { showInMenu: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu products' });
  }
};

export const toggleMenuVisibility = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    const updated = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { showInMenu: !product.showInMenu },
      include: { category: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle menu visibility' });
  }
};
