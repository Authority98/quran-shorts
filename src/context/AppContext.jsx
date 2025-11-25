import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { getReciters, getTranslations, getChapters, getVerses } from '../services/quranApi';
import { getBackgroundVideos } from '../services/videoApi';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [reciters, setReciters] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [chapters, setChapters] = useState([]);

    const [selectedReciter, setSelectedReciter] = useState(null);
    const [selectedTranslation, setSelectedTranslation] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);

    const [verses, setVerses] = useState([]);
    const [backgroundVideos, setBackgroundVideos] = useState([]);

    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const recorderRef = useRef(null);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [recitersData, translationsData, chaptersData, videosData] = await Promise.all([
                getReciters(),
                getTranslations(),
                getChapters(),
                getBackgroundVideos()
            ]);

            setReciters(recitersData);
            setTranslations(translationsData);
            setChapters(chaptersData);
            setBackgroundVideos(videosData);

            // Set defaults
            if (recitersData.length > 0) {
                // Default to Mishary Rashid Alafasy if found, otherwise first one
                const mishary = recitersData.find(r => r.reciter_name === 'Mishari Rashid Al-Afasy' || r.name === 'Mishari Rashid Al-Afasy' || r.style === 'Mishari Rashid Al-Afasy');
                // Note: API usually returns 'reciter_name' or 'name'. Let's check common variations or just use ID 7 if we knew it.
                // But safer to search.
                // Actually, let's log the names to be sure in dev, but for now I'll try to find him.
                // Common ID is 7. Let's try to find by ID 7 as well if name fails.
                const defaultReciter = mishary || recitersData.find(r => r.id === 7) || recitersData[0];
                setSelectedReciter(defaultReciter.id);
            }
            if (translationsData.length > 0) setSelectedTranslation(translationsData[0].id);
            if (chaptersData.length > 0) setSelectedChapter(chaptersData[0].id);

            setIsLoading(false);
        };

        fetchData();
    }, []);

    // Fetch Verses when selection changes
    useEffect(() => {
        if (selectedReciter && selectedTranslation && selectedChapter) {
            const fetchVersesData = async () => {
                setIsLoading(true);
                const versesData = await getVerses(selectedChapter, selectedReciter, selectedTranslation);
                setVerses(versesData);

                // Fetch smart videos based on the new verses
                const videosData = await getBackgroundVideos(versesData);
                setBackgroundVideos(videosData);

                setCurrentVerseIndex(0);
                setIsPlaying(false);
                setIsLoading(false);
            };
            fetchVersesData();
        }
    }, [selectedReciter, selectedTranslation, selectedChapter]);

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    const nextVerse = async () => {
        if (currentVerseIndex < verses.length - 1) {
            // If recording, pause first to ensure we capture the next verse correctly
            if (isRecording) {
                setIsPlaying(false);
            }
            setCurrentVerseIndex(prev => prev + 1);
        } else {
            setIsPlaying(false); // Stop at end
            setCurrentVerseIndex(0); // Reset

            // Stop recording if active
            if (isRecording) {
                stopRecording();
            }
        }
    };

    // Handle Recording Sync: When verse changes, capture text then resume
    useEffect(() => {
        if (isRecording && !isPlaying && recorderRef.current) {
            const syncRecording = async () => {
                // Wait for DOM to update with new verse text
                await new Promise(resolve => setTimeout(resolve, 200));

                // Capture the new text
                await recorderRef.current.updateTextOverlay();

                // Resume playback (and thus recording flow)
                setIsPlaying(true);
            };
            syncRecording();
        }
    }, [currentVerseIndex, isRecording, isPlaying]);

    const startRecording = async (videoEl, textEl, audioEl) => {
        if (isRecording) return;

        setIsRecording(true);
        setCurrentVerseIndex(0); // Start from beginning
        setIsPlaying(false); // Pause initially to setup

        // Initialize Recorder
        const { SurahRecorder } = await import('../utils/Recorder');
        recorderRef.current = new SurahRecorder(videoEl, textEl, audioEl, () => {
            setIsRecording(false);
            alert("Download Complete!");
        });

        await recorderRef.current.start();

        // Capture first verse
        await new Promise(resolve => setTimeout(resolve, 200)); // Wait for render
        await recorderRef.current.updateTextOverlay();

        setIsPlaying(true); // Start playback
    };

    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
        }
        setIsRecording(false);
    };

    return (
        <AppContext.Provider value={{
            reciters,
            translations,
            chapters,
            selectedReciter,
            setSelectedReciter,
            selectedTranslation,
            setSelectedTranslation,
            selectedChapter,
            setSelectedChapter,
            verses,
            backgroundVideos,
            currentVerseIndex,
            setCurrentVerseIndex,
            isPlaying,
            play,
            pause,
            nextVerse,
            isLoading,
            startRecording,
            isRecording
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
