import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Globe, 
  ChefHat, 
  Sparkles, 
  Star, 
  TrendingUp,
  Search,
  Filter,
  ShoppingBag,
  DollarSign,
  Clock,
  Users,
  X,
  Info,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

const translations = {
  en: {
    title: 'Digital Menu',
    subtitle: 'Browse our delicious offerings',
    loading: 'Loading menu...',
    noItems: 'No menu items available at the moment.',
    checkBack: 'Please check back later!',
    allItems: 'All Items',
    staffAccess: 'Staff Access:',
    admin: 'Admin',
    cashier: 'Cashier',
    kitchen: 'Kitchen',
    featured: 'Featured Items',
    popular: 'Popular',
    new: 'New',
    builtBy: 'Built by',
    version: 'Version'
  },
  or: {
    title: 'Menyuu Dijitaalaa',
    subtitle: 'Nyaata keenya mi\'aawaa ilaali',
    loading: 'Menyuu fe\'aa jira...',
    noItems: 'Yeroo ammaa meeshaaleen menyuu hin jiran.',
    checkBack: 'Maaloo booda deebi\'ii ilaali!',
    allItems: 'Meeshaalee Hunda',
    staffAccess: 'Hojjettoonni:',
    admin: 'Bulchaa',
    cashier: 'Kaashiyera',
    kitchen: 'Mana Nyaataa',
    featured: 'Meeshaalee Addaa',
    popular: 'Jaallatamaa',
    new: 'Haaraa',
    builtBy: 'Kan ijaarame',
    version: 'Gosa'
  },
  am: {
    title: 'ዲጂታል ምናሌ',
    subtitle: 'ጣፋጭ ምግቦቻችንን ይመልከቱ',
    loading: 'ምናሌ በመጫን ላይ...',
    noItems: 'በአሁኑ ጊዜ ምናሌ እቃዎች የሉም።',
    checkBack: 'እባክዎ ቆይተው ይመልከቱ!',
    allItems: 'ሁሉም እቃዎች',
    staffAccess: 'ሰራተኞች:',
    admin: 'አስተዳዳሪ',
    cashier: 'ገንዘብ ተቀባይ',
    kitchen: 'ኩሽና',
    featured: 'ተመራጭ እቃዎች',
    popular: 'ተወዳጅ',
    new: 'አዲስ',
    builtBy: 'የተገነባው በ',
    version: 'ስሪት'
  },
  so: {
    title: 'Liiska Dijitaalka ah',
    subtitle: 'Eeg waxyaalaha macaan ee aan hayno',
    loading: 'Liiska waa la soo rarayo...',
    noItems: 'Hadda liiska cunto ma jiro.',
    checkBack: 'Fadlan mar dambe soo noqo!',
    allItems: 'Dhammaan Alaabta',
    staffAccess: 'Shaqaalaha:',
    admin: 'Maamule',
    cashier: 'Lacag-bixiye',
    kitchen: 'Jikada',
    featured: 'Alaabta Muhiimka ah',
    popular: 'Caanka ah',
    new: 'Cusub',
    builtBy: 'Waxaa dhisay',
    version: 'Nooca'
  },
  ar: {
    title: 'القائمة الرقمية',
    subtitle: 'تصفح عروضنا اللذيذة',
    loading: 'جاري تحميل القائمة...',
    noItems: 'لا توجد عناصر قائمة متاحة في الوقت الحالي.',
    checkBack: 'يرجى المراجعة لاحقاً!',
    allItems: 'جميع العناصر',
    staffAccess: 'وصول الموظفين:',
    admin: 'المسؤول',
    cashier: 'أمين الصندوق',
    kitchen: 'المطبخ',
    featured: 'العناصر المميزة',
    popular: 'شائع',
    new: 'جديد',
    builtBy: 'بناه',
    version: 'الإصدار'
  }
};

export default function Home() {
  const [menuProducts, setMenuProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'Digital Menu',
    subname: 'Browse our delicious offerings',
    logo: null,
    primaryColor: '#d97706'
  });
  const [dragX, setDragX] = useState(0);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    fetchMenuProducts();
    fetchRestaurantSettings();
  }, []);

  // Update CSS variables when restaurant settings change
  useEffect(() => {
    if (restaurantSettings.primaryColor) {
      // Convert hex to RGB for CSS variables
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const rgb = hexToRgb(restaurantSettings.primaryColor);
      if (rgb) {
        document.documentElement.style.setProperty('--color-primary', restaurantSettings.primaryColor);
        document.documentElement.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        
        // Calculate lighter and darker variants
        const lighterColor = `#${Math.min(255, rgb.r + 40).toString(16).padStart(2, '0')}${Math.min(255, rgb.g + 40).toString(16).padStart(2, '0')}${Math.min(255, rgb.b + 40).toString(16).padStart(2, '0')}`;
        const darkerColor = `#${Math.max(0, rgb.r - 40).toString(16).padStart(2, '0')}${Math.max(0, rgb.g - 40).toString(16).padStart(2, '0')}${Math.max(0, rgb.b - 40).toString(16).padStart(2, '0')}`;
        
        document.documentElement.style.setProperty('--color-primary-light', lighterColor);
        document.documentElement.style.setProperty('--color-primary-dark', darkerColor);
      }
    }
  }, [restaurantSettings.primaryColor]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const fetchRestaurantSettings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/settings/restaurant`);
      setRestaurantSettings({
        name: data.name || 'Digital Menu',
        subname: data.subname || 'Browse our delicious offerings',
        logo: data.logo || null,
        primaryColor: data.primaryColor || '#d97706'
      });
    } catch (err) {
      console.error('Failed to fetch restaurant settings');
    }
  };

  const fetchMenuProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products/menu`);
      setMenuProducts(data);
      
      // Extract unique categories by id
      const categoryMap = new Map();
      data.forEach(p => {
        if (p.category && !categoryMap.has(p.category.id)) {
          categoryMap.set(p.category.id, p.category);
        }
      });
      const uniqueCategories = Array.from(categoryMap.values());
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch menu products');
      setLoading(false);
    }
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  const getLocalizedText = (item, field) => {
    const langMap = {
      en: field,
      or: `${field}Or`,
      am: `${field}Am`,
      so: `${field}So`,
      ar: `${field}Ar`
    };
    return item[langMap[language]] || item[field];
  };

  const filteredProducts = menuProducts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category.id === selectedCategory;
    const matchesSearch = getLocalizedText(p, 'name').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'or', name: 'Afaan Oromo', flag: '🇪🇹' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'so', name: 'Soomaali', flag: '🇸🇴' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Helper function to get product images as array
  const getProductImages = (product) => {
    if (!product.image) return [];
    
    // Try to parse as JSON array
    try {
      const parsed = JSON.parse(product.image);
      return Array.isArray(parsed) ? parsed : [product.image];
    } catch {
      // If not JSON, check if comma-separated
      if (product.image.includes(',')) {
        return product.image.split(',').map(img => img.trim());
      }
      // Single image
      return [product.image];
    }
  };

  // Reset image index when product changes
  useEffect(() => {
    if (selectedProduct) {
      setCurrentImageIndex(0);
      setDragX(0);
    }
  }, [selectedProduct]);

  const handlePrevImage = () => {
    const images = getProductImages(selectedProduct);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const images = getProductImages(selectedProduct);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Swipe gesture handler for image carousel
  const handleDragEnd = (event, info) => {
    const images = getProductImages(selectedProduct);
    const swipeThreshold = 50; // Minimum swipe distance
    
    if (info.offset.x > swipeThreshold) {
      // Swiped right - go to previous image
      handlePrevImage();
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left - go to next image
      handleNextImage();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`backdrop-blur-md border-b-4 sticky top-0 z-50`}
        style={{
          backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: darkMode ? 'var(--color-border)' : 'var(--color-primary)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div 
                className={`${darkMode ? 'bg-opacity-80' : 'bg-gradient-to-r'} p-3 rounded-xl shadow-lg`}
                style={{ 
                  backgroundColor: darkMode ? restaurantSettings.primaryColor : undefined,
                  backgroundImage: darkMode ? undefined : `linear-gradient(to right, ${restaurantSettings.primaryColor}, ${restaurantSettings.primaryColor}dd)`
                }}
              >
                {restaurantSettings.logo ? (
                  <img 
                    src={`${API_URL.replace('/api', '')}${restaurantSettings.logo}`} 
                    alt="Restaurant Logo" 
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <ChefHat className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 
                  className={`text-3xl font-bold ${darkMode ? '' : 'bg-gradient-to-r bg-clip-text text-transparent'}`}
                  style={{ 
                    color: darkMode ? restaurantSettings.primaryColor : undefined,
                    backgroundImage: darkMode ? undefined : `linear-gradient(to right, ${restaurantSettings.primaryColor}, ${restaurantSettings.primaryColor}cc)`
                  }}
                >
                  {restaurantSettings.name}
                </h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-amber-700'} flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4" />
                  {restaurantSettings.subname}
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2
                    }
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 15,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className={`p-3 rounded-xl transition-all shadow-md hover:shadow-lg touch-target haptic-press`}
                  style={{
                    backgroundColor: darkMode ? '#374151' : `${restaurantSettings.primaryColor}20`,
                    color: darkMode ? '#e5e7eb' : restaurantSettings.primaryColor,
                    minWidth: '44px',
                    minHeight: '44px'
                  }}
                >
                  <Globe className="w-6 h-6" />
                </motion.button>
                
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        y: -10, 
                        scale: 0.95,
                        transition: { duration: 0.2 }
                      }}
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-amber-200'} overflow-hidden z-50`}
                    >
                      {languages.map((lang, index) => (
                        <motion.button
                          key={lang.code}
                          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: {
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 300
                            }
                          }}
                          whileHover={{ 
                            x: isRTL ? -5 : 5,
                            backgroundColor: language === lang.code 
                              ? (darkMode ? '#d97706' : '#fef3c7')
                              : (darkMode ? '#374151' : '#fffbeb'),
                            transition: { type: "spring", stiffness: 400, damping: 10 }
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors touch-target haptic-press ${
                            language === lang.code 
                              ? darkMode ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900'
                              : darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-amber-50 text-gray-700'
                          }`}
                          style={{ minHeight: '44px' }}
                        >
                          <motion.span 
                            className="text-2xl"
                            whileHover={{ 
                              scale: 1.2,
                              rotate: 10,
                              transition: { type: "spring", stiffness: 400 }
                            }}
                          >
                            {lang.flag}
                          </motion.span>
                          <span className="font-medium">{lang.name}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3
                  }
                }}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 180,
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all shadow-md hover:shadow-lg touch-target haptic-press`}
                style={{
                  backgroundColor: darkMode ? '#374151' : `${restaurantSettings.primaryColor}20`,
                  color: darkMode ? '#fbbf24' : restaurantSettings.primaryColor,
                  minWidth: '44px',
                  minHeight: '44px'
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: darkMode ? 0 : 180,
                    scale: darkMode ? 1 : 0.8
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 py-8 pb-24 md:pb-8">
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className={`inline-block rounded-full h-16 w-16 border-4 ${darkMode ? 'border-amber-500 border-t-transparent' : 'border-amber-600 border-t-transparent'}`}
            />
            <p className={`mt-6 text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>{t.loading}</p>
          </div>
        ) : menuProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-amber-200'}`}
          >
            <div className="text-8xl mb-6">🍽️</div>
            <p className={`text-2xl font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{t.noItems}</p>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.checkBack}</p>
          </motion.div>
        ) : (
          <>
            {/* Search Bar with Enhanced Animation */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }
              }}
              className="mb-8"
            >
              <div className="relative max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0, x: isRTL ? 20 : -20 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                  }}
                >
                  <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-amber-600'} w-6 h-6`} />
                </motion.div>
                <motion.input
                  whileFocus={{ 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full ${isRTL ? 'pr-14 pl-4' : 'pl-14 pr-4'} py-5 rounded-2xl border-2 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-amber-500' 
                      : 'bg-white border-amber-200 text-gray-900 placeholder-gray-400 focus:border-amber-500'
                  } focus:ring-4 focus:ring-amber-100 transition-all shadow-lg text-lg`}
                />
              </div>
            </motion.div>

            {/* Category Filters with Staggered Animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1
                }
              }}
              className="mb-10 flex flex-wrap gap-3 justify-center"
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.15
                  }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('all')}
                className={`px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 touch-target haptic-press ${
                  selectedCategory === 'all'
                    ? 'text-white'
                    : darkMode
                      ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-2 border-gray-700'
                      : 'bg-white hover:bg-amber-50 border-2'
                }`}
                style={selectedCategory === 'all' ? {
                  background: `linear-gradient(to right, ${restaurantSettings.primaryColor}, ${restaurantSettings.primaryColor}dd)`,
                  boxShadow: darkMode ? `0 10px 25px ${restaurantSettings.primaryColor}50` : `0 10px 25px ${restaurantSettings.primaryColor}30`,
                  minHeight: '48px'
                } : {
                  borderColor: darkMode ? '#374151' : `${restaurantSettings.primaryColor}30`,
                  color: darkMode ? '#e5e7eb' : restaurantSettings.primaryColor,
                  minHeight: '48px'
                }}
              >
                <motion.div
                  animate={{ rotate: selectedCategory === 'all' ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Filter className="w-5 h-5" />
                </motion.div>
                {t.allItems}
              </motion.button>
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.15 + (index + 1) * 0.05
                    }
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-8 py-4 rounded-xl font-bold transition-all shadow-lg touch-target haptic-press ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : darkMode
                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-2 border-gray-700'
                        : 'bg-white hover:bg-amber-50 border-2'
                  }`}
                  style={selectedCategory === category.id ? {
                    background: `linear-gradient(to right, ${restaurantSettings.primaryColor}, ${restaurantSettings.primaryColor}dd)`,
                    boxShadow: darkMode ? `0 10px 25px ${restaurantSettings.primaryColor}50` : `0 10px 25px ${restaurantSettings.primaryColor}30`,
                    minHeight: '48px'
                  } : {
                    borderColor: darkMode ? '#374151' : `${restaurantSettings.primaryColor}30`,
                    color: darkMode ? '#e5e7eb' : restaurantSettings.primaryColor,
                    minHeight: '48px'
                  }}
                >
                  {getLocalizedText(category, 'name')}
                </motion.button>
              ))}
            </motion.div>

            {/* Products Grid - Enhanced with Staggered Spring Animations */}
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layoutId={`product-${product.id}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.03
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      y: -20,
                      transition: { duration: 0.2 }
                    }}
                    whileHover={{ 
                      y: -10, 
                      scale: 1.03,
                      transition: { 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10 
                      }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProduct(product)}
                    className={`rounded-2xl overflow-hidden cursor-pointer backdrop-blur-md transition-all ${
                      darkMode 
                        ? 'bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/40' 
                        : 'bg-white/30 border border-white/40 hover:bg-white/40'
                    }`}
                    style={{
                      boxShadow: darkMode 
                        ? 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3)'
                        : 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {(() => {
                      const images = getProductImages(product);
                      const firstImage = images.length > 0 ? images[0] : null;
                      return firstImage ? (
                        <div className="relative h-40 md:h-48 overflow-hidden">
                          <motion.img 
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            whileHover={{ 
                              scale: 1.15,
                              transition: { duration: 0.4 }
                            }}
                            src={`${API_URL.replace('/api', '')}${firstImage}`} 
                            alt={getLocalizedText(product, 'name')}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {/* Shimmer overlay while loading */}
                          <div className={`absolute inset-0 ${darkMode ? 'shimmer-dark' : 'shimmer'} pointer-events-none`} 
                            style={{ 
                              opacity: 0,
                              animation: 'shimmer 2s ease-in-out'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                          <motion.div 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 260, 
                              damping: 20,
                              delay: index * 0.03 + 0.2
                            }}
                            whileHover={{ 
                              scale: 1.1, 
                              rotate: 5,
                              transition: { type: "spring", stiffness: 400 }
                            }}
                            className="absolute top-2 right-2 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1"
                            style={{ 
                              backgroundColor: `${restaurantSettings.primaryColor}dd`,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            <Star className="w-3 h-3 fill-current" />
                          </motion.div>
                        </div>
                      ) : (
                        <div className="h-40 md:h-48 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 flex items-center justify-center relative overflow-hidden">
                          <motion.div 
                            className="absolute inset-0 opacity-20"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8 }}
                          >
                            <div className="absolute top-5 left-5 w-16 h-16 bg-white rounded-full blur-2xl"></div>
                            <div className="absolute bottom-5 right-5 w-20 h-20 bg-white rounded-full blur-2xl"></div>
                          </motion.div>
                          <motion.span 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 200, 
                              damping: 15,
                              delay: index * 0.03
                            }}
                            className="text-white text-4xl md:text-5xl font-bold drop-shadow-2xl z-10"
                          >
                            {getLocalizedText(product, 'name').charAt(0)}
                          </motion.span>
                        </div>
                      );
                    })()}
                    
                    <div className="p-3 md:p-4">
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 + 0.1 }}
                        className={`text-sm md:text-base font-bold mb-2 line-clamp-2 leading-snug min-h-[44px] flex items-center`}
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {getLocalizedText(product, 'name')}
                      </motion.h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: index * 0.03 + 0.15,
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ 
                            scale: 1.1,
                            transition: { type: "spring", stiffness: 400 }
                          }}
                          className="text-lg md:text-xl font-extrabold flex items-center gap-1"
                          style={{ 
                            background: `linear-gradient(135deg, ${restaurantSettings.primaryColor}, ${restaurantSettings.primaryColor}dd)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          <DollarSign className="w-4 h-4 text-green-600" />
                          {product.price}
                        </motion.span>
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: index * 0.03 + 0.2,
                            type: "spring"
                          }}
                          whileHover={{ 
                            scale: 1.2, 
                            rotate: 15,
                            transition: { type: "spring", stiffness: 400 }
                          }}
                        >
                          <Info className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </motion.div>
                      </div>
                      
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: index * 0.03 + 0.25,
                          type: "spring",
                          stiffness: 200
                        }}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm`}
                        style={{
                          backgroundColor: darkMode ? `${restaurantSettings.primaryColor}25` : `${restaurantSettings.primaryColor}20`,
                          color: darkMode ? restaurantSettings.primaryColor : restaurantSettings.primaryColor,
                          border: `1px solid ${restaurantSettings.primaryColor}40`
                        }}
                      >
                        {getLocalizedText(product.category, 'name')}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl`}
              >
                <Search className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No items match your search</p>
              </motion.div>
            )}
          </>
        )}

        {/* Enhanced Product Detail Modal with Layout Transitions */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                layoutId={`product-${selectedProduct.id}`}
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }
                }}
                exit={{ 
                  scale: 0.9, 
                  opacity: 0, 
                  y: 50,
                  transition: { duration: 0.2 }
                }}
                onClick={(e) => e.stopPropagation()}
                className={`relative max-w-5xl w-full my-8 rounded-3xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
              >
                {/* Close Button with Enhanced Animation */}
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2
                    }
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 90,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedProduct(null)}
                  className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} z-20 p-3 rounded-full shadow-2xl backdrop-blur-sm ${darkMode ? 'bg-gray-800/90 text-white hover:bg-gray-700' : 'bg-white/90 text-gray-800 hover:bg-gray-100'}`}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left Side - Image Carousel */}
                  <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    {(() => {
                      const images = getProductImages(selectedProduct);
                      const hasImages = images.length > 0;
                      const currentImage = hasImages ? images[currentImageIndex] : null;

                      return hasImages ? (
                        <div className="relative h-full min-h-[400px] md:min-h-[600px] group">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentImageIndex}
                              drag="x"
                              dragConstraints={{ left: 0, right: 0 }}
                              dragElastic={0.2}
                              onDragEnd={handleDragEnd}
                              className="w-full h-full cursor-grab active:cursor-grabbing"
                            >
                              <motion.img
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                src={`${API_URL.replace('/api', '')}${currentImage}`}
                                alt={`${getLocalizedText(selectedProduct, 'name')} - Image ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover pointer-events-none"
                              />
                            </motion.div>
                          </AnimatePresence>
                          
                          {/* Gradient Overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>
                          
                          {/* Navigation Arrows with Enhanced Animations */}
                          {images.length > 1 && (
                            <>
                              <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ 
                                  opacity: 1, 
                                  x: 0,
                                  transition: {
                                    type: "spring",
                                    stiffness: 200,
                                    delay: 0.3
                                  }
                                }}
                                whileHover={{ 
                                  scale: 1.15, 
                                  x: -3,
                                  transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrevImage}
                                className={`absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full shadow-2xl transition-all ${darkMode ? 'bg-gray-900/80 text-white hover:bg-gray-800' : 'bg-white/80 text-gray-800 hover:bg-white'} backdrop-blur-sm relative overflow-hidden`}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ 
                                    x: '100%',
                                    transition: { duration: 0.6, ease: "easeInOut" }
                                  }}
                                />
                                <ChevronLeft className="w-6 h-6 relative z-10" />
                              </motion.button>
                              <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ 
                                  opacity: 1, 
                                  x: 0,
                                  transition: {
                                    type: "spring",
                                    stiffness: 200,
                                    delay: 0.3
                                  }
                                }}
                                whileHover={{ 
                                  scale: 1.15, 
                                  x: 3,
                                  transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextImage}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full shadow-2xl transition-all ${darkMode ? 'bg-gray-900/80 text-white hover:bg-gray-800' : 'bg-white/80 text-gray-800 hover:bg-white'} backdrop-blur-sm relative overflow-hidden`}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ 
                                    x: '100%',
                                    transition: { duration: 0.6, ease: "easeInOut" }
                                  }}
                                />
                                <ChevronRight className="w-6 h-6 relative z-10" />
                              </motion.button>

                              {/* Thumbnail Preview Strip with Staggered Animation */}
                              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-3 rounded-2xl backdrop-blur-md bg-black/30">
                                {images.map((img, index) => (
                                  <motion.button
                                    key={index}
                                    initial={{ opacity: 0, scale: 0, y: 20 }}
                                    animate={{ 
                                      opacity: 1, 
                                      scale: 1, 
                                      y: 0,
                                      transition: {
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.4 + index * 0.05
                                      }
                                    }}
                                    whileHover={{ 
                                      scale: 1.15, 
                                      y: -4,
                                      transition: { type: "spring", stiffness: 400, damping: 10 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all ${
                                      index === currentImageIndex
                                        ? 'ring-4 ring-white shadow-xl'
                                        : 'opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <img
                                      src={`${API_URL.replace('/api', '')}${img}`}
                                      alt={`Thumbnail ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </motion.button>
                                ))}
                              </div>

                              {/* Image Counter Badge */}
                              <div className={`absolute top-6 left-6 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm ${darkMode ? 'bg-gray-900/80 text-white' : 'bg-white/80 text-gray-800'}`}>
                                <span className="text-sm font-bold">
                                  {currentImageIndex + 1} / {images.length}
                                </span>
                              </div>
                            </>
                          )}

                          {/* Featured Badge */}
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="absolute top-6 right-6 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm"
                            style={{ backgroundColor: `${restaurantSettings.primaryColor}dd` }}
                          >
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm">{t.featured}</span>
                          </motion.div>
                        </div>
                      ) : (
                        <div className="h-full min-h-[400px] md:min-h-[600px] bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-20 left-20 w-60 h-60 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
                          </div>
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10 }}
                            className="text-white text-9xl font-bold drop-shadow-2xl z-10"
                          >
                            {getLocalizedText(selectedProduct, 'name').charAt(0)}
                          </motion.span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Side - Product Information */}
                  <div className="p-8 md:p-10 flex flex-col">
                    {/* Header Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span 
                          className="inline-block px-4 py-2 rounded-full text-sm font-bold"
                          style={{
                            backgroundColor: `${restaurantSettings.primaryColor}20`,
                            color: restaurantSettings.primaryColor
                          }}
                        >
                          {getLocalizedText(selectedProduct.category, 'name')}
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center gap-1 text-amber-500"
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </motion.div>
                      </div>

                      <h2 className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {getLocalizedText(selectedProduct, 'name')}
                      </h2>

                      {/* Price Section */}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-amber-50 to-orange-50'}`}
                      >
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price</p>
                          <span className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            {selectedProduct.price}
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Description */}
                    {getLocalizedText(selectedProduct, 'description') && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                      >
                        <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          <Info className="w-5 h-5" />
                          About this item
                        </h3>
                        <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getLocalizedText(selectedProduct, 'description')}
                        </p>
                      </motion.div>
                    )}

                    {/* Product Details Grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`grid grid-cols-2 gap-4 p-6 rounded-2xl mb-6 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${restaurantSettings.primaryColor}20` }}
                          >
                            <ShoppingBag className="w-5 h-5" style={{ color: restaurantSettings.primaryColor }} />
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Category</p>
                            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {getLocalizedText(selectedProduct.category, 'name')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${restaurantSettings.primaryColor}20` }}
                          >
                            <Clock className="w-5 h-5" style={{ color: restaurantSettings.primaryColor }} />
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Prep Time</p>
                            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              15-20 min
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${restaurantSettings.primaryColor}20` }}
                          >
                            <TrendingUp className="w-5 h-5" style={{ color: restaurantSettings.primaryColor }} />
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Status</p>
                            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Available
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${restaurantSettings.primaryColor}20` }}
                          >
                            <Users className="w-5 h-5" style={{ color: restaurantSettings.primaryColor }} />
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Serves</p>
                            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              1-2 People
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Action Buttons with Enhanced Animations and Touch Targets */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-auto space-y-3"
                    >
                      <motion.button
                        whileHover={{ 
                          scale: 1.02, 
                          y: -2,
                          boxShadow: `0 15px 40px ${restaurantSettings.primaryColor}60`,
                          transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 text-lg relative overflow-hidden touch-target haptic-press"
                        style={{ 
                          background: `linear-gradient(135deg, ${restaurantSettings.primaryColor}, ${restaurantSettings.primaryColor}dd)`,
                          boxShadow: `0 10px 30px ${restaurantSettings.primaryColor}40`,
                          minHeight: '52px'
                        }}
                      >
                        {/* Shimmer effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ 
                            x: '100%',
                            transition: { duration: 0.6, ease: "easeInOut" }
                          }}
                        />
                        <ShoppingBag className="w-6 h-6 relative z-10" />
                        <span className="relative z-10">Order Now</span>
                      </motion.button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ 
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 400, damping: 10 }
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`py-3 rounded-xl font-bold border-2 transition-colors relative overflow-hidden touch-target haptic-press ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                          style={{ minHeight: '48px' }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ 
                              x: '100%',
                              transition: { duration: 0.6, ease: "easeInOut" }
                            }}
                          />
                          <span className="relative z-10">Share</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ 
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 400, damping: 10 }
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`py-3 rounded-xl font-bold border-2 transition-colors flex items-center justify-center gap-2 relative overflow-hidden touch-target haptic-press ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                          style={{ minHeight: '48px' }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ 
                              x: '100%',
                              transition: { duration: 0.6, ease: "easeInOut" }
                            }}
                          />
                          <motion.div
                            whileHover={{ 
                              rotate: [0, -10, 10, -10, 0],
                              transition: { duration: 0.5 }
                            }}
                            className="relative z-10"
                          >
                            <Star className="w-5 h-5" />
                          </motion.div>
                          <span className="relative z-10">Favorite</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Navigation Bar - Better Reachability */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
          className={`fixed bottom-0 left-0 right-0 z-40 md:hidden backdrop-blur-md border-t ${
            darkMode 
              ? 'bg-gray-900/90 border-gray-700' 
              : 'bg-white/90 border-gray-200'
          }`}
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)',
            boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-center justify-around px-2 py-3">
            {/* Home/All Items */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedCategory('all')}
              className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center px-3"
            >
              <motion.div
                animate={{
                  scale: selectedCategory === 'all' ? 1.1 : 1,
                  color: selectedCategory === 'all' 
                    ? restaurantSettings.primaryColor 
                    : (darkMode ? '#9ca3af' : '#6b7280')
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
              <motion.span 
                className={`text-xs font-semibold`}
                animate={{
                  color: selectedCategory === 'all' 
                    ? restaurantSettings.primaryColor 
                    : (darkMode ? '#9ca3af' : '#6b7280')
                }}
              >
                All
              </motion.span>
              {selectedCategory === 'all' && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-1 w-12 h-1 rounded-full"
                  style={{ backgroundColor: restaurantSettings.primaryColor }}
                />
              )}
            </motion.button>

            {/* Categories (First 3) */}
            {categories.slice(0, 3).map((category) => (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedCategory(category.id)}
                className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center px-3 relative"
              >
                <motion.div
                  animate={{
                    scale: selectedCategory === category.id ? 1.1 : 1,
                    color: selectedCategory === category.id 
                      ? restaurantSettings.primaryColor 
                      : (darkMode ? '#9ca3af' : '#6b7280')
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ShoppingBag className="w-6 h-6" />
                </motion.div>
                <motion.span 
                  className={`text-xs font-semibold truncate max-w-[60px]`}
                  animate={{
                    color: selectedCategory === category.id 
                      ? restaurantSettings.primaryColor 
                      : (darkMode ? '#9ca3af' : '#6b7280')
                  }}
                >
                  {getLocalizedText(category, 'name').substring(0, 8)}
                </motion.span>
                {selectedCategory === category.id && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1 w-12 h-1 rounded-full"
                    style={{ backgroundColor: restaurantSettings.primaryColor }}
                  />
                )}
              </motion.button>
            ))}

            {/* More Categories Button */}
            {categories.length > 3 && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center px-3"
              >
                <motion.div
                  animate={{
                    rotate: showMobileNav ? 180 : 0,
                    color: darkMode ? '#9ca3af' : '#6b7280'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.div>
                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  More
                </span>
              </motion.button>
            )}
          </div>

          {/* Expanded Categories Menu */}
          <AnimatePresence>
            {showMobileNav && categories.length > 3 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`overflow-hidden border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="grid grid-cols-3 gap-2 p-4">
                  {categories.slice(3).map((category, index) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 300
                        }
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowMobileNav(false);
                      }}
                      className={`min-h-[44px] px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                        selectedCategory === category.id
                          ? 'text-white'
                          : darkMode
                            ? 'bg-gray-800 text-gray-200'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                      style={selectedCategory === category.id ? {
                        background: `linear-gradient(135deg, ${restaurantSettings.primaryColor}, ${restaurantSettings.primaryColor}dd)`
                      } : {}}
                    >
                      {getLocalizedText(category, 'name')}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-20 pt-10 border-t-2 ${darkMode ? 'border-gray-700' : 'border-amber-200'}`}
        >
          <div className="text-center space-y-3">
            {/* Company Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 
                className={`text-2xl font-bold`}
                style={{ color: darkMode ? restaurantSettings.primaryColor : restaurantSettings.primaryColor }}
              >
                {restaurantSettings.name}
              </h3>
            </motion.div>

            {/* Built By */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {t.builtBy} <span 
                className={`font-semibold`}
                style={{ color: darkMode ? restaurantSettings.primaryColor : restaurantSettings.primaryColor }}
              >
                Alkhwarizm
              </span>
            </motion.p>

            {/* Version */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}
            >
              {t.version} 1.0.0
            </motion.p>

            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'} pt-2`}
            >
              © {new Date().getFullYear()} . Alkhwarizm All rights reserved.
            </motion.p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
