import React, { useEffect, useRef, useState } from 'react';

interface CommandEntry {
	command: string;
	output: React.ReactNode;
}

interface InteractiveTerminalProps {
	expanded?: boolean;
	onToggleExpand?: () => void;
}

const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
	expanded = true,
	onToggleExpand
}) => {
	const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([
		{
			command: '',
			output: (
				<div className="welcome-message">
					<p>Welcome to Will Diamond's interactive portfolio terminal.</p>
					<p>Type <span className="command-highlight">help</span> to see available commands.</p>
				</div>
			)
		}
	]);
	const [inputValue, setInputValue] = useState('');
	const [currentPath, setCurrentPath] = useState('/');
	const inputRef = useRef<HTMLInputElement>(null);
	const outputRef = useRef<HTMLDivElement>(null);

	// Focus input when terminal is clicked
	const handleTerminalClick = () => {
		inputRef.current?.focus();
	};

	// Auto-scroll to bottom when new commands are added
	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight;
		}
	}, [commandHistory]);

	// Focus input on initial render
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	// Process the entered command
	const handleCommandSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!inputValue.trim()) return;

		const command = inputValue.trim();
		let output: React.ReactNode;

		// Process command
		if (command === 'help') {
			output = (
				<div className="help-output">
					<p>Available commands:</p>
					<ul>
						<li><span className="command">help</span> - Show this help message</li>
						<li><span className="command">ls</span> - List available sections</li>
						<li><span className="command">cd [directory]</span> - Navigate to a section</li>
						<li><span className="command">cat [file]</span> - Display content</li>
						<li><span className="command">clear</span> - Clear terminal</li>
						<li><span className="command">whoami</span> - About Will Diamond</li>
						<li><span className="command">./hire-me.sh</span> - Start hiring process</li>
					</ul>
				</div>
			);
		} else if (command === 'ls') {
			output = (
				<div className="ls-output">
					<span className="directory">about/</span>
					<span className="directory">projects/</span>
					<span className="directory">skills/</span>
					<span className="file">resume.pdf</span>
					<span className="executable">contact.exe</span>
					<span className="executable">hire-me.sh</span>
				</div>
			);
		} else if (command === 'clear') {
			setCommandHistory([]);
			setInputValue('');
			return;
		} else if (command === 'whoami') {
			output = (
				<div className="whoami-output">
					<p>Will Diamond</p>
					<p>AI Engineer at Contoural Inc</p>
					<p>Building LLM systems for Fortune 500 companies</p>
					<p>Previously founded Recodify.ai, organized Latent Space Podcast and AI Engineer Conference</p>
				</div>
			);
		} else if (command.startsWith('cd ')) {
			const dir = command.split(' ')[1];
			if (['about', 'projects', 'skills'].includes(dir)) {
				setCurrentPath(`/${dir}`);
				output = <p>Changed directory to /{dir}</p>;

				// Scroll to section in the main UI
				setTimeout(() => {
					document.getElementById(`${dir}-section`)?.scrollIntoView({ behavior: 'smooth' });
				}, 100);
			} else {
				output = <p className="error">cd: no such directory: {dir}</p>;
			}
		} else if (command.startsWith('cat ')) {
			const file = command.split(' ')[1];

			if (file === 'resume.pdf') {
				output = <p>Opening resume... <a href="/resume.pdf" target="_blank" className="text-primary hover:underline">resume.pdf</a></p>;
			} else if (file.endsWith('.txt')) {
				// Simple file content lookup
				const filePath = file.startsWith('/') ? file : `${currentPath}/${file}`;

				if (filePath === '/about/bio.txt') {
					output = (
						<div className="file-content">
							<p>Will Diamond is an AI Engineer with experience building LLM systems for Fortune 500 companies.</p>
							<p>He is passionate about AI, machine learning, and creating innovative solutions.</p>
						</div>
					);
				} else if (filePath === '/skills/languages.txt') {
					output = (
						<div className="file-content">
							<p>Programming Languages:</p>
							<ul>
								<li>Python</li>
								<li>TypeScript</li>
								<li>JavaScript</li>
								<li>SQL</li>
							</ul>
						</div>
					);
				} else {
					output = <p className="error">cat: {file}: No such file or directory</p>;
				}
			} else {
				output = <p className="error">cat: {file}: No such file or directory</p>;
			}
		} else if (command === './hire-me.sh') {
			output = (
				<div className="script-output">
					<p className="text-primary">Initiating hiring process for Will Diamond...</p>
					<p>Analyzing candidate qualifications...</p>
					<p className="text-primary">Candidate is an excellent fit for your team!</p>
					<p>To proceed with hiring, please send a message through the contact form below or email directly.</p>
					<div className="mt-2 p-2 border border-primary/30 rounded">
						<p className="text-sm">$ ./hire-me.sh --reason</p>
						<p className="text-xs opacity-70 mt-1">1. Experienced AI Engineer with practical LLM implementation</p>
						<p className="text-xs opacity-70">2. Strong background in both engineering and product</p>
						<p className="text-xs opacity-70">3. Proven track record of delivering results</p>
					</div>
				</div>
			);
		} else {
			output = <p className="error">Command not found: {command}. Type 'help' for available commands.</p>;
		}

		// Add command to history
		setCommandHistory(prev => [...prev, { command, output }]);
		setInputValue('');
	};

	return (
		<div className={`terminal-container ${expanded ? 'expanded' : 'collapsed'}`} onClick={handleTerminalClick}>
			<div className="terminal-header">
				<div className="window-controls">
					<span className="control close"></span>
					<span className="control minimize" onClick={(e) => {
						e.stopPropagation();
						onToggleExpand?.();
					}}></span>
					<span className="control maximize"></span>
				</div>
				<div className="terminal-title">will@portfolio ~ {currentPath}</div>

				<button
					className="terminal-toggle text-xs text-primary/70 hover:text-primary ml-auto"
					onClick={(e) => {
						e.stopPropagation();
						onToggleExpand?.();
					}}
				>
					{expanded ? 'Minimize' : 'Expand'} Terminal
				</button>
			</div>

			{expanded && (
				<>
					<div className="terminal-output" ref={outputRef}>
						{commandHistory.map((entry, index) => (
							<div key={index} className="command-entry">
								{entry.command && (
									<div className="command-line">
										<span className="prompt">will@portfolio{currentPath}$</span> {entry.command}
									</div>
								)}
								<div className="output">{entry.output}</div>
							</div>
						))}
					</div>

					<form onSubmit={handleCommandSubmit} className="terminal-input-form">
						<span className="prompt">will@portfolio{currentPath}$</span>
						<input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							className="terminal-input"
							aria-label="Terminal input"
							autoComplete="off"
							spellCheck="false"
						/>
					</form>
				</>
			)}
		</div>
	);
};

export default InteractiveTerminal; 