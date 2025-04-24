'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import { useState } from 'react';

export default function MigrationPage() {
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [message, setMessage] = useState<string>('');

	const runMigration = async () => {
		try {
			setStatus('loading');
			setMessage('Starting migration...');

			try {
				// Fetch our migration module
				const migrationModule = await import('@/sanity/lib/migrateFeaturedProjects');

				// Check if the migration function exists
				if (typeof migrationModule.migrateFeaturedProjects !== 'function') {
					throw new Error('Migration function not found in the module');
				}

				// Run the migration
				await migrationModule.migrateFeaturedProjects();

				// Update UI
				setStatus('success');
				setMessage('Migration completed successfully!');
			} catch (importError) {
				console.error('Error importing or running migration:', importError);
				setStatus('error');
				setMessage(`Migration failed: Could not load migration module. Make sure the file exists and is properly exported.`);
			}
		} catch (error) {
			setStatus('error');
			setMessage(`Migration failed: ${error instanceof Error ? error.message : String(error)}`);
			console.error('Migration error:', error);
		}
	};

	return (
		<div className="max-w-4xl mx-auto py-12 px-4">
			<h1 className="text-3xl font-bold mb-8">Sanity Data Migration</h1>

			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Featured Projects Migration</CardTitle>
					<CardDescription>
						This tool will migrate the hardcoded featured projects data to Sanity CMS.
						Only run this if you haven't already migrated the data.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="bg-yellow-50 text-yellow-800 p-4 rounded-md border border-yellow-200 mb-4">
						<div className="flex items-start">
							<InfoIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
							<div>
								<h4 className="font-medium text-sm">Important</h4>
								<p className="text-sm mt-1">
									This operation will create new projects in Sanity. It will skip any projects that already exist (based on the project ID).
									Make sure you have proper backups before proceeding.
								</p>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col items-start gap-4">
					<Button
						onClick={runMigration}
						disabled={status === 'loading'}
						variant={status === 'error' ? 'destructive' : 'default'}
					>
						{status === 'loading' ? 'Migrating...' : 'Migrate Featured Projects'}
					</Button>

					{message && (
						<div className={`text-sm p-4 rounded w-full ${status === 'error' ? 'bg-destructive/10 text-destructive' :
							status === 'success' ? 'bg-green-500/10 text-green-500' :
								'bg-muted'
							}`}>
							{message}
						</div>
					)}
				</CardFooter>
			</Card>
		</div>
	);
} 