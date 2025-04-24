import imageUrlBuilder from '@sanity/image-url';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, useCdn } from '../env';
import { Project } from '../sanity.types';

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn,
});

// Helper to generate image URLs
const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
	return builder.image(source);
}

// GROQ query to fetch featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
	return client.fetch(
		`*[_type == "project" && isFeatured == true] | order(timeline.startDate desc) {
      _id,
      title,
      id,
      company,
      description,
      problem,
      solution,
      challenges,
      approach,
      technicalInsights,
      learnings,
      achievements,
      personalContribution,
      results,
      metrics,
      technologies,
      "media": media[] {
        type,
        "url": select(
          type == "image" => image.asset->url,
          type != "image" => url
        ),
        alt,
        "poster": select(
          defined(poster) => poster.asset->url,
          null
        ),
        isThumbnail
      },
      primaryColor,
      github,
      demoUrl,
      caseStudyUrl,
      timeline
    }`
	);
}

// Get a single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
	const projects = await client.fetch(
		`*[_type == "project" && id == $id] {
      _id,
      title,
      id,
      company,
      description,
      problem,
      solution,
      challenges,
      approach,
      technicalInsights,
      learnings,
      achievements,
      personalContribution,
      results,
      metrics,
      technologies,
      "media": media[] {
        type,
        "url": select(
          type == "image" => image.asset->url,
          type != "image" => url
        ),
        alt,
        "poster": select(
          defined(poster) => poster.asset->url,
          null
        ),
        isThumbnail
      },
      primaryColor,
      github,
      demoUrl,
      caseStudyUrl,
      timeline,
      categories,
      tags,
      complexity
    }`,
		{ id }
	);

	return projects.length > 0 ? projects[0] : null;
}
