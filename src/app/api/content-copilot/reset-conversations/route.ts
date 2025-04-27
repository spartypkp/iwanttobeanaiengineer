import { createClient } from '@/lib/utils/supabase/server';

interface ResetConversationsRequest {
	documentId: string;
}

export async function POST(req: Request) {
	try {
		// Check if authenticated (this would be where you'd add additional auth checks)
		// For production, you should add proper authentication checks here

		// Parse the request body
		const { documentId }: ResetConversationsRequest = await req.json();

		if (!documentId) {
			return Response.json({ error: 'Document ID is required' }, { status: 400 });
		}

		// Initialize Supabase client
		const supabase = await createClient();

		// Call the simplified SQL function
		const { data, error } = await supabase
			.rpc('reset_document_conversations', { p_document_id: documentId });

		if (error) {
			console.error('Error resetting conversations:', error);
			return Response.json(
				{ error: `Failed to reset conversations: ${error.message}` },
				{ status: 500 }
			);
		}

		// Return the count of deleted conversations
		return Response.json({
			success: true,
			message: `Reset conversations for document: ${documentId}`,
			deletedCount: data
		});
	} catch (error) {
		console.error('Unexpected error:', error);
		return Response.json(
			{ error: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` },
			{ status: 500 }
		);
	}
} 