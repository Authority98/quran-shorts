import axios from 'axios';

const BASE_URL = 'https://api.quran.com/api/v4';

export const getReciters = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/resources/recitations`);
    return response.data.recitations;
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return [];
  }
};

export const getTranslations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/resources/translations?language=en`);
    return response.data.translations;
  } catch (error) {
    console.error('Error fetching translations:', error);
    return [];
  }
};

export const getChapters = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/chapters`);
    return response.data.chapters;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
};

export const getVerses = async (chapterId, reciterId, translationId) => {
  try {
    // Fetch verses with audio and translation
    // We need audio_url for the specific reciter.
    // The verses/by_chapter endpoint is complex.
    // Let's try a more specific approach.

    // 1. Get verses text and translation
    const textResponse = await axios.get(`${BASE_URL}/verses/by_chapter/${chapterId}`, {
      params: {
        language: 'en',
        words: false,
        translations: translationId,
        fields: 'text_uthmani',
        per_page: 50, // Adjust as needed, maybe pagination later
      }
    });

    // 2. Get audio for the chapter by the reciter
    // api.quran.com/api/v4/chapter_recitations/{reciter_id}/{chapter_id}
    // This gives the full audio file for the chapter.
    // But we want verse-by-verse.
    // Some reciters have verse-by-verse audio.
    // Let's check recitations endpoint again.
    // It seems some recitations are "gapless" (full chapter) and some are "verse_by_verse".
    // We should filter for verse_by_verse reciters if we want verse-by-verse sync easily.

    // For now, let's assume we use verse_by_verse reciters.
    // The endpoint for verse audio is:
    // https://api.quran.com/api/v4/recitations/{reciter_id}/by_chapter/{chapter_id}
    // Wait, let's look at the docs or response structure.

    // Actually, let's use the /verses/by_chapter endpoint which can include audio.
    // But we need to pass the audio field? No, audio is a separate resource.

    // Let's try fetching audio files separately.
    const audioResponse = await axios.get(`${BASE_URL}/recitations/${reciterId}/by_chapter/${chapterId}`, {
      params: {
        per_page: 50
      }
    });

    // Merge data
    const verses = textResponse.data.verses.map((verse, index) => {
      const audio = audioResponse.data.audio_files.find(a => a.verse_key === verse.verse_key);
      return {
        ...verse,
        audio_url: audio ? `https://verses.quran.com/${audio.url}` : null,
        translation: verse.translations[0]?.text
      };
    });

    return verses;

  } catch (error) {
    console.error('Error fetching verses:', error);
    return [];
  }
};
