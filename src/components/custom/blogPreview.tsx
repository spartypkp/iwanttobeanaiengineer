import React from 'react';

interface BlogPreviewProps {
    title: string;
    excerpt: string;
    date: string;
    link: string;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ title, excerpt, date, link }) => {
    return (
        <div className="border-b last:border-b-0 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
            <div className="flex flex-col justify-between w-5/6 pr-4">
                <a href={link} className="hover:underline">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
                </a>
                <p className="text-sm text-gray-600 mb-1">{excerpt}</p>
                <span className="text-xs text-gray-500">{date}</span>
            </div>
            <div className="w-1/6 flex justify-end items-center">
                <div className="h-20 w-20 bg-black rounded-lg"> {/* Placeholder for image, added rounded corners */}</div>
            </div>
        </div>
    );
};

export default BlogPreview;
