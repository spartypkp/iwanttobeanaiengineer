import React from 'react';

/**
 * Rambling component to highlight and provide a tooltip for text portions.
 * @param {Object} props - React props.
 * @param {string} props.children - Text to display and highlight.
 */
const Rambling: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <span className="relative group">
            <span className="bg-orange-100 px-1 rounded">
                {children}
            </span>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 w-auto p-2 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Caution: Will is rambling here 🌀
            </span>
        </span>

		
    );
};

export default Rambling;
