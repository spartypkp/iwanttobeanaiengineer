"use server";
import { Message } from 'ai';
import { createClient } from './supabase/server';

export async function saveChat({
	conversationId,
	messages,
}: {
	conversationId: string;
	messages: Message[];
}): Promise<void> {
	const supabase = await createClient();

	// 1) Delete existing message rows for this conversation (we replace history)
	const { error: delError } = await supabase
		.from('messages')
		.delete()
		.eq('conversation_id', conversationId);
	if (delError) {
		console.error('[saveChat] Failed to delete existing messages:', delError);
		// Still attempt to insert new ones; do not throw
	}

	// 2) Insert new ordered rows
	const rows = (Array.isArray(messages) ? messages : []).map((m, idx) => ({
		conversation_id: conversationId,
		external_id: (m as any).id,
		role: m.role,
		content: typeof (m as any).content === 'string' ? (m as any).content : null,
		content_parts: Array.isArray((m as any).parts) ? (m as any).parts : null,
		sequence: idx,
	}));

	if (rows.length > 0) {
		const { error: insError } = await supabase.from('messages').insert(rows);
		if (insError) {
			console.error('[saveChat] Failed to insert messages:', insError);
		}
	}

	// 3) Touch conversation updated_at
	await supabase
		.from('conversations')
		.update({ updated_at: new Date().toISOString(), messages: null })
		.eq('id', conversationId);
}

export async function loadChat(id: string): Promise<Message[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from('messages')
		.select('id, external_id, role, content, content_parts, sequence')
		.eq('conversation_id', id)
		.order('sequence', { ascending: true });

	if (error) {
		console.error('Error loading conversation messages:', error);
		return [];
	}

	const rows = data || [];
	return rows.map((row: any) => (
		Array.isArray(row.content_parts) && row.content_parts.length > 0
			? { id: row.external_id || row.id, role: row.role, parts: row.content_parts }
			: { id: row.external_id || row.id, role: row.role, content: row.content || '' }
	));
}

