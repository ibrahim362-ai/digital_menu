import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderTree, Package, Menu, QrCode, LogOut, Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Printer,
  Image as ImageIcon, ChevronRight, TrendingUp, ShoppingBag, Download, Globe, Settings, Users, ChefHat, CreditCard, Shield, Copy, Check
} from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { useBranding } from '../context/BrandingContext';

export default function Admin() {
  const { branding, updateBranding, BASE_URL, fetchBranding } = useBranding();
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '' });
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ 
    name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '',
    description: '', descriptionOr: '', descriptionAm: '', descriptionSo: '', descriptionAr: '',
    price: '', image: '', categoryId: '' 
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [qrcodes, setQrcodes] = useState([]);
  const [qrcodeForm, setQrcodeForm] = useState({ name: '', url: '', description: '' });
  const [editingQrcodeId, setEditingQrcodeId] = useState(null);
  const [viewingQrcode, setViewingQrcode] = useState(null);
  
  // Settings state
  const [adminForm, setAdminForm] = useState({ email: '', password: '', name: '' });
  const [restaurantForm, setRestaurantForm] = useState({ 
    name: '', 
    subname: '', 
    logo: '', 
    favicon: '',
    browserTitle: '',
    primaryColor: '#d97706' 
  });
  const [showPassword, setShowPassword] = useState({});
  const [copiedField, setCopiedField] = useState(null);
  
  const navigate = useNavigate();

  // Setup axios interceptor for handling 401 errors
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

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = getCurrentUser();
      if (!user || user.role !== 'admin') {
        navigate('/admin/login', { replace: true });
        return;
      }
      setAdmin(user);
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'categories') fetchCategories();
    else if (activeTab === 'products') { fetchProducts(); fetchCategories(); }
    else if (activeTab === 'qrcodes') fetchQrcodes();
    else if (activeTab === 'menu') { fetchProducts(); fetchCategories(); }
    else if (activeTab === 'settings') { 
      // Populate admin form with current admin data
      if (admin) {
        setAdminForm({ 
          name: admin.name || '', 
          email: admin.email || '', 
          password: '' 
        });
      }
      // Fetch restaurant settings
      fetchRestaurantSettings();
    }
  }, [activeTab, admin]);

  // Update document title when restaurant settings change
  useEffect(() => {
    if (restaurantForm.browserTitle) {
      document.title = `${restaurantForm.browserTitle} - Admin`;
    }
  }, [restaurantForm.browserTitle]);

  // API base URL from environment
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  
  // Axios config with credentials
  const axiosConfig = { withCredentials: true };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`, axiosConfig);
      setCategories(data);
    } catch (err) { 
      console.error('Failed to fetch categories', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    }
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
    try {
      await axios.delete(`${API_URL}/categories/${id}`, axiosConfig);
      fetchCategories();
    } catch (err) { console.error('Failed to delete category'); }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setCategoryForm({ name: category.name, nameOr: category.nameOr || '', nameAm: category.nameAm || '', nameSo: category.nameSo || '', nameAr: category.nameAr || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCategoryForm({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '' });
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`, axiosConfig);
      setProducts(data);
    } catch (err) { 
      console.error('Failed to fetch products', err.response?.data || err.message); 
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    try {
      let uploadedUrls = [];
      
      // If multiple files, use the multiple endpoint
      if (files.length > 1) {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('images', file);
        });
        
        console.log('Uploading multiple files:', files.length);
        const { data } = await axios.post(`${API_URL}/upload/multiple`, formData, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        });
        console.log('Upload response:', data);
        uploadedUrls = data.urls;
      } else {
        // Single file upload
        const formData = new FormData();
        formData.append('image', files[0]);
        
        console.log('Uploading single file');
        const { data } = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        });
        console.log('Upload response:', data);
        uploadedUrls = [data.url];
      }
      
      // Store as JSON array
      let currentImages = [];
      if (productForm.image) {
        try {
          const parsed = JSON.parse(productForm.image);
          currentImages = Array.isArray(parsed) ? parsed : [productForm.image];
        } catch {
          // If not valid JSON, treat as single image or comma-separated
          currentImages = productForm.image.includes(',') 
            ? productForm.image.split(',').map(img => img.trim()) 
            : [productForm.image];
        }
      }
      
      const newImages = [...currentImages, ...uploadedUrls];
      setProductForm({ ...productForm, image: JSON.stringify(newImages) });
      console.log('Images updated successfully');
    } catch (err) { 
      console.error('Upload error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert(`Failed to upload images: ${errorMsg}`); 
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    try {
      const currentImages = productForm.image ? JSON.parse(productForm.image) : [];
      const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
      setProductForm({ ...productForm, image: updatedImages.length > 0 ? JSON.stringify(updatedImages) : '' });
    } catch (err) {
      console.error('Failed to remove image');
    }
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
      setProductForm({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '', description: '', descriptionOr: '', descriptionAm: '', descriptionSo: '', descriptionAr: '', price: '', image: '', categoryId: '' });
      fetchProducts();
    } catch (err) { console.error('Failed to save product'); }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name, nameOr: product.nameOr || '', nameAm: product.nameAm || '', nameSo: product.nameSo || '', nameAr: product.nameAr || '',
      description: product.description || '', descriptionOr: product.descriptionOr || '', descriptionAm: product.descriptionAm || '', descriptionSo: product.descriptionSo || '', descriptionAr: product.descriptionAr || '',
      price: product.price, image: product.image || '', categoryId: product.categoryId
    });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProductForm({ name: '', nameOr: '', nameAm: '', nameSo: '', nameAr: '', description: '', descriptionOr: '', descriptionAm: '', descriptionSo: '', descriptionAr: '', price: '', image: '', categoryId: '' });
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, axiosConfig);
      fetchProducts();
    } catch (err) { console.error('Failed to delete product'); }
  };

  const fetchQrcodes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/qrcodes`, axiosConfig);
      setQrcodes(data);
    } catch (err) { 
      console.error('Failed to fetch QR codes', err.response?.data || err.message); 
    }
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

  const startEditQrcode = (qrcode) => {
    setEditingQrcodeId(qrcode.id);
    setQrcodeForm({ name: qrcode.name, url: qrcode.url, description: qrcode.description || '' });
  };

  const cancelEditQrcode = () => {
    setEditingQrcodeId(null);
    setQrcodeForm({ name: '', url: '', description: '' });
  };

  const handleDeleteQrcode = async (id) => {
    if (!confirm('Delete this QR code?')) return;
    try {
      await axios.delete(`${API_URL}/qrcodes/${id}`, axiosConfig);
      fetchQrcodes();
    } catch (err) { console.error('Failed to delete QR code'); }
  };

  const handlePrintQrcode = (qrcode) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Print QR Code - ${qrcode.name}</title><style>body { text-align: center; padding: 20px; font-family: Arial, sans-serif; } h2 { margin-bottom: 10px; } img { max-width: 400px; margin: 20px 0; } @media print { button { display: none; } }</style></head><body><h2>${qrcode.name}</h2><p>${qrcode.description || ''}</p><img src="${qrcode.qrCodeData}" alt="QR Code" /><p>URL: ${qrcode.url}</p><button onclick="window.print()">Print</button></body></html>`);
    printWindow.document.close();
  };

  const handleToggleMenuVisibility = async (productId) => {
    try {
      await axios.put(`${API_URL}/products/${productId}/toggle-menu`, {}, axiosConfig);
      fetchProducts();
    } catch (err) { console.error('Failed to toggle menu visibility'); }
  };

  // Settings functions
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!adminForm.name || !adminForm.email) {
      alert('Name and email are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminForm.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate password if provided (only validate if not empty)
    if (adminForm.password && adminForm.password.trim() !== '') {
      if (adminForm.password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
    }

    try {
      const updateData = {
        name: adminForm.name,
        email: adminForm.email,
      };
      
      // Only include password if it's not empty
      if (adminForm.password && adminForm.password.trim() !== '') {
        updateData.password = adminForm.password;
      }
      
      const response = await axios.put(`${API_URL}/settings/admin`, updateData, axiosConfig);
      alert('Admin credentials updated successfully');
      
      // Clear password field but keep name and email
      setAdminForm({ ...adminForm, password: '' });
      
      // Update the admin state with new data
      if (response.data.admin) {
        setAdmin(response.data.admin);
        // Update localStorage
        const user = getCurrentUser();
        if (user) {
          user.name = response.data.admin.name;
          user.email = response.data.admin.email;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (err) { 
      console.error('Update admin error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to update admin credentials';
      alert(errorMessage);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCopyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const fetchRestaurantSettings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/settings/restaurant`);
      setRestaurantForm({
        name: data.name || '',
        subname: data.subname || '',
        logo: data.logo || '',
        favicon: data.favicon || '',
        browserTitle: data.browserTitle || 'Restaurant Management',
        primaryColor: data.primaryColor || '#d97706'
      });
    } catch (err) {
      console.error('Failed to fetch restaurant settings', err);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }
      });
      setRestaurantForm({ ...restaurantForm, logo: data.url });
    } catch (err) { 
      console.error('Failed to upload logo'); 
      alert('Failed to upload logo'); 
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }
      });
      setRestaurantForm({ ...restaurantForm, favicon: data.url });
    } catch (err) { 
      console.error('Failed to upload favicon'); 
      alert('Failed to upload favicon'); 
    }
  };

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    
    if (!restaurantForm.name) {
      alert('Restaurant name is required');
      return;
    }

    if (!restaurantForm.browserTitle) {
      alert('Browser title is required');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/settings/restaurant`, restaurantForm, axiosConfig);
      alert('Restaurant settings updated successfully');
      
      if (response.data.settings) {
        const updatedSettings = {
          name: response.data.settings.name,
          subname: response.data.settings.subname || '',
          logo: response.data.settings.logo || '',
          favicon: response.data.settings.favicon || '',
          browserTitle: response.data.settings.browserTitle || 'Restaurant Management',
          primaryColor: response.data.settings.primaryColor || '#d97706'
        };
        setRestaurantForm(updatedSettings);
        
        // Update global branding context
        updateBranding(updatedSettings);
      }
    } catch (err) { 
      console.error('Update restaurant error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update restaurant settings';
      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    { id: 'menu', label: 'Digital Menu', icon: Menu },
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
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="bg-gradient-to-r from-amber-800 via-amber-900 to-orange-900 shadow-2xl sticky top-0 z-50 border-b-4 border-amber-600">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <div className="bg-amber-600 p-3 rounded-xl shadow-lg">
              {branding.logo ? (
                <img 
                  src={`${BASE_URL}${branding.logo}`} 
                  alt="Restaurant Logo" 
                  className="w-7 h-7 object-contain"
                />
              ) : (
                <LayoutDashboard className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-50">
                {branding.name || 'Restaurant'} - Admin
              </h1>
              <p className="text-amber-200 text-sm">Manage your restaurant</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="text-amber-50 font-medium">{admin.name}</p>
              <p className="text-amber-200 text-xs">{admin.email}</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700 flex items-center gap-2 shadow-lg transition-all">
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mb-8 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl overflow-x-auto border border-amber-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button key={tab.id} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold rounded-xl flex items-center gap-3 whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white shadow-lg shadow-amber-300' : 'text-amber-800 hover:bg-amber-100'}`}>
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold mb-2">Welcome back, {admin.name}!</h2>
                  <p className="text-amber-100 text-lg">Here's what's happening with your restaurant today</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 }} 
                  whileHover={{ y: -5 }} 
                  className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-6 border-l-4 border-l-blue-500"
                  style={{
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 text-sm font-semibold tracking-wide">Total Products</p>
                      <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{stats.totalProducts}</h3>
                    </div>
                    <div className="bg-blue-100/80 backdrop-blur-sm p-4 rounded-2xl">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Active inventory</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }} 
                  whileHover={{ y: -5 }} 
                  className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-6 border-l-4 border-l-purple-500"
                  style={{
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 text-sm font-semibold tracking-wide">Categories</p>
                      <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{stats.totalCategories}</h3>
                    </div>
                    <div className="bg-purple-100/80 backdrop-blur-sm p-4 rounded-2xl">
                      <FolderTree className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    <span>Product groups</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }} 
                  whileHover={{ y: -5 }} 
                  className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-6 border-l-4 border-l-green-500"
                  style={{
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 text-sm font-semibold tracking-wide">Menu Items</p>
                      <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{stats.visibleProducts}</h3>
                    </div>
                    <div className="bg-green-100/80 backdrop-blur-sm p-4 rounded-2xl">
                      <Menu className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>Visible to customers</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }} 
                  whileHover={{ y: -5 }} 
                  className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-6 border-l-4 border-l-amber-500"
                  style={{
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 text-sm font-semibold tracking-wide">QR Codes</p>
                      <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{stats.totalQRCodes}</h3>
                    </div>
                    <div className="bg-amber-100/80 backdrop-blur-sm p-4 rounded-2xl">
                      <QrCode className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-amber-600 text-sm font-medium">
                    <Download className="w-4 h-4 mr-1" />
                    <span>Generated codes</span>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }} 
                className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-8"
                style={{
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => setActiveTab('products')} 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="font-semibold">Add New Product</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => setActiveTab('categories')} 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="font-semibold">Add Category</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => setActiveTab('qrcodes')} 
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4"
                  >
                    <QrCode className="w-6 h-6" />
                    <span className="font-semibold">Generate QR Code</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Category Management</h2>
                  <p className="text-gray-600 mt-1">Organize your products into categories</p>
                </div>
              </div>

              <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdateCategory(editingId); } : handleCreateCategory} className="bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <Globe className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Multi-Language Category</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">English Name *</label>
                    <input type="text" placeholder="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all" required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Afaan Oromo</label>
                    <input type="text" placeholder="Maqaa ramaddii" value={categoryForm.nameOr} onChange={(e) => setCategoryForm({ ...categoryForm, nameOr: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">አማርኛ (Amharic)</label>
                    <input type="text" placeholder="የምድብ ስም" value={categoryForm.nameAm} onChange={(e) => setCategoryForm({ ...categoryForm, nameAm: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Soomaali (Somali)</label>
                    <input type="text" placeholder="Magaca qaybta" value={categoryForm.nameSo} onChange={(e) => setCategoryForm({ ...categoryForm, nameSo: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700">العربية (Arabic)</label>
                    <input type="text" placeholder="اسم الفئة" value={categoryForm.nameAr} onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all" dir="rtl" />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 flex items-center gap-2 shadow-lg transition-all font-semibold">
                    <Save className="w-5 h-5" />
                    {editingId ? 'Update' : 'Create'} Category
                  </motion.button>
                  {editingId && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-8 py-4 rounded-xl hover:bg-gray-600 flex items-center gap-2 shadow-lg transition-all font-semibold">
                      <X className="w-5 h-5" />
                      Cancel
                    </motion.button>
                  )}
                </div>
              </motion.form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <motion.div 
                    key={category.id} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: index * 0.05 }} 
                    whileHover={{ y: -5 }} 
                    className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-6"
                    style={{
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600">ID: {category.id}</p>
                        <p className="text-sm text-gray-600 mt-1">Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-amber-100/80 backdrop-blur-sm p-3 rounded-2xl">
                        <FolderTree className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => startEdit(category)} 
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 shadow-md transition-all font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => handleDeleteCategory(category.id)} 
                        className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 shadow-md transition-all font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {categories.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No categories yet. Create your first category above!</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
                  <p className="text-gray-600 mt-1">Add and manage your menu products</p>
                </div>
              </div>

              <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} onSubmit={handleProductSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Product Information</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4">Product Names</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="English Name *" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" required />
                      <input type="text" placeholder="Afaan Oromo" value={productForm.nameOr} onChange={(e) => setProductForm({ ...productForm, nameOr: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" />
                      <input type="text" placeholder="አማርኛ" value={productForm.nameAm} onChange={(e) => setProductForm({ ...productForm, nameAm: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" />
                      <input type="text" placeholder="Soomaali" value={productForm.nameSo} onChange={(e) => setProductForm({ ...productForm, nameSo: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" />
                      <input type="text" placeholder="العربية" value={productForm.nameAr} onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" dir="rtl" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4">Descriptions</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <textarea placeholder="English Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" rows="2" />
                      <textarea placeholder="Ibsa (Afaan Oromo)" value={productForm.descriptionOr} onChange={(e) => setProductForm({ ...productForm, descriptionOr: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" rows="2" />
                      <textarea placeholder="መግለጫ (አማርኛ)" value={productForm.descriptionAm} onChange={(e) => setProductForm({ ...productForm, descriptionAm: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" rows="2" />
                      <textarea placeholder="Sharaxaad (Soomaali)" value={productForm.descriptionSo} onChange={(e) => setProductForm({ ...productForm, descriptionSo: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" rows="2" />
                      <textarea placeholder="الوصف (العربية)" value={productForm.descriptionAr} onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })} className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" rows="2" dir="rtl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                      <input type="number" step="0.01" placeholder="0.00" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <select value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" required>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Product Images (Multiple)
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload} 
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all" 
                    />
                    <p className="text-xs text-gray-500 mt-1">You can select multiple images (up to 10)</p>
                    
                    {productForm.image && getProductImages(productForm.image).length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        {getProductImages(productForm.image).map((img, index) => (
                          <motion.div 
                            key={index}
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            className="relative group"
                          >
                            <img 
                              src={`${BASE_URL}${img}`} 
                              alt={`Preview ${index + 1}`} 
                              className="h-32 w-full object-cover rounded-xl shadow-lg border-4 border-blue-200" 
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                              {index + 1}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg transition-all font-semibold">
                    <Save className="w-5 h-5" />
                    {editingProductId ? 'Update' : 'Create'} Product
                  </motion.button>
                  {editingProductId && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={cancelEditProduct} className="bg-gray-500 text-white px-8 py-4 rounded-xl hover:bg-gray-600 flex items-center gap-2 shadow-lg transition-all font-semibold">
                      <X className="w-5 h-5" />
                      Cancel
                    </motion.button>
                  )}
                </div>
              </motion.form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => {
                  const images = getProductImages(product.image);
                  const firstImage = images.length > 0 ? images[0] : null;
                  
                  return (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: index * 0.05 }} 
                    whileHover={{ y: -5 }} 
                    className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {firstImage ? (
                      <div className="h-48 overflow-hidden relative">
                        <img src={`${BASE_URL}${firstImage}`} alt={product.name} className="w-full h-full object-cover" />
                        {images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                            +{images.length - 1} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category.name}</p>
                        </div>
                        <span className="bg-green-100/80 backdrop-blur-sm text-green-800 px-3 py-1 rounded-full text-sm font-bold">${product.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }} 
                          onClick={() => startEditProduct(product)} 
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 shadow-md transition-all text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }} 
                          onClick={() => handleDeleteProduct(product.id)} 
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 shadow-md transition-all text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
              {products.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No products yet. Create your first product above!</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Digital Menu Management</h2>
                <p className="text-gray-600 mt-1">Control which products appear on your public menu at <a href="/" target="_blank" className="text-amber-600 hover:underline font-medium">http://localhost:5173/</a></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => {
                  const images = getProductImages(product.image);
                  const firstImage = images.length > 0 ? images[0] : null;
                  
                  return (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: index * 0.05 }} 
                    whileHover={{ y: -5 }} 
                    className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {firstImage ? (
                      <div className="h-48 overflow-hidden relative">
                        <img src={`${BASE_URL}${firstImage}`} alt={product.name} className="w-full h-full object-cover" />
                        {images.length > 1 && (
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                            +{images.length - 1} more
                          </div>
                        )}
                        {product.showInMenu && (
                          <div className="absolute top-3 right-3 bg-green-500 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Visible
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                        {product.showInMenu && (
                          <div className="absolute top-3 right-3 bg-green-500 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Visible
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category.name}</p>
                        </div>
                        <span className="bg-green-100/80 backdrop-blur-sm text-green-800 px-3 py-1 rounded-full text-sm font-bold">${product.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        onClick={() => handleToggleMenuVisibility(product.id)}
                        className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all ${
                          product.showInMenu 
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800' 
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600'
                        }`}>
                        {product.showInMenu ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        {product.showInMenu ? 'Hide from Menu' : 'Show in Menu'}
                      </motion.button>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
              {products.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <Menu className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No products yet. Create products first in the "Products" tab.</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'qrcodes' && (
            <motion.div key="qrcodes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">QR Code Management</h2>
                <p className="text-gray-600 mt-1">Generate and manage QR codes for your restaurant</p>
              </div>

              <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} onSubmit={handleQrcodeSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <QrCode className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">QR Code Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">QR Code Name *</label>
                    <input type="text" placeholder="e.g., Table 1, Menu Link" value={qrcodeForm.name} onChange={(e) => setQrcodeForm({ ...qrcodeForm, name: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all" required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">URL *</label>
                    <input type="url" placeholder="https://example.com" value={qrcodeForm.url} onChange={(e) => setQrcodeForm({ ...qrcodeForm, url: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700">Description (Optional)</label>
                    <textarea placeholder="Add a description..." value={qrcodeForm.description} onChange={(e) => setQrcodeForm({ ...qrcodeForm, description: e.target.value })} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all" rows="3" />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 flex items-center gap-2 shadow-lg transition-all font-semibold">
                    <QrCode className="w-5 h-5" />
                    {editingQrcodeId ? 'Update' : 'Generate'} QR Code
                  </motion.button>
                  {editingQrcodeId && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={cancelEditQrcode} className="bg-gray-500 text-white px-8 py-4 rounded-xl hover:bg-gray-600 flex items-center gap-2 shadow-lg transition-all font-semibold">
                      <X className="w-5 h-5" />
                      Cancel
                    </motion.button>
                  )}
                </div>
              </motion.form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {qrcodes.map((qrcode, index) => (
                  <motion.div 
                    key={qrcode.id} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: index * 0.1 }} 
                    whileHover={{ y: -5 }} 
                    className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-6"
                    style={{
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{qrcode.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{qrcode.description}</p>
                    <div className="flex justify-center mb-4 bg-gray-50/50 backdrop-blur-sm p-4 rounded-2xl">
                      <motion.img 
                        whileHover={{ scale: 1.05 }} 
                        src={qrcode.qrCodeData} 
                        alt={qrcode.name} 
                        className="w-48 h-48 rounded-lg shadow-md" 
                      />
                    </div>
                    <p className="text-xs text-gray-600 mb-4 break-all bg-gray-50/50 backdrop-blur-sm p-3 rounded-lg">
                      <span className="font-semibold">URL:</span> {qrcode.url}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => setViewingQrcode(qrcode)} 
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-3 rounded-xl hover:from-green-700 hover:to-green-800 flex items-center justify-center gap-2 shadow-md transition-all font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => handlePrintQrcode(qrcode)} 
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center gap-2 shadow-md transition-all font-medium"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => startEditQrcode(qrcode)} 
                        className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 flex items-center justify-center gap-2 shadow-md transition-all font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => handleDeleteQrcode(qrcode.id)} 
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-3 rounded-xl hover:from-red-700 hover:to-red-800 flex items-center justify-center gap-2 shadow-md transition-all font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {qrcodes.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No QR codes yet. Generate your first QR code above!</p>
                </motion.div>
              )}

              <AnimatePresence>
                {viewingQrcode && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingQrcode(null)}>
                    <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-amber-300" onClick={(e) => e.stopPropagation()}>
                      <h3 className="text-3xl font-bold mb-4 text-gray-900">{viewingQrcode.name}</h3>
                      <p className="text-gray-700 mb-6">{viewingQrcode.description}</p>
                      <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                        <motion.img whileHover={{ scale: 1.05 }} src={viewingQrcode.qrCodeData} alt={viewingQrcode.name} className="w-full rounded-xl shadow-lg" />
                      </div>
                      <p className="text-sm text-gray-600 mb-6 break-all bg-gray-50 p-4 rounded-xl">
                        <span className="font-semibold">URL:</span> {viewingQrcode.url}
                      </p>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setViewingQrcode(null)} className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 flex items-center justify-center gap-2 shadow-lg transition-all font-semibold">
                        <X className="w-5 h-5" />
                        Close
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">System Settings</h2>
                <p className="text-gray-600 mt-1">Manage user accounts and platform configuration</p>
              </div>

              {/* Restaurant Settings */}
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <Settings className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Restaurant Settings</h3>
                    <p className="text-sm text-gray-600">Customize your restaurant branding</p>
                  </div>
                </div>
                
                <form onSubmit={handleUpdateRestaurant} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                      <input 
                        type="text" 
                        placeholder="My Restaurant" 
                        value={restaurantForm.name} 
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subname / Tagline</label>
                      <input 
                        type="text" 
                        placeholder="Delicious Food & Great Service" 
                        value={restaurantForm.subname} 
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, subname: e.target.value })} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Browser Tab Title *</label>
                    <input 
                      type="text" 
                      placeholder="Restaurant Management" 
                      value={restaurantForm.browserTitle} 
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, browserTitle: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
                      required 
                    />
                    <p className="text-xs text-gray-500 mt-1">This will appear in the browser tab</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Favicon (Browser Tab Icon)
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFaviconUpload} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 32x32px or 64x64px square image</p>
                    {restaurantForm.favicon && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 flex items-center gap-4">
                        <img 
                          src={`${BASE_URL}${restaurantForm.favicon}`} 
                          alt="Favicon" 
                          className="h-16 w-16 object-contain rounded-xl shadow-lg border-2 border-amber-200 bg-white p-2" 
                        />
                        <button
                          type="button"
                          onClick={() => setRestaurantForm({ ...restaurantForm, favicon: '' })}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove Favicon
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Restaurant Logo (Navigation/Menu)
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                    />
                    <p className="text-xs text-gray-500 mt-1">This logo will appear in the navigation bar and customer menu</p>
                    {restaurantForm.logo && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 flex items-center gap-4">
                        <img 
                          src={`${BASE_URL}${restaurantForm.logo}`} 
                          alt="Restaurant Logo" 
                          className="h-24 w-24 object-contain rounded-xl shadow-lg border-2 border-amber-200 bg-white p-2" 
                        />
                        <button
                          type="button"
                          onClick={() => setRestaurantForm({ ...restaurantForm, logo: '' })}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove Logo
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color Theme</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={restaurantForm.primaryColor} 
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, primaryColor: e.target.value })} 
                        className="h-12 w-24 rounded-lg border border-gray-300 cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={restaurantForm.primaryColor} 
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, primaryColor: e.target.value })} 
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono" 
                        placeholder="#d97706"
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      {['#d97706', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setRestaurantForm({ ...restaurantForm, primaryColor: color })}
                          className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg mt-0.5">
                        <Settings className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-amber-900 mb-1">Preview</h4>
                        <div className="bg-white rounded-lg p-4 border border-amber-200 space-y-3">
                          <div className="flex items-center gap-3">
                            {restaurantForm.logo && (
                              <img 
                                src={`${BASE_URL}${restaurantForm.logo}`} 
                                alt="Logo Preview" 
                                className="h-12 w-12 object-contain" 
                              />
                            )}
                            <div>
                              <h3 className="font-bold text-lg" style={{ color: restaurantForm.primaryColor }}>
                                {restaurantForm.name || 'My Restaurant'}
                              </h3>
                              {restaurantForm.subname && (
                                <p className="text-sm text-gray-600">{restaurantForm.subname}</p>
                              )}
                            </div>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              {restaurantForm.favicon && (
                                <img 
                                  src={`${BASE_URL}${restaurantForm.favicon}`} 
                                  alt="Favicon Preview" 
                                  className="h-4 w-4 object-contain" 
                                />
                              )}
                              <span className="font-medium">{restaurantForm.browserTitle || 'Restaurant Management'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="submit" 
                    className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 flex items-center gap-2 shadow-md transition-all font-medium"
                  >
                    <Save className="w-5 h-5" />
                    Update Restaurant Settings
                  </motion.button>
                </form>
              </motion.div>

              {/* Admin Settings */}
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Admin Account</h3>
                    <p className="text-sm text-gray-600">Update your admin credentials</p>
                  </div>
                </div>
                
                <form onSubmit={handleUpdateAdmin} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                        <span className="text-xs text-gray-500 ml-2">(Can be used as username for login)</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Admin User" 
                          value={adminForm.name} 
                          onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} 
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                          required 
                        />
                        <button 
                          type="button" 
                          onClick={() => handleCopyToClipboard(adminForm.name, 'name')} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Copy name"
                        >
                          {copiedField === 'name' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          placeholder="ibrahimkamil362@gmail.com" 
                          value={adminForm.email} 
                          onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} 
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                          required 
                        />
                        <button 
                          type="button" 
                          onClick={() => handleCopyToClipboard(adminForm.email, 'email')} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Copy email"
                        >
                          {copiedField === 'email' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password 
                      <span className="text-xs text-gray-500 ml-2">(leave empty to keep current)</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword.admin ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={adminForm.password} 
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} 
                        className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button 
                          type="button" 
                          onClick={() => handleCopyToClipboard(adminForm.password, 'password')} 
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Copy password"
                          disabled={!adminForm.password}
                        >
                          {copiedField === 'password' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => togglePasswordVisibility('admin')} 
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                          title={showPassword.admin ? "Hide password" : "Show password"}
                        >
                          {showPassword.admin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Login Options</h4>
                        <p className="text-xs text-blue-700">
                          You can login using either your <span className="font-semibold">Email</span> or <span className="font-semibold">Name</span> (as username) with your password.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="submit" 
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-md transition-all font-medium"
                  >
                    <Save className="w-5 h-5" />
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
