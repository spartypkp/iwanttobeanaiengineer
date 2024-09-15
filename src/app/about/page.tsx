import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Dummy components for interactive elements


const AboutPage: React.FC = () => {
	return (
		<div className="container mx-auto px-4">
			<section className="items-center py-8  mx-auto">
				<h1 className="text-4xl font-bold text-gray-800 mb-4">My Journey</h1>
				<div className="text-md text-gray-600 space-y-4">
					<p>
						Hello! I&apos;m Will, a 25-year-old data scientist turned AI engineer, embarking on a quest to start my career as a full-time AI Engineer.
						I absolutely love working with LLMs and built this website to document my journey to finding full-time employment as an AI engineer.
						I&apos;ve had a non-traditional career path on my journey, and hope that my story may inspire other young engineers to follow their dreams too.
						Telling my story is the first step in putting myself out there and finding my dream job.
					</p>
					<p>
						I was born and raised in Los Altos, CA, in the heart of Silicon Valley. I was very fortunate to have been raised in a good neighborhood
						with a loving and supportive family. I was immersed in a culture of innovation and entrepreneurship from a young age. Influenced by my father,
						a software engineer and eventually startup founder, my fascination with technology began early and led me to a path of exploration and discovery
						in the digital world. I got good grades at Los Altos High School, played football for 4 years, and took multiple computer science courses.
						I loved the feeling of solving puzzles and the reward of building things, and decided to pursue a degree in Computer Science in college.
					</p>
				</div>

			</section>

			<section className="items-center py-8  mx-auto">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">Educational Foundation</h2>
				<div className="text-md text-gray-600 space-y-4">
					<p>I attended university at Michigan State as an undergraduate CS major. I chose Michigan State because I loved the traditional midwest college experience, and because I got a partial scholarship to go there.</p>
					<p>Originally majoring in computer science, I quickly found my true calling in data science—an area where the practical application of technology to solve real problems ignited my passion. Not that I didn&apos;t like the classic algorithms and data structures of CS, but I got to model and solve real world problems in Data Science. And they actually taught us how to use git (Shocker that the CS program hasn&apos;t changed in 20 years!)</p>
					<p>As I progressed through my data science degree I got to take more classes in AI and Machine Learning, which was just the coolest thing ever to me. I knew I always wanted to work in AI and strongly believed that the hardest and most interesting problems could be solved with AI technology. (Notably this was pre ChatGPT)</p>
				</div>
			</section>

			<section className="items-center py-8  mx-auto">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">Navigating Challenges</h2>
				<div className="text-md text-gray-600 space-y-4">
					<p>Post-graduation, the transition from academia to the professional world was unexpectedly challenging.</p>
					<p>
						Despite a robust educational background, the job market proved unforgiving, and repeated rejections soon took their toll, leaving me demoralized and questioning my path. Grinding leetcode was something that I seriously struggled with. I became disillusioned with the entire process, feeling like I was wasting my time and making no progress.
						It was during this period of introspection that I decided to take a step back.
					</p>
					<p>
						I spent a year coaching JV football at Palo Alto with my twin brother, which was a unique and fun experience I&apos;m glad I did. After the season I returned to my old college job of bartending in downtown Mountain View, in order to make ends meet and help pay my way as I was living at home with my parents.
					</p>
				</div>
			</section>

			<section className="items-center py-8  mx-auto">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">A Lifechanging Act of Kindness</h2>
				<div className="text-md text-gray-600 space-y-4">
					<p>Disillusioned with leetcode grinding and depressed from the college grad job search, I found myself working 40-50+ hours bartending and wondering how I could start my career.</p>
					<p>The turning point came from an unexpected source—a chance encounter at the bar with a random person at my bar one night. His name was Sean, and he was unexpectedly kind: asking about my education and eventually career goals. Sean was also a programmer, with a lot of software engineering experience.</p>
					<p>He asked me if there was any idea or dream I wanted to work on or build: to which I said yes. For 5 years I&apos;ve had the idea to build some kind of aplication to help regular people understand the law and the rights that apply to them. On the spot, Sean invited me to come code with him and some friends that Sunday at a local coffee shop.
						This group, meeting every Sunday to hack/collaborate on projects and share ideas, was named Sunday Hustle.</p>
					<p>I seriously debated if I wanted to go, but reason took over and I realized it could be the spark I needed to restart my efforts to break into tech and get a job.
						It was the best decision I ever made. I met a group of passionate, kind, and experienced software engineers and AI enthusiasts. Below you can see my github contributions for 2023. It&apos;s very clear when I started going to Sunday Hustle.
					</p>
					<Image width={600} height={300} src="/sundayHustleCommits.png" alt="Commits after my first Sunday Hustle."></Image>

				</div>
				<h2 className="text-3xl font-bold text-gray-800 mb-4">Sunday Hustle</h2>
				<div className="text-md text-gray-600 space-y-4">
					<p>I started regularly going to Sunday Hustle every week. At my first Sunday Hustle, I didn&apos;t know what to work on. I felt self-conscious of my coding ability and thought that I needed to spend some time doing leetcode to get back to speed.</p>
					<p>Sean immediately told me this was a dumb idea (something I love about him lol). This is where I first got introduced to the hacker and builder mindset, something I am proud to say I have today. Sean was of the strong opinion that learning by doing was the optimal approach. After hearing my ideas for my dream project (which had no name), he suggested I look into implementing LLM technology and pointed to me something called &quot;vector embeddings&quot; and the pgvector library for Postgres.</p>
					<p>Never having used LLMs before and having only basic experience with SQL, I started working on my project.
						I kept coming every week, and ended up meeting more core members of the group. All incredibly supportive of my journey, and incredibly kind. (Shoutout Josh, Mark, Antonio, and Rune you legends)</p>
					<p>I learned so much so fast, surrounded by great people. I felt so incredibly lucky. I readily accepted the hacker/builder mindset.</p>
					<p>I got so much experience using LLMs by building, in the very early days of the technology. (Pre GPT-4 if you can imagine!)</p>
					<p>I spend so much time talking about Sunday Hustle because it&apos;s been so important to me. A lot of the older members, especially Sean, became not just friends but people I consider mentors to me. Sean, ever humble (almost to an annoying degree), to this day claims his role in helping me get back on my feet is negligible, although I attribute his kindness as the reason I&apos;m on my journey to becoming an AI Engineer today. Below is a picture of the group, photo creds Mark.</p>
					<Image src="/sundayHustle.webp" alt="SQL table for California statutes" width={800} height={600}></Image>

				</div>
			</section>

			<section className="py-8">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">Ask Abe - My First AI Application</h2>
				<div className="text-md text-gray-600 space-y-4">

					<p>
						Every Sunday marked an improvement in my capabilities as a software engineer and an increase in my experience using LLM technologies. My dream legal help project started to take shape into a fully functional LLM chatbot. The goal of the project was to democratize access and understanding of legal knowledge to all.
					</p>
					<Button variant="link">
						<Link href="https://www.askabeai.com/">Visit Ask Abe</Link>
					</Button>

					<p>
						A user could ask simple questions to the chatbot, which would search a database of scraped legislation (more on this feat later) to find relevant legislation. It would give legal education and information (never advice, don&apos;t sue me) in a format understandable to all. Included in its answer would be direct citations to the legislation, as well as the ability to view exact text and visit the official .gov website.
					</p>
					<Image width={1000} height={800} src="/abeChat.png" alt="Example chat with Abe"></Image>
					<p>
						I gave my LLM the persona of Abraham Lincoln, always honest and truthful. Building trust in LLM responses was a big deal back then, and still remains a problem today in critical domains such as legal.
					</p>

					<p>
						I learned so much about embeddings, similarity search, rag pipelines, optimizations to user queries with LLMs, chain of thought reasoning and prompting, and limitations to LLM technology. Things like retries, LLM rate limits, cost/accuracy optimization, and evals were all completely new concepts. The myriad of LLM errors in a complex system like this was equally difficult and fun. It felt like solving puzzles within puzzles, where the inner workings of LLMs and the process of optimizing responses felt half science half magic.
					</p>
					<p>
						I loved it.
					</p>
					<p>
						Eventually, I went to a Stanford LLM hackathon to showcase Ask Abe. I met so many friends and connections that helped me make my passion project into a career. I quit my job bartending, and started working full time on my passion project.
					</p>
					<Button variant="link">
						<Link href="/projects/askAbe">You can see a more detailed explanation of this project here.</Link>
					</Button>


				</div>
			</section>

			<section className="py-8">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">Starting Recodify.AI</h2>
				<div className="text-md text-gray-600 space-y-4">
					<p>
						I founded my first startup based on the work I had been doing with Ask Abe. The idea was to build a platform to help AI Engineers build LLM applications in the legal field. I asked my data science friend from MSU, Madeline, to be my cofounder. We would provide extensively processed primary source legislation data and tools to streamline the difficult task of building applications. And to start out we would offer our consulting services to help companies build AI applications in the legal field using our IP.
					</p>
					<p>
						The core of our business was providing access to an SQL database of global scraped legislation. In the process of building Ask Abe, the most time consuming process was finding accurate and usable source data for RAG. I looked far and wide for open source legislation data and found nothing. There were many open source platforms for finding judicial court cases and decisions, but nobody could provide the actual legislation that serves as the basis for all of our laws and regulations. Any AI application built in the legal field is almost certainly built only with this judicial data, or serves to help lawyers and attorneys conduct their work more efficiently. The rare few legal AI applications which could analyze legislation data were owned and operated by the big players in this game: CaseText, LexisNexis, and Thompson Rheuters.
					</p>
					<Image src="/sqlStatutes.png" alt="SQL table for California statutes" width={800} height={600}></Image>
					<p>
						These big players had such a monopoly on these AI applications because they had a monopoly on the data. We aimed to remove this barrier, level the playing field, and provide all the data and tools an AI Engineer would need to start building instantly. We wanted to democratize legal knowledge to allow for the construction of more powerful and wide spread AI applications.
					</p>
					<p>Finding product market fit was difficult, not to mention the technical and practical implications of offering up the world&apos;s legislative data from an API. After a lot of debate and hard thinking, I decided to open source my work and shut down the startup to focus on my career as a software engineer and AI Engineer.</p>
					<Button variant="link">
						<Link href="/projects/openSourceLegislation">You can see a more detailed explanation of the project and herculean effort of scraping global legislation here.</Link>
					</Button>
					<p>Through my work with recodify I was able to get contract AI Engineering work for Contoural, utilizing the IP and my experience to build LLM applications with real business value. (Users for my AI applications? Crazy!)</p>


				</div>
			</section>

			<section className="py-8">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">AI Engineering at Contoural</h2>
				<p className="text-md text-gray-600">
					Placeholder about my current AI Engineering work at Contoural
				</p>
			</section>

			<section className="py-8">
				<h2 className="text-3xl font-bold text-gray-800 mb-4">Hire me as an AI Engineer.</h2>
				<p className="text-md text-gray-600">
					Placeholder about looking for full time employment as AI Engineer. Call to action, blah blah blah. What up Mark.
				</p>
			</section>




		</div>
	);
};

const ContactForm = () => {
	/* This form should allow users to send a message directly through the website. */
	return (
		<form className="bg-gray-100 p-4 my-4">
			<div>
				<label htmlFor="email">Email:</label>
				<input type="email" id="email" name="email" className="border p-2 w-full" placeholder="Your email" />
			</div>
			<div>
				<label htmlFor="message">Message:</label>
				<textarea id="message" name="message" className="border p-2 w-full" placeholder="Your message"></textarea>
			</div>
			<button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Send
			</button>
		</form>
	);
};

// Imports here

export default AboutPage;

const Timeline = () => {
	/* This component should display an interactive timeline of key life events and milestones. */
	return <div className="bg-gray-200 p-4 my-4">Interactive Timeline Component</div>;
};

const SkillsChart = () => {
	/* This component should show a skills chart or radar chart with hover effects to show more details about each skill. */
	return <div className="bg-gray-200 p-4 my-4">Skills Chart Component</div>;
};

const ProjectCarousel = () => {
	/* This component should allow users to click through a carousel of major projects, expanding to show more details on click. */
	return <div className="bg-gray-200 p-4 my-4">Project Carousel Component</div>;
};

