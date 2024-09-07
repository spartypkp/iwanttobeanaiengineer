// BlogFeed.tsx
import React from 'react';
import BlogPreview from './blogPreview'; // Ensure this is correctly imported

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    link: string;
}

interface BlogFeedProps {
    type: 'daily' | 'technical';
}

const BlogFeed: React.FC<BlogFeedProps> = ({ type }) => {
    const generateBlogs = (type: 'daily' | 'technical'): Blog[] => {
        if (type === 'daily') {
            return [
                {
                    id: 1,
                    title: "Daily Check-In: Progress and Challenges",
                    excerpt: "Today's focus was refining the blog feed component with TypeScript.",
                    date: "September 7, 2024",
                    link: `/blogs/daily/1`
                },
                {
                    id: 2,
                    title: "Day's Summary: Insights and Learning",
                    excerpt: "A reflection on the lessons learned from integrating interactive elements in React.",
                    date: "September 8, 2024",
                    link: `/blogs/daily/2`
                },
                {
                    id: 3,
                    title: "Daily Reflection: Troubleshooting and Fixes",
                    excerpt: "An overview of today's troubleshooting efforts and the fixes implemented.",
                    date: "September 9, 2024",
                    link: `/blogs/daily/3`
                },
                {
                    id: 4,
                    title: "Day's End Review: Achievements and Setbacks",
                    excerpt: "A candid look at both the achievements and the setbacks faced throughout the day.",
                    date: "September 10, 2024",
                    link: `/blogs/daily/4`
                }
            ];
        } else {
            return [
                {
                    id: 1,
                    title: "Technical Dive: Building the iwanttobeanaiengineer.com",
                    excerpt: "A comprehensive breakdown of the technical aspects of creating this website.",
                    date: "September 7, 2024",
                    link: `/blogs/technical/1`
                },
                {
                    id: 2,
                    title: "In-depth Analysis: AI Integration in Web Projects",
                    excerpt: "Exploring the integration of AI technologies within web-based projects.",
                    date: "September 12, 2024",
                    link: `/blogs/technical/2`
                },
                {
                    id: 3,
                    title: "Technical Insight: Optimizing React Components",
                    excerpt: "Techniques for optimizing React components for better performance and usability.",
                    date: "September 15, 2024",
                    link: `/blogs/technical/3`
                },
                {
                    id: 4,
                    title: "Deep Dive: Using TypeScript in React",
                    excerpt: "Benefits and challenges of using TypeScript in React development.",
                    date: "September 18, 2024",
                    link: `/blogs/technical/4`
                }
            ];
        }
    };

    const blogs = generateBlogs(type);

    return (
        <div className="max-h-96 overflow-y-auto border rounded-lg shadow-sm">
            {blogs.map(blog => (
                <BlogPreview
                    key={blog.id}
                    title={blog.title}
                    excerpt={blog.excerpt}
                    date={blog.date}
                    link={blog.link}
                />
            ))}
        </div>
    );
};

export default BlogFeed;
