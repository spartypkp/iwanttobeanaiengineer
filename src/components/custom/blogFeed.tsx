import React from 'react';
import BlogPreview from './blogPreview'; // Ensure this is correctly imported
import { Button } from '../ui/button';
import { DailyBlog } from '@/lib/types';
import { getAllBlogs } from '@/lib/api';
import { BlogPreviewProps } from './blogPreview';
interface BlogFeedProps {
	type: 'daily' | 'technical';
}

async function fetchBlogs(type: string) {
	if (type === 'daily') {
		const allBlogs = await getAllBlogs();
		if (allBlogs && allBlogs.length > 0) {
			const blogProps = allBlogs.map((blog: DailyBlog): BlogPreviewProps => {
				return {
					day: blog.day_count,
					title: `Day ${blog.day_count}: ${blog.blog_title}` || "No Title", // Fallback if no title
					excerpt: blog.blog_description || "No Description", // Fallback if no description
					date: `${blog.date}`,
					link: `/dailyBlogs/${blog.date}`
				};
			});
			return blogProps;
		}
	} else {
		// Preset data for technical blogs as previously given
		return [];
	}
}

const BlogFeed: React.FC<BlogFeedProps> = async ({ type }) => {
	let blogProps = await fetchBlogs(type);
	if (!blogProps) {
		blogProps = [];
	}
	
	

	return (
		<div className="flex-1">
		  <div className={type === 'daily' ? "text-center" : "text-center"}>
			<h4 className="text-3xl font-bold mb-4">{type === 'daily' ? "Latest Daily Blogs" : "Featured Technical Blogs"}</h4>
			<p className="text-sm mb-6">
			  {type === 'daily' ? "Catch up with my daily progress and insights into the life of an aspiring AI engineer." :
			  "Deep dives into specific projects and technical challenges I've tackled."}
			</p>
		  </div>
		  <div className="max-h-96 rounded-lg bg-gray-100 overflow-y-auto shadow-sm p-2">
			{blogProps.map(blog => (
			  <BlogPreview
			  key={blog.day}
			  day={blog.day}
			  title={`${blog.title}`}
			  excerpt={blog.excerpt}
			  date={`${blog.date}`}
			  link={`/dailyBlogs/${blog.date}`}
			/>
			))}
		  </div>
		  <div className="text-center mt-4">
			<Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View All {type} Blogs</Button>
		  </div>
		</div>
	  );
};

export default BlogFeed;
