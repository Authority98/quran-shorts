import React, { useState, useEffect } from 'react';
import { Cloud, Clock, MapPin } from 'lucide-react';

export const Widgets = ({ darkMode }) => {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);

    // Update Time
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Weather (Rahim Yar Khan)
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Open-Meteo API for Rahim Yar Khan (28.4212, 70.2989)
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.4212&longitude=70.2989&current=temperature_2m,weather_code&timezone=auto');
                const data = await res.json();
                setWeather({
                    temp: Math.round(data.current.temperature_2m),
                    code: data.current.weather_code
                });
            } catch (e) {
                console.error("Weather fetch failed", e);
            }
        };
        fetchWeather();
        // Refresh every 30 mins
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: 'Asia/Karachi'
        }).format(date);
    };

    const cardClass = `flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-md border shadow-lg transition-colors duration-300
        ${darkMode ? 'bg-slate-900/40 border-slate-700 text-slate-200' : 'bg-white/40 border-white/50 text-slate-700'}`;

    return (
        <div className="absolute top-6 right-6 z-50 hidden md:flex flex-col gap-3 items-end pointer-events-none">
            {/* Time Widget */}
            <div className={cardClass}>
                <Clock size={18} className="text-emerald-500" />
                <div className="flex flex-col items-end leading-tight">
                    <span className="text-xs font-medium opacity-70">Pakistan Time</span>
                    <span className="font-bold font-mono">{formatTime(time)}</span>
                </div>
            </div>

            {/* Weather Widget */}
            <div className={cardClass}>
                <Cloud size={18} className="text-sky-500" />
                <div className="flex flex-col items-end leading-tight">
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-medium opacity-70">Rahim Yar Khan</span>
                        <MapPin size={10} className="opacity-50" />
                    </div>
                    <span className="font-bold">
                        {weather ? `${weather.temp}°C` : 'Loading...'}
                    </span>
                </div>
            </div>
        </div>
    );
};
