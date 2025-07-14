import React, { useState } from 'react';
import { AnalysisType, SeoResult } from '../types';
import { useI18n } from '../hooks/useI18n';
import { useUser } from '../hooks/useUser';
import { generateSeoContent } from '../services/geminiService';

interface SeoToolProps {
  onNewResult: (result: SeoResult | null, type: AnalysisType) => void;
  setIsLoading: (isLoading: boolean) => void;
  onUpgradeClick: () => void;
}

export const SeoTool: React.FC<SeoToolProps> = ({ onNewResult, setIsLoading, onUpgradeClick }) => {
  const { t, lang } = useI18n();
  const { user, canMakeRequest, addHistory } = useUser();
  const [text, setText] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>(AnalysisType.KEYWORDS);
  const [tone, setTone] = useState('professional');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (canMakeRequest) {
      onUpgradeClick();
      return;
    }

    if (analysisType === AnalysisType.COMPETITOR && !user.isPremium) {
      onUpgradeClick();
      return;
    }

    setIsLoading(true);
    onNewResult(null, analysisType);
    
    try {
      const result = await generateSeoContent(analysisType, text, lang, tone);
      onNewResult(result, analysisType);
      addHistory(analysisType, text, result);
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
      onNewResult(null, analysisType);
    } finally {
      setIsLoading(false);
    }
  };

  const isCompetitorAnalysisDisabled = !user.isPremium && analysisType === AnalysisType.COMPETITOR;

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-2xl h-full flex flex-col p-6 space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.pasteTextHere}
        className="w-full flex-grow bg-slate-800 border border-slate-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none placeholder-slate-500"
      ></textarea>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{t.analysisType}</label>
        <div className="grid grid-cols-2 gap-2">
          {[AnalysisType.KEYWORDS, AnalysisType.IMPROVE, AnalysisType.SUGGESTION, AnalysisType.COMPETITOR].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAnalysisType(type)}
              className={`relative text-sm font-semibold p-3 rounded-lg text-left transition-all border-2 ${
                analysisType === type ? 'bg-sky-500/20 border-sky-500 text-white' : 'bg-slate-700/50 border-transparent hover:border-slate-600 text-slate-300'
              }`}
            >
              {t[type.toLowerCase()]}
              {type === AnalysisType.COMPETITOR && !user.isPremium && (
                <span className="absolute top-1 right-1 text-xs bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-full">{t.premiumFeature}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {(analysisType === AnalysisType.IMPROVE || analysisType === AnalysisType.SUGGESTION) && (
         <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.tone}</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                 {['professional', 'friendly', 'persuasive'].map(toneValue => (
                     <button
                        key={toneValue}
                        type="button"
                        onClick={() => user.isPremium ? setTone(toneValue) : onUpgradeClick()}
                        className={`relative text-sm font-semibold p-3 rounded-lg text-left transition-all border-2 ${
                            tone === toneValue && user.isPremium ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-700/50 border-transparent hover:border-slate-600 text-slate-300'
                        }`}
                     >
                        {t[toneValue]}
                        {!user.isPremium && (
                             <span className="absolute top-1 right-1 text-xs bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-full">{t.premiumFeature}</span>
                        )}
                     </button>
                 ))}
            </div>
         </div>
      )}

      <button
        type="submit"
        disabled={!text.trim() || isCompetitorAnalysisDisabled}
        className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:from-sky-600 hover:to-emerald-600 transition-all transform hover:scale-105 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isCompetitorAnalysisDisabled ? t.upgradeToUnlock : t.getResults}
      </button>
    </form>
  );
};