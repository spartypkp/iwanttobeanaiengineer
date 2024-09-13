import React from 'react';
import BlogFeed from '@/components/custom/blogFeed';
import { getAllBlogs } from '@/lib/api';
import { DailyBlog, Introduction, Task, Reflection } from '@/lib/types';
import BlogPreview from '@/components/custom/blogPreview';

  
export default async function DailyBlogPage() {
	const allBlogs = await getAllBlogs()
	if (!allBlogs) {
		return null;
	}
	
	return (
		<div className="flex-1">
		  <div className="text-center">
			<h4 className="text-3xl font-bold mb-4">Latest Daily Blogs</h4>
			<p className="text-sm mb-6">
			  Catch up with my daily progress and insights into the life of an aspiring AI engineer.
			</p>
		  </div>
		  <div className="max-h-96 rounded-lg bg-gray-100 overflow-y-auto shadow-sm p-2">
			{allBlogs.map(blog => (
			  <BlogPreview
			    key={blog.day_count}
				day={blog.day_count}
				title={`Day ${blog.day_count}: ${blog.blog_title}`}
				excerpt={blog.blog_description}
				date={`${blog.date}`}
				link={`/dailyBlogs/${blog.date}`}
			  />
			))}
		  </div>
		  
		</div>
	  );
};

