import axios from 'axios';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/videos';

// Fallback videos in case API fails or no key
const FALLBACK_VIDEOS = [
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm',
];

export const getBackgroundVideos = async (query = 'nature') => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            headers: {
                Authorization: PEXELS_API_KEY,
            },
            params: {
                query,
                per_page: 5,
                orientation: 'portrait', // We want vertical videos for Shorts
                size: 'medium'
            },
        });

        return response.data.videos.map(video => video.video_files[0].link);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return FALLBACK_VIDEOS;
    }
};
