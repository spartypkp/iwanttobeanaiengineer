"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Sample data for visualizations
const skillsData = [
	{ name: 'Python', value: 90 },
	{ name: 'JavaScript/TypeScript', value: 80 },
	{ name: 'React/NextJS', value: 85 },
	{ name: 'ML/LLMs', value: 75 },
	{ name: 'UI/UX Design', value: 65 },
];

const projectsOverTime = [
	{ month: 'Jan', count: 1 },
	{ month: 'Feb', count: 2 },
	{ month: 'Mar', count: 2 },
	{ month: 'Apr', count: 3 },
	{ month: 'May', count: 4 },
	{ month: 'Jun', count: 5 },
	{ month: 'Jul', count: 6 },
	{ month: 'Aug', count: 7 },
	{ month: 'Sep', count: 9 },
	{ month: 'Oct', count: 10 },
	{ month: 'Nov', count: 12 },
	{ month: 'Dec', count: 15 },
];

const moodTracking = [
	{ day: 'Mon', productivity: 70, happiness: 65, motivation: 75 },
	{ day: 'Tue', productivity: 85, happiness: 70, motivation: 80 },
	{ day: 'Wed', productivity: 75, happiness: 75, motivation: 70 },
	{ day: 'Thu', productivity: 90, happiness: 80, motivation: 85 },
	{ day: 'Fri', productivity: 65, happiness: 90, motivation: 65 },
	{ day: 'Sat', productivity: 55, happiness: 95, motivation: 60 },
	{ day: 'Sun', productivity: 60, happiness: 85, motivation: 70 },
];

const codeMetrics = [
	{ name: 'GitHub Commits', value: 427 },
	{ name: 'Lines of Code', value: 15243 },
	{ name: 'Pull Requests', value: 86 },
	{ name: 'Code Reviews', value: 104 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

const StatsPage: React.FC = () => {
	return (
		<div className="container mx-auto px-4 py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Statistics Dashboard</h1>
				<p className="text-xl text-gray-600 max-w-3xl mx-auto">
					A collection of metrics and visualizations tracking my journey as an AI Engineer.
					<span className="block mt-2 text-sm text-gray-500">Note: This is a concept visualization with sample data. Real metrics coming soon!</span>
				</p>
			</div>

			<Tabs defaultValue="skills" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
					<TabsTrigger value="projects">Project Growth</TabsTrigger>
					<TabsTrigger value="productivity">Productivity Tracking</TabsTrigger>
					<TabsTrigger value="code">Code Metrics</TabsTrigger>
				</TabsList>

				{/* Skills & Expertise Tab */}
				<TabsContent value="skills" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Technical Skills Distribution</CardTitle>
								<CardDescription>Relative proficiency across technical domains</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={skillsData}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={100}
											fill="#8884d8"
											dataKey="value"
											label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
										>
											{skillsData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Skill Proficiency Levels</CardTitle>
								<CardDescription>Estimated competency levels (out of 100)</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={skillsData}
										layout="vertical"
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis type="number" domain={[0, 100]} />
										<YAxis dataKey="name" type="category" width={150} />
										<Tooltip />
										<Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
											{skillsData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Project Growth Tab */}
				<TabsContent value="projects" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Cumulative Projects Over Time</CardTitle>
							<CardDescription>Growth in project portfolio throughout the year</CardDescription>
						</CardHeader>
						<CardContent className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={projectsOverTime}
									margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
								>
									<defs>
										<linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
											<stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
										</linearGradient>
									</defs>
									<XAxis dataKey="month" />
									<YAxis />
									<CartesianGrid strokeDasharray="3 3" />
									<Tooltip />
									<Area
										type="monotone"
										dataKey="count"
										stroke="#8884d8"
										fillOpacity={1}
										fill="url(#colorProjects)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Productivity Tracking Tab */}
				<TabsContent value="productivity" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Weekly Mood & Productivity Tracking</CardTitle>
							<CardDescription>Metrics derived from daily blog entries</CardDescription>
						</CardHeader>
						<CardContent className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									data={moodTracking}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="day" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="productivity"
										stroke="#8884d8"
										activeDot={{ r: 8 }}
									/>
									<Line type="monotone" dataKey="happiness" stroke="#82ca9d" />
									<Line type="monotone" dataKey="motivation" stroke="#ffc658" />
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Code Metrics Tab */}
				<TabsContent value="code" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{codeMetrics.map((metric, index) => (
							<Card key={index}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
									<Badge variant="outline" className="font-mono">{index + 1}</Badge>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
									<p className="text-xs text-muted-foreground">
										Last updated: {new Date().toLocaleDateString()}
									</p>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Code Contribution Metrics</CardTitle>
								<CardDescription>Overall development activity</CardDescription>
							</CardHeader>
							<CardContent className="h-80">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={codeMetrics}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar dataKey="value" fill="#8884d8">
											{codeMetrics.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default StatsPage;