import ProjectCard, { Project } from '@/components/custom/projectCard';

const projects: Project[] = [
    {
		id: "daily-blog-builder",
		name: "Daily Blog Builder",
		description: "A local Flask application designed to aid in structuring and writing daily blogs with the help of an AI editor. It includes features such as AI-assisted content refinement, rich text editing, and automated blog management and publication. I use this tool everyday to write all of my daily blogs, edit them, and publish them to this NextJS site!",
		technologies: ["Flask", "React", "NextJS", "PostgreSQL", "Supabase", "Quill.js", "OpenAI"],
		githubUrl: "https://github.com/spartypkp/daily-blog-builder", // Update with your actual GitHub repository URL
		liveDemoUrl: "https://iwanttobeanaiengineer.vercel.app/dailyBlogs", // Optional: provide if available
		status: "Active",
		startDate: new Date(2024, 9, 4), // Example start date, adjust as necessary
		thumbnailSrc: "/blogBuilder.png",
		features:  <div>
        <p>
            <strong>Daily Blog Builder</strong> simplifies the process of writing, managing, and publishing daily blogs.
            It&apos;s designed to support individuals committed to documenting their journey towards personal or professional goals.
            This tool integrates seamlessly into daily routines, offering a blend of technical documentation capabilities and self-reflection tools.
        </p>
        <h3 className="font-semibold text-lg">Core Functionalities</h3>
        <ul>
            <li>
                <strong>AI-Assisted Writing:</strong> Utilizes advanced AI to provide editorial guidance, ensuring content clarity and engagement.
                It includes automatic summarization, humor injection, and structured data extraction from technical documents.
            </li>
            <li>
                <strong>Reflection and Motivation:</strong> The AI Editor helps analyze daily successes and failures, offering feedback that encourages continuous improvement and consistent goal pursuit.
            </li>
            <li>
                <strong>Rich Text Editing:</strong> Incorporates Quill.js for a flexible and user-friendly writing experience.
            </li>
            <li>
                <strong>Seamless Integration:</strong> Custom React components are dynamically generated for enhancing blog posts with additional content and interactive elements.
            </li>
            <li>
                <strong>Storage and Management:</strong> Automated handling of blog entries with Postgres and Supabase Storage, supporting embedded images and other media.
            </li>
            <li>
                <strong>Publication Ready:</strong> Features include one-click blog publishing to a NextJS frontend, with all edits and annotations intact.
            </li>
        </ul>
        <p>
            Whether you&apos;re documenting project progress, daily learning, or personal growth, <em>Daily Blog Builder</em> is tailored to make the journey insightful and documented.
        </p>
    </div>
	},
	{
		id: "open-source-legislation",
		name: "Open Source Legislation",
		description: "Welcome to open-source-legislation, a platform dedicated to democratizing access to global legislative data. This repository serves as a foundational tool for developers, legal professionals, and researchers to build applications using primary source legislation.",
		features: (
			<div>
				<h3 className="font-semibold text-lg">Features and Functionalities</h3>
				<ul>
					<li>Global Repository of Scraped Legislation: Access an extensive database of detailed legislative content from jurisdictions worldwide.</li>
					<li>Download Processed SQL Legislation Data: Easily integrate legislation into your systems with SQL files enriched with metadata.</li>
					<li>Unified Legislation Schema: Leverage a sophisticated SQL schema designed for deep relational data exploration and complex querying.</li>
					<li>Large Language Model Readiness: Utilize data structured for AI applications, including pre-generated embedding fields.</li>
					<li>Python SDK: Employ our Python SDK to interact with the legislation data using Pydantic models for seamless data handling and validation.</li>
					<li>TypeScript SDK (Coming Soon): Enhance client-side application development with our upcoming TypeScript SDK.</li>
					<li>Customizable Scraping Tools: Adapt and extend scraping tools as needed, contributing to the community’s growth and resource pool.</li>
				</ul>
				
			</div>
		),
		technologies: ["Python", "SQL", "Pydantic", "OpenAI", "Selenium", "BeautifulSoup"],
		githubUrl: "https://github.com/spartypkp/open-source-legislation",
		liveDemoUrl: undefined, // If there's no live demo available
		status: "Active",
		startDate: new Date(2023, 10, 1),
		thumbnailSrc: "/openSourceLegislationTracker.png", // Assuming you have a relevant image
	},
	{
		id: "iwanttobeanaiengineer",
		name: "I Want To Be An AI Engineer",
		description: "This website documents my journey to becoming an AI engineer, featuring daily blogs, technical deep dives, and an interactive resume. Designed as a real-time window into my job search, it serves both as a personal catharsis and a professional portfolio.",
		features: (
			<div>
				<h3 className="font-semibold text-lg">Features and Functionalities</h3>
				<ul>
					<li>Interactive Countdown: Tracks the days until I secure a full-time AI engineering position.</li>
					<li>Daily Blogs: Document daily progress with insights into both routine tasks and significant achievements.</li>
					<li>Technical Blog Posts: In-depth discussions on larger projects and AI concepts.</li>
					<li>AI Editor &apos;Dave&apos;: A virtual editor that assists in refining content and managing blog postings, easing the burden of consistent content creation.</li>
					<li>Interactive Resume: Showcases my projects and experiences, highlighting capabilities as an AI engineer and providing transparency in my job search.</li>
					<li>Statistics Tracking: Charts and tracks a variety of personal and technical statistics, visualizing progress and areas for improvement.</li>
					<li>Project Page: A dedicated section for each project, including this website, to detail development progress, technologies used, and project-specific features.</li>
				</ul>
			</div>
		),
		technologies: ["NextJS", "React", "TypeScript", "Vercel"],
		githubUrl: "https://github.com/spartypkp/iwanttobeanaiengineer", // Update with actual URL
		liveDemoUrl: "https://iwanttobeanaiengineer.vercel.app/",
		status: "Active",
		startDate: new Date(2024, 0, 1), // Assume starting date of the project
		thumbnailSrc: "/iWantToBeAnAIEngineer.png", // Placeholder for the actual image URL
	},
	{
		id: "pgtyped-pydantic",
		name: "PGTyped Pydantic",
		description: "PGTyped Pydantic automates the process of adding type hints to SQL queries in Python projects, by generating Pydantic models directly from SQL commands. It enhances productivity by observing changes in real-time and updating Python files with accurate type annotations derived from the database schema.",
		features: (
			<div>
				<h3 className="font-semibold text-lg">Features and Functionalities</h3>
				<ul>
					<li>Automatic Pydantic Model Generation: Monitors Python files for SQL queries and automatically generates corresponding Pydantic models for parameters and results.</li>
					<li>Real-Time Updates: Operates in &apos;watch mode&apos;, dynamically watching for changes in specified directories and updating code with new models and annotations as SQL queries are saved.</li>
					<li>Effortless Integration: Developers can focus on writing straightforward SQL queries; the tool handles the creation and integration of type hints and Pydantic models.</li>
					<li>Type Safety: Ensures that the interaction between Python code and the PostgreSQL database is type-safe, minimizing runtime errors and enhancing code quality.</li>
					<li>Fork and Enhancements: A fork of the original PGTyped library, adapted for Python to use Pydantic models instead of TypeScript interfaces, leveraging the robust npx package of PGTyped modified for Python.</li>
				</ul>
			</div>
		),
		technologies: ["Python", "PostgreSQL", "Pydantic", "Node.js"],
		githubUrl: "https://github.com/spartypkp/pgtyped-pydantic", // Replace with your actual GitHub repository URL
		liveDemoUrl: "https://github.com/spartypkp/pgPydanticTest", // Optional: Provide if available
		status: "Archived",
		startDate: new Date(2024, 1, 1), // Example start date, adjust as necessary
		thumbnailSrc: "/pgTypedPydantic.png", // Placeholder for the actual image URL
	} 
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