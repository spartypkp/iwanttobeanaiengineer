import ProjectCard, { Project } from '@/components/custom/projectCard';

const projects: Project[] = [
    {
        id: "1",
        name: "Recodify",
        description: "An application to transform legislation into data-driven interfaces.",
        technologies: ["React", "Node.js", "GraphQL"],
        githubUrl: "https://github.com/yourUsername/recodify",
        liveDemoUrl: "https://recodify.com",
        status: "Active",
        startDate: new Date(2023, 0, 1),
		thumbnailSrc: "/blah"
    },
    // More projects...
];
const ProjectsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center">My Projects</h1>
            <div className="flex flex-wrap justify-center">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}

export default ProjectsPage;