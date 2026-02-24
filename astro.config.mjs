// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
	site: 'https://jatinthummar.github.io',
	compressHTML: true,
	build: {
		inlineStylesheets: 'auto',
	},
	markdown: {
		rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]],
	},
	vite: {
		plugins: [tailwindcss()],
		build: {
			cssMinify: true,
		},
	},
	integrations: [sitemap()],
});
