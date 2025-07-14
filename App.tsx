import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { SeoTool } from './SeoTool';
import { ResultsDisplay } from './ResultsDisplay';
import { HistoryPanel } from './HistoryPanel';
import { PremiumModal } from './PremiumModal';
import { CookieBanner } from './CookieBanner';
import { useI18n } from './useI18n';
import { useUser } from './useUser';
import { SeoResult, AnalysisType } from './types';

enum ActiveView {
    TOOL = 'TOOL',
    HISTORY = 'HISTORY',
    SETTINGS = 'SETTINGS',
}

export default function App() {
  const { t } = useI18n();
  const { user, deleteHistoryItem, clearHistory, upgradeToPremium, clearPersonalData } = useUser();
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.TOOL);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<SeoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysisType, setCurrentAnalysisType] = useState<AnalysisType>(AnalysisType.KEYWORDS);
  
  const handleNewResult = useCallback((result: SeoResult | null, type: AnalysisType) => {
    setCurrentResult(result);
    setCurrentAnalysisType(type);
    setActiveView(ActiveView.TOOL);
  }, []);
  
  const handleViewHistoryResult = useCallback((result: SeoResult) => {
    setCurrentResult(result);
    setActiveView(ActiveView.TOOL);
  }, []);
  
  const handleUpgradeConfirm = (email: string) => {
    upgradeToPremium(email);
    setIsPremiumModalOpen(false);
    alert(t.paymentConfirmed);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
      clearPersonalData();
      alert(t.dataCleared);
    }
  }

  const NavButton = ({ view, label, icon }: { view: ActiveView, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
        activeView === view ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header onGoPremiumClick={() => setIsPremiumModalOpen(true)} />
      
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-2">
                <NavButton view={ActiveView.TOOL} label={t.seoTool} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} />
                <NavButton view={ActiveView.HISTORY} label={t.history} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <NavButton view={ActiveView.SETTINGS} label={t.settings} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
            </nav>
        </aside>

        <section className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ display: activeView === ActiveView.TOOL ? 'grid' : 'none' }}>
            <SeoTool onNewResult={handleNewResult} setIsLoading={setIsLoading} onUpgradeClick={() => setIsPremiumModalOpen(true)} />
            <ResultsDisplay result={currentResult} isLoading={isLoading} analysisType={currentAnalysisType} />
        </section>

        <section className="flex-grow" style={{ display: activeView === ActiveView.HISTORY ? 'block' : 'none' }}>
            <HistoryPanel history={user.history} onView={handleViewHistoryResult} onDelete={deleteHistoryItem} onClear={clearHistory} />
        </section>
        
        <section className="flex-grow" style={{ display: activeView === ActiveView.SETTINGS ? 'block' : 'none' }}>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">{t.manageData}</h2>
                <p className="text-slate-400 mb-4">You can clear all your locally stored data, including your history and premium status.</p>
                <button 
                  onClick={handleClearData}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    {t.clearPersonalData}
                </button>
            </div>
        </section>

      </main>

      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} onConfirm={handleUpgradeConfirm} />
      <CookieBanner />
    </div>
  );
}
