import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderTree, Package, Menu, QrCode, LogOut, Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Printer,
  Image as ImageIcon, TrendingUp, ShoppingBag, Download, Globe, Settings, Users, Shield, Copy, Check
} from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { useBranding } from '../context/BrandingContext';

export default function Admin() {
  const { branding, updateBranding, BASE_URL } = useBranding();
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '' });
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ 
    name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '',
    description: '', descriptionOr: '', descriptionAm: '', descriptionSo: '', descriptionAr: '',
    price: '', prepTime: '', image: '', categoryId: '' 
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [qrcodes, setQrcodes] = useState([]);
  const [qrcodeForm, setQrcodeForm] = useState({ name: '', url: '', description: '' });
  const [editingQrcodeId, setEditingQrcodeId] = useState(null);
  const [viewingQrcode, setViewingQrcode] = useState(null);
  const [adminForm, setAdminForm] = useState({ email: '', password: '', name: '' });
  const [restaurantForm, setRestaurantForm] = useState({ 
    name: '', subname: '', logo: '', favicon: '', browserTitle: '',
    primaryColor: '#d97706', seoKeywords: '', seoDescription: '', location: '', city: '', country: ''
  });
  const [showPassword, setShowPassword] = useState({});
  const [copiedField, setCopiedField] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/admin/login', { replace: true });
        }
        return Promise.reject(error);
      }
    );
    return () => { axios.interceptors.response.eject(interceptor); };
  }, [navigate]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') { navigate('/admin/login', { replace: true }); return; }
    setAdmin(user);
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'categories') fetchCategories();
    else if (activeTab === 'products') { fetchProducts(); fetchCategories(); }
    else if (activeTab === 'qrcodes') fetchQrcodes();
    else if (activeTab === 'menu') { fetchProducts(); fetchCategories(); }
    else if (activeTab === 'settings') {
      if (admin) setAdminForm({ name: admin.name || '', email: admin.email || '', password: '' });
      fetchRestaurantSettings();
    }
  }, [activeTab, admin]);

  useEffect(() => {
    if (restaurantForm.browserTitle) document.title = `${restaurantForm.browserTitle} - Admin`;
  }, [restaurantForm.browserTitle]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const axiosConfig = { withCredentials: true };

  const fetchCategories = async () => {
    try { const { data } = await axios.get(`${API_URL}/categories`, axiosConfig); setCategories(data); }
    catch (err) { console.error('Failed to fetch categories', err.message); }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/categories`, categoryForm, axiosConfig);
      setCategoryForm({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '' });
      fetchCategories();
    } catch (err) { console.error('Failed to create category'); }
  };

  const handleUpdateCategory = async (id) => {
    try {
      await axios.put(`${API_URL}/categories/${id}`, categoryForm, axiosConfig);
      setEditingId(null);
      setCategoryForm({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '' });
      fetchCategories();
    } catch (err) { console.error('Failed to update category'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await axios.delete(`${API_URL}/categories/${id}`, axiosConfig); fetchCategories(); }
    catch (err) { console.error('Failed to delete category'); }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setCategoryForm({ name: category.name, nameOr: category.nameOr || '', nameAm: category.nameAm || '', nameSo: category.nameSo || '', nameAr: category.nameAr || '' });
  };
  const cancelEdit = () => { setEditingId(null); setCategoryForm({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '' }); };

  const fetchProducts = async () => {
    try { const { data } = await axios.get(`${API_URL}/products`, axiosConfig); setProducts(data); }
    catch (err) { console.error('Failed to fetch products', err.message); }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    try {
      let uploadedUrls = [];
      if (files.length > 1) {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        const { data } = await axios.post(`${API_URL}/upload/multiple`, formData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, withCredentials: true
        });
        uploadedUrls = data.urls;
      } else {
        const formData = new FormData();
        formData.append('image', files[0]);
        const { data } = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, withCredentials: true
        });
        uploadedUrls = [data.url];
      }
      let currentImages = [];
      if (productForm.image) {
        try {
          const parsed = JSON.parse(productForm.image);
          currentImages = Array.isArray(parsed) ? parsed : [productForm.image];
        } catch {
          currentImages = productForm.image.includes(',') ? productForm.image.split(',').map(img => img.trim()) : [productForm.image];
        }
      }
      setProductForm({ ...productForm, image: JSON.stringify([...currentImages, ...uploadedUrls]) });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert(`Failed to upload images: ${errorMsg}`);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    try {
      const currentImages = productForm.image ? JSON.parse(productForm.image) : [];
      const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
      setProductForm({ ...productForm, image: updatedImages.length > 0 ? JSON.stringify(updatedImages) : '' });
    } catch (err) { console.error('Failed to remove image'); }
  };

  const getProductImages = (imageData) => {
    if (!imageData) return [];
    try {
      const parsed = JSON.parse(imageData);
      return Array.isArray(parsed) ? parsed : [imageData];
    } catch {
      return imageData.includes(',') ? imageData.split(',').map(img => img.trim()) : [imageData];
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await axios.put(`${API_URL}/products/${editingProductId}`, productForm, axiosConfig);
        setEditingProductId(null);
      } else {
        await axios.post(`${API_URL}/products`, productForm, axiosConfig);
      }
      setProductForm({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '', description: '', descriptionOr: '', descriptionAm: '', descriptionSo: '', descriptionAr: '', price: '', prepTime: '', image: '', categoryId: '' });
      fetchProducts();
    } catch (err) { console.error('Failed to save product'); }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name, nameOr: product.nameOr || '', nameAm: product.nameAm || '', nameSo: product.nameSo || '', nameAr: product.nameAr || '',
      description: product.description || '', descriptionOr: product.descriptionOr || '', descriptionAm: product.descriptionAm || '', descriptionSo: product.descriptionSo || '', descriptionAr: product.descriptionAr || '',
      price: product.price, prepTime: product.prepTime || '', image: product.image || '', categoryId: product.categoryId
    });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProductForm({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '', description: '', descriptionOr: '', descriptionAm: '', descriptionSo: '', descriptionAr: '', price: '', prepTime: '', image: '', categoryId: '' });
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await axios.delete(`${API_URL}/products/${id}`, axiosConfig); fetchProducts(); }
    catch (err) { console.error('Failed to delete product'); }
  };

  const fetchQrcodes = async () => {
    try { const { data } = await axios.get(`${API_URL}/qrcodes`, axiosConfig); setQrcodes(data); }
    catch (err) { console.error('Failed to fetch QR codes', err.message); }
  };

  const handleQrcodeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQrcodeId) {
        await axios.put(`${API_URL}/qrcodes/${editingQrcodeId}`, qrcodeForm, axiosConfig);
        setEditingQrcodeId(null);
      } else {
        await axios.post(`${API_URL}/qrcodes`, qrcodeForm, axiosConfig);
      }
      setQrcodeForm({ name: '', url: '', description: '' });
      fetchQrcodes();
    } catch (err) { console.error('Failed to save QR code'); }
  };

  const startEditQrcode = (qrcode) => { setEditingQrcodeId(qrcode.id); setQrcodeForm({ name: qrcode.name, url: qrcode.url, description: qrcode.description || '' }); };
  const cancelEditQrcode = () => { setEditingQrcodeId(null); setQrcodeForm({ name: '', url: '', description: '' }); };

  const handleDeleteQrcode = async (id) => {
    if (!confirm('Delete this QR code?')) return;
    try { await axios.delete(`${API_URL}/qrcodes/${id}`, axiosConfig); fetchQrcodes(); }
    catch (err) { console.error('Failed to delete QR code'); }
  };

  const handlePrintQrcode = (qrcode) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Print QR Code - ${qrcode.name}</title><style>body{text-align:center;padding:20px;font-family:Arial,sans-serif;}h2{margin-bottom:10px;}img{max-width:400px;margin:20px 0;}@media print{button{display:none;}}</style></head><body><h2>${qrcode.name}</h2><p>${qrcode.description||''}</p><img src="${qrcode.qrCodeData}" alt="QR Code"/><p>URL: ${qrcode.url}</p><button onclick="window.print()">Print</button></body></html>`);
    printWindow.document.close();
  };

  const handleToggleMenuVisibility = async (productId) => {
    try { await axios.put(`${API_URL}/products/${productId}/toggle-menu`, {}, axiosConfig); fetchProducts(); }
    catch (err) { console.error('Failed to toggle menu visibility'); }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.email) { alert('Name and email are required'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminForm.email)) { alert('Please enter a valid email address'); return; }
    if (adminForm.password && adminForm.password.trim() !== '' && adminForm.password.length < 6) { alert('Password must be at least 6 characters long'); return; }
    try {
      const updateData = { name: adminForm.name, email: adminForm.email };
      if (adminForm.password && adminForm.password.trim() !== '') updateData.password = adminForm.password;
      const response = await axios.put(`${API_URL}/settings/admin`, updateData, axiosConfig);
      alert('Admin credentials updated successfully');
      setAdminForm({ ...adminForm, password: '' });
      if (response.data.admin) {
        setAdmin(response.data.admin);
        const user = getCurrentUser();
        if (user) { user.name = response.data.admin.name; user.email = response.data.admin.email; localStorage.setItem('user', JSON.stringify(user)); }
      }
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to update admin credentials');
    }
  };

  const togglePasswordVisibility = (field) => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));

  const handleCopyToClipboard = async (text, field) => {
    try { await navigator.clipboard.writeText(text); setCopiedField(field); setTimeout(() => setCopiedField(null), 2000); }
    catch (err) { console.error('Failed to copy:', err); }
  };

  const fetchRestaurantSettings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/settings/restaurant`);
      setRestaurantForm({
        name: data.name || '', subname: data.subname || '', logo: data.logo || '', favicon: data.favicon || '',
        browserTitle: data.browserTitle || 'Restaurant Management', primaryColor: data.primaryColor || '#d97706',
        seoKeywords: data.seoKeywords || '', seoDescription: data.seoDescription || '',
        location: data.location || '', city: data.city || '', country: data.country || ''
      });
    } catch (err) { console.error('Failed to fetch restaurant settings', err); }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const formData = new FormData(); formData.append('image', file);
    try {
      const { data } = await axios.post(`${API_URL}/upload`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } });
      setRestaurantForm({ ...restaurantForm, logo: data.url });
    } catch (err) { alert('Failed to upload logo'); }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const formData = new FormData(); formData.append('image', file);
    try {
      const { data } = await axios.post(`${API_URL}/upload`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } });
      setRestaurantForm({ ...restaurantForm, favicon: data.url });
    } catch (err) { alert('Failed to upload favicon'); }
  };

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    if (!restaurantForm.name) { alert('Restaurant name is required'); return; }
    if (!restaurantForm.browserTitle) { alert('Browser title is required'); return; }
    try {
      const response = await axios.put(`${API_URL}/settings/restaurant`, restaurantForm, axiosConfig);
      alert('Restaurant settings updated successfully');
      if (response.data.settings) {
        const updatedSettings = {
          name: response.data.settings.name, subname: response.data.settings.subname || '',
          logo: response.data.settings.logo || '', favicon: response.data.settings.favicon || '',
          browserTitle: response.data.settings.browserTitle || 'Restaurant Management',
          primaryColor: response.data.settings.primaryColor || '#d97706'
        };
        setRestaurantForm(updatedSettings);
        updateBranding(updatedSettings);
      }
    } catch (err) { alert(err.response?.data?.error || 'Failed to update restaurant settings'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); localStorage.removeItem('token');
    navigate('/admin/login', { replace: true });
  };

  if (!admin) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full" />
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'menu', label: 'Menu', icon: Menu },
    { id: 'qrcodes', label: 'QR Codes', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    visibleProducts: products.filter(p => p.showInMenu).length,
    totalQRCodes: qrcodes.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Navbar */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="bg-gradient-to-r from-amber-800 via-amber-900 to-orange-900 shadow-2xl sticky top-0 z-50 border-b-4 border-amber-600">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="bg-amber-600 p-2 sm:p-3 rounded-xl shadow-lg shrink-0">
              {branding.logo ? (
                <img src={`${BASE_URL}${branding.logo}`} alt="Logo" className="w-5 h-5 sm:w-7 sm:h-7 object-contain" />
              ) : (
                <LayoutDashboard className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-xl lg:text-2xl font-bold text-amber-50 truncate leading-tight">
                {branding.name || 'Restaurant'} <span className="hidden sm:inline">- Admin</span>
              </h1>
              <p className="text-amber-200 text-xs hidden sm:block">Manage your restaurant</p>
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:block text-right">
              <p className="text-amber-50 font-medium text-sm">{admin.name}</p>
              <p className="text-amber-200 text-xs">{admin.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl hover:bg-red-700 flex items-center gap-1 sm:gap-2 shadow-lg transition-all text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Tab Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 bg-white/90 backdrop-blur-md p-2 sm:p-3 rounded-2xl shadow-xl overflow-x-auto border border-amber-200 scrollbar-hide"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 sm:px-5 lg:px-6 py-2 sm:py-3 lg:py-4 font-semibold rounded-xl flex items-center gap-1 sm:gap-2 transition-all text-xs sm:text-sm lg:text-base ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white shadow-lg shadow-amber-300'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
                <div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-white/10 rounded-full -ml-18 sm:-ml-24 -mb-18 sm:-mb-24"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Welcome back, {admin.name}!</h2>
                  <p className="text-amber-100 text-sm sm:text-lg">Here's what's happening with your restaurant today</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {[
                  { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'blue', sub: 'Active inventory', subIcon: TrendingUp },
                  { label: 'Categories', value: stats.totalCategories, icon: FolderTree, color: 'purple', sub: 'Product groups', subIcon: ShoppingBag },
                  { label: 'Menu Items', value: stats.visibleProducts, icon: Menu, color: 'green', sub: 'Visible to customers', subIcon: Eye },
                  { label: 'QR Codes', value: stats.totalQRCodes, icon: QrCode, color: 'amber', sub: 'Generated codes', subIcon: Download },
                ].map((stat, i) => {
                  const Icon = stat.icon; const SubIcon = stat.subIcon;
                  const colorMap = { blue: 'border-l-blue-500 bg-blue-100/80 text-blue-600', purple: 'border-l-purple-500 bg-purple-100/80 text-purple-600', green: 'border-l-green-500 bg-green-100/80 text-green-600', amber: 'border-l-amber-500 bg-amber-100/80 text-amber-600' };
                  const [borderColor, bgColor, textColor] = colorMap[stat.color].split(' ');
                  return (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.1 }} whileHover={{ y: -4 }}
                      className={`backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-4 sm:p-6 border-l-4 ${borderColor}`}
                      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 20px 40px rgba(0,0,0,0.08)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 text-xs sm:text-sm font-semibold tracking-wide">{stat.label}</p>
                          <h3 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-1 sm:mt-2">{stat.value}</h3>
                        </div>
                        <div className={`${bgColor} p-2 sm:p-4 rounded-2xl`}>
                          <Icon className={`w-5 h-5 sm:w-8 sm:h-8 ${textColor}`} />
                        </div>
                      </div>
                      <div className={`mt-3 sm:mt-4 flex items-center ${textColor} text-xs sm:text-sm font-medium`}>
                        <SubIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{stat.sub}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-5 sm:p-8"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 20px 40px rgba(0,0,0,0.08)' }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { label: 'Add New Product', tab: 'products', color: 'from-blue-600 to-blue-700', icon: Plus },
                    { label: 'Add Category', tab: 'categories', color: 'from-purple-600 to-purple-700', icon: Plus },
                    { label: 'Generate QR Code', tab: 'qrcodes', color: 'from-amber-600 to-amber-700', icon: QrCode },
                  ].map(({ label, tab, color, icon: Icon }) => (
                    <motion.button key={tab} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab)}
                      className={`bg-gradient-to-r ${color} text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                      <span className="font-semibold text-sm sm:text-base">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* CATEGORIES */}
          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Category Management</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Organize your products into categories</p>
              </div>

              <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdateCategory(editingId); } : handleCreateCategory}
                className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-amber-200"
              >
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="bg-amber-100 p-2 sm:p-3 rounded-xl">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Multi-Language Category</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">English Name *</label>
                    <input type="text" placeholder="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all text-sm sm:text-base" required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Afaan Oromo</label>
                    <input type="text" placeholder="Maqaa ramaddii" value={categoryForm.nameOr} onChange={(e) => setCategoryForm({ ...categoryForm, nameOr: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all text-sm sm:text-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">አማርኛ (Amharic)</label>
                    <input type="text" placeholder="የምድብ ስም" value={categoryForm.nameAm} onChange={(e) => setCategoryForm({ ...categoryForm, nameAm: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all text-sm sm:text-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Soomaali (Somali)</label>
                    <input type="text" placeholder="Magaca qaybta" value={categoryForm.nameSo} onChange={(e) => setCategoryForm({ ...categoryForm, nameSo: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all text-sm sm:text-base" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700">العربية (Arabic)</label>
                    <input type="text" placeholder="اسم الفئة" value={categoryForm.nameAr} onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all text-sm sm:text-base" dir="rtl" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-5 sm:mt-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 flex items-center gap-2 shadow-lg transition-all font-semibold text-sm sm:text-base">
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {editingId ? 'Update' : 'Create'} Category
                  </motion.button>
                  {editingId && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-600 flex items-center gap-2 shadow-lg transition-all font-semibold text-sm sm:text-base">
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      Cancel
                    </motion.button>
                  )}
                </div>
              </motion.form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {categories.map((category, index) => (
                  <motion.div key={category.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}
                    className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-4 sm:p-6"
                    style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 20px 40px rgba(0,0,0,0.08)' }}
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{category.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">ID: {category.id}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-amber-100/80 p-2 sm:p-3 rounded-2xl ml-2 shrink-0">
                        <FolderTree className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 sm:mt-4">
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => startEdit(category)} className="flex-1 bg-blue-600 text-white px-3 py-2 sm:py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-1 sm:gap-2 shadow-md transition-all font-medium text-sm">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDeleteCategory(category.id)} className="flex-1 bg-red-600 text-white px-3 py-2 sm:py-3 rounded-xl hover:bg-red-700 flex items-center justify-center gap-1 sm:gap-2 shadow-md transition-all font-medium text-sm">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {categories.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
                  <FolderTree className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">No categories yet. Create your first category above!</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Management</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Add and manage your menu products</p>
              </div>

              <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} onSubmit={handleProductSubmit} className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-amber-200">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-xl">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Product Information</h3>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">Product Names</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <input type="text" placeholder="English Name *" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" required />
                      <input type="text" placeholder="Afaan Oromo" value={productForm.nameOr} onChange={(e) => setProductForm({ ...productForm, nameOr: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" />
                      <input type="text" placeholder="አማርኛ" value={productForm.nameAm} onChange={(e) => setProductForm({ ...productForm, nameAm: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" />
                      <input type="text" placeholder="Soomaali" value={productForm.nameSo} onChange={(e) => setProductForm({ ...productForm, nameSo: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" />
                      <input type="text" placeholder="العربية" value={productForm.nameAr} onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base sm:col-span-2" dir="rtl" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">Descriptions</h4>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <textarea placeholder="English Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" rows="2" />
                      <textarea placeholder="Ibsa (Afaan Oromo)" value={productForm.descriptionOr} onChange={(e) => setProductForm({ ...productForm, descriptionOr: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" rows="2" />
                      <textarea placeholder="መግለጫ (አማርኛ)" value={productForm.descriptionAm} onChange={(e) => setProductForm({ ...productForm, descriptionAm: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" rows="2" />
                      <textarea placeholder="Sharaxaad (Soomaali)" value={productForm.descriptionSo} onChange={(e) => setProductForm({ ...productForm, descriptionSo: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" rows="2" />
                      <textarea placeholder="الوصف (العربية)" value={productForm.descriptionAr} onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })} className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" rows="2" dir="rtl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Birr) *</label>
                      <input type="number" step="0.01" placeholder="0.00" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prep Time</label>
                      <input type="text" placeholder="e.g., 15-20 min" value={productForm.prepTime} onChange={(e) => setProductForm({ ...productForm, prepTime: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm sm:text-base" required>
                      <option value="">Select Category</option>
                      {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      Product Images (Multiple)
                    </label>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base" />
                    <p className="text-xs text-gray-500 mt-1">You can select multiple images (up to 10)</p>
                    {productForm.image && getProductImages(productForm.image).length > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
                        {getProductImages(productForm.image).map((img, index) => (
                          <motion.div key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                            <img src={`${BASE_URL}${img}`} alt={`Preview ${index + 1}`} className="h-24 sm:h-32 w-full object-cover rounded-xl shadow-lg border-4 border-blue-200" />
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white p-1 sm:p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </motion.button>
                            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">{index + 1}</div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg transition-all font-semibold text-sm sm:text-base">
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {editingProductId ? 'Update' : 'Create'} Product
                  </motion.button>
                  {editingProductId && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={cancelEditProduct} className="bg-gray-500 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-600 flex items-center gap-2 shadow-lg transition-all font-semibold text-sm sm:text-base">
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      Cancel
                    </motion.button>
                  )}
                </div>
              </motion.form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product, index) => {
                  const images = getProductImages(product.image);
                  const firstImage = images.length > 0 ? images[0] : null;
                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}
                      className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl overflow-hidden"
                      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 20px 40px rgba(0,0,0,0.08)' }}
                    >
                      {firstImage ? (
                        <div className="h-40 sm:h-48 overflow-hidden relative">
                          <img src={`${BASE_URL}${firstImage}`} alt={product.name} className="w-full h-full object-cover" />
                          {images.length > 1 && <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs font-bold">+{images.length - 1}</div>}
                        </div>
                      ) : (
                        <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{product.category.name}</p>
                          </div>
                          <span className="bg-green-100/80 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ml-2 shrink-0">{product.price} Birr</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex gap-2">
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => startEditProduct(product)} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 sm:gap-2 shadow-md transition-all text-xs sm:text-sm font-medium">
                            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            Edit
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDeleteProduct(product.id)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 sm:gap-2 shadow-md transition-all text-xs sm:text-sm font-medium">
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {products.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
                  <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">No products yet. Create your first product above!</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* DIGITAL MENU */}
          {activeTab === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Digital Menu Management</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Control which products appear on your public menu</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product, index) => {
                  const images = getProductImages(product.image);
                  const firstImage = images.length > 0 ? images[0] : null;
                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}
                      className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl overflow-hidden"
                      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 20px 40px rgba(0,0,0,0.08)' }}
                    >
                      {firstImage ? (
                        <div className="h-40 sm:h-48 overflow-hidden relative">
                          <img src={`${BASE_URL}${firstImage}`} alt={product.name} className="w-full h-full object-cover" />
                          {images.length > 1 && <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs font-bold">+{images.length - 1}</div>}
                          {product.showInMenu && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Visible
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                          <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                          {product.showInMenu && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Visible
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{product.category.name}</p>
                          </div>
                          <span className="bg-green-100/80 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ml-2 shrink-0">{product.price} Birr</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleToggleMenuVisibility(product.id)}
                          className={`w-full px-4 py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all text-sm sm:text-base ${
                            product.showInMenu
                              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                              : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600'
                          }`}
                        >
                          {product.showInMenu ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                          {product.showInMenu ? 'Hide from Menu' : 'Show in Menu'}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {products.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
                  <Menu className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">No products yet. Create products first in the "Products" tab.</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* QR CODES */}
          {activeTab === 'qrcodes' && (
            <motion.div key="qrcodes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">QR Code Management</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Generate and manage QR codes for your restaurant</p>
              </div>

              <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} onSubmit={handleQrcodeSubmit} className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-amber-200">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="bg-amber-100 p-2 sm:p-3 rounded-xl">
                    <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">QR Code Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">QR Code Name *</label>
                    <input type="text" placeholder="e.g., Table 1, Menu Link" value={qrcodeForm.name} onChange={(e) => setQrcodeForm({ ...qrcodeForm, name: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all text-sm sm:text-base" required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">URL *</label>
                    <input type="url" placeholder="https://example.com" value={qrcodeForm.url} onChange={(e) => setQrcodeForm({ ...qrcodeForm, url: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all text-sm sm:text-base" required />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700">Description (Optional)</label>
                    <textarea placeholder="Add a description..." value={qrcodeForm.description} onChange={(e) => setQrcodeForm({ ...qrcodeForm, description: e.target.value })} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all text-sm sm:text-base" rows="3" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-5 sm:mt-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 flex items-center gap-2 shadow-lg transition-all font-semibold text-sm sm:text-base">
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                    {editingQrcodeId ? 'Update' : 'Generate'} QR Code
                  </motion.button>
                  {editingQrcodeId && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={cancelEditQrcode} className="bg-gray-500 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-600 flex items-center gap-2 shadow-lg transition-all font-semibold text-sm sm:text-base">
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      Cancel
                    </motion.button>
                  )}
                </div>
              </motion.form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {qrcodes.map((qrcode, index) => (
                  <motion.div key={qrcode.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -4 }}
                    className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-4 sm:p-6"
                    style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 20px 40px rgba(0,0,0,0.08)' }}
                  >
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{qrcode.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{qrcode.description}</p>
                    <div className="flex justify-center mb-3 sm:mb-4 bg-gray-50/50 p-3 sm:p-4 rounded-2xl">
                      <motion.img whileHover={{ scale: 1.05 }} src={qrcode.qrCodeData} alt={qrcode.name} className="w-36 h-36 sm:w-48 sm:h-48 rounded-lg shadow-md" />
                    </div>
                    <p className="text-xs text-gray-600 mb-3 sm:mb-4 break-all bg-gray-50/50 p-2 sm:p-3 rounded-lg">
                      <span className="font-semibold">URL:</span> {qrcode.url}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewingQrcode(qrcode)} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-2 py-2 sm:py-3 rounded-xl hover:from-green-700 hover:to-green-800 flex items-center justify-center gap-1 sm:gap-2 shadow-md transition-all font-medium text-xs sm:text-sm">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        View
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handlePrintQrcode(qrcode)} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-2 py-2 sm:py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center gap-1 sm:gap-2 shadow-md transition-all font-medium text-xs sm:text-sm">
                        <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                        Print
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => startEditQrcode(qrcode)} className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-2 py-2 sm:py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 flex items-center justify-center gap-1 sm:gap-2 shadow-md transition-all font-medium text-xs sm:text-sm">
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Edit
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDeleteQrcode(qrcode.id)} className="bg-gradient-to-r from-red-600 to-red-700 text-white px-2 py-2 sm:py-3 rounded-xl hover:from-red-700 hover:to-red-800 flex items-center justify-center gap-1 sm:gap-2 shadow-md transition-all font-medium text-xs sm:text-sm">
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {qrcodes.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
                  <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">No QR codes yet. Generate your first QR code above!</p>
                </motion.div>
              )}

              <AnimatePresence>
                {viewingQrcode && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingQrcode(null)}>
                    <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border-4 border-amber-300" onClick={(e) => e.stopPropagation()}>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">{viewingQrcode.name}</h3>
                      <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">{viewingQrcode.description}</p>
                      <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl mb-4 sm:mb-6">
                        <motion.img whileHover={{ scale: 1.05 }} src={viewingQrcode.qrCodeData} alt={viewingQrcode.name} className="w-full rounded-xl shadow-lg" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 break-all bg-gray-50 p-3 sm:p-4 rounded-xl">
                        <span className="font-semibold">URL:</span> {viewingQrcode.url}
                      </p>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setViewingQrcode(null)} className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 sm:py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 flex items-center justify-center gap-2 shadow-lg transition-all font-semibold text-sm sm:text-base">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        Close
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">System Settings</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage user accounts and platform configuration</p>
              </div>

              {/* Restaurant Settings */}
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="bg-amber-100 p-2 sm:p-3 rounded-xl">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Restaurant Settings</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Customize your restaurant branding</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateRestaurant} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                      <input type="text" placeholder="My Restaurant" value={restaurantForm.name} onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subname / Tagline</label>
                      <input type="text" placeholder="Delicious Food & Great Service" value={restaurantForm.subname} onChange={(e) => setRestaurantForm({ ...restaurantForm, subname: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Browser Tab Title *</label>
                    <input type="text" placeholder="Restaurant Management" value={restaurantForm.browserTitle} onChange={(e) => setRestaurantForm({ ...restaurantForm, browserTitle: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base" required />
                    <p className="text-xs text-gray-500 mt-1">This will appear in the browser tab</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      Favicon (Browser Tab Icon)
                    </label>
                    <input type="file" accept="image/*" onChange={handleFaviconUpload} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm sm:text-base" />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 32x32px or 64x64px square image</p>
                    {restaurantForm.favicon && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4">
                        <img src={`${BASE_URL}${restaurantForm.favicon}`} alt="Favicon" className="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-xl shadow-lg border-2 border-amber-200 bg-white p-2" />
                        <button type="button" onClick={() => setRestaurantForm({ ...restaurantForm, favicon: '' })} className="text-red-600 hover:text-red-700 text-sm font-medium">Remove Favicon</button>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      Restaurant Logo (Navigation/Menu)
                    </label>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm sm:text-base" />
                    <p className="text-xs text-gray-500 mt-1">This logo will appear in the navigation bar and customer menu</p>
                    {restaurantForm.logo && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4">
                        <img src={`${BASE_URL}${restaurantForm.logo}`} alt="Restaurant Logo" className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-xl shadow-lg border-2 border-amber-200 bg-white p-2" />
                        <button type="button" onClick={() => setRestaurantForm({ ...restaurantForm, logo: '' })} className="text-red-600 hover:text-red-700 text-sm font-medium">Remove Logo</button>
                      </motion.div>
                    )}
                  </div>

                  {/* SEO Section */}
                  <div className="border-t border-gray-200 pt-5 sm:pt-6 mt-2">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      SEO & Location Settings
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords</label>
                        <input type="text" placeholder="Cafe Dire Dawa, ethiopia, coffee shop" value={restaurantForm.seoKeywords} onChange={(e) => setRestaurantForm({ ...restaurantForm, seoKeywords: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base" />
                        <p className="text-xs text-gray-500 mt-1">Comma-separated keywords for search engines</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                        <textarea placeholder="Brief description of your restaurant for search engines..." value={restaurantForm.seoDescription} onChange={(e) => setRestaurantForm({ ...restaurantForm, seoDescription: e.target.value })} rows="3" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none text-sm sm:text-base" />
                        <p className="text-xs text-gray-500 mt-1">150-160 characters recommended</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input type="text" placeholder="Dire Dawa" value={restaurantForm.city} onChange={(e) => setRestaurantForm({ ...restaurantForm, city: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input type="text" placeholder="Ethiopia" value={restaurantForm.country} onChange={(e) => setRestaurantForm({ ...restaurantForm, country: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                        <input type="text" placeholder="Street address, Dire Dawa, Ethiopia" value={restaurantForm.location} onChange={(e) => setRestaurantForm({ ...restaurantForm, location: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color Theme</label>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <input type="color" value={restaurantForm.primaryColor} onChange={(e) => setRestaurantForm({ ...restaurantForm, primaryColor: e.target.value })} className="h-10 sm:h-12 w-16 sm:w-24 rounded-lg border border-gray-300 cursor-pointer" />
                      <input type="text" value={restaurantForm.primaryColor} onChange={(e) => setRestaurantForm({ ...restaurantForm, primaryColor: e.target.value })} className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono text-sm sm:text-base" placeholder="#d97706" />
                    </div>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {['#d97706', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'].map(color => (
                        <button key={color} type="button" onClick={() => setRestaurantForm({ ...restaurantForm, primaryColor: color })} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all" style={{ backgroundColor: color }} title={color} />
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg mt-0.5 shrink-0">
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-amber-900 mb-1">Preview</h4>
                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-amber-200 space-y-2 sm:space-y-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {restaurantForm.logo && <img src={`${BASE_URL}${restaurantForm.logo}`} alt="Logo Preview" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />}
                            <div>
                              <h3 className="font-bold text-base sm:text-lg" style={{ color: restaurantForm.primaryColor }}>{restaurantForm.name || 'My Restaurant'}</h3>
                              {restaurantForm.subname && <p className="text-xs sm:text-sm text-gray-600">{restaurantForm.subname}</p>}
                            </div>
                          </div>
                          <div className="border-t pt-2 sm:pt-3">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              {restaurantForm.favicon && <img src={`${BASE_URL}${restaurantForm.favicon}`} alt="Favicon Preview" className="h-4 w-4 object-contain" />}
                              <span className="font-medium">{restaurantForm.browserTitle || 'Restaurant Management'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-amber-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-amber-700 flex items-center gap-2 shadow-md transition-all font-medium text-sm sm:text-base">
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    Update Restaurant Settings
                  </motion.button>
                </form>
              </motion.div>

              {/* Admin Account */}
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="bg-indigo-100 p-2 sm:p-3 rounded-xl">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Admin Account</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Update your admin credentials</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateAdmin} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-xs text-gray-500">(Can be used as username)</span>
                      </label>
                      <div className="relative">
                        <input type="text" placeholder="Admin User" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base" required />
                        <button type="button" onClick={() => handleCopyToClipboard(adminForm.name, 'name')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors">
                          {copiedField === 'name' ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <input type="email" placeholder="admin@example.com" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base" required />
                        <button type="button" onClick={() => handleCopyToClipboard(adminForm.email, 'email')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors">
                          {copiedField === 'email' ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password <span className="text-xs text-gray-500">(leave empty to keep current)</span>
                    </label>
                    <div className="relative">
                      <input type={showPassword.admin ? "text" : "password"} placeholder="••••••••" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-20 sm:pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button type="button" onClick={() => handleCopyToClipboard(adminForm.password, 'password')} className="text-gray-400 hover:text-indigo-600 transition-colors" disabled={!adminForm.password}>
                          {copiedField === 'password' ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                        <button type="button" onClick={() => togglePasswordVisibility('admin')} className="text-gray-400 hover:text-indigo-600 transition-colors">
                          {showPassword.admin ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg mt-0.5 shrink-0">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Login Options</h4>
                        <p className="text-xs text-blue-700">You can login using either your <span className="font-semibold">Email</span> or <span className="font-semibold">Name</span> (as username) with your password.</p>
                      </div>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-md transition-all font-medium text-sm sm:text-base">
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    Update Admin Account
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
