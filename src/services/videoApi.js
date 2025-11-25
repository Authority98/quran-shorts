import axios from 'axios';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/videos';

// Fallback videos in case API fails or no key
const FALLBACK_VIDEOS = [
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm',
];

// Keyword mapping for smart context - STRICT NATURE (No Humans, No Animals)
const KEYWORDS = {
    // Elements of Nature
    nature: ['earth', 'land', 'mountain', 'tree', 'garden', 'river', 'fruit', 'grain', 'leaf', 'forest', 'desert', 'sand', 'rock'],
    sky: ['sky', 'sun', 'moon', 'star', 'cloud', 'night', 'day', 'light', 'dark', 'dawn', 'dusk', 'heaven', 'paradise', 'angel', 'spirit', 'soul'],
    water: ['sea', 'ocean', 'water', 'rain', 'ship', 'sailing', 'fountain', 'spring'],
    fire: ['fire', 'hell', 'burn', 'flame', 'punishment', 'blazing', 'smoke', 'heat'],

    // Abstract concepts mapped to nature
    peace: ['peace', 'mercy', 'prayer', 'mosque', 'worship', 'faith', 'truth', 'sign', 'creation', 'time', 'life', 'death'],

    // Living beings mapped to their habitats/elements (Indirect representation)
    // We do NOT show the animals/people, but the environment they inhabit or a metaphorical element
    animal_habitat: ['camel', 'cattle', 'bird', 'ant', 'bee', 'spider', 'horse', 'elephant', 'lion', 'wolf', 'people', 'mankind', 'face', 'hand'],
};

const getQueryFromText = (text) => {
    const lowerText = text.toLowerCase();

    // Check for specific categories
    for (const [category, words] of Object.entries(KEYWORDS)) {
        if (words.some(word => lowerText.includes(word))) {
            // Return a specific visual query based on the category, enforcing STRICT nature/landscape
            switch (category) {
                case 'fire': return 'fire flames texture'; // Texture ensures abstract/close-up
                case 'water': return 'ocean waves nature';
                case 'sky': return 'sky clouds time lapse';
                case 'nature': return 'nature landscape forest';
                case 'animal_habitat': return 'nature landscape wilderness'; // Map animals to wilderness
                case 'peace': return 'mosque architecture sky'; // Mosques are fine, or sky
                default: return `${category} nature landscape`;
            }
        }
    }

    return 'nature landscape abstract'; // Default fallback
};

export const getBackgroundVideos = async (verses = []) => {
    try {
        // If no verses provided, just return some generic nature videos
        if (!verses.length) {
            return getGenericVideos();
        }

        const usedVideoUrls = new Set();
        const videoPromises = [];

        // Process verses sequentially to ensure uniqueness (or use a shared Set if parallel)
        // For simplicity and to avoid race conditions with the Set, we'll fetch in parallel but filter carefully
        // However, fetching 5 videos per verse is expensive. Let's do it smartly.

        for (const verse of verses) {
            const query = getQueryFromText(verse.translation || '');

            // We push a promise that resolves to a unique video
            videoPromises.push((async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/search`, {
                        headers: { Authorization: PEXELS_API_KEY },
                        params: {
                            query,
                            per_page: 10, // Fetch more to increase chance of uniqueness
                            orientation: 'portrait',
                            size: 'medium'
                        },
                    });

                    const videos = response.data.videos;

                    // Find the first video that hasn't been used
                    let selectedVideo = null;
                    for (const video of videos) {
                        const link = video.video_files[0]?.link;
                        if (link && !usedVideoUrls.has(link)) {
                            selectedVideo = link;
                            usedVideoUrls.add(link);
                            break;
                        }
                    }

                    // If all used (unlikely with 10), fallback to the first one or a generic fallback
                    return selectedVideo || videos[0]?.video_files[0]?.link || FALLBACK_VIDEOS[0];

                } catch (e) {
                    console.error(`Error fetching video for query "${query}":`, e);
                    return FALLBACK_VIDEOS[0];
                }
            })());
        }

        return await Promise.all(videoPromises);

    } catch (error) {
        console.error('Error in smart video fetch:', error);
        return FALLBACK_VIDEOS;
    }
};

const getGenericVideos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            headers: { Authorization: PEXELS_API_KEY },
            params: {
                query: 'islamic nature',
                per_page: 5,
                orientation: 'portrait',
                size: 'medium'
            },
        });
        return response.data.videos.map(video => video.video_files[0].link);
    } catch (e) {
        return FALLBACK_VIDEOS;
    }
};
