/**
 * Script to generate embeddings for all content in Sanity
 * 
 * This script:
 * 1. Fetches all content from Sanity (projects, skills, work history, knowledge base)
 * 2. Generates embeddings for each content item
 * 3. Stores the embeddings in the Supabase database
 * 
 * Usage:
 * - Set up environment variables (OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY)
 * - Run: npx ts-node src/scripts/generateEmbeddings.ts
 */

import { generateAllEmbeddings } from '../lib/embeddings';

async function main() {
	try {
		console.log('Starting embedding generation...');

		// Load environment variables from .env.local if not already loaded
		if (!process.env.OPENAI_API_KEY) {
			console.log('Loading environment variables from .env.local');
			require('dotenv').config({ path: '.env.local' });
		}

		// Validate required environment variables
		const requiredEnvVars = [
			'OPENAI_API_KEY',
			'NEXT_PUBLIC_SUPABASE_URL',
			'SUPABASE_SERVICE_KEY'
		];

		const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
		if (missingEnvVars.length > 0) {
			throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
		}

		// Generate embeddings
		await generateAllEmbeddings();

		console.log('Embedding generation completed successfully');
	} catch (error) {
		console.error('Error generating embeddings:', error);
		process.exit(1);
	}
}

// Run the script
main(); 