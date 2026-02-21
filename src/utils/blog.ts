import { getCollection, render } from 'astro:content';

export interface BlogPost {
	id: string;
	slug: string;
	title: string;
	description: string;
	publishDate: Date;
	updatedDate?: Date;
	tags: string[];
	draft: boolean;
	image?: string;
	Content: Awaited<ReturnType<typeof render>>['Content'];
	readingTime: number;
}

function estimateReadingTime(text: string): number {
	const wordsPerMinute = 200;
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export async function fetchPosts(): Promise<BlogPost[]> {
	const posts = await getCollection('blog');
	const normalized = await Promise.all(
		posts.map(async (post) => {
			const { Content } = await render(post);
			return {
				id: post.id,
				slug: post.id.replace(/\.md$/, ''),
				title: post.data.title,
				description: post.data.description,
				publishDate: post.data.publishDate,
				updatedDate: post.data.updatedDate,
				tags: post.data.tags,
				draft: post.data.draft,
				image: post.data.image,
				Content,
				readingTime: estimateReadingTime(post.body ?? ''),
			} satisfies BlogPost;
		})
	);

	return normalized
		.filter((post) => !post.draft)
		.sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf());
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}
