import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BrandingContext = createContext();

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState({
    name: 'Restaurant',
    subname: '',
    logo: '',
    favicon: '',
    browserTitle: 'Restaurant Management',
    primaryColor: '#d97706'
  });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const BASE_URL = API_URL.replace('/api', '');

  const fetchBranding = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/settings/restaurant`);
      const brandingData = {
        name: data.name || 'Restaurant',
        subname: data.subname || '',
        logo: data.logo || '',
        favicon: data.favicon || '',
        browserTitle: data.browserTitle || 'Restaurant Management',
        primaryColor: data.primaryColor || '#d97706'
      };
      setBranding(brandingData);
      applyBranding(brandingData);
    } catch (error) {
      console.error('Failed to fetch branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyBranding = (brandingData) => {
    // Update document title
    document.title = brandingData.browserTitle;

    // Update favicon
    if (brandingData.favicon) {
      let favicon = document.querySelector("link[rel*='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = `${BASE_URL}${brandingData.favicon}`;
    }
  };

  const updateBranding = (newBranding) => {
    setBranding(newBranding);
    applyBranding(newBranding);
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, loading, BASE_URL, fetchBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};
