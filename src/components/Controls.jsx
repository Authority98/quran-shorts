import React from 'react';
import { Play, Pause, SkipForward, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Controls = ({ darkMode }) => {
    const { isPlaying, play, pause, nextVerse, startRecording, isRecording } = useApp();

    return (
        <div className={`flex items-center justify-center gap-8 p-8 pb-10 border-t backdrop-blur-lg transition-colors duration-500
            ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-white/20'}`}>

            <button
                onClick={isPlaying ? pause : play}
                className={`group relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95
                    ${darkMode ? 'bg-white text-slate-900 hover:bg-slate-200 shadow-white/10' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'}`}
            >
                {isPlaying ? (
                    <Pause size={32} fill="currentColor" className="relative z-10" />
                ) : (
                    <Play size={32} fill="currentColor" className="relative z-10 ml-1" />
                )}
            </button>

            <button
                onClick={nextVerse}
                className={`flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-300 shadow-lg hover:scale-105 active:scale-95
                    ${darkMode ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'}`}
            >
                <SkipForward size={28} fill="currentColor" className={darkMode ? 'text-slate-300' : 'text-slate-600'} />
            </button>

            <button
                onClick={() => {
                    // Feature temporarily disabled
                    alert("Feature coming soon!");

                    /* 
                    const videoEl = document.getElementById('video-element');
                    const textEl = document.getElementById('text-overlay');
                    const audioEl = document.getElementById('audio-element');
                    if (videoEl && textEl && audioEl) {
                        startRecording(videoEl, textEl, { current: audioEl });
                    } else {
                        console.error("Elements not found for recording");
                    }
                    */
                }}
                disabled={isRecording}
                className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg flex items-center justify-center gap-2
                    ${darkMode
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:shadow-slate-900/50'
                        : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-slate-200/50'
                    }`}
                title="Download Video (Coming Soon)"
            >
                {isRecording ? (
                    <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Download size={24} />
                )}
            </button>
        </div>
    );
};

export default Controls;
