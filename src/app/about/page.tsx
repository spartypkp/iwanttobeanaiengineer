"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { SocialIcon } from "react-social-icons";
// Dummy components for interactive elements
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Pie, PieChart } from "recharts";

const AboutPage: React.FC = () => {
	const chartData = [
		{ language: "python", visitors: 275, fill: "#8CCF7E" }, // A blue shade commonly associated with Python
		{ language: "typescript", visitors: 200, fill: "#3178C6" }, // A deep blue used in TypeScript's branding
		{ language: "sql", visitors: 187, fill: "#F29111" }, // A golden color, referencing classic SQL icons
		{ language: "javascript", visitors: 173, fill: "#F0DB4F" }, // JavaScript's yellow from its logo
		{ language: "c_plus_plus", visitors: 90, fill: "#004482" }, // A navy blue often used for C++
	];

	const chartConfig = {
		visitors: {
			label: "Experience",
		},
		python: {
			label: "Python",
			color: "#8CCF7E",
		},
		typescript: {
			label: "TypeScript",
			color: "#3178C6",
		},
		sql: {
			label: "SQL",
			color: "#F29111",
		},
		javascript: {
			label: "JavaScript",
			color: "#F0DB4F",
		},
		c_plus_plus: {
			label: "C++",
			color: "#004482",
		},
	};
	return (
		<div className="container mx-auto px-4">
			{/* Header Section: Display your name and title prominently */}
			<header className="text-center py-8">
				<Card
					className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
				>
					<CardHeader className="pb-3 items-center">
						<CardTitle className="text-6xl">Will Diamond - AI Engineer</CardTitle>
						<CardDescription className="max-w-lg text-balance text-lg leading-relaxed text-center text-black">
							Los Altos, CA, United States | will@diamondquarters.com
						</CardDescription>
					</CardHeader>
				</Card>


				<div className="flex flex-row justify-left mt-10 space-x-4">
					<Card className="w-[200px] h-[140px]">

						<CardContent><h1 className="text-2xl">LinkedIn</h1><Link passHref legacyBehavior href="https://www.linkedin.com/in/will-diamond-b1724520b/"><SocialIcon network="linkedin"></SocialIcon></Link></CardContent>

					</Card>
					<Card className="w-[200px] h-[140px]">
						<CardContent><h1 className="text-2xl">Github</h1><Link passHref legacyBehavior href="https://github.com/spartypkp"><SocialIcon network="github"></SocialIcon></Link></CardContent>
					</Card>
					<Card className="w-[200px] h-[140px]">
						<CardContent>
							<h1 className="text-2xl">Ask Abe</h1>
							<Link href="https://www.askabeai.com/">
								<div className="flex items-center justify-center">
									<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
										<circle cx="25" cy="25" r="25" fill="orange" />
										<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fontFamily="Arial" fontSize="30" fill="black">A</text>
									</svg>
								</div>
							</Link>
						</CardContent>
					</Card>
					<Card className="w-[200px] h-[140px]">
						<CardContent>
							<h1 className="text-2xl mb-4">PDF Resume</h1>
							<Link
								href="/resume.pdf"  // Adjust the path if your file is located elsewhere
								download="Will_Diamond_Resume.pdf"  // Suggest a filename for the downloaded file
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								title="Download my resume"
							>
								Download
							</Link></CardContent>
					</Card>
				</div>
			</header>
			<main className="flex flex-col">
				<div className="flex flex-row">
					<div className="flex flex-col w-3/5 mr-6">

						<Card

						>
							<CardHeader className="pb-3 w-4xl">
								<CardTitle>Profile</CardTitle>
								<CardDescription className="text-balance leading-relaxed">
									I am an AI Engineer with specialization in building full-stack AI applications that utilize LLMs . I have experience in building data pipelines which utilize LLMs to conduct large scale web scraping, data processing, and structured metadata extraction to populate and prepare databases as knowledge bases for RAG. I have proficiency in utilizing Python, Pydantic, PostgreSQL, and other LLM libraries such as Instructor to build prompt pipelines to extract structured data at scale. I have experience building APIs used by AI assitants and generative AI web applications in React and NextJS.
								</CardDescription>
							</CardHeader>

						</Card>



						{/* Employment History Section: List your job experiences */}
						

							<h2 className="text-2xl font-semibold text-gray-800 mt-4 w-full min-w-full">Work Experience</h2>

							{/* Contract AI Engineer at Contoural Inc. */}
							<Card className="mb-6 bg-white shadow-md rounded-lg=">
								<CardHeader>
									<CardTitle>Contract AI Engineer, Contoural Inc.</CardTitle>
									<CardDescription>Nov 2023 — Present</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="list-disc list-inside text-gray-600">
										<li>Effectively led Contoural&apos;s AI Citation Extraction Pilot Project.</li>
										<li>Designed and implemented the project plan.</li>
										<li>Developed and maintained production prompt pipelines.</li>
										<li>Coordinated with domain experts to build effective eval sets.</li>
									</ul>
								</CardContent>
								<CardFooter>
									<p>Happy to provide references on request.</p>
								</CardFooter>
							</Card>

							{/* Founder and CEO at Recodify.AI */}
							<Card className="bg-white shadow-md rounded-lg">
								<CardHeader>
									<CardTitle>Founder and CEO, Recodify.AI</CardTitle>
									<CardDescription>Aug 2023 — Aug 2024</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="list-disc list-inside text-gray-600">
										<li>Researched innovative methods to transform legislation into optimal schema for use with RAG and AI agents, and custom tooling/APIs to access it.</li>
										<li>Created scraping engine technology to automatically extract, process, and prepare primary source legislation for use with LLM pipelines.</li>
										<li>Developed diverse AI web applications for displaying, chatting with, and understanding primary source legislation for end users.</li>
										<li>Scraped and processed 47 US States and Federal legislation.</li>
									</ul>
								</CardContent>

							</Card>

						


					</div>
					<div className="flex flex-col w-2/5">

						<Card className="w-full">
							<CardHeader>
								<CardTitle>Programming Languages</CardTitle>
								<CardDescription>Experience</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={chartConfig}>
									<BarChart
										accessibilityLayer
										data={chartData}
										layout="vertical"
										margin={{
											left: 20,
										}}
									>
										<YAxis
											dataKey="language"
											type="category"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
											tickFormatter={(value) =>
												chartConfig[value as keyof typeof chartConfig]?.label
											}
										/>
										<XAxis dataKey="visitors" type="number" hide />
										<ChartTooltip
											cursor={false}
											content={<ChartTooltipContent hideLabel />}
										/>
										<Bar dataKey="visitors" layout="vertical" radius={5} />
									</BarChart>
								</ChartContainer>
							</CardContent>
							<CardFooter className="flex-col items-start gap-2 text-sm">
								<div className="flex gap-2 font-medium leading-none">
									Relative experience shown. <TrendingUp className="h-4 w-4" />
								</div>
								<div className="leading-none text-muted-foreground">
									See Statistics page for more detailed statistics.
								</div>
							</CardFooter>
						</Card>
						<div className="mt-4">
							<section className="mb-8 border shadow-sm rounded-lg p-6 space-y-4">
								<h2 className="text-2xl font-semibold leading-none tracking-tight">Core Dev Tools & Frameworks</h2>
								{/* Frontend Frameworks Section */}
								<div className="bg-blue-100 shadow-md rounded-lg p-4">
									<h3 className="text-xl font-semibold leading-tight">Frontend</h3>
									<div className="flex flex-wrap items-center justify-center gap-3 p-3">
										{/* Each framework as a badge */}
										<span className="bg-blue-300 text-white px-3 py-1 rounded-full shadow-sm">NextJS</span>
										<span className="bg-blue-300 text-white px-3 py-1 rounded-full shadow-sm">React</span>
										<span className="bg-blue-300 text-white px-3 py-1 rounded-full shadow-sm">ShadCN</span>
										<span className="bg-blue-300 text-white px-3 py-1 rounded-full shadow-sm">TailwindCSS</span>
										<span className="bg-blue-300 text-white px-3 py-1 rounded-full shadow-sm">Selenium</span>
										<span className="bg-blue-300 text-white px-3 py-1 rounded-full shadow-sm">BeautifulSoup</span>
									</div>
								</div>

								{/* Backend Frameworks Section */}
								<div className="bg-green-100 shadow-md rounded-lg p-6 mt-6">
									<h3 className="text-xl font-semibold text-gray-700 mb-3">Backend</h3>
									<div className="flex flex-wrap items-center justify-center gap-3">
										{/* Each framework as a badge */}
										<span className="bg-green-300 text-white px-3 py-1 rounded-full shadow-sm">Pydantic</span>
										<span className="bg-green-300 text-white px-3 py-1 rounded-full shadow-sm">Instructor</span>
										<span className="bg-green-300 text-white px-3 py-1 rounded-full shadow-sm">FastAPI</span>
										<span className="bg-green-300 text-white px-3 py-1 rounded-full shadow-sm">Postgres (with JSONB)</span>
										<span className="bg-green-300 text-white px-3 py-1 rounded-full shadow-sm">Psycopg</span>
										<span className="bg-green-300 text-white px-3 py-1 rounded-full shadow-sm">PG-Typed</span>
									</div>
								</div>
							</section>
						</div>


					</div>

				</div>
				{/* Introduction Section: Brief introduction about yourself */}



				{/* Interactive Timeline Section: Display a timeline of your career */}
				<section className="flex flex-col items-center justify-center py-8">
					<Card className="w-full w-4xl flex flex-col items-center">
						<CardHeader className="pb-3 text-center">
							<h2 className="text-4xl font-bold">Interactive Career Timeline</h2>
						</CardHeader>
						<CardContent className="flex justify-center items-center w-full">
							<Carousel className="w-full max-w-4xl max-h-[700px]">
								<CarouselContent className="h-[700px]">

									<CarouselItem key={1} className="min-h-full">
										<div className="p-1  shadow-md rounded-md h-full min-h-full">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">
													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Growing Up In the Bay Area</h1>
													<Image src="/losAltos.png" alt="Los Altos California" className="rounded-md" width={500} height={500} />
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															I was born and raised in Los Altos, CA, in the heart of Silicon Valley. I was very fortunate to have been raised in a good neighborhood
															with a loving and supportive family. I was immersed in a culture of innovation and entrepreneurship from a young age. I got good grades at Los Altos High School, played football for 4 years, and took multiple computer science courses.

														</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={2} className="min-h-full">
										<div className="p-1  shadow-md rounded-md h-full min-h-full">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">
													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Discovering my Love of Programming</h1>
													<Image src="/scratch.png" alt="Scratch" className="rounded-md" width={500} height={500} />
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															I loved the feeling of solving puzzles and the reward of building things. My first project was a 2D golf simulator built in Scratch using physics equations I had just learned in my AP Physics class! I was hooked from there, and decided to pursue a degree in Computer Science in college.
														</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={3} className="min-h-full">
										<div className="p-1  shadow-md rounded-md h-full min-h-full">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">
													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Undergraduate Computer Science</h1>
													<Image src="/msuEngineering.jpeg" alt="MSU Engineering" className="rounded-md" width={500} height={500} />
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>I attended university at Michigan State as an undergraduate CS major. I chose Michigan State because I loved the traditional midwest college experience, and because I got a partial scholarship to go there. There I learned Python, C++, and of course fundamental data structures and algorithms.</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

									<CarouselItem key={4} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Switching Majors to Data Science</h1>
													<Image src="/nflStats.png" alt="NFL Statistics" className="rounded-md" width={500} height={500} />
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">


														<p>After taking some Data Science electives, I quickly found my true calling in data science—an area where the practical application of technology to solve real problems ignited my passion. One of my favorite projects was a statistical analysis of NFL statistics and the coefficient of correlation with number of wins. Not that I didn&apos;t like the classic algorithms and data structures of CS, but I got to model and solve real world problems in Data Science. And they actually taught us how to use git (Shocker that the CS program hasn&apos;t changed in 20 years!)</p>

													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={5} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">First Hands on Experience with ML and AI </h1>
													<Image src="/SVM.png" alt="SVM Results" className="rounded-md" width={500} height={500} />
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">

														<p>As I progressed through my data science degree I got to take more classes in AI and Machine Learning, which was just the coolest thing ever to me. I knew I always wanted to work in AI and strongly believed that the hardest and most interesting problems could be solved with AI technology. (Notably this was pre ChatGPT). My capstone project worked with Argonne National Laboratory building ML models to predict moments of high volatility in fluid dynamics datasets. My SVM model performed the best, which our group chose to use for our final results and presentation!</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

									<CarouselItem key={6} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Post Graduation Struggles</h1>
													<Image src="/leetcode.jpeg" alt="I hate leetcode" className="rounded-md" width={500} height={500} />
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>Post-graduation, the transition from academia to the professional world was unexpectedly challenging.</p>
														<p>
															Despite a robust educational background, the job market proved unforgiving, and repeated rejections soon took their toll, leaving me demoralized and questioning my path. Grinding leetcode was something that I seriously struggled with. I became disillusioned with the entire process, feeling like I was wasting my time and making no progress.
															It was during this period of introspection that I decided to take a step back.
														</p>
														<p>
															I spent a year coaching JV football at Palo Alto with my twin brother, which was a unique and fun experience I&apos;m glad I did. After the season I returned to my old college job of bartending in downtown Mountain View, in order to make ends meet and help pay my way as I was living at home with my parents.
														</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

									<CarouselItem key={7} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">A Lifechanging Act of Kindness</h1>
													<Image src="/scratch.jpeg" alt="Bartending at scratch" className="rounded-md" width={300} height={300} />
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">



														<p>Disillusioned with leetcode grinding and depressed from the college grad job search, I found myself working 40-50+ hours bartending and wondering how I could start my career.</p>
														<p>The turning point came from an unexpected source—a chance encounter at the bar with a random person at my bar one night. His name was Sean, and he was unexpectedly kind: asking about my education and eventually career goals. Sean was also a programmer, with a lot of software engineering experience.</p>
														<p>He asked me if there was any idea or dream I wanted to work on or build: to which I said yes. For 5 years I&apos;ve had the idea to build some kind of aplication to help regular people understand the law and the rights that apply to them. On the spot, Sean invited me to come code with him and some friends that Sunday at a local coffee shop.
															This group, meeting every Sunday to hack/collaborate on projects and share ideas, was named Sunday Hustle.</p>

													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

									<CarouselItem key={8} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">A Second Chance</h1>
													<Image src="/sundayHustleCommits.png" alt="Commits after joining Sunday Hustle" className="rounded-md" width={500} height={500} />
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">



														<p>I seriously debated if I wanted to go, but reason took over and I realized it could be the spark I needed to restart my efforts to break into tech and get a job.
															It was the best decision I ever made. I met a group of passionate, kind, and experienced software engineers and AI enthusiasts. Above you can see my github contributions for 2023. It&apos;s very clear when I started going to Sunday Hustle.
														</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

									<CarouselItem key={9} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Sunday Hustle</h1>
													<Image src="/secondHustle.webp" alt="Commits after joining Sunday Hustle" className="rounded-md" width={500} height={500} />
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>I started regularly going to Sunday Hustle every week. At my first Sunday Hustle, I didn&apos;t know what to work on. I felt self-conscious of my coding ability and thought that I needed to spend some time doing leetcode to get back to speed.</p>
														<p>Sean immediately told me this was a dumb idea (something I love about him lol). This is where I first got introduced to the hacker and builder mindset, something I am proud to say I have today. Sean was of the strong opinion that learning by doing was the optimal approach. After hearing my ideas for my dream project (which had no name), he suggested I look into implementing LLM technology and pointed to me something called &quot;vector embeddings&quot; and the pgvector library for Postgres.</p>
														<p>Above is the picture of my second ever Sunday Hustle with Sean</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

									<CarouselItem key={10} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Sunday Hustle Pt 2</h1>
													<Image src="/sundayHustle.webp" alt="Sunday Squad" className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>I learned so much so fast, surrounded by great people. I felt so incredibly lucky. I readily accepted the hacker/builder mindset.</p>
														<p>I got so much experience using LLMs by building, in the very early days of the technology. (Pre GPT-4 if you can imagine!)</p>
														<p>I spend so much time talking about Sunday Hustle because it&apos;s been so important to me. A lot of the older members, especially Sean, became not just friends but people I consider mentors to me. Sean, ever humble (almost to an annoying degree), to this day claims his role in helping me get back on my feet is negligible, although I attribute his kindness as the reason I&apos;m on my journey to becoming an AI Engineer today. Below is a picture of the group, photo creds Mark.</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

									<CarouselItem key={11} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Building My Dream Project</h1>
													<Image src="/abeChat.png" alt="SQL table for California statutes" className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															Every Sunday marked an improvement in my capabilities as a software engineer and an increase in my experience using LLM technologies. My dream legal help project started to take shape into a fully functional LLM chatbot. The goal of the project was to democratize access and understanding of legal knowledge to all.
														</p>
														<Button variant="link">
															<Link href="https://www.askabeai.com/">Visit Ask Abe</Link>
														</Button>
														<p>
															A user could ask simple questions to the chatbot, which would search a database of scraped legislation (more on this feat later) to find relevant legislation. It would give legal education and information (never advice, don&apos;t sue me) in a format understandable to all. Included in its answer would be direct citations to the legislation, as well as the ability to view exact text and visit the official .gov website.
														</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

									<CarouselItem key={12} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Ask Abe - My First Full Stack AI Application</h1>
													<Image src="/abeSite.png" alt="Ask Abe Website" className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
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
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={13} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Starting Recodify.ai</h1>
													<Image src="/sqlStatutes.png" alt="SQL table for California statutes" className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															I founded my first startup based on the work I had been doing with Ask Abe. The idea was to build a platform to help AI Engineers build LLM applications in the legal field. I asked my data science friend from MSU, Madeline, to be my cofounder. We would provide extensively processed primary source legislation data and tools to streamline the difficult task of building applications. And to start out we would offer our consulting services to help companies build AI applications in the legal field using our IP.
														</p>
														<p>
															The core of our business was providing access to an SQL database of global scraped legislation. In the process of building Ask Abe, the most time consuming process was finding accurate and usable source data for RAG. I looked far and wide for open source legislation data and found nothing. There were many open source platforms for finding judicial court cases and decisions, but nobody could provide the actual legislation that serves as the basis for all of our laws and regulations. Any AI application built in the legal field is almost certainly built only with this judicial data, or serves to help lawyers and attorneys conduct their work more efficiently. The rare few legal AI applications which could analyze legislation data were owned and operated by the big players in this game: CaseText, LexisNexis, and Thompson Rheuters.
														</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={14} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Democratizing Legal Knowledge</h1>
													<Image src="/abeMission.png" alt="SQL table for California statutes" className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															These big players had such a monopoly on these AI applications because they had a monopoly on the data. We aimed to remove this barrier, level the playing field, and provide all the data and tools an AI Engineer would need to start building instantly. We wanted to democratize legal knowledge to allow for the construction of more powerful and wide spread AI applications.
														</p>
														<p>
															This startup alligned with the mission of Ask Abe, and the whole reason I started building this platform and technology in the first place.
														</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={15} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Open Sourcing My Work</h1>
													<Image src="/openSourceLegislation.png" alt="SQL table for California statutes" className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>Finding product market fit was difficult, not to mention the technical and practical implications of offering up the world&apos;s legislative data from an API. After a lot of debate and hard thinking, I decided to open source my work and shut down the startup to focus on my career as a software engineer and AI Engineer.</p>
														<Button variant="link">
															<Link href="/projects/openSourceLegislation">You can see a more detailed explanation of the project and herculean effort of scraping global legislation here.</Link>
														</Button>
														<p>Through my work with recodify I was able to get contract AI Engineering work for Contoural, utilizing the IP and my experience to build LLM applications with real business value. (Users for my AI applications? Crazy!)</p>
													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={16} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">AI Engineering Work with Contoural</h1>
													<Image src="/contoural.png" alt="SQL table for California statutes" className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															Because of our extensive IP of scraped and processed legislation, we were able to get our first client: Contoural
														</p>
														<p>
															Contoural is an information governance consulting company which does extensive work consulting clients on how to handle large amounts of data to maintain legal and regulatory compliance.
														</p>

													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={17} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Building an LLM System to Extract Recordkeeping Requirements </h1>
													<Image src="/rrExtraction.png" alt="SQL table for California statutes" className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															We were brought on to Contoural to build an AI system for extracting Recordkeeping Requirements with higher accuracy and quality metadata than anything on the market (very niche market)
														</p>
														<p>
															This complex AI system pushed the boundaries of LLM capabilities for reasoning and structured data extraction in the legal field.
														</p>
														<p>
															I gained so much experience building production ready LLM applications. Creation of extensive LLM eval sets by domain experts was the most valuable experience gained.
														</p>


													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={18} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">Building LLM Tools with Immediate Business Value  </h1>
													<Image src="/aiCitationHelper.png" alt="AI Citation Helper " className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															Besides working on the main Recordkeeping Requirement AI Extraction project, I also had opportunities to interview and shadow employees to better understand their work flows. I diagnosed a couple of areas of work where LLMs could be incredibly useful for increasing efficiency.
														</p>
														<p>
															One of these LLM applications I built took in large amounts of legal citations data to pre-sort and classify each citation&apos;s relevance to a given client.
														</p>
														<p>
															This self contained LLM application was able to reduce an attorneys time to complete this kind of soul crushing legal research and analysis work by 75%. This not only saved Contoural a lot of expensive domain expert billable hours, but significantly reduced some of the most hated work done by these domain experts.
														</p>


													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

									<CarouselItem key={19} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">My Numerous Side Projects</h1>
													<Image src="/totalCommits.png" alt="AI Citation Helper " className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															Throughout my journey as an AI engineer, I have worked on numerous side projects. Full transparency, there&apos;s a lot of half finished implementations! (A common problem)
														</p>
														<p>
															I learned to love building. Be it NextJS websites (love/hate sometimes), custom AI engineering tools, or experimentations into LLM capabilities. The spirit of Sunday Hustle&apos;s &quot;build something and demo it&quot; lives on.
														</p>
														<p>
															You can view more of my projects in more technical depth at the link below. I will continue to build, ship, and demo. Who knows what I&apos;ll build next Sunday!
														</p>
														<Button variant="link">
															<Link href="/projects">Projects Page</Link>
														</Button>


													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
									<CarouselItem key={20} className="min-h-full">
										<div className="p-1 h-full min-h-full flex items-center justify-center">
											<Card className="min-h-full w-full max-w-4xl  shadow-xl rounded-lg overflow-hidden">
												<CardContent className="flex flex-col items-center  justify-between p-4 space-y-4 h-[700px]">

													<h1 className="text-2xl bg-white font-semibold border-black rounded-lg p-4 border text-gray-800">The Future?</h1>
													<Image src="/shareHolderValue.png" alt="AI Citation Helper " className="rounded-md" width={500} height={500}></Image>
													<div className="text-sm bg-white rounded-lg border border-black text-gray-600 space-y-2 max-w-full px-2">
														<p>
															Although I loved founding Recodify.ai, and building LLM applications for Contoural, I&apos;ve always felt I hadn&apos;t reached my potential. I&apos;m currently looking for full time employment in software engineering and AI Engineering.
														</p>
														<p>
															I want to work on interesting and difficult projects.
														</p>
														<p>
															I want to work in a fast paced environment, BUILDING! Shipping fast, and contributing as much as possible.
														</p>
														<p>
															I want to be a part of a team building great things. Surrounded by passionate, experienced (cracked), and motivated people.
														</p>
														<p>
															I want to work somewhere I can learn as much as possible by doing.
														</p>

														<Button variant="link">
															<Link href="/projects">Projects Page</Link>
														</Button>


													</div>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>

								</CarouselContent>
								<CarouselPrevious />
								<CarouselNext />
							</Carousel>

						</CardContent>
					</Card>

					{/* Interactive timeline component goes here */}


				</section>

			</main>






			{/* Footer Section: Call to action or contact information */}
			<footer className="py-4 bg-gray-200 mt-8">
				<div className="text-center">
					<p className="text-sm text-gray-600">Interested in working together? <a href="mailto:will@diamondquarters.com" className="text-blue-600">Email me</a></p>
				</div>
			</footer>
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

