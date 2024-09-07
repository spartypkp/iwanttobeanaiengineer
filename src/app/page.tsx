import React from 'react';
import { Button } from '@/components/ui/button';
import BlogFeed from '@/components/custom/blogFeed';  // Component for displaying blog previews

const HomePage: React.FC = () => {
    const daysSinceStart: number = 0;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="text-center space-y-6 my-12">
                <img src="profilePic.jpg" alt="Profile Picture" className="mx-auto h-48 w-48 object-cover rounded-full" />
                <h1 className="text-6xl font-bold">👋 Hi, I'm Will</h1>
                <h2 className="text-5xl font-semibold">🚀 I Want to Be an AI Engineer</h2>
                <p className="text-xl">
                    It's been <span className="font-bold text-red-600">{daysSinceStart}</span> days since I started my quest 🗓️.
                    This counter stops the day I get hired as an AI Engineer 🔐.
                </p>
            </header>

            <section className="py-8 px-4">
                <h3 className="text-4xl font-bold text-center mb-6">Welcome to Will's Quest!</h3>
                <p className="text-lg leading-relaxed mb-4">
                    Hello and welcome to iwanttobeanaiengineer.com! I'm Dave, the AI crafted to guide you through Will's journey towards becoming an AI engineer.
                </p>

                {/* Blog Feeds Section */}
                <div className="mb-8">
                    <h4 className="text-3xl font-bold text-center mb-4">Latest Daily Blogs</h4>
                    <p className="text-center text-sm mb-6">Catch up with my daily progress and insights into the life of an aspiring AI engineer.</p>
                    <BlogFeed type="daily" />
                    <div className="text-center mt-4">
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View All Daily Blogs</Button>
                    </div>
                </div>
                
                <div className="mb-8">
                    <h4 className="text-3xl font-bold text-center mb-4">Featured Technical Blogs</h4>
                    <p className="text-center text-sm mb-6">Deep dives into specific projects and technical challenges I've tackled.</p>
                    <BlogFeed type="technical" />
                    <div className="text-center mt-4">
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View All Technical Blogs</Button>
                    </div>
                </div>

                {/* Highlighted Projects Section */}
                <section className="my-10">
                    <h3 className="text-4xl font-bold text-center mb-6">Highlighted Projects</h3>
                    {/* Placeholder for dynamic project highlights */}
                </section>

                {/* Call to Action Section */}
                <div className="text-center my-10">
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Explore More Projects</Button>
                </div>
            </section>

            <footer className="text-center my-10">
                <p>Interested in my journey or want to connect? Follow me or drop a line!</p>
                <div className="space-x-4 mt-2">
                    <Button>Twitter</Button>
                    <Button>LinkedIn</Button>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
