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

export function getRelatedPosts(current: BlogPost, allPosts: BlogPost[], limit = 2): BlogPost[] {
	return allPosts
		.filter((p) => p.slug !== current.slug)
		.map((p) => ({
			post: p,
			shared: p.tags.filter((t) => current.tags.includes(t)).length,
		}))
		.filter((p) => p.shared > 0)
		.sort((a, b) => b.shared - a.shared)
		.slice(0, limit)
		.map((p) => p.post);
}

export function getAllTags(posts: BlogPost[]): { tag: string; count: number }[] {
	const tagMap = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.tags) {
			tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
		}
	}
	return Array.from(tagMap.entries())
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count);
}
