import React from 'react';
import { HistoryItem, SeoResult } from '../types';
import { useI18n } from '../hooks/useI18n';

interface HistoryPanelProps {
  history: HistoryItem[];
  onView: (result: SeoResult) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const HistoryIcon = ({ type }: { type: string }) => {
  const iconMap = {
    KEYWORDS: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 017.743-5.743z" /></svg>,
    IMPROVE: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    COMPETITOR: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    SUGGESTION: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  };
  return iconMap[type] || null;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onView, onDelete, onClear }) => {
  const { t } = useI18n();

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl h-full flex flex-col">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">{t.history}</h2>
        {history.length > 0 && (
          <button onClick={onClear} className="text-xs text-slate-400 hover:text-red-400 transition-colors">
            {t.clearHistory}
          </button>
        )}
      </div>
      <div className="p-2 flex-grow overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>{t.historyEmpty}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {history.map(item => (
              <li key={item.id} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between group">
                <div className="flex items-center space-x-3 overflow-hidden">
                   <div className="text-slate-500"><HistoryIcon type={item.type} /></div>
                   <div className="overflow-hidden">
                    <p className="text-sm font-medium text-slate-300 capitalize truncate">{t[item.type.toLowerCase()] || item.type.toLowerCase()}</p>
                    <p className="text-xs text-slate-400 truncate">{`"${item.input}"`}</p>
                   </div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(item.result)} title={t.viewResult} className="p-1.5 rounded-md hover:bg-slate-700 text-sky-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                    <button onClick={() => onDelete(item.id)} title={t.delete} className="p-1.5 rounded-md hover:bg-slate-700 text-red-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};