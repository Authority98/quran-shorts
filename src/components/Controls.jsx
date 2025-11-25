import React, { useState } from 'react';
import { Play, Pause, SkipForward, Download, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from './Modal';

const Controls = ({ darkMode }) => {
    const { isPlaying, play, pause, nextVerse, startRecording, isRecording } = useApp();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex items-center justify-center gap-6 mt-auto pt-6 border-t border-white/10">
            {/* Modal Integration */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Coming Soon"
                darkMode={darkMode}
            >
                <p className="opacity-80">
                    The video download feature is currently being enhanced to support high-quality audio and perfect synchronization.
                    <br /><br />
                    Stay tuned for the update!
                </p>
            </Modal>

            <button
                onClick={() => {
                    // window.location.reload();
                    // Actually, let's just reset the context if needed, but reload is easiest for full reset
                    window.location.reload();
                }}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95
                    ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                title="Reset"
            >
                <RefreshCw size={20} />
            </button>

            <button
                onClick={isPlaying ? pause : play}
                className={`p-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center
                    ${darkMode
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-900/50'
                        : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-200/50'
                    }`}
            >
                {isPlaying ? (
                    <Pause size={32} fill="currentColor" />
                ) : (
                    <Play size={32} fill="currentColor" className="ml-1" />
                )}
            </button>

            <button
                onClick={nextVerse}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95
                    ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
                <SkipForward size={24} />
            </button>

            <button
                onClick={() => {
                    // Show Modal instead of alert
                    setShowModal(true);
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
