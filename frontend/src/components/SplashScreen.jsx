import { useEffect, useState } from 'react';
import { useBranding } from '../context/BrandingContext';
import { Sparkles, ChefHat } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const { branding, BASE_URL, loading } = useBranding();
  const [isVisible, setIsVisible] = useState(true);
  const [startTimer, setStartTimer] = useState(false);

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
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: `linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)`
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" 
        style={{ 
          background: `radial-gradient(circle, ${branding.primaryColor}40 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)'
        }} 
      />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20" 
        style={{ 
          background: `radial-gradient(circle, ${branding.primaryColor}40 0%, transparent 70%)`,
          transform: 'translate(-30%, 30%)'
        }} 
      />

      {/* Main content */}
      <div className="relative text-center space-y-8 px-6">
        {/* Glass card container */}
        <div 
          className="backdrop-blur-md rounded-3xl p-12 animate-splash"
          style={{
            background: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 30px 60px rgba(0, 0, 0, 0.12)'
          }}
        >
          {/* Logo with gradient background */}
          <div className="mb-8 animate-logo-float">
            <div 
              className="inline-flex p-6 rounded-3xl shadow-2xl animate-logo-glow"
              style={{
                background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.primaryColor}dd 100%)`,
                boxShadow: `0 20px 60px ${branding.primaryColor}40`
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
              className="text-6xl font-extrabold tracking-tight animate-text-slide bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${branding.primaryColor}, ${branding.primaryColor}cc)`
              }}
            >
              {branding.name}
            </h1>
            {branding.subname && (
              <div className="flex items-center justify-center gap-2 animate-text-slide-delay">
                <Sparkles className="w-5 h-5" style={{ color: branding.primaryColor }} />
                <p className="text-2xl font-medium" style={{ color: `${branding.primaryColor}dd` }}>
                  {branding.subname}
                </p>
                <Sparkles className="w-5 h-5" style={{ color: branding.primaryColor }} />
              </div>
            )}
          </div>

          {/* Loading indicator with brand color */}
          <div className="mt-10 flex justify-center">
            <div className="flex space-x-3">
              <div
                className="w-4 h-4 rounded-full animate-bounce-custom"
                style={{ 
                  backgroundColor: branding.primaryColor,
                  animationDelay: '0ms',
                  boxShadow: `0 4px 12px ${branding.primaryColor}60`
                }}
              />
              <div
                className="w-4 h-4 rounded-full animate-bounce-custom"
                style={{ 
                  backgroundColor: branding.primaryColor,
                  animationDelay: '150ms',
                  boxShadow: `0 4px 12px ${branding.primaryColor}60`
                }}
              />
              <div
                className="w-4 h-4 rounded-full animate-bounce-custom"
                style={{ 
                  backgroundColor: branding.primaryColor,
                  animationDelay: '300ms',
                  boxShadow: `0 4px 12px ${branding.primaryColor}60`
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
