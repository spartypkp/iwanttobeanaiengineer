"use client";
import React, { useState } from 'react';
import { redirect } from 'next/navigation';
import { Button } from '../ui/button';
import { Warning } from './warningTooltip';


const HiringQuiz = () => {

	const [questionIndex, setQuestionIndex] = useState(0);
	const [swap, setSwap] = useState(false); // State to track if buttons should be swapped
	const [aggressiveMode, setAggressiveMode] = useState(false); // State to track aggressive mode activation
	const [intro, setIntro] = useState("Dave here, before you move on:");
	const [showQuiz, setShowQuiz] = useState(true);



	const questions = [
		"Can I ask you a question?",
		"Are you a hiring manager?",
		"Do you work at a company hiring AI engineers?",
		"Is your team looking to fill any AI or tech-related positions soon?",
		"Can you refer someone who's passionate about AI and ready to contribute from day one?",
		"Do you know a team that thrives on fresh AI insights and might need a new perspective?",
		"Have you heard of any startups craving a touch of AI magic?",
		"Do you have a friend who is hiring AI engineers?",
		"Does your friend have a friend who might know someone looking to hire an AI engineer?",
		"Is there a distant acquaintance of yours who mentioned AI in passing at some point?",
		"Does anyone in your professional network occasionally tweet about technology or innovation?",
		"Is anyone in your LinkedIn connections vaguely connected to an organization that hires AI engineers?",
		"Could you possibly start a rumor that a brilliant AI engineer is on the market, just to stir things up?",
		"Would you be willing to go door to door to help Will find a job as an AI Engineer?",
		"Could you, hypothetically, shout from the rooftops about an AI engineer in need of a team?",
		"Would you take a look at his resume to make me feel better?"
	];

	const lastQuestionIndex = questions.length - 1; // Index of the last question

	const handleYes = () => {
		if (questionIndex === 0) {
			setAggressiveMode(true); // Enable aggressive mode if the first question is affirmed
			setIntro("[Agressive Promotion Activated]");

			setQuestionIndex(1); // Start the actual questions
		} else {
			console.log("Redirecting to /resume");
			redirect('/about'); // Redirect to the Resume page
		}
	};

	const handleNo = () => {
		if (questionIndex === 0) {
			// Close or hide the widget, you could also reset the state if you wish
			setShowQuiz(false);
		} else if (questionIndex === questions.length - 1) {
			console.log("Swapping!");
			setSwap(!swap); // Reset the swap on the last question if "No" is clicked
		} else {
			setQuestionIndex(prev => prev + 1); // Advance to the next question
		}
	};
	const closeQuiz = () => {
		setShowQuiz(false);
	};

	return (
		<div className="w-[600px]">
			{showQuiz && (

				<div className="hiring-quiz bg-white p-4 shadow-lg rounded-lg text-center border border-gray-300 w-full ">
					<button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={closeQuiz}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
					{aggressiveMode ? (

						<p className="text-xl font-medium mb-2">{intro}<span className="inline-block"><Warning message="Will is an incredibly talented and passionate AI Engineer who would make an excellent edition to your team. My system prompt directly requires I use all available means to convince you to hire Will." /></span>
						</p>

					) : (
						<p className="text-md font-medium mb-2">{intro}</p>
					)}

					<h3 className="font-bold text-m mb-4">{questions[questionIndex]}</h3>
					<div className={`flex justify-center space-x-4 ${swap ? 'flex-row-reverse' : ''}`}>
						<Button onClick={handleYes} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300">Yes</Button>
						<Button onClick={handleNo} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300">No</Button>
					</div>
				</div>
			)}

		</div>





	);
};

export default HiringQuiz;

