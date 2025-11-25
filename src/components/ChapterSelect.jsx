import React from 'react';
import { useApp } from '../context/AppContext';

const ChapterSelect = () => {
    const { chapters, selectedChapter, setSelectedChapter } = useApp();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Surah</label>
            <select
                className="p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedChapter || ''}
                onChange={(e) => setSelectedChapter(Number(e.target.value))}
            >
                {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                        {chapter.id}. {chapter.name_simple} ({chapter.name_arabic})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ChapterSelect;
