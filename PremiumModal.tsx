import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { PREMIUM_PRICE, PAYPAL_LINK, TWINT_PHONE } from '../constants';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (email.includes('@')) {
      onConfirm(email);
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 transform transition-all animate-fade-in-up">
        <div className="p-8 text-center">
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 p-3 rounded-full -mt-16">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{t.premiumModalTitle}</h2>
          <p className="text-slate-400 mb-6">{`One-time payment of ${PREMIUM_PRICE}`}</p>

          <ul className="text-left space-y-3 text-slate-300 mb-8">
            {t.premiumBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-slate-400 text-left mb-2">{t.enterEmail}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <p className="text-slate-400 mb-4">{t.payWith}:</p>
          <div className="flex justify-center space-x-4 mb-8">
            <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">PayPal</a>
            <div className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg">TWINT ({TWINT_PHONE})</div>
          </div>
          
          <button
            onClick={handleConfirm}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={!email}
          >
            {t.confirmPayment}
          </button>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};