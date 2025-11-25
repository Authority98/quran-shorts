import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const VideoPlayer = () => {
    const {
        verses,
        currentVerseIndex,
        backgroundVideos,
        isPlaying,
        nextVerse,
        isLoading
    } = useApp();

    const audioRef = useRef(null);
    const videoRef = useRef(null);

    const currentVerse = verses[currentVerseIndex];
    const currentVideo = backgroundVideos.length > 0
        ? backgroundVideos[currentVerseIndex % backgroundVideos.length]
        : null;

    // Handle Audio Playback
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying && currentVerse?.audio_url) {
                audioRef.current.src = currentVerse.audio_url;
                audioRef.current.play().catch(e => console.error("Audio play error:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [currentVerse, isPlaying]);

    // Handle Video Playback
    useEffect(() => {
        if (videoRef.current) {
            // Ensure video plays when component mounts or updates
            videoRef.current.play().catch(e => console.error("Video play error:", e));
        }
    }, [currentVideo]);

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
                Loading...
            </div>
        );
    }

    if (!currentVerse) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
                Select a Surah to start
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-black">
            {/* Background Video */}
            <AnimatePresence mode='wait'>
                {currentVideo && (
                    <motion.video
                        key={currentVideo} // Key change triggers animation
                        ref={videoRef}
                        src={currentVideo}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    />
                )}
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40" />

            {/* Text Content */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-6 text-center z-10">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentVerse.verse_key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-relaxed font-arabic" dir="rtl">
                            {currentVerse.text_uthmani}
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 font-medium">
                            {currentVerse.translation}
                        </p>
                        <span className="text-sm text-white/60 mt-4">
                            {currentVerse.verse_key}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Hidden Audio Player */}
            <audio
                ref={audioRef}
                onEnded={nextVerse}
                className="hidden"
            />
        </div>
    );
};

export default VideoPlayer;
