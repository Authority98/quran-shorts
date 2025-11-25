import React from 'react';

const Logo = ({ darkMode }) => {
    return (
        <div className="flex items-center gap-3 group cursor-default">
            {/* Icon Container */}
            <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg
                ${darkMode
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-900/50'
                    : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200/50'
                }`}
            >
                {/* Crescent Moon Shape */}
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current relative z-10 transform -rotate-12" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>

                {/* Play Button Overlay */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-emerald-600 fill-current ml-0.5">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                </div>
            </div>

            {/* Text */}
            <div className="flex flex-col">
                <h1 className={`text-2xl font-black tracking-tight leading-none transition-colors duration-300
                    ${darkMode ? 'text-white' : 'text-slate-900'}`}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">Q</span>uran
                    <span className={`ml-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Shorts</span>
                </h1>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 transition-colors duration-300
                    ${darkMode ? 'text-slate-500 group-hover:text-emerald-400' : 'text-slate-400 group-hover:text-emerald-500'}`}
                >
                    Create & Share
                </span>
            </div>
        </div>
    );
};

export default Logo;
