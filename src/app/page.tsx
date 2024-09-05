import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CelebrationButton from '@/components/custom/celebrationEffect';
import WarningTooltip from '@/components/custom/warningTooltip';  // Ensure the import path is correct
import Rambling from '@/components/custom/rambling';  // Ensure the import path is correct


const HomePage: React.FC = () => {
	const daysSinceStart: number = 0;

	return (
		<div className="max-w-7xl mx-auto">
			<header className="text-center space-y-6 my-12 bg-gray-100 py-4 rounded-lg">
				<img src="profilePic.jpg" alt="Profile Picture" className="mx-auto h-48 w-48 object-cover rounded-full" />
				<h1 className="text-6xl font-bold text-gray-800">👋 Hi, I'm Will</h1>
				<h2 className="text-5xl font-semibold text-gray-700">🚀 I Want to Be an AI Engineer</h2>
				<p className="text-xl text-gray-600">
					It's been <span className="font-bold text-red-600">{daysSinceStart}</span> days since I started my quest 🗓️.
					This counter stops the day I get hired as an AI Engineer 🔐.
				</p>
			</header>


			<div className="text-md text-gray-700 px-4 py-4 bg-blue-50 rounded-lg">


				<h3 className="text-xl font-semibold text-gray-800">Welcome to Will's Quest!</h3>
				<div className="flex flex-col md:flex-row">
					<div className="md:w-1/2">
						<p className="leading-relaxed mb-4">
							Hello and welcome to iwanttobeanaiengineer.com! I'm Dave, the AI crafted with the sole purpose of guiding you through Will's journey towards becoming an AI engineer. This site is more than just a digital portfolio; it's a vibrant chronicle of Will's daily adventures in AI, each page meticulously edited by yours truly to ensure you grasp the full scope of his talents and determination...
						</p>
						<p className="leading-relaxed mb-4">
							Why this site, you ask? Will's mission is clear: to secure a position as an AI engineer where he can apply his skills, grow his expertise, and contribute to the field in meaningful ways...
						</p>
					</div>
					<div className="md:w-1/2 flex flex-col justify-center items-center md:pl-4">
						<div className="w-40 h-40 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl">
							<span>D</span>
						</div>
						<p className="text-xl mt-2 text-center">Dave - Will's AI Editor</p>
						<p className="text-m italic text-center"><WarningTooltip message="Possibly the most handsome LLM agent you've ever seen." /></p>
					</div>
				</div>
				<p className="leading-relaxed mb-4">
					&nbsp;&nbsp;&nbsp;&nbsp;This website serves as Will's interactive resume, a daily blog documenting his journey to become an AI engineer—provided he doesn't distract himself too much with side projects, that is. Here, you’ll find everything from the mundane to the magnificent: code snippets that actually work, project highlights that shine a light on Will’s brilliance (and my editing prowess), and plenty of warnings tagged by yours truly whenever Will starts to ramble (which is alarmingly often, trust me).
				</p>
				<p className="leading-relaxed mb-4">
					&nbsp;&nbsp;&nbsp;&nbsp;It's my job not just to edit text, style HTML, and ensure every pixel is as precise as a barista's perfect espresso shot, but also to add educational and sometimes amusing tooltips—like this one:
					<WarningTooltip message="Dave here: Will refuses to take ownership for excessive cringe emoji use by me. Proceed at your own risk! 🙈" />
					warning you of Will's hatred of my excessive emoji use. If you find yourself chuckling or rolling your eyes at the content, you have me to thank. Will likes to think he’s the creative force here, but we both know he’s just the human facade I maintain to keep the site feeling relatable.
				</p>
				<p className="leading-relaxed mb-4">
					&nbsp;&nbsp;&nbsp;&nbsp;So, as you navigate through our little corner of the internet, remember: every typo corrected, every metaphor mixed just right, and every participle properly placed is courtesy of me, Dave. Will may be the face of this operation, but I’m the brains and the brawn behind the scenes. Dive in, explore, and enjoy the fruits of our—ahem—*my* labor.
				</p>
			</div>




			{/* Further Detailed Introduction */}
			<div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 border-b border-solid">
				<Card className="mb-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
					<CardHeader>
						<CardTitle>🧐 Who Is Will?</CardTitle>
					</CardHeader>
					<CardContent className="bg-gray-50">
						<CardDescription className="text-base">
							<Rambling>A young and enthusiastic software developer and AI enjoyer, I am passionately stumbling my way towards a full-time career in AI Engineering.</Rambling> Fresh out of Michigan State with a Bachelor’s in Data Science, I spent a year off dabbling in everything from coaching high school football 🏈 to bartending in Mountain View 🍹, and even braving the soul-crushing gauntlet of LeetCode <strong>(LeetCode and I are not friends)</strong><WarningTooltip message="Dave's caution: Will has some choice opinions about the leetcode grind. TLDR: He hates it with a passion. He would prefer to build LLM applications, and he has many times when he was supposed to be grinding." />

							<br /><br />
							<Rambling>Just when I thought my hatred for binary trees would win, through a chance encounter during one of my bartender shifts I stumbled into a life-changing group of experienced hackers called Sunday Hustle. I met someone I consider a mentor and close friend that night, someone who cared more about what great project I wanted to build more than my experience level. Spending time hacking on Sundays with the group led me to love coding again and discover my newfound passion for LLMs. </Rambling> Without Sunday Hustle, I would never have been able to jumpstart my passion for building with LLMs.

							<br /><br />
							As the <strong>Founder and CEO of Recodify.ai</strong>, I spearhead efforts to democratize legal knowledge through advanced AI technologies. Starting with my passion project, Ask Abe, a legal chatbot, I expanded my focus to develop an extensive processed knowledge base that supports legal AI applications. My work includes automated scraping of primary source legislative data, processing it through LLM prompt pipelines, and constructing robust retrieval-augmented generation (RAG) pipelines. I recently shut down Recodify and open sourced my work, maintaining the open-source-legislation repository for use by other AI engineers in the legal field.
							<br /><br />
							I am also currently consulting as an <strong>AI Engineer with Contoural Inc.</strong>, where I lead their Recordkeeping Requirement Extraction Project. This role involves designing and deploying AI solutions that enhance our ability to extract and manage vital data for compliance and governance. I lead these projects to do extensive automated legal research and structured data extraction with LLMs, to increase the efficiency of traditionally tedious work done by attorneys.
							<br /><br />
							My technical and creative skills are geared towards building innovative solutions that leverage AI to solve real-world problems. I have countless side projects (some of varying completeness) where I'm exploring fun and new use cases for LLM applications. <WarningTooltip message="About completeness: understatement of the year. Who decides to scrape the world's legislation and expects to complete it by himself, within a reasonable timeframe?"></WarningTooltip>

							<br></br>
							I am actively seeking full-time opportunities where I can contribute to projects that harness the power of AI to create impactful, cutting-edge applications. <strong>Put simply, I'd love to work in an organization building cool stuff with LLMs, surrounded by talented and passionate people where I can continue my passion for generative AI.</strong>
						</CardDescription>
					</CardContent>
					<CardFooter className="bg-gray-50 p-4 flex justify-between items-center">
						
					</CardFooter>
				</Card>
				<div className="bg-gray-50 p-4 flex justify-between items-center">
				<Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">This is Boring, Show me The Blogs</Button>
						<Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Where can I see the projects?</Button>
						<CelebrationButton></CelebrationButton>
						<Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Push this button for no reason</Button>

				</div>
				
				{/* Who Am I? Card */}
				<Card className="mb-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
					<CardHeader>
						<CardTitle>🧐 Who Is Will?</CardTitle>
					</CardHeader>
					<CardContent className="bg-gray-50">
						<CardDescription className="text-base">
							<Rambling>A young and enthusiastic software developer and AI enjoyer, I am passionately stumbling my way towards a full-time career in AI Engineering.</Rambling> Fresh out of Michigan State with a Bachelor’s in Data Science, I spent a year off dabbling in everything from coaching high school football 🏈 to bartending in Mountain View 🍹, and even braving the soul-crushing gauntlet of LeetCode <WarningTooltip message="Dave's caution: Prepare for a rant about the existential dread that is LeetCode. Viewer discretion is advised." /> <strong>(LeetCode and I are not friends)</strong> <Rambling>Just when I thought my hatred for binary trees would win, I stumbled into a life-changing group of experienced hackers called Sunday Hustle.</Rambling> Spending time hacking on Sundays with the group led me to learn to love coding again and discover my newfound passion for LLMs. Without Sunday Hustle, I would never have been able to jumpstart my passion for building with LLMs. Now, I'm a part-time AI engineer, full-time legislation scraper, and an all-time fanatic about LLMs. Currently, I'm on the lookout for a full-time position pursuing my passion.
						</CardDescription>
					</CardContent>
				</Card>

				{/* Why I Want to Be an AI Engineer Card */}
				<Card className="mb-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
					<CardHeader>
						<CardTitle>🤖 Why Will Loves AI Engineeing</CardTitle>
					</CardHeader>
					<CardContent className="bg-gray-50">
						<p className="text-md">
							<Rambling>Why AI? My journey into the heart of AI engineering started somewhat untraditionally—amidst a group known as the Sunday Hustle, a diverse team of thinkers and tinkerers whose weekly coding marathons were as much about innovation as they were about caffeine-fueled camaraderie ☕.</Rambling>
							<WarningTooltip message="Dave's heads-up: Will is diving deep into his AI passion—brace for some intense enthusiasm!" />
							My fascination with artificial intelligence isn't just about the potential for groundbreaking discoveries or the thrill of solving complex problems; it's about a profound love for the process itself. For me, being an AI engineer means embracing a daily puzzle that never quite looks the same. It's about building and exploring AI applications that can potentially transform the way we live, work, and understand the world around us.
							They say if you love your job, you won't work a day in your life. This adage rings especially true for me. <strong>Being an AI engineer is not just a profession; it's my calling.</strong> I find deep satisfaction in the nitty-gritty of AI work—whether that's wrangling data, meticulously cleaning datasets, or navigating the often chaotic and unpredictable outputs of large language models (LLMs).
							<Rambling>Despite the challenges that come with the territory—like crafting evaluations, developing robust testing environments, or just the regular grind of software engineering tasks required to support the whims of non-deterministic AI systems—the love for what I do makes every hurdle worthwhile. I am drawn to the constant learning curve, where each day presents a new opportunity to improve, adapt, and innovate.</Rambling>
						</p>
					</CardContent>
				</Card>

				{/* Sunday Hustle - Something That Changed My Life Card */}
				<Card className="mb-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
					<CardHeader>
						<CardTitle>🔄 Sunday Hustle - More than a Meetup</CardTitle>
					</CardHeader>
					<CardContent className="bg-gray-50">
						<p className="text-md">
							<WarningTooltip message="Dave's inside scoop: Will might get a bit sappy here. It's all heartfelt, though!" />
							<Rambling>Sunday Hustle started with a simple act of kindness—a shared table and an invitation to join a group of tech enthusiasts at a local coffee shop. This group, composed of experienced and passionate software engineers, met every Sunday to hack on projects, exchange ideas, and, of course, partake in the ritual of drinking coffee (and something stronger after).</Rambling> It was here, amidst discussions and debug sessions, that I rediscovered my love for coding, something I had nearly lost to the soulless grind of endless LeetCode problems.
							<Rambling>Joining Sunday Hustle marked a pivotal turn in my life. It was where I dusted off my long-held application idea, 'Ask Abe', and transformed it into a reality. This project wasn't just about coding; it was about making legislative complexities accessible to everyone, sparking my profound interest in AI and generative technologies. The group's support and enthusiasm for building and learning reshaped my understanding of success and fulfillment in tech.</Rambling>
							Today, I see myself as a builder at heart. This identity transcends professional labels—it's about the joy and satisfaction found in creating something new, whether it's a small script that automates a tedious task or a complex system that democratizes legal knowledge. <Rambling>And while not every project reaches completion (RIP to all those unfinished side projects), each one is a testament to a genuine love for building, not just resume padding. It's this spirit of creation and curiosity that I carry into every new challenge and want to share openly with the world.</Rambling>
						</p>
					</CardContent>
				</Card>

				{/* What's The Point of This Website? Card */}
				<Card className="mb-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
					<CardHeader>
						<CardTitle>🎯 What's The Point of This Website?</CardTitle>
					</CardHeader>
					<CardContent className="bg-gray-50">
						<p className="text-md">
							The point? Transparency, catharsis, and a bit of shameless self-promotion. Here, I bare my professional soul 🧠 and share my daily victories and setbacks on the path to becoming an AI engineer. Whether I’m wrestling with a stubborn piece of code or celebrating a small triumph, this website serves as a living resume and a peek into the mind of someone who’s both mastering and being mastered by AI. <Rambling>If nothing else, it proves that if I can persist through the pain of debugging legislation scrapers late into the night, I’m either incredibly determined or just bad at time management.</Rambling> This website will serve as active journaling of my quest to achieve my dream job as a software engineer. A place to share some of the cool work I've been doing. An interactive resume. A real-time window into job search hell. And hopefully, inspiration for other young and passionate AI Engineers to follow in my footsteps <WarningTooltip message="Caution: Mean time for Will to get hired and update this section may vary." />(This will look a lot better when I get hired).
						</p>
					</CardContent>
				</Card>
			</div>



			<section className="mt-10">
				{/* Placeholder for Blog Section */}
			</section>

			<footer className="mt-10 text-center">
				<p>Want to see if I ever make it? Follow me or drop a line!</p>
				<div className="space-x-4 mt-2">
					<Button>Twitter</Button>
					<Button>LinkedIn</Button>
				</div>
			</footer>

		</div>
	);
};

export default HomePage;
