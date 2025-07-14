import React, { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';

const COOKIE_CONSENT_KEY = 'seoBoosterCookieConsent';

export const CookieBanner: React.FC = () => {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm p-4 border-t border-slate-700 z-50 animate-fade-in-up">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-300">{t.cookieConsent}</p>
        <button
          onClick={handleAccept}
          className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-emerald-700 transition-colors flex-shrink-0"
        >
          {t.accept}
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};