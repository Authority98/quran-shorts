import React, { createContext, useState, useEffect, useContext } from 'react';
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
            if (recitersData.length > 0) setSelectedReciter(recitersData[0].id);
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
                setCurrentVerseIndex(0);
                setIsPlaying(false);
                setIsLoading(false);
            };
            fetchVersesData();
        }
    }, [selectedReciter, selectedTranslation, selectedChapter]);

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);
    const nextVerse = () => {
        if (currentVerseIndex < verses.length - 1) {
            setCurrentVerseIndex(prev => prev + 1);
        } else {
            setIsPlaying(false); // Stop at end
            setCurrentVerseIndex(0); // Reset
        }
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
            isLoading
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
