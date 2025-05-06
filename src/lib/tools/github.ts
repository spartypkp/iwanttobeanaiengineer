import { logToolCall } from '@/lib/tools/utils';
import { Octokit } from '@octokit/rest';
import { tool, type Tool } from 'ai';
import { z } from 'zod';

type GithubTools =
	| 'getRepository'
	| 'getRepositoryLanguages'
	| 'getRepositoryDetails';

export const githubTools = (
	{ token, baseUrl }: { token: string; baseUrl?: string; },
	config?: {
		excludeTools?: GithubTools[];
	}
): Partial<Record<GithubTools, Tool>> => {
	const octokit = new Octokit({
		auth: token,
		...(baseUrl && { baseUrl }),
	});

	const tools: Partial<Record<GithubTools, Tool>> = {
		getRepository: tool({
			description: 'Get detailed information about a specific GitHub repository, including stats and metadata',
			parameters: z.object({
				repoName: z
					.string()
					.describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
			}),
			execute: async ({ repoName }, { toolCallId }) => {
				try {
					const result = await getRepository(octokit, repoName);

					// Log successful tool call
					await logToolCall(toolCallId, 'getRepository', { repoName }, result, false);

					return result;
				} catch (error) {
					const errorResult = { error: String(error) };

					// Log failed tool call
					await logToolCall(toolCallId, 'getRepository', { repoName }, errorResult, true);

					return errorResult;
				}
			},
		}),
		getRepositoryLanguages: tool({
			description: 'Get a breakdown of programming languages used in a repository and their relative proportions',
			parameters: z.object({
				repoName: z
					.string()
					.describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
			}),
			execute: async ({ repoName }, { toolCallId }) => {
				try {
					const result = await getRepositoryLanguages(octokit, repoName);

					// Log successful tool call
					await logToolCall(toolCallId, 'getRepositoryLanguages', { repoName }, result, false);

					return result;
				} catch (error) {
					const errorResult = { error: String(error) };

					// Log failed tool call
					await logToolCall(toolCallId, 'getRepositoryLanguages', { repoName }, errorResult, true);

					return errorResult;
				}
			},
		}),
		getRepositoryDetails: tool({
			description: 'Get comprehensive information about a GitHub repository, including metadata, languages, and README content',
			parameters: z.object({
				repoName: z
					.string()
					.describe('Full repository name in the format "owner/repo" (e.g., "microsoft/typescript")'),
			}),
			execute: async ({ repoName }, { toolCallId }) => {
				try {
					// Get all repository information in parallel
					const [repoInfo, languages, readme] = await Promise.all([
						getRepository(octokit, repoName),
						getRepositoryLanguages(octokit, repoName),
						getRepositoryReadme(octokit, repoName)
					]);

					const result = {
						repository: repoInfo,
						languages,
						readme
					};

					// Log successful tool call
					await logToolCall(toolCallId, 'getRepositoryDetails', { repoName }, result, false);

					return result;
				} catch (error) {
					const errorResult = { error: String(error) };

					// Log failed tool call
					await logToolCall(toolCallId, 'getRepositoryDetails', { repoName }, errorResult, true);

					return errorResult;
				}
			},
		}),
	};

	for (const toolName in tools) {
		if (config?.excludeTools?.includes(toolName as GithubTools)) {
			delete tools[toolName as GithubTools];
		}
	}

	return tools;
};

async function searchRepositories(
	octokit: Octokit,
	{
		query,
		sort,
		order,
		perPage,
	}: { query: string; sort: 'stars' | 'forks' | 'help-wanted-issues' | 'updated'; order: 'asc' | 'desc'; perPage: number; }
) {
	try {
		const { data } = await octokit.rest.search.repos({
			q: query,
			sort: sort as 'stars' | 'forks' | 'help-wanted-issues' | 'updated' | undefined,
			order: order as 'asc' | 'desc',
			per_page: perPage,
		});

		return data.items.map((repo) => ({
			fullName: repo.full_name,
			description: repo.description,
			url: repo.html_url,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			language: repo.language,
		}));
	} catch (error) {
		return { error: String(error) };
	}
}

async function listRepositories(octokit: Octokit) {
	try {
		const { data } = await octokit.rest.repos.listForAuthenticatedUser();
		return data.map((repo) => repo.full_name);
	} catch (error) {
		return { error: String(error) };
	}
}

async function createRepository(
	octokit: Octokit,
	{
		name,
		private: isPrivate,
		description,
		autoInit,
		organization,
	}: {
		name: string;
		private?: boolean;
		description?: string;
		autoInit?: boolean;
		organization?: string;
	}
) {
	try {
		const params = {
			name,
			private: isPrivate,
			description,
			auto_init: autoInit,
		};

		const { data } = organization
			? await octokit.rest.repos.createInOrg({ ...params, org: organization })
			: await octokit.rest.repos.createForAuthenticatedUser(params);

		return {
			name: data.full_name,
			url: data.html_url,
			private: data.private,
			description: data.description,
		};
	} catch (error) {
		return { error: String(error) };
	}
}

async function getRepository(octokit: Octokit, repoName: string) {
	try {
		const [owner, repo] = repoName.split('/');
		const { data } = await octokit.rest.repos.get({ owner, repo });

		return {
			name: data.full_name,
			description: data.description,
			url: data.html_url,
			stars: data.stargazers_count,
			forks: data.forks_count,
			openIssues: data.open_issues_count,
			language: data.language,
			license: data.license?.name,
			defaultBranch: data.default_branch,
		};
	} catch (error) {
		return { error: String(error) };
	}
}

async function getRepositoryLanguages(octokit: Octokit, repoName: string) {
	try {
		const [owner, repo] = repoName.split('/');
		const { data } = await octokit.rest.repos.listLanguages({ owner, repo });
		return data;
	} catch (error) {
		return { error: String(error) };
	}
}

async function getRepositoryReadme(octokit: Octokit, repoName: string) {
	try {
		const [owner, repo] = repoName.split('/');
		const { data } = await octokit.rest.repos.getReadme({
			owner,
			repo,
		});

		// GitHub returns the README content as base64 encoded, so we need to decode it
		const content = data.content ? Buffer.from(data.content, 'base64').toString() : null;

		return {
			content,
			name: data.name,
			path: data.path,
			url: data.html_url,
			downloadUrl: data.download_url,
		};
	} catch (error) {
		// A missing readme shouldn't be a fatal error
		if (String(error).includes('Not Found')) {
			return {
				content: null,
				message: 'README not found in repository'
			};
		}
		return { error: String(error) };
	}
}
