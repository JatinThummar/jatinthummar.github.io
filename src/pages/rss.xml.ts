import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { fetchPosts } from '../utils/blog';

export async function GET(context: APIContext) {
	const posts = await fetchPosts();
	return rss({
		title: "Jatin Thummar's Blog",
		description: 'Thoughts on frontend development, React Native, Expo, and building great user experiences.',
		site: context.site!,
		items: posts.map((post) => ({
			title: post.title,
			pubDate: post.publishDate,
			description: post.description,
			link: `/blog/${post.slug}/`,
			categories: post.tags,
		})),
	});
}
