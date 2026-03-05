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
  Users
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
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'Digital Menu',
    subname: 'Browse our delicious offerings',
    logo: null,
    primaryColor: '#d97706'
  });

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
      
      const uniqueCategories = [...new Set(data.map(p => p.category))];
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`backdrop-blur-md ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-amber-200'} shadow-2xl border-b-4 sticky top-0 z-50`}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className={`p-3 rounded-xl transition-all shadow-md hover:shadow-lg`}
                  style={{
                    backgroundColor: darkMode ? '#374151' : `${restaurantSettings.primaryColor}20`,
                    color: darkMode ? '#e5e7eb' : restaurantSettings.primaryColor
                  }}
                >
                  <Globe className="w-5 h-5" />
                </motion.button>
                
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-amber-200'} overflow-hidden z-50`}
                    >
                      {languages.map((lang) => (
                        <motion.button
                          key={lang.code}
                          whileHover={{ x: isRTL ? -5 : 5 }}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                            language === lang.code 
                              ? darkMode ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900'
                              : darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-amber-50 text-gray-700'
                          }`}
                        >
                          <span className="text-2xl">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all shadow-md hover:shadow-lg`}
                style={{
                  backgroundColor: darkMode ? '#374151' : `${restaurantSettings.primaryColor}20`,
                  color: darkMode ? '#fbbf24' : restaurantSettings.primaryColor
                }}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
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
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative max-w-2xl mx-auto">
                <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-amber-600'} w-6 h-6`} />
                <input
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

            {/* Category Filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10 flex flex-wrap gap-3 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('all')}
                className={`px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${
                  selectedCategory === 'all'
                    ? 'text-white'
                    : darkMode
                      ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-2 border-gray-700'
                      : 'bg-white hover:bg-amber-50 border-2'
                }`}
                style={selectedCategory === 'all' ? {
                  background: `linear-gradient(to right, ${restaurantSettings.primaryColor}, ${restaurantSettings.primaryColor}dd)`,
                  boxShadow: darkMode ? `0 10px 25px ${restaurantSettings.primaryColor}50` : `0 10px 25px ${restaurantSettings.primaryColor}30`
                } : {
                  borderColor: darkMode ? '#374151' : `${restaurantSettings.primaryColor}30`,
                  color: darkMode ? '#e5e7eb' : restaurantSettings.primaryColor
                }}
              >
                <Filter className="w-5 h-5" />
                {t.allItems}
              </motion.button>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-8 py-4 rounded-xl font-bold transition-all shadow-lg ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : darkMode
                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-2 border-gray-700'
                        : 'bg-white hover:bg-amber-50 border-2'
                  }`}
                  style={selectedCategory === category.id ? {
                    background: `linear-gradient(to right, ${restaurantSettings.primaryColor}, ${restaurantSettings.primaryColor}dd)`,
                    boxShadow: darkMode ? `0 10px 25px ${restaurantSettings.primaryColor}50` : `0 10px 25px ${restaurantSettings.primaryColor}30`
                  } : {
                    borderColor: darkMode ? '#374151' : `${restaurantSettings.primaryColor}30`,
                    color: darkMode ? '#e5e7eb' : restaurantSettings.primaryColor
                  }}
                >
                  {getLocalizedText(category, 'name')}
                </motion.button>
              ))}
            </motion.div>

            {/* Products Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-amber-100'}`}
                  >
                    {product.image ? (
                      <div className="relative h-64 overflow-hidden">
                        <motion.img 
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          src={`${API_URL.replace('/api', '')}${product.image}`} 
                          alt={getLocalizedText(product, 'name')}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div 
                          className="absolute top-4 right-4 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
                          style={{ backgroundColor: restaurantSettings.primaryColor }}
                        >
                          <Star className="w-4 h-4 fill-current" />
                          {t.popular}
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
                          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full"></div>
                        </div>
                        <span className="text-white text-7xl font-bold drop-shadow-2xl z-10">
                          {getLocalizedText(product, 'name').charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex-1`}>
                          {getLocalizedText(product, 'name')}
                        </h3>
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-1"
                        >
                          <DollarSign className="w-6 h-6 text-green-600" />
                          {product.price}
                        </motion.span>
                      </div>
                      
                      <span 
                        className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 border`}
                        style={{
                          backgroundColor: darkMode ? `${restaurantSettings.primaryColor}20` : `${restaurantSettings.primaryColor}15`,
                          color: darkMode ? restaurantSettings.primaryColor : restaurantSettings.primaryColor,
                          borderColor: darkMode ? `${restaurantSettings.primaryColor}30` : `${restaurantSettings.primaryColor}30`
                        }}
                      >
                        {getLocalizedText(product.category, 'name')}
                      </span>
                      
                      {getLocalizedText(product, 'description') && (
                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getLocalizedText(product, 'description')}
                        </p>
                      )}
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
                Al-Khwarizmi
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
              © {new Date().getFullYear()} Al-Khwarizmi. All rights reserved.
            </motion.p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
