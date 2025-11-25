import React from 'react';
import { useApp } from '../context/AppContext';

const ReciterSelect = () => {
    const { reciters, selectedReciter, setSelectedReciter } = useApp();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Reciter</label>
            <select
                className="p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedReciter || ''}
                onChange={(e) => setSelectedReciter(Number(e.target.value))}
            >
                {reciters.map((reciter) => (
                    <option key={reciter.id} value={reciter.id}>
                        {reciter.reciter_name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ReciterSelect;
