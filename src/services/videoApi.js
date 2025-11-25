import axios from 'axios';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/videos';

// Fallback videos in case API fails or no key
const FALLBACK_VIDEOS = [
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm'
];

// Helper to get used video IDs from localStorage
const getUsedVideoIds = () => {
    try {
        const stored = localStorage.getItem('used_pexels_videos');
        return new Set(stored ? JSON.parse(stored) : []);
    } catch (e) {
        console.error('Error reading used videos from localStorage:', e);
        return new Set();
    }
};

// Helper to save used video ID to localStorage
const markVideoAsUsed = (id) => {
    try {
        const used = getUsedVideoIds();
        used.add(id);
        localStorage.setItem('used_pexels_videos', JSON.stringify([...used]));
    } catch (e) {
        console.error('Error saving used video to localStorage:', e);
    }
};

const getQueryFromText = (text) => {
    if (!text) return 'nature';

    const lowerText = text.toLowerCase();

    // Mood mapping for context-aware visuals (Abstract concepts)
    const moodMap = {
        'hell': 'fire', 'jahannam': 'fire', 'fire': 'fire', 'burn': 'fire',
        'punishment': 'volcano', 'wrath': 'storm', 'anger': 'storm',
        'pain': 'storm', 'torment': 'lava', 'evil': 'dark forest',
        'heaven': 'beautiful garden', 'paradise': 'waterfall', 'jannah': 'beautiful garden',
        'peace': 'calm water', 'mercy': 'sunrise', 'light': 'sun rays'
    };

    // Check for mood keywords
    for (const [keyword, query] of Object.entries(moodMap)) {
        if (lowerText.includes(keyword)) {
            return query;
        }
    }

    // Simple keyword extraction: remove common words, keep longer words
    const stopWords = new Set(['the', 'and', 'is', 'in', 'at', 'of', 'a', 'an', 'to', 'for', 'with', 'on', 'verily', 'indeed', 'that', 'this', 'from', 'upon', 'they', 'them', 'their']);
    let words = lowerText.replace(/[^\w\s]/g, '').split(/\s+/);

    const keywords = words.filter(w => w.length > 3 && !stopWords.has(w));

    return keywords.slice(0, 3).join(' ') || 'nature';
};

// ... (KEYWORDS and getQueryFromText remain the same) ...

export const getBackgroundVideos = async (verses = []) => {
    try {
        if (!PEXELS_API_KEY) {
            console.warn("Pexels API Key is missing. Using fallback videos.");
            // Return rotated fallbacks
            return verses.map((_, i) => FALLBACK_VIDEOS[i % FALLBACK_VIDEOS.length]);
        }

        // If no verses provided, just return some generic nature videos
        if (!verses.length) {
            return getGenericVideos();
        }

        // Load globally used video IDs
        const globalUsedVideoIds = getUsedVideoIds();
        const currentSessionUsedUrls = new Set();
        const videoPromises = [];

        for (let i = 0; i < verses.length; i++) {
            const verse = verses[i];
            // Enforce "nature" in the query
            const baseQuery = getQueryFromText(verse.translation || '');

            // DRONE ONLY: Strict drone/aerial view
            const query = `${baseQuery} drone view aerial`;

            // We push a promise that resolves to a unique video
            videoPromises.push((async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/search`, {
                        headers: { Authorization: PEXELS_API_KEY },
                        params: {
                            query,
                            per_page: 30, // Fetch MORE to increase chance of uniqueness
                            orientation: 'portrait',
                            size: 'medium'
                        },
                    });

                    const videos = response.data.videos;

                    // Find the first video that hasn't been used globally or in this session
                    let selectedVideo = null;
                    let selectedVideoId = null;

                    for (const video of videos) {
                        const link = video.video_files[0]?.link;
                        const id = video.id;

                        if (link && !globalUsedVideoIds.has(id) && !currentSessionUsedUrls.has(link)) {
                            selectedVideo = link;
                            selectedVideoId = id;

                            // Mark as used immediately for this session's logic
                            currentSessionUsedUrls.add(link);
                            // We don't update global storage here to avoid race conditions if multiple tabs, 
                            // but for this simple app it's fine. We'll update it after selection.
                            break;
                        }
                    }

                    if (selectedVideo) {
                        markVideoAsUsed(selectedVideoId);
                        return selectedVideo;
                    }

                    // If all used, try to find one that hasn't been used in *this* session at least
                    for (const video of videos) {
                        const link = video.video_files[0]?.link;
                        if (link && !currentSessionUsedUrls.has(link)) {
                            return link;
                        }
                    }

                    // Absolute fallback
                    return videos[0]?.video_files[0]?.link || FALLBACK_VIDEOS[i % FALLBACK_VIDEOS.length];

                } catch (e) {
                    console.error(`Error fetching video for query "${query}":`, e);
                    return FALLBACK_VIDEOS[i % FALLBACK_VIDEOS.length];
                }
            })());
        }

        return await Promise.all(videoPromises);

    } catch (error) {
        console.error('Error in smart video fetch:', error);
        return verses.map((_, i) => FALLBACK_VIDEOS[i % FALLBACK_VIDEOS.length]);
    }
};

const getGenericVideos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            headers: { Authorization: PEXELS_API_KEY },
            params: {
                query: 'nature drone view aerial',
                per_page: 10,
                orientation: 'portrait',
                size: 'medium'
            },
        });
        return response.data.videos.map(video => video.video_files[0].link);
    } catch (e) {
        return FALLBACK_VIDEOS;
    }
};
