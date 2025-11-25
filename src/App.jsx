import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import ReciterSelect from './components/ReciterSelect';
import TranslationSelect from './components/TranslationSelect';
import ChapterSelect from './components/ChapterSelect';
import VideoPlayer from './components/VideoPlayer';
import Controls from './components/Controls';
import { Moon, Sun } from 'lucide-react';

import { Widgets } from './components/Widgets';

import Logo from './components/Logo';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <AppProvider>
      <div className={`min-h-screen w-full transition-colors duration-500 relative ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} flex flex-col md:flex-row font-sans selection:bg-blue-500/30`}>

        {/* Widgets */}
        <Widgets darkMode={darkMode} />

        {/* Sidebar / Controls Area */}
        <div className={`w-full md:w-[400px] md:h-screen backdrop-blur-2xl border-r flex flex-col z-20 shadow-2xl relative transition-all duration-500
          ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/70 border-white/20'}`}>

          <div className="p-8 pt-12 pb-6 flex justify-between items-start">
            <Logo darkMode={darkMode} />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-all duration-300 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-8 scrollbar-hide mask-image-b">
            <ReciterSelect darkMode={darkMode} />
            <TranslationSelect darkMode={darkMode} />
            <ChapterSelect darkMode={darkMode} />
          </div>

          <div className="pb-8 px-8"> {/* Added padding container for controls */}
            <Controls darkMode={darkMode} />
          </div>
        </div>

        {/* Main Preview Area */}
        <div className={`flex-1 flex items-center justify-center p-8 min-h-[600px] md:min-h-screen relative transition-colors duration-500 ${darkMode ? 'bg-slate-950' : 'bg-[#F5F5F7]'}`}>
          {/* Subtle ambient background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] transition-colors duration-1000 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-400/10'}`} />
            <div className={`absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] transition-colors duration-1000 ${darkMode ? 'bg-purple-900/20' : 'bg-purple-400/10'}`} />
          </div>

          {/* Standard 9:16 Video Container (TikTok Style) */}
          <div className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10 z-10 transform transition-transform hover:scale-[1.01] duration-500">
            <VideoPlayer />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
