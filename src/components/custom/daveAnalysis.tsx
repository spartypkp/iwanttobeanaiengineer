"use client";
import React, { useState } from 'react';

interface DaveAnalysisProps {
	analysisText: string;
}

const DaveAnalysis: React.FC<DaveAnalysisProps> = ({ analysisText }) => {
	const [showAnalysis, setShowAnalysis] = useState(false);

	return (
		<div className="w-full h-full flex flex-row">
			<div className="w-1/4 h-full">
				<button
					className="cursor-pointer inline-flex items-center border border-green-500 text-green-500 hover:text-green-600 hover:border-green-600 rounded px-2 py-1 text-sm font-medium transition-colors duration-200"
					onMouseEnter={() => setShowAnalysis(true)}
					onMouseLeave={() => setShowAnalysis(false)}
				>
					<i className="fas fa-info-circle"></i>
					<span className="ml-1">Dave Analysis</span>
				</button>
			</div>
			<div className="w-3/4 min-h-full">
				{showAnalysis && (
					<div className="relative mt-2 bg-white border border-gray-300 p-3 shadow-lg rounded text-sm text-gray-600">
						{analysisText}
					</div>
				)}

			</div>

		</div>
	);
};

export default DaveAnalysis;
