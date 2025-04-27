'use client';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";

interface ResetConversationsButtonProps {
	documentId: string;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	onSuccess?: () => void;
}

export function ResetConversationsButton({
	documentId,
	variant = "outline",
	size = "sm",
	className,
	onSuccess
}: ResetConversationsButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleReset = async () => {
		// Ask for confirmation
		if (!confirm("Are you sure you want to reset all conversations for this document? This action cannot be undone.")) {
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('/api/content-copilot/reset-conversations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ documentId }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to reset conversations');
			}

			// Display success message with count of deleted conversations
			toast({
				title: "Conversations Reset",
				description: `Successfully reset ${data.deletedCount || 0} conversations and their related data.`,
				variant: "default",
			});

			// Call success callback if provided
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			console.error('Error resetting conversations:', error);
			toast({
				title: "Error",
				description: `Failed to reset conversations: ${error instanceof Error ? error.message : String(error)}`,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			onClick={handleReset}
			disabled={isLoading}
		>
			{isLoading ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Resetting...
				</>
			) : (
				<>
					<RefreshCw className="mr-2 h-4 w-4" />
					Reset AI Conversations
				</>
			)}
		</Button>
	);
} 