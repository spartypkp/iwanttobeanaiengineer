"use client";

import React, { useEffect, useRef, ReactElement } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css'; // Choose the style you prefer
// Importing languages
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import { Introduction, IntroductionFieldOrder, Reflection, ReflectionFieldOrder, Task, TaskFieldOrder, isDaveSection } from '@/lib/types';
import { Question, Warning, Informative } from './warningTooltip';
import { createRoot } from 'react-dom/client';
import DaveIcon from './dave';

// Registering languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);

interface DynamicHTMLProps {
	sectionData: Introduction | Reflection | Task;
	type: 'Introduction' | 'Reflection' | 'Task'; // Added type hint prop
}

const DynamicHTML: React.FC<DynamicHTMLProps> = ({ sectionData, type }) => {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (ref.current) {
			// Highlight all code blocks
			ref.current.querySelectorAll('pre').forEach((block) => {
				hljs.highlightElement(block as HTMLElement);
			});
			// Find all <question> HTML elements, convert to React components
			const questions = ref.current.querySelectorAll('question');
			questions.forEach(question => {
				const message = question.getAttribute('message');
				const parentSpan = question.parentElement;

				// Check if the parent is actually a <span> and replace its content
				if (parentSpan && parentSpan.tagName === 'SPAN') {
					const root = createRoot(parentSpan!); // createRoot(container!) if you use TypeScript
					root.render(<Question message={message || 'Error'} />);
				}
			});
			// Repeat for <informative> components
			const informatives = ref.current.querySelectorAll('informative');
			informatives.forEach(informative => {
				const message = informative.getAttribute('message');
				const parentSpan = informative.parentElement;

				// Check if the parent is actually a <span> and replace its content
				if (parentSpan && parentSpan.tagName === 'SPAN') {
					const root = createRoot(parentSpan!); // createRoot(container!) if you use TypeScript
					root.render(<Informative message={message || 'Error'} />);
				}
			});
			// Repeat for warnings
			const warnings = ref.current.querySelectorAll('warning');
			warnings.forEach(warning => {
				const message = warning.getAttribute('message');
				const parentSpan = warning.parentElement;

				// Check if the parent is actually a <span> and replace its content
				if (parentSpan && parentSpan.tagName === 'SPAN') {
					const root = createRoot(parentSpan!); // createRoot(container!) if you use TypeScript
					root.render(<Warning message={message || 'Error'} />);
				}
			});
		}
	}, [sectionData]); // Rerun highlighting when data changes

	const createMarkup = (htmlString: string) => ({ __html: htmlString });

	const adjustCodeBlocks = (htmlString: string) => {
		const length = htmlString.length;
		htmlString = htmlString.replace(/<pre class="ql-syntax" spellcheck="false">/g, '<pre class="whitespace-pre-wrap"><code>').replace(/<\/pre>/g, '</code></pre>');
		let isCodeBlock = false;
		if (htmlString.length != length) {
			isCodeBlock = true;
		}
		return [htmlString, isCodeBlock];

	};

	const getFieldOrder = (): string[] => {
		switch (type) {
			case 'Introduction':
				return IntroductionFieldOrder;
			case 'Reflection':
				return ReflectionFieldOrder;
			case 'Task':
				return TaskFieldOrder;
			default:
				return [];
		}
	};

	const fieldOrder = getFieldOrder();

	return (
		<div ref={ref}>
			{fieldOrder.map((fieldName) => {
				const value = (sectionData as any)[fieldName];
				if (typeof value === 'string') {
					let [cleanedValue, isCodeBlock] = adjustCodeBlocks(value);
					let isAIgenerated = isDaveSection(sectionData, fieldName);

					const bgClass = isAIgenerated ? 'bg-blue-100' : 'bg-gray-100'; // blue background if AI-generated

					return (
						<div key={fieldName} className={`mb-4 rounded-lg ${bgClass} border border-gray-400 p-4 `}>
							<div className="flex justify-between items-center mb-2">
								<h4 className="text-xl underline font-semibold text-black capitalize">
									{fieldName.split('_').join(' ')}
								</h4>
								<div className="text-sm font-medium text-black">
									{isAIgenerated ? 'Dave' : 'Will'}
								</div>
							</div>

							<div className="text-black text-base ql-editor leading-normal" dangerouslySetInnerHTML={createMarkup(cleanedValue as string)} />

						</div>
					);
				} else if (typeof value === 'number') {
					// Assuming you have a separate component for displaying slider values
					return generateDynamicSlider(fieldName, value);
				}
				return null;
			})}
		</div>
	);
};

export default DynamicHTML;

function generateDynamicSlider(slider: string, value: number) {
	let newColorClass;
	let sliderLabel = slider.replace(/_/g, ' ');

	// Determine the new color class based on the slider's value
	switch (slider) {
		case 'enthusiasm_level':
			newColorClass = value > 66 ? 'bg-green-500' : value > 33 ? 'bg-yellow-500' : 'bg-red-500';
			break;
		case 'burnout_level':
			newColorClass = value > 66 ? 'bg-red-500' : value > 33 ? 'bg-yellow-500' : 'bg-green-500';
			break;
		case 'leetcode_hatred_level':
			newColorClass = value > 66 ? 'bg-red-500' : value > 33 ? 'bg-purple-500' : 'bg-blue-500';
			break;
		case 'focus_level':
			newColorClass = value > 66 ? 'bg-green-500' : value > 33 ? 'bg-orange-500' : 'bg-red-500';
			break;
		case 'productivity_level':
			newColorClass = value > 66 ? 'bg-green-500' : value > 33 ? 'bg-green-300' : 'bg-green-100';
			break;
		case 'distraction_level':
			newColorClass = value > 66 ? 'bg-yellow-500' : value > 33 ? 'bg-yellow-300' : 'bg-yellow-100';
			break;
		case 'desire_to_play_steam_games_level':
			newColorClass = value > 66 ? 'bg-purple-500' : value > 33 ? 'bg-purple-300' : 'bg-purple-100';
			break;
		case 'overall_frustration_level':
			newColorClass = value > 66 ? 'bg-red-500' : value > 33 ? 'bg-red-300' : 'bg-red-100';
			break;
		default:
			newColorClass = 'bg-blue-300'; // default case
	}

	return (
		<div className="mb-4">
			<h4 className="text-lg font-semibold text-gray-800 mb-2 capitalize">{sliderLabel}</h4>
			<div className="w-full bg-gray-300 h-2 rounded-lg overflow-hidden border border-black">
				<div className={`h-full ${newColorClass}`} style={{ width: `${value}%` }}></div>
			</div>
		</div>
	);
}