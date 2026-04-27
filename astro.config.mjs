import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import rehypeExternalLinks from 'rehype-external-links';

/**
 * Build a slug → lastmod map from blog post frontmatter.
 * Prefers updatedDate over publishDate (Google uses lastmod only when accurate).
 */
function getBlogDates() {
	/** @type {Record<string, string>} */
	const dates = {};
	const blogDir = path.resolve('src/content/blog');
	if (!fs.existsSync(blogDir)) return dates;

	for (const file of fs.readdirSync(blogDir)) {
		if (!file.endsWith('.md')) continue;
		const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
		const slug = file.replace(/\.md$/, '');
		const updatedMatch = content.match(/^updatedDate:\s*(.+)$/m);
		const publishMatch = content.match(/^publishDate:\s*(.+)$/m);
		const dateStr = updatedMatch?.[1]?.trim() || publishMatch?.[1]?.trim();
		if (dateStr) {
			// Use YYYY-MM-DD format (W3C date, recommended by Google)
			dates[slug] = new Date(dateStr).toISOString().split('T')[0];
		}
	}
	return dates;
}

const blogDates = getBlogDates();
const latestBlogDate = Object.values(blogDates).sort().reverse()[0];

export default defineConfig({
	site: 'https://jatinthummar.github.io',
	compressHTML: true,
	build: {
		inlineStylesheets: 'auto',
	},
	markdown: {
		rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]],
		shikiConfig: {
			theme: 'github-dark',
		},
	},
	vite: {
		plugins: [tailwindcss()],
		build: {
			cssMinify: true,
		},
	},
	integrations: [
		sitemap({
			// Drop unused namespaces — no news/video/i18n content on this site.
			namespaces: { news: false, video: false, xhtml: false },
			// Google ignores changefreq and priority — only lastmod matters.
			// Use serialize() to set accurate lastmod per page.
			serialize(item) {
				const url = item.url.replace(/\/$/, '');
				const base = 'https://jatinthummar.github.io';

				// Blog posts — real publish/update date from frontmatter
				const blogMatch = url.match(/\/blog\/([^/]+)$/);
				if (blogMatch && !url.includes('/tag/')) {
					const slug = blogMatch[1];
					if (blogDates[slug]) item.lastmod = blogDates[slug];
					return item;
				}

				// Homepage, blog index, tag pages — latest blog post date
				if (url === base || url === `${base}/blog` || url.includes('/blog/tag/')) {
					item.lastmod = latestBlogDate;
					return item;
				}

				// Static pages (about) — no lastmod (avoids inaccurate dates)
				return item;
			},
		}),
	],
});
