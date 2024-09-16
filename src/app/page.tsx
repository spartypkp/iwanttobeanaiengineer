import React from 'react';
import { Button } from '@/components/ui/button';
import BlogFeed from '@/components/custom/blogFeed';
import { Warning, Informative, Question, Highlight } from '@/components/custom/warningTooltip';
import HiringQuiz from '@/components/custom/hiringQuiz';
import Link from 'next/link';
const HomePage: React.FC = () => {

	const calculateDaysSince = (startDate: Date) => {
		const now = new Date();
		const difference = now.getTime() - startDate.getTime();
		return Math.floor(difference / (1000 * 3600 * 24)); // Convert milliseconds to days
	};
	const startDate = new Date('2024-09-05');
	const daysSinceStart = calculateDaysSince(startDate);

	return (
		<div className="max-w-7xl mx-auto">
			<header className="text-center space-y-6 my-12">
				<img src="profilePic.jpg" alt="Profile Picture" className="mx-auto h-48 w-48 object-cover rounded-full" />
				<h1 className="text-6xl font-bold">Hi, I&apos;m Will.</h1>
				<h2 className="text-3xl font-semibold mt-4">
					This is My Quest to Get My Dream Job as an AI Engineer.
				</h2>
				<p className="text-xl">
					It&apos;s been <span className="font-bold text-red-600 text-4xl">{daysSinceStart}</span> days since I started.
				</p>
				<p className="text-xl">
					The counter stops the day I get hired.
				</p>
			</header>

			<section className="py-8 px-4">
				<h3 className="text-4xl font-bold text-center mb-6">Why this Website?</h3>
				<p className="text-lg leading-relaxed mb-4">
					The point? Transparency, catharsis, and a bit of shameless self-promotion. I post daily blogs that serve as progress reports and document my journey in a structured way, covering both the mundane and the exciting parts of my day-to-day work. There are also in-depth technical blog posts where I dive into larger projects I&apos;m working on. <span className="inline-block"><Informative message="He means the ones he actually finishes."></Informative></span>
				</p>

				<p className="text-lg leading-relaxed mb-4">
					Many friends and mentors suggested starting a blog to document my progress (mostly for myself), provide a window into some interesting projects I work on, and possibly help me on my goal of full-time employment. <span className="inline-block"><Warning message="And by 'help', he means 'please hire me so I can stop pretending I understand recursion.'"></Warning></span> I always struggled with putting myself out there, and the thought of writing a technical blog terrifies me.
				</p>

				<p className="text-lg leading-relaxed mb-4">
					So, I decided to build an AI editor—Dave—to handle most of the blog editing and writing, allowing me to completely avoid responsibility. <span className="inline-block"><Question message="Avoid responsibility, or just scared of typos, Will?"></Question></span> Dave not only proofreads and compiles my thoughts but also automatically posts them, helping me overcome my fear of putting myself out there.
				</p>
				<p className="text-lg leading-relaxed mb-4">
					Ultimately, this website doubles as an interactive resume, showcasing projects and experiences that highlight my capabilities as an AI engineer. It&apos;s a real-time window into my job search, and hopefully, an inspiration for other young and passionate engineers. <span className="inline-block"><Highlight message="Just don’t look too closely at the commit messages; it’s not as inspiring.">Even if no one sees this, I&apos;ll still have this site to look back on someday.</Highlight></span>
				</p>
			</section>


			<section>

				<div className="flex flex-row justify-between space-x-4 px-4 py-8">
					<BlogFeed type={'daily'} />
					<BlogFeed type={'technical'} />
				</div>

			</section>

			<section className="flex items-center justify-center">
				<HiringQuiz></HiringQuiz>
			</section>


			<section className="my-10">
				<h3 className="text-4xl font-bold text-center mb-6">Highlighted Projects</h3>
				<p className="text-center text-lg mb-4">
					Explore a curated selection of projects that exemplify innovative solutions and technical expertise. From AI-driven applications to sophisticated data pipelines, these highlights reflect the breadth and depth of my engineering capabilities.
				</p>
				{/* Placeholder for dynamic project highlights */}
				<div className="items-center justify-center">
					<Button variant="link" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/projects">Explore More Projects</Link></Button>

				</div>
			</section>


			<section className="my-10">
				<h3 className="text-4xl font-bold text-center mb-6">Interactive Resume</h3>
				<p className="text-center text-lg mb-4">
					View my resume in an interactive format, including a career timeline. Learn more about my skills, experience, and my journey as as software engineer.
				</p>
				{/* Placeholder for dynamic project highlights */}
				<div className="items-center justify-center">
					<Button variant="link" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/about">Learn More About My Journey</Link></Button>

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
