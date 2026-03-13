import { useEffect, useState } from 'react';
import { useBranding } from '../context/BrandingContext';
import { Sparkles, ChefHat } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const { branding, BASE_URL, loading } = useBranding();
  const [isVisible, setIsVisible] = useState(true);
  const [startTimer, setStartTimer] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // Apply dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Start timer only after branding is loaded
    if (!loading) {
      setStartTimer(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!startTimer) return;

    // Hide splash screen after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [startTimer, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${darkMode ? 'dark' : ''}`}
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)'
      }}
    >
      {/* Decorative background elements */}
      <div 
        className={`absolute top-0 right-0 w-96 h-96 rounded-full transition-opacity duration-500 ${
          darkMode ? 'opacity-10' : 'opacity-20'
        }`}
        style={{ 
          background: `radial-gradient(circle, ${branding.primaryColor}${darkMode ? '60' : '40'} 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)'
        }} 
      />
      <div 
        className={`absolute bottom-0 left-0 w-80 h-80 rounded-full transition-opacity duration-500 ${
          darkMode ? 'opacity-10' : 'opacity-20'
        }`}
        style={{ 
          background: `radial-gradient(circle, ${branding.primaryColor}${darkMode ? '60' : '40'} 0%, transparent 70%)`,
          transform: 'translate(-30%, 30%)'
        }} 
      />

      {/* Main content */}
      <div className="relative text-center space-y-8 px-6">
        {/* Glass card container */}
        <div 
          className="backdrop-blur-md rounded-3xl p-12 animate-splash transition-all duration-500"
          style={{
            background: darkMode 
              ? 'rgba(30, 41, 59, 0.3)' 
              : 'rgba(255, 255, 255, 0.4)',
            border: darkMode 
              ? '1px solid rgba(71, 85, 105, 0.3)' 
              : '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: darkMode
              ? 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 30px 60px rgba(0, 0, 0, 0.3)'
              : 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 30px 60px rgba(0, 0, 0, 0.12)'
          }}
        >
          {/* Logo with gradient background */}
          <div className="mb-8 animate-logo-float">
            <div 
              className="inline-flex p-6 rounded-3xl shadow-2xl animate-logo-glow transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.primaryColor}dd 100%)`,
                boxShadow: darkMode
                  ? `0 20px 60px ${branding.primaryColor}60`
                  : `0 20px 60px ${branding.primaryColor}40`
              }}
            >
              {branding.logo ? (
                <img
                  src={`${BASE_URL}${branding.logo}`}
                  alt={branding.name}
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <ChefHat className="w-24 h-24 text-white" />
              )}
            </div>
          </div>

          {/* Restaurant Name with gradient */}
          <div className="space-y-3 animate-text-fade">
            <h1 
              className={`text-6xl font-extrabold tracking-tight animate-text-slide transition-all duration-500 ${
                darkMode ? 'text-transparent bg-gradient-to-r bg-clip-text' : 'text-transparent bg-gradient-to-r bg-clip-text'
              }`}
              style={{
                backgroundImage: darkMode
                  ? `linear-gradient(to right, ${branding.primaryColor}, ${branding.primaryColor}ee)`
                  : `linear-gradient(to right, ${branding.primaryColor}, ${branding.primaryColor}cc)`
              }}
            >
              {branding.name}
            </h1>
            {branding.subname && (
              <div className="flex items-center justify-center gap-2 animate-text-slide-delay">
                <Sparkles className="w-5 h-5 transition-colors duration-500" style={{ color: branding.primaryColor }} />
                <p 
                  className={`text-2xl font-medium transition-colors duration-500 ${
                    darkMode ? 'text-gray-300' : ''
                  }`}
                  style={{ color: darkMode ? '#cbd5e1' : `${branding.primaryColor}dd` }}
                >
                  {branding.subname}
                </p>
                <Sparkles className="w-5 h-5 transition-colors duration-500" style={{ color: branding.primaryColor }} />
              </div>
            )}
          </div>

          {/* Loading indicator with brand color */}
          <div className="mt-10 flex justify-center">
            <div className="flex space-x-3">
              <div
                className="w-4 h-4 rounded-full animate-bounce-custom transition-all duration-500"
                style={{ 
                  backgroundColor: branding.primaryColor,
                  animationDelay: '0ms',
                  boxShadow: darkMode 
                    ? `0 4px 12px ${branding.primaryColor}80` 
                    : `0 4px 12px ${branding.primaryColor}60`
                }}
              />
              <div
                className="w-4 h-4 rounded-full animate-bounce-custom transition-all duration-500"
                style={{ 
                  backgroundColor: branding.primaryColor,
                  animationDelay: '150ms',
                  boxShadow: darkMode 
                    ? `0 4px 12px ${branding.primaryColor}80` 
                    : `0 4px 12px ${branding.primaryColor}60`
                }}
              />
              <div
                className="w-4 h-4 rounded-full animate-bounce-custom transition-all duration-500"
                style={{ 
                  backgroundColor: branding.primaryColor,
                  animationDelay: '300ms',
                  boxShadow: darkMode 
                    ? `0 4px 12px ${branding.primaryColor}80` 
                    : `0 4px 12px ${branding.primaryColor}60`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splash {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          50% {
            transform: scale(1.02) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes logo-float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(-3deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
          75% {
            transform: translateY(-8px) rotate(3deg);
          }
        }

        @keyframes logo-glow {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.1);
          }
        }

        @keyframes text-slide {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          60% {
            opacity: 0;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes text-fade {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes bounce-custom {
          0%, 80%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-20px) scale(1.1);
          }
        }

        .animate-splash {
          animation: splash 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-logo-float {
          animation: logo-float 3s ease-in-out infinite;
        }

        .animate-logo-glow {
          animation: logo-glow 2s ease-in-out infinite;
        }

        .animate-text-slide {
          animation: text-slide 1.5s ease-out;
        }

        .animate-text-slide-delay {
          animation: text-slide 1.5s ease-out 0.3s backwards;
        }

        .animate-text-fade {
          animation: text-fade 2s ease-out;
        }

        .animate-bounce-custom {
          animation: bounce-custom 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
