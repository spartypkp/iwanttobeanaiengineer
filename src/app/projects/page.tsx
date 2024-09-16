import ProjectCard, { Project } from '@/components/custom/projectCard';

const projects: Project[] = [
    {
		id: "daily-blog-builder",
		name: "Daily Blog Builder",
		description: "A local Flask application designed to aid in structuring and writing daily blogs with the help of an AI editor. It includes features such as AI-assisted content refinement, rich text editing, and automated blog management and publication.",
		technologies: ["Flask", "React", "NextJS", "PostgreSQL", "Supabase", "Quill.js", "OpenAI"],
		githubUrl: "https://github.com/yourGithubUsername/daily-blog-builder", // Update with your actual GitHub repository URL
		liveDemoUrl: "https://daily-blog-builder-demo.com", // Optional: provide if available
		status: "Active",
		startDate: new Date(2023, 0, 1), // Example start date, adjust as necessary
		thumbnailSrc: "/dailyBlogBuilder"
	},
    // More projects...
];
const ProjectsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center">My Projects</h1>
			<p>Note: Currently being updated rn!</p>
            <div className="flex flex-wrap justify-center">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}

export default ProjectsPage;