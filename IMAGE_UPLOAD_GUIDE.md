# 📸 Image Upload & Display Guide

## ✅ Changes Made

1. **Order Now Button Hidden** ✓
   - The "Order Now" button has been removed from the product detail modal
   - Only "Share" and "Favorite" buttons remain

2. **Image Display Fixed** ✓
   - Product images will display correctly when uploaded
   - Supports multiple images per product
   - Image carousel with navigation arrows
   - Thumbnail preview strip

## 📤 How to Upload Product Images

### From Admin Panel

1. **Login to Admin**
   - Go to: https://simoo.skoolific.com/admin/login
   - Email: ibrahimkamil362@gmail.com
   - Password: Admin@123

2. **Navigate to Products Tab**
   - Click on "Products" in the admin dashboard

3. **Add/Edit Product**
   - Click "Add Product" or edit existing product
   - Fill in product details (name, price, description, category)

4. **Upload Images**
   - Click "Choose Files" in the image upload section
   - Select up to 10 images per product
   - Images will show as thumbnails with remove buttons
   - Click "Add Product" or "Update Product" to save

### Image Requirements

- **Format:** JPG, PNG, GIF
- **Size:** Recommended max 5MB per image
- **Dimensions:** Recommended 800x800px or larger
- **Multiple Images:** Up to 10 images per product

## 🖼️ How Images Display

### Product Cards (Grid View)
- Shows first image or gradient placeholder with first letter
- Hover effect with scale animation
- Category badge overlay

### Product Modal (Detail View)
- Full-size image carousel
- Navigation arrows (left/right)
- Thumbnail strip at bottom
- Image counter badge (e.g., "2 / 5")
- Swipe gesture support on mobile

## 🔧 Image Path Format

Images are stored in: `/var/www/digital_menu/backend/uploads/`

The API serves them at: `https://simoo.skoolific.com/uploads/filename.jpg`

## 🐛 Troubleshooting

### Images Not Displaying?

1. **Check Upload Directory Permissions**
   ```bash
   ssh root@76.13.48.245
   chmod -R 755 /var/www/digital_menu/backend/uploads
   chown -R www-data:www-data /var/www/digital_menu/backend/uploads
   ```

2. **Check Nginx Configuration**
   ```bash
   # Verify uploads location is proxied
   cat /etc/nginx/sites-available/digital-menu | grep uploads
   ```

3. **Check Backend Logs**
   ```bash
   pm2 logs restaurant-backend
   ```

4. **Test Image Upload**
   - Try uploading a small test image (< 1MB)
   - Check browser console for errors (F12)

### No Products Showing?

1. **Add Products from Admin Panel**
   - Login to admin
   - Go to Categories tab → Add categories first
   - Go to Products tab → Add products
   - Toggle "Show in Menu" to make visible

2. **Check Database**
   ```bash
   ssh root@76.13.48.245
   cd /var/www/digital_menu/backend
   node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.product.findMany().then(console.log);"
   ```

## 📝 Sample Product Data

Here's what a product with images looks like in the database:

```json
{
  "id": 1,
  "name": "Burger",
  "price": 150,
  "image": "/uploads/1234567890-burger.jpg,/uploads/1234567891-burger2.jpg",
  "categoryId": 1,
  "showInMenu": true
}
```

Images are stored as comma-separated paths.

## 🎨 Customization

### Change Image Placeholder Color

Edit `frontend/src/pages/Home.jsx`:

```javascript
// Find this line (around line 770):
<div className="h-40 md:h-48 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400">

// Change colors:
<div className="h-40 md:h-48 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
```

### Change Image Aspect Ratio

```javascript
// Current: Square-ish (h-40 md:h-48)
<div className="relative h-40 md:h-48 overflow-hidden">

// Taller: 
<div className="relative h-56 md:h-64 overflow-hidden">

// Wider:
<div className="relative h-32 md:h-40 overflow-hidden">
```

## ✅ Verification

Visit https://simoo.skoolific.com and:

1. ✓ Order Now button should be hidden in product modal
2. ✓ Images should display when products have them
3. ✓ Gradient placeholder shows when no image
4. ✓ Image carousel works with multiple images
5. ✓ Thumbnails show at bottom of modal

---

**Last Updated:** March 12, 2026
