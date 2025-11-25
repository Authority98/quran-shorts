import React from 'react';
import { useApp } from '../context/AppContext';

const TranslationSelect = () => {
    const { translations, selectedTranslation, setSelectedTranslation } = useApp();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Translation</label>
            <select
                className="p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedTranslation || ''}
                onChange={(e) => setSelectedTranslation(Number(e.target.value))}
            >
                {translations.map((translation) => (
                    <option key={translation.id} value={translation.id}>
                        {translation.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TranslationSelect;
