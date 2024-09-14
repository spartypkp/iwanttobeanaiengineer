import { getBlogBySlug } from "@/lib/api";
import { redirect } from "next/navigation";
import Head from 'next/head';
import DynamicHTML from "@/components/custom/dynamicHTML";
import 'react-quill/dist/quill.snow.css';

export default async function Blog({ params }: { params: { blogId: string; }; }) {
	const blog = await getBlogBySlug(params.blogId);
	if (!blog) {
		redirect('/not-found');
	}

	return (
		<>
			<Head>
				<link href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css" rel="stylesheet" />
			</Head>
			<div className="daily-blog-container max-w-6xl mx-auto my-8 p-4 bg-white shadow-lg rounded-lg leading-loose">



				<div className="mb-8 rounded lg border border-gray-400 bg-blue-100 text-black p-4">
					<h1 className="text-4xl font-bold text-black">{`Day ${blog.day_count}: ${blog.blog_title}`}</h1>
					<p className="mb-4">{`Date: ${blog.date}`}</p>
					<p>{blog.blog_description}</p>

				</div>


				{blog.introduction && (
					<div className="mb-8 mt-8">
						<h1 className="text-4xl font-bold text-gray-800 mb-3">Morning Pregame and Introduction</h1>
						<DynamicHTML sectionData={blog.introduction} type="Introduction" />
					</div>
				)}

				{blog.tasks && blog.tasks.map((task, index) => (
					<div key={`task-${index}`} className="mb-8">
						<h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">Task {index + 1}</h1>
						<DynamicHTML sectionData={task} type="Task" />
					</div>
				))}

				{blog.reflection && (
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">Reflection</h1>

						<DynamicHTML sectionData={blog.reflection} type="Reflection" />
					</div>
				)}
			</div>
		</>
	);
}
