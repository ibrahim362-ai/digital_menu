# SEO Implementation Guide

## Overview
This implementation adds automatic SEO-friendly URL slugs to Categories and Products for better search engine optimization.

## Features

### 1. Automatic Slug Generation
- Slugs are automatically generated from the `name` field
- Converts to lowercase
- Replaces spaces with hyphens
- Removes special characters
- Ensures uniqueness by appending numbers if needed

### 2. Examples
| Name | Generated Slug |
|------|----------------|
| "Pizza Margherita" | `pizza-margherita` |
| "Café Latte" | `cafe-latte` |
| "Burger & Fries" | `burger-fries` |
| "Pizza" (duplicate) | `pizza-1` |

### 3. Database Schema
Both `Category` and `Product` models now include:
- `slug` field (unique, indexed)
- Automatic generation on create/update

## Setup Instructions

### 1. Run Migration
```bash
cd backend
npx prisma migrate deploy
```

### 2. Generate Slugs for Existing Data
```bash
node generate-slugs.js
```

This will:
- Generate slugs for all existing categories
- Generate slugs for all existing products
- Ensure all slugs are unique

### 3. Verify
```bash
npx prisma studio
```
Check that all categories and products have slug values.

## API Response Changes

### Category Response
```json
{
  "id": 1,
  "name": "Pizza",
  "slug": "pizza",
  "nameOr": "ፒዛ",
  "createdAt": "2026-03-12T00:00:00.000Z"
}
```

### Product Response
```json
{
  "id": 1,
  "name": "Margherita Pizza",
  "slug": "margherita-pizza",
  "description": "Classic tomato and mozzarella",
  "price": 12.99,
  "categoryId": 1
}
```

## SEO Benefits

1. **Clean URLs**: `/menu/pizza/margherita-pizza` instead of `/menu/1/1`
2. **Keyword Rich**: URLs contain actual product/category names
3. **User Friendly**: Easy to read and remember
4. **Search Engine Friendly**: Better indexing and ranking
5. **Shareable**: More descriptive when shared on social media

## Usage in Frontend

You can now use slugs for routing:

```javascript
// Before
<Link to={`/product/${product.id}`}>

// After (SEO-friendly)
<Link to={`/product/${product.slug}`}>
```

## Automatic Updates

Slugs are automatically:
- Generated when creating new categories/products
- Updated when the name changes
- Made unique if duplicates exist

## Technical Details

### Slug Generation Logic
Located in: `backend/src/utils/seo.js`

- Converts to lowercase
- Replaces spaces with `-`
- Removes special characters
- Handles duplicates with numeric suffixes

### Controllers Updated
- `categoryController.js` - Auto-generates slugs on create/update
- `productController.js` - Auto-generates slugs on create/update

### Database Indexes
- Unique constraint on slug fields
- Index for fast slug lookups
- Optimized for SEO-friendly routing
