import React from 'react';
import { Lang } from '../types';
import { useI18n } from '../hooks/useI18n';
import { useUser } from '../hooks/useUser';
import { Logo } from './common/Logo';

interface HeaderProps {
  onGoPremiumClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoPremiumClick }) => {
  const { lang, setLanguage, t } = useI18n();
  const { user, requestsLeft } = useUser();

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Lang);
  };

  return (
    <header className="p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-full text-sm">
            {user.isPremium ? (
              <span className="text-green-400 font-semibold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Premium
              </span>
            ) : (
              <span className="text-sky-300">
                {requestsLeft > 0 ? `${requestsLeft} ${t.requestsLeft}` : "0 " + t.requestsLeft}
              </span>
            )}
          </div>

          <div className="relative">
            <select
              value={lang}
              onChange={handleLangChange}
              className="bg-slate-800 border border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label={t.language}
            >
              <option value={Lang.EN}>English</option>
              <option value={Lang.FR}>Français</option>
            </select>
             <svg className="w-4 h-4 absolute top-1/2 right-2.5 -translate-y-1/2 pointer-events-none text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>

          {!user.isPremium && (
            <button
              onClick={onGoPremiumClick}
              className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold px-4 py-2 rounded-full text-sm hover:from-sky-600 hover:to-emerald-600 transition-all transform hover:scale-105"
            >
              {t.goPremium}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};