import { getBlogBySlug } from "@/lib/api";
import { DailyBlog } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function Blog({ params }: { params: { blogId: string; }; }) {
	const blog = await getBlogBySlug(params.blogId)
	if (!blog) {
		redirect('/not-found')
	}
	console.log(blog)
	return (
		<div className="daily-blog-container">
    <div className="blog-date">
        <h3>Date</h3>
        <p>{`${blog.date}`}</p>
    </div>

    <div className="blog-introduction">
        <h3>Introduction</h3>
        <div className="personal-context"><h4>Personal Context</h4><p>{blog.introduction?.personal_context}</p></div>
        <div className="daily-goals"><h4>Daily Goals</h4><p>{blog.introduction?.daily_goals}</p></div>
        <div className="learning-focus"><h4>Learning Focus</h4><p>{blog.introduction?.learning_focus}</p></div>
        <div className="challenges"><h4>Challenges</h4><p>{blog.introduction?.challenges}</p></div>
        <div className="plan-of-action"><h4>Plan of Action</h4><p>{blog.introduction?.plan_of_action}</p></div>
    </div>

    <div className="blog-tasks">
        <h3>Tasks</h3>
        {blog.tasks.map((task, index) => (
            <div key={index} className="task">
                <h4>Task {index + 1}</h4>
                <p className="task-goal">{task.task_goal}</p>
                <p className="task-description">{task.task_description}</p>
                {/* Add more fields as needed */}
            </div>
        ))}
    </div>

    <div className="blog-reflection">
        <h3>Reflection</h3>
        <div className="technical-challenges"><h4>Technical Challenges</h4><p>{blog.reflection?.technical_challenges}</p></div>
        <div className="interesting-bugs"><h4>Interesting Bugs</h4><p>{blog.reflection?.interesting_bugs}</p></div>
        {/* Add more fields as needed */}
    </div>
</div>

	)

}