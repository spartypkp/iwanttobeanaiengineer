import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { ContentType } from './types';

type ContentProgressTrackerProps = {
	contentType: Exclude<ContentType, null>;
	fields: { id: string, label: string, required: boolean; }[];
	completedFields: string[];
};

// Component for tracking progress of content creation
export function ContentProgressTracker({
	contentType,
	fields,
	completedFields = []
}: ContentProgressTrackerProps) {
	return (
		<Card className="border-primary/20 bg-card shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]">
			<CardHeader className="px-4 py-3 border-b border-primary/20">
				<CardTitle className="text-sm font-medium flex items-center justify-between text-primary">
					<span>Required Fields</span>
					<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
						{completedFields.length}/{fields.length}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<div className="space-y-2">
					{fields.map((field) => (
						<div key={field.id} className="flex items-center text-sm">
							{completedFields.includes(field.id) ? (
								<CheckCircle2 size={16} className="text-primary mr-2 flex-shrink-0" />
							) : (
								<Circle size={16} className="text-primary/30 mr-2 flex-shrink-0" />
							)}
							<span className={completedFields.includes(field.id) ? 'text-foreground' : 'text-primary/60'}>
								{field.label} {field.required && <span className="text-destructive">*</span>}
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
} 