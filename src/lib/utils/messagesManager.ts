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
	// Pass the messages array directly; Supabase client handles JSONB serialization
	const supabase = await createClient();
	await supabase.from('conversations').update({
		messages: messages, // Pass the array directly
		updated_at: new Date().toISOString(),
	}).eq('id', conversationId);
	// Save to Supabase 'conversation' table.
}

export async function loadChat(id: string): Promise<Message[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from('conversations')
		.select('messages')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error loading conversation messages:', error);
		return [];
	}

	// data.messages should now be the actual Message[] array, or null if not present
	if (!data || !data.messages) {
		return [];
	}

	// No need to parse, as it's already a JavaScript array/object from JSONB
	// Optionally, add runtime validation here if needed to ensure it's Message[]
	return data.messages as Message[];
}

