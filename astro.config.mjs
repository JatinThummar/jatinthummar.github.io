// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';

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
	integrations: [sitemap()],
});
