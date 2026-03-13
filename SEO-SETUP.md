# SEO Setup Guide - Simoo Cafe

## ✅ What Was Added

### 1. SEO-Friendly URL Slugs
- Categories: `/menu/beverages` instead of `/menu/1`
- Products: `/menu/beverages/ethiopian-coffee` instead of `/menu/1/1`

### 2. Location-Based SEO
- City: Dire Dawa
- Country: Ethiopia
- Full address support

### 3. SEO Meta Fields
- Keywords: "Cafe Dire Dawa, ethiopia, simoo cafe, coffee shop dire dawa..."
- Description: Optimized for search engines
- Open Graph tags for social media
- Twitter Card tags

### 4. Auto Browser Title
- Automatically uses restaurant name: "Simoo Cafe - Dire Dawa, Ethiopia"

## 🚀 Quick Setup

### Step 1: Apply Database Migrations
```bash
cd backend
npx prisma migrate deploy
```

### Step 2: Seed SEO Data
```bash
# Full seed (recommended for new installations)
node seed.js

# Or just SEO data
node seed-seo.js

# Or generate slugs for existing data
node generate-slugs.js
```

### Step 3: Restart Backend
```bash
pm2 restart restaurant-backend
# Or if running locally:
npm start
```

### Step 4: Rebuild Frontend
```bash
cd ../frontend
npm run build
```

## 📝 Configure in Admin Panel

1. Login to admin panel: `/admin`
2. Go to **Settings** tab
3. Scroll to **SEO & Location Settings**
4. Fill in:
   - **SEO Keywords**: Cafe Dire Dawa, ethiopia, simoo cafe, coffee shop
   - **SEO Description**: Brief description (150-160 characters)
   - **City**: Dire Dawa
   - **Country**: Ethiopia
   - **Full Address**: Your complete address

## 🎯 Default Configuration

Pre-configured for Simoo Cafe:

```
Restaurant Name: Simoo Cafe
Browser Title: Simoo Cafe - Dire Dawa, Ethiopia
Keywords: Cafe Dire Dawa, ethiopia, simoo cafe, coffee shop dire dawa, 
          restaurant dire dawa, best cafe ethiopia, ethiopian coffee, 
          dire dawa restaurants
Description: Simoo Cafe - Experience the finest coffee and delicious 
             food in Dire Dawa, Ethiopia. Your favorite local cafe for 
             authentic Ethiopian cuisine and premium coffee.
City: Dire Dawa
Country: Ethiopia
```

## 🔍 SEO Benefits

### Before
- URL: `http://yoursite.com/menu/1/1`
- Title: "Digital Menu"
- No meta description
- No location data

### After
- URL: `http://yoursite.com/menu/beverages/ethiopian-coffee`
- Title: "Simoo Cafe - Dire Dawa, Ethiopia"
- Meta description with keywords
- Location: Dire Dawa, Ethiopia
- Open Graph tags for social sharing

## 📊 What Gets Optimized

### 1. URLs (Slugs)
Every category and product gets a clean URL:
- "Ethiopian Coffee" → `ethiopian-coffee`
- "Fresh Juice" → `fresh-juice`
- "Burger & Fries" → `burger-fries`

### 2. HTML Meta Tags
```html
<title>Simoo Cafe - Dire Dawa, Ethiopia</title>
<meta name="description" content="Experience the finest coffee..." />
<meta name="keywords" content="Cafe Dire Dawa, ethiopia, simoo cafe..." />
<meta property="og:title" content="Simoo Cafe - Dire Dawa, Ethiopia" />
<meta name="geo.placename" content="Dire Dawa" />
```

### 3. Search Engine Visibility
- Better ranking for "cafe dire dawa"
- Better ranking for "restaurant ethiopia"
- Better ranking for "simoo cafe"
- Local search optimization

## 🛠️ Verify Setup

### Check Database
```bash
npx prisma studio
```
Verify:
- ✅ Categories have `slug` field populated
- ✅ Products have `slug` field populated
- ✅ RestaurantSettings has SEO fields

### Check Frontend
1. Open your site
2. View page source (Ctrl+U)
3. Look for meta tags:
   - `<meta name="keywords" ...>`
   - `<meta name="description" ...>`
   - `<meta property="og:title" ...>`

### Check Admin Panel
1. Login to `/admin`
2. Go to Settings
3. Verify SEO fields are visible and editable

## 📱 Update SEO Anytime

1. Login to admin panel
2. Settings → Restaurant Settings
3. Update SEO & Location fields
4. Click "Update Restaurant Settings"
5. Changes apply immediately!

## 🌐 For Production Server

After deploying to your server (76.13.48.245):

```bash
ssh root@76.13.48.245
cd /root/digital_menu/backend
npx prisma migrate deploy
node seed-seo.js
pm2 restart restaurant-backend
```

## 📈 Monitor SEO Performance

Use these tools to check your SEO:
- Google Search Console
- Google My Business (for local SEO)
- Bing Webmaster Tools
- Check rankings for "cafe dire dawa"

## 💡 SEO Best Practices

1. **Keep keywords relevant**: Focus on location + service
2. **Update description**: Keep it under 160 characters
3. **Use location**: Always include city and country
4. **Update regularly**: Keep menu items current
5. **Add images**: Products with images rank better

## 🆘 Troubleshooting

### Slugs not showing
```bash
cd backend
node generate-slugs.js
pm2 restart restaurant-backend
```

### SEO fields not saving
```bash
npx prisma migrate status
npx prisma generate
```

### Meta tags not updating
- Clear browser cache
- Rebuild frontend: `npm run build`
- Hard refresh: Ctrl+Shift+R

---

**Your restaurant is now SEO-optimized for Dire Dawa, Ethiopia! 🎉**
