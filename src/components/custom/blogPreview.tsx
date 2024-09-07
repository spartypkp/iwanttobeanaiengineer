// BlogPreview.tsx
import React from 'react';
import DaveAnalysis from './daveAnalysis';

interface BlogPreviewProps {
    title: string;
    excerpt: string;
    date: string;
    link: string;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ title, excerpt, date, link }) => {
    // Placeholder data for Dave's analysis
    const daveText = "Dave's take: A deep dive into the complexities of AI ethics that might just blow your mind—or put you to sleep. It's a fine line!";

    return (
        <div className="border-b last:border-b-0 rounded-t-lg p-4 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center relative">
            <div className="flex-1">
                <a href={link} className="hover:underline">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
                </a>
                <p className="text-sm text-gray-600 mb-1">{excerpt}</p>
                <div className="flex items-center text-gray-500 text-xs">
                    <span>{date}</span>
                    <div className="ml-2 cursor-pointer group">
                        <i className="fas fa-info-circle text-blue-500"></i>
                        <DaveAnalysis analysisText={daveText} />
                    </div>
                </div>
            </div>
            <div className="ml-4 flex-shrink-0">
                <div className="h-20 w-20 bg-black"> {/* Placeholder for image */}</div>
            </div>
        </div>
    );
};

export default BlogPreview;
