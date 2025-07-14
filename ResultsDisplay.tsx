import React, { useRef } from 'react';
import { SeoResult, Keyword, Competitor, AnalysisType } from '../types';
import { useI18n } from '../hooks/useI18n';
import { useUser } from '../hooks/useUser';

interface ResultsDisplayProps {
  result: SeoResult | null;
  isLoading: boolean;
  analysisType: AnalysisType;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, analysisType }) => {
  const { t } = useI18n();
  const { user } = useUser();
  const printRef = useRef<HTMLDivElement>(null);

  const exportToCSV = () => {
    if (!result) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    let rows: string[][] = [];

    if (result.keywords) {
      rows.push(["Keyword", "Category", "Reason"]);
      result.keywords.forEach(kw => rows.push([`"${kw.word}"`, kw.category, `"${kw.reason}"`]));
    } else if (result.competitors) {
      rows.push(["Competitor", "Strategy", "Keywords", "Weakness"]);
      result.competitors.forEach(c => rows.push([`"${c.name}"`, `"${c.strategy}"`, `"${c.keywords.join(', ')}"`, `"${c.weakness}"`]));
    } else if (result.improvedText) {
      rows.push(["Improved Text"]);
      rows.push([`"${result.improvedText.replace(/"/g, '""')}"`]);
    }

    rows.forEach(rowArray => {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `seo_booster_export_${analysisType.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printSection = printContent.innerHTML;
      document.body.innerHTML = `
        <html>
          <head>
            <title>SEO Booster Export</title>
            <style>
              body { font-family: sans-serif; }
              .keyword-card, .competitor-card, .text-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
              h3 { font-size: 1.2em; color: #333; }
              p { color: #555; }
              span { background-color: #eee; padding: 2px 5px; border-radius: 4px; font-size: 0.9em; }
            </style>
          </head>
          <body>
            <h1>${t.results}</h1>
            ${printSection}
          </body>
        </html>`;
      window.print();
      document.body.innerHTML = originalContents;
      // We need to re-mount the React app, a simple reload is easiest
      window.location.reload();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <svg className="animate-spin h-8 w-8 text-sky-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg">{t.generating}</p>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <p className="text-lg">{t.noResults}</p>
        </div>
      );
    }
    
    return (
        <div ref={printRef}>
            {result.improvedText && (
                <div className="text-card">
                    <h3 className="text-xl font-bold mb-4 text-emerald-400">{t.improvedTextTitle}</h3>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{result.improvedText}</p>
                </div>
            )}
            {result.keywords && (
                <div>
                    <h3 className="text-xl font-bold mb-4 text-emerald-400">{t.keywordsTitle}</h3>
                    <div className="space-y-4">
                        {result.keywords.map((kw, index) => (
                            <div key={index} className="p-4 bg-slate-800 rounded-lg border border-slate-700 keyword-card">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg text-white">{kw.word}</h4>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                                        kw.category === 'primary' ? 'bg-sky-500/20 text-sky-300' :
                                        kw.category === 'secondary' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-600/50 text-slate-300'
                                    }`}>{kw.category}</span>
                                </div>
                                <p className="text-slate-400 mt-2 text-sm">{kw.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {result.competitors && (
                <div>
                    <h3 className="text-xl font-bold mb-4 text-emerald-400">{t.competitorsTitle}</h3>
                    <div className="space-y-4">
                        {result.competitors.map((c, index) => (
                             <div key={index} className="p-4 bg-slate-800 rounded-lg border border-slate-700 competitor-card">
                                <h4 className="font-bold text-lg text-white">{c.name}</h4>
                                <div className="mt-3">
                                    <p className="font-semibold text-sm text-slate-300">Strategy:</p>
                                    <p className="text-slate-400 text-sm">{c.strategy}</p>
                                </div>
                                <div className="mt-3">
                                    <p className="font-semibold text-sm text-slate-300">Keywords:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {c.keywords.map(kw => <span key={kw} className="text-xs bg-slate-700 px-2 py-1 rounded">{kw}</span>)}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className="font-semibold text-sm text-slate-300">Exploitable Weakness:</p>
                                    <p className="text-slate-400 text-sm">{c.weakness}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl h-full flex flex-col">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">{t.results}</h2>
        {result && user.isPremium && (
          <div className="flex space-x-2">
            <button onClick={exportToCSV} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-1 px-3 rounded-md transition-colors">{t.exportCSV}</button>
            <button onClick={exportToPDF} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-1 px-3 rounded-md transition-colors">{t.exportPDF}</button>
          </div>
        )}
      </div>
      <div className="p-6 flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};