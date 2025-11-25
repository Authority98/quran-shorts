import React from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Controls = () => {
    const { isPlaying, play, pause, nextVerse } = useApp();

    return (
        <div className="flex items-center justify-center gap-4 p-4 bg-white border-t">
            <button
                onClick={isPlaying ? pause : play}
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button
                onClick={nextVerse}
                className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
                <SkipForward size={24} />
            </button>
        </div>
    );
};

export default Controls;
