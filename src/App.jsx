import React from 'react';
import { AppProvider } from './context/AppContext';
import ReciterSelect from './components/ReciterSelect';
import TranslationSelect from './components/TranslationSelect';
import ChapterSelect from './components/ChapterSelect';
import VideoPlayer from './components/VideoPlayer';
import Controls from './components/Controls';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Sidebar / Controls Area */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r flex flex-col h-full z-20 shadow-xl">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Quran Shorts</h1>
            <p className="text-sm text-gray-500">Generate video verses</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <ReciterSelect />
            <TranslationSelect />
            <ChapterSelect />
          </div>

          <Controls />
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center p-4 md:p-8">
          {/* Phone Frame / Aspect Ratio Container */}
          <div className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800">
            <VideoPlayer />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
