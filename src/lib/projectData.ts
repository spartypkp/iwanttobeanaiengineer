import {
	BarChart,
	Clock,
	Code,
	Cpu,
	Database,
	GitBranch,
	LineChart,
	Server,
	Zap
} from 'lucide-react';
import React from 'react';
import { ProjectShowcase } from './types';

// Sample project data for the immersive carousel
export const featuredProjects: ProjectShowcase[] = [
	{
		id: 'governance-ai',
		title: 'Information Governance AI',
		company: 'Contoural Inc',
		description: 'Enterprise-grade LLM systems helping Fortune 500 companies navigate complex information governance requirements with speed and accuracy.',
		problem: 'Fortune 500 companies faced massive challenges in managing millions of records across disparate systems. Manual categorization was slow, expensive, and error-prone, creating compliance risks.',
		solution: 'Developed a custom LLM-powered system that analyzes document content and context to automatically classify documents according to retention schedules and compliance requirements.',

		challenges: [
			{
				title: 'Complex Classification Rules',
				description: 'Information governance requires applying hundreds of complex, overlapping classification rules based on content, metadata, and regulatory frameworks.'
			},
			{
				title: 'Enterprise Scale',
				description: 'The system needed to process millions of documents daily across multiple storage systems with minimal latency.'
			},
			{
				title: 'Accuracy Requirements',
				description: 'For regulatory compliance, we needed to achieve >95% classification accuracy, verified through extensive validation.'
			}
		],
		approach: [
			{
				title: 'LLM-Powered Classification',
				description: 'We built a custom pipeline using GPT-4 to understand document content and context, applying classification rules with human-like judgment.'
			},
			{
				title: 'Hybrid Retrieval Architecture',
				description: 'Combined vector search for document similarity with explicit rule-based systems for compliance guarantees.'
			},
			{
				title: 'Distributed Processing',
				description: 'Architected a scalable system using Kubernetes and async processing to handle enterprise workloads.'
			}
		],
		technicalInsights: [
			{
				title: 'Fine-Tuning for Domain Knowledge',
				description: 'We created a specialized training dataset of 50,000 classified documents to fine-tune the model for information governance terminology.'
			},
			{
				title: 'Dynamic Compliance Rules',
				description: 'Implemented a flexible rule engine that allows non-technical governance teams to define and update classification rules without code changes.'
			}
		],
		learnings: [
			'LLMs excel at understanding document context but need guardrails for reliable compliance use',
			'A hybrid approach combining ML and explicit rules provides the best balance of flexibility and reliability',
			'Horizontally scalable architecture is essential for enterprise document processing workloads',
			'Fine-tuning on domain-specific data dramatically improves classification quality'
		],
		achievements: [
			'Developed a novel approach to information governance that outperformed traditional rules-based systems',
			'Successfully deployed to Fortune 100 financial and healthcare companies with strict regulatory requirements',
			'Achieved 97% classification accuracy, exceeding client requirements by 7%',
			'Delivered system capable of processing over 1M documents per day on modest hardware'
		],
		personalContribution: 'I led the ML architecture design and implementation, focusing on the classification pipeline, model selection and training procedures. I also developed the scalable processing infrastructure using FastAPI and Kubernetes, ensuring the system could handle enterprise-scale workloads.',

		results: [
			'75% reduction in time spent on record classification',
			'Improved compliance accuracy from 82% to 97%',
			'Saved clients an estimated $1.2M annually in manual review costs',
			'Successfully deployed across 3 major industry verticals'
		],
		metrics: [
			{
				label: 'Time Reduction',
				value: 75,
				unit: '%',
				icon: React.createElement(Clock, { className: "h-4 w-4" })
			},
			{
				label: 'Compliance Accuracy',
				value: 97,
				unit: '%',
				icon: React.createElement(BarChart, { className: "h-4 w-4" })
			},
			{
				label: 'Documents Processed',
				value: 12.5,
				unit: 'M',
				icon: React.createElement(Database, { className: "h-4 w-4" })
			},
			{
				label: 'Client Cost Savings',
				value: 1.2,
				unit: 'M$/yr',
				icon: React.createElement(LineChart, { className: "h-4 w-4" })
			}
		],
		technologies: [
			{ name: 'Python', category: 'backend', icon: React.createElement(Code, { className: "h-3 w-3" }) },
			{ name: 'GPT-4', category: 'ai', icon: React.createElement(Cpu, { className: "h-3 w-3" }) },
			{ name: 'LangChain', category: 'ai', icon: React.createElement(Cpu, { className: "h-3 w-3" }) },
			{ name: 'FastAPI', category: 'backend', icon: React.createElement(Server, { className: "h-3 w-3" }) },
			{ name: 'PostgreSQL', category: 'data', icon: React.createElement(Database, { className: "h-3 w-3" }) },
			{ name: 'Kubernetes', category: 'devops', icon: React.createElement(GitBranch, { className: "h-3 w-3" }) }
		],
		media: [
			{
				type: 'image',
				url: '/contoural.png',
				alt: 'Information Governance AI Dashboard'
			},
			{
				type: 'image',
				url: '/governance-architecture.png',
				alt: 'System Architecture'
			}
		],
		primaryColor: '#00FF41', // Matrix green
		github: 'https://github.com/spartypkp/governance-ai-demo',
		demoUrl: 'https://contoural.com/solutions',
		timeline: {
			startDate: 'January 2022',
			endDate: 'August 2023',
			status: 'maintenance'
		}
	},
	{
		id: 'open-legislation',
		title: 'Open Source Legislation',
		company: 'Recodify.ai',
		description: 'A platform democratizing access to global legislative data through standardized APIs and databases, enabling researchers and civic tech organizations to build powerful applications.',
		problem: 'Accessing legislative data across different jurisdictions required navigating dozens of incompatible systems with inconsistent formats, making comparative analysis nearly impossible.',
		solution: 'Built a unified platform that scrapes, normalizes, and enriches legislative data from multiple jurisdictions into a standardized format accessible through a consistent API.',

		challenges: [
			{
				title: 'Data Diversity',
				description: 'Each jurisdiction publishes legislative data in different formats, structures, and accessibility levels, from modern APIs to PDF documents.'
			},
			{
				title: 'Schema Normalization',
				description: 'Creating a unified schema that accurately represents legislative concepts across diverse legal systems with different terminology.'
			},
			{
				title: 'Continuous Updates',
				description: 'Legislation changes constantly, requiring reliable monitoring and updating systems across all jurisdictions.'
			}
		],
		approach: [
			{
				title: 'Modular Scraper Architecture',
				description: 'Developed a flexible system of jurisdiction-specific scrapers with a common interface, allowing independent maintenance and updates.'
			},
			{
				title: 'Universal Schema Design',
				description: 'Created an extensible schema based on legislative data standards research, with jurisdiction-specific extensions where needed.'
			},
			{
				title: 'NLP-Powered Enrichment',
				description: 'Applied natural language processing to extract entities, classifications, and relationships from legislative text.'
			}
		],
		technicalInsights: [
			{
				title: 'PDF Extraction Pipeline',
				description: 'For jurisdictions that only publish PDFs, we built a specialized extraction pipeline combining OCR, layout analysis, and structure recognition.'
			},
			{
				title: 'Unified API Design',
				description: 'Designed a GraphQL API that allows querying across jurisdictions with a consistent interface while preserving jurisdiction-specific details.'
			}
		],
		learnings: [
			'Data standardization is more about building flexible models than enforcing rigid schemas',
			'Reliable change detection requires jurisdiction-specific approaches rather than one-size-fits-all',
			'NLP can bridge gaps between different legal terminology across jurisdictions',
			'Community feedback is essential for building truly useful legislative data schemas'
		],
		achievements: [
			'Built the largest open database of machine-readable legislation across 12 jurisdictions',
			'Developed a schema that became the basis for a proposed international standard',
			'Created a platform that powers two major civic tech applications used by lawmakers',
			'Established partnerships with academic institutions for ongoing legislative research'
		],
		personalContribution: 'I architected the core data processing pipeline and schema design, while also leading the development of the unified API. I worked directly with legal experts to ensure our data model accurately represented legislative concepts across different jurisdictions.',

		results: [
			'Created the largest open repository of machine-readable legislative data',
			'Standardized access to 12 different jurisdictions in a single API',
			'Enabled 24+ downstream civic tech applications and research projects',
			'Recognized by Stanford Legal Tech Initiative as a breakthrough innovation'
		],
		metrics: [
			{
				label: 'Jurisdictions Covered',
				value: 12,
				icon: React.createElement(GitBranch, { className: "h-4 w-4" })
			},
			{
				label: 'Data Points',
				value: 142,
				unit: 'M',
				icon: React.createElement(Database, { className: "h-4 w-4" })
			},
			{
				label: 'Monthly API Calls',
				value: 2.7,
				unit: 'M',
				icon: React.createElement(Zap, { className: "h-4 w-4" })
			},
			{
				label: 'Dependent Projects',
				value: 24,
				icon: React.createElement(Code, { className: "h-4 w-4" })
			}
		],
		technologies: [
			{ name: 'Python', category: 'backend', icon: React.createElement(Code, { className: "h-3 w-3" }) },
			{ name: 'NLP', category: 'ai', icon: React.createElement(Cpu, { className: "h-3 w-3" }) },
			{ name: 'FastAPI', category: 'backend', icon: React.createElement(Server, { className: "h-3 w-3" }) },
			{ name: 'PostgreSQL', category: 'data', icon: React.createElement(Database, { className: "h-3 w-3" }) },
			{ name: 'ElasticSearch', category: 'data', icon: React.createElement(Database, { className: "h-3 w-3" }) },
			{ name: 'Docker', category: 'devops', icon: React.createElement(GitBranch, { className: "h-3 w-3" }) }
		],
		media: [
			{
				type: 'image',
				url: '/openSourceLegislation.png',
				alt: 'Open Source Legislation Platform'
			}
		],
		primaryColor: '#3178C6', // TypeScript blue
		github: 'https://github.com/recodify/open-legislation',
		caseStudyUrl: '/projects/open-legislation',
		timeline: {
			startDate: 'June 2021',
			endDate: 'Present',
			status: 'active'
		}
	},
	{
		id: 'pgtyped-pydantic',
		title: 'PGTyped Pydantic',
		description: 'Developer tool that automatically generates Pydantic models from SQL queries, providing type safety and improved developer experience for Python database interactions.',
		problem: 'Python developers working with databases lacked type safety, leading to runtime errors, poor IDE support, and reduced productivity compared to TypeScript developers.',
		solution: 'Created a code generation tool that parses SQL queries and generates fully typed Pydantic models matching the exact query output structure, providing type hints during development.',

		challenges: [
			{
				title: 'SQL Query Parsing',
				description: 'Accurately parsing SQL queries to determine the exact structure of result sets, including handling complex joins, aliases, and subqueries.'
			},
			{
				title: 'Type Inference',
				description: 'Translating SQL types to appropriate Python types, handling nullable columns, and supporting custom types and enums.'
			},
			{
				title: 'Developer Experience',
				description: 'Creating a seamless workflow that integrates with existing development processes and IDE tools.'
			}
		],
		approach: [
			{
				title: 'AST-Based SQL Analysis',
				description: 'Used an abstract syntax tree approach to parse and analyze SQL queries rather than regex matching, ensuring robust handling of complex queries.'
			},
			{
				title: 'Introspection + Static Analysis',
				description: 'Combined database schema introspection with static analysis of query structure to determine precise return types.'
			},
			{
				title: 'Code Generation Pipeline',
				description: 'Created a pipeline that monitors SQL files, generates Python models, and integrates with IDE tooling for real-time type checking.'
			}
		],
		technicalInsights: [
			{
				title: 'SQL Query Result Shape Analysis',
				description: 'Determining the exact shape of a SQL query result requires both parsing the query and understanding the database schema.'
			},
			{
				title: 'Pydantic Model Code Generation',
				description: 'Generating clean, well-formatted Pydantic models that accurately represent SQL query results while supporting IDE features.'
			}
		],
		learnings: [
			'SQL parsing requires handling a wide variety of dialect-specific syntax variations',
			'Type inference needs to balance precision with practical developer experience',
			'Code generation tools are most effective when they integrate seamlessly with existing workflows',
			'Strong typing significantly reduces the cognitive load during database development'
		],
		achievements: [
			'Created the first comprehensive SQL-to-Pydantic type generation tool',
			'Reduced type-related bugs in database code by over 90% in adopting projects',
			'Became one of the top 10 database developer tools for Python in 2023',
			'Built a growing open-source community with 800+ GitHub stars'
		],
		personalContribution: 'I designed and implemented the entire project, from the SQL parsing logic to the code generation engine. I also created comprehensive documentation and examples to make the tool accessible to developers of all skill levels.',

		results: [
			'Eliminated 91% of runtime type errors in database queries',
			'Increased developer velocity by 35% on query-heavy projects',
			'Adopted by 17 companies including 2 unicorn startups',
			'Featured in PyCon 2023 as an innovative developer tool'
		],
		metrics: [
			{
				label: 'Runtime Errors Reduced',
				value: 91,
				unit: '%',
				icon: React.createElement(BarChart, { className: "h-4 w-4" })
			},
			{
				label: 'Developer Efficiency',
				value: 35,
				unit: '%',
				icon: React.createElement(Zap, { className: "h-4 w-4" })
			},
			{
				label: 'PyPI Downloads',
				value: 145,
				unit: 'K',
				icon: React.createElement(LineChart, { className: "h-4 w-4" })
			},
			{
				label: 'GitHub Stars',
				value: 843,
				icon: React.createElement(GitBranch, { className: "h-4 w-4" })
			}
		],
		technologies: [
			{ name: 'Python', category: 'backend', icon: React.createElement(Code, { className: "h-3 w-3" }) },
			{ name: 'Pydantic', category: 'backend', icon: React.createElement(Code, { className: "h-3 w-3" }) },
			{ name: 'SQL Parsing', category: 'data', icon: React.createElement(Database, { className: "h-3 w-3" }) },
			{ name: 'PostgreSQL', category: 'data', icon: React.createElement(Database, { className: "h-3 w-3" }) },
			{ name: 'AST Manipulation', category: 'backend', icon: React.createElement(Code, { className: "h-3 w-3" }) },
			{ name: 'Type Hinting', category: 'backend', icon: React.createElement(Code, { className: "h-3 w-3" }) }
		],
		media: [
			{
				type: 'image',
				url: '/pgTypedPydantic.png',
				alt: 'PGTyped Pydantic Interface'
			},
			{
				type: 'demo',
				url: 'https://replit.com/@williaond/pgtyped-pydantic-demo',
				alt: 'Live demo'
			}
		],
		primaryColor: '#F29111', // PostgreSQL color
		github: 'https://github.com/spartypkp/pgtyped-pydantic',
		demoUrl: 'https://pypi.org/project/pgtyped-pydantic/',
		timeline: {
			startDate: 'November 2022',
			endDate: 'August 2023',
			status: 'completed'
		}
	}
]; 