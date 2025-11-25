import React from 'react';
import { useApp } from '../context/AppContext';

const ReciterSelect = ({ darkMode }) => {
    const { reciters, selectedReciter, setSelectedReciter } = useApp();

    return (
        <div className="flex flex-col gap-3 group">
            <label className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Reciter
            </label>
            <div className="relative">
                <select
                    className={`w-full p-4 pr-10 rounded-2xl border appearance-none outline-none transition-all duration-300 cursor-pointer font-medium
                        ${darkMode
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:bg-slate-750'
                            : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 shadow-sm hover:shadow-md'
                        }`}
                    value={selectedReciter || ''}
                    onChange={(e) => setSelectedReciter(Number(e.target.value))}
                >
                    {reciters.map((reciter) => (
                        <option key={reciter.id} value={reciter.id} className={darkMode ? 'bg-slate-800' : 'bg-white'}>
                            {reciter.reciter_name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ReciterSelect;
