# SEO Implementation Guide

## Overview
This implementation adds comprehensive SEO features including automatic slug generation for Categories and Products, plus location-based SEO optimization.

## Features

### 1. Automatic Slug Generation
- Slugs are automatically generated from the `name` field
- Converts to lowercase
- Replaces spaces with hyphens
- Removes special characters
- Ensures uniqueness by appending numbers if needed

### 2. SEO Meta Fields
Restaurant settings now include:
- **SEO Keywords**: Comma-separated keywords for search engines
- **SEO Description**: Meta description (150-160 characters recommended)
- **Location**: Full address
- **City**: City name (e.g., "Dire Dawa")
- **Country**: Country name (e.g., "Ethiopia")

### 3. Default SEO Configuration
Pre-configured for Simoo Cafe:
- Keywords: "Cafe Dire Dawa, ethiopia, simoo cafe, coffee shop dire dawa, restaurant dire dawa, best cafe ethiopia, ethiopian coffee, dire dawa restaurants"
- Description: "Simoo Cafe - Experience the finest coffee and delicious food in Dire Dawa, Ethiopia"
- Location: Dire Dawa, Ethiopia

## Database Schema

### Category Model
```prisma
model Category {
  id        Int       @id @default(autoincrement())
  name      String
  slug      String?   @unique  // SEO-friendly URL slug
  // ... other fields
  @@index([slug])
}
```

### Product Model
```prisma
model Product {
  id        Int       @id @default(autoincrement())
  name      String
  slug      String?   @unique  // SEO-friendly URL slug
  // ... other fields
  @@index([slug])
}
```

### RestaurantSettings Model
```prisma
model RestaurantSettings {
  id             Int      @id @default(autoincrement())
  name           String
  seoKeywords    String?  // SEO keywords
  seoDescription String?  // Meta description
  location       String?  // Full address
  city           String?  // City name
  country        String?  // Country name
  // ... other fields
}
```

## Setup Instructions

### 1. Run Migrations
```bash
cd backend
npx prisma migrate deploy
```

### 2. Seed SEO Data
```bash
# Option 1: Full seed (includes SEO data)
node seed.js

# Option 2: SEO data only
node seed-seo.js

# Option 3: Generate slugs for existing data
node generate-slugs.js
```

### 3. Verify
```bash
npx prisma studio
```
Check that:
- All categories have slug values
- All products have slug values
- Restaurant settings have SEO fields populated

## Admin Panel Configuration

Navigate to Settings → Restaurant Settings to configure:

1. **Basic Info**
   - Restaurant Name (auto-used in browser title)
   - Subname/Tagline
   - Browser Tab Title

2. **SEO & Location Settings**
   - SEO Keywords (comma-separated)
   - SEO Description (150-160 chars)
   - City
   - Country
   - Full Address

## API Response Examples

### Category with Slug
```json
{
  "id": 1,
  "name": "Beverages",
  "slug": "beverages",
  "nameOr": "Dhugaatii",
  "createdAt": "2026-03-12T00:00:00.000Z"
}
```

### Product with Slug
```json
{
  "id": 1,
  "name": "Ethiopian Coffee",
  "slug": "ethiopian-coffee",
  "description": "Fresh brewed traditional coffee",
  "price": 25.00,
  "categoryId": 1
}
```

### Restaurant Settings with SEO
```json
{
  "id": 1,
  "name": "Simoo Cafe",
  "browserTitle": "Simoo Cafe - Dire Dawa, Ethiopia",
  "seoKeywords": "Cafe Dire Dawa, ethiopia, simoo cafe...",
  "seoDescription": "Experience the finest coffee...",
  "city": "Dire Dawa",
  "country": "Ethiopia",
  "location": "Dire Dawa, Ethiopia"
}
```

## SEO Benefits

1. **Clean URLs**: `/menu/beverages/ethiopian-coffee` instead of `/menu/1/1`
2. **Keyword Rich**: URLs contain actual product/category names
3. **Location-Based SEO**: City and country metadata for local search
4. **Meta Tags**: Proper description and keywords for search engines
5. **Social Sharing**: Open Graph tags for better social media previews
6. **Search Engine Friendly**: Better indexing and ranking

## Frontend Integration

### Using SEO Data
```javascript
import { useBranding } from './context/BrandingContext';

function MyComponent() {
  const { branding } = useBranding();
  
  // Access SEO data
  console.log(branding.seoKeywords);
  console.log(branding.city);
  console.log(branding.country);
}
```

### SEO-Friendly Routing
```javascript
// Before
<Link to={`/product/${product.id}`}>

// After (SEO-friendly)
<Link to={`/product/${product.slug}`}>
```

## HTML Meta Tags

The frontend automatically includes:
- Meta description
- Meta keywords
- Open Graph tags (Facebook)
- Twitter Card tags
- Geo location tags
- Robots meta tag

## Automatic Features

### Browser Title
- Automatically uses restaurant name if no custom title is set
- Format: "{Restaurant Name} - {City}, {Country}"

### Slug Generation
- Automatically generated on create/update
- Handles duplicates with numeric suffixes
- Updates when name changes

## Technical Details

### Slug Generation Logic
Located in: `backend/src/utils/seo.js`

```javascript
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
```

### Controllers Updated
- `categoryController.js` - Auto-generates slugs
- `productController.js` - Auto-generates slugs
- `settingsController.js` - Handles SEO fields

### Database Indexes
- Unique constraint on slug fields
- Index for fast slug lookups
- Optimized for SEO-friendly routing

## Maintenance

### Update SEO Data
1. Login to admin panel
2. Go to Settings tab
3. Update SEO & Location fields
4. Save changes

### Regenerate Slugs
```bash
cd backend
node generate-slugs.js
```

### Backup SEO Data
```bash
pg_dump -U restaurant_user -t restaurant_settings restaurant_db > seo_backup.sql
```

## Best Practices

1. **Keywords**: Use 5-10 relevant keywords, comma-separated
2. **Description**: Keep between 150-160 characters
3. **Location**: Be specific (city, country)
4. **Browser Title**: Include location for local SEO
5. **Update Regularly**: Keep SEO data current

## Troubleshooting

### Slugs not generating
```bash
# Check if migration ran
npx prisma migrate status

# Regenerate slugs
node generate-slugs.js
```

### SEO fields not saving
- Check database migration ran successfully
- Verify Prisma schema is up to date
- Run `npx prisma generate`

### Meta tags not showing
- Clear browser cache
- Check frontend build
- Verify index.html has meta tags
