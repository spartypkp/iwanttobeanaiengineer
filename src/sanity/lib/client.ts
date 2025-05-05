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
	  slug,
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
      thumbnail,
      "media": media[] {
        type,
        videoSource,
        "url": select(
          type == "image" => image.asset->url,
          type == "video" && videoSource == "upload" => videoFile.asset->url,
          type != "image" => url
        ),
        alt,
        "poster": select(
          defined(poster) => poster.asset->url,
          null
        ),
        featured
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
	  slug,
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
      thumbnail,
      "media": media[] {
        type,
        videoSource,
        "url": select(
          type == "image" => image.asset->url,
          type == "video" && videoSource == "upload" => videoFile.asset->url,
          type != "image" => url
        ),
        alt,
        "poster": select(
          defined(poster) => poster.asset->url,
          null
        ),
        featured,
        caption
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

// Function to get all projects
export async function getAllProjects(): Promise<Project[]> {
	return client.fetch(
		`*[_type == "project"] | order(timeline.startDate desc) {
      _id,
      title,
      slug,
      id,
      company,
      description,
      isFeatured,
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
      thumbnail,
      "media": media[] {
        type,
        videoSource,
        "url": select(
          type == "image" => image.asset->url,
          type == "video" && videoSource == "upload" => videoFile.asset->url,
          type != "image" => url
        ),
        alt,
        "poster": select(
          defined(poster) => poster.asset->url,
          null
        ),
        featured,
        caption
      },
      primaryColor,
      github,
      demoUrl,
      caseStudyUrl,
      timeline,
      categories,
      tags,
      complexity
    }`
	);
}

// Function to get a project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
	const projects = await client.fetch(
		`*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      id,
      company,
      description,
      isFeatured,
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
      thumbnail,
      "media": media[] {
        type,
        videoSource,
        "url": select(
          type == "image" => image.asset->url,
          type == "video" && videoSource == "upload" => videoFile.asset->url,
          type != "image" => url
        ),
        alt,
        "poster": select(
          defined(poster) => poster.asset->url,
          null
        ),
        featured,
        caption
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
		{ slug }
	);

	return projects;
}

// Function to get all skills
export async function getAllSkills() {
	return client.fetch(
		`*[_type == "skill"] | order(name asc) {
      _id,
      name,
      slug,
      category,
      description,
      proficiency,
      yearsExperience,
      examples,
      featured,
      "projects": projects[]->{ 
        _id, 
        title, 
        id, 
        description 
      }
    }`
	);
}

// Function to get all knowledge base items
export async function getAllKnowledgeItems() {
	return client.fetch(
		`*[_type == "knowledgeBase"] | order(priority desc) {
      _id,
      title,
      slug,
      category,
      question,
      content,
      keywords,
      priority,
      isPublic,
      "relatedProjects": relatedProjects[]->{ 
        _id, 
        title, 
        id,
        description 
      },
      "relatedSkills": relatedSkills[]->{ 
        _id, 
        name, 
        category,
        proficiency 
      }
    }`
	);
}
