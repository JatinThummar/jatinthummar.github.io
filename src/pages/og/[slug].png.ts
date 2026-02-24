import { Resvg } from '@resvg/resvg-js';
import type { GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import { fetchPosts } from '../../utils/blog';

const fontRes = await fetch(
	'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf'
);
const interBold = await fontRes.arrayBuffer();

const fontResRegular = await fetch(
	'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf'
);
const interRegular = await fontResRegular.arrayBuffer();

// Fetch JetBrains Mono Bold via CSS API (forces a TTF-compatible response)
const monoFontCss = await fetch(
	'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700',
	{ headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.54.16' } }
).then((r) => r.text());
const monoFontUrl = monoFontCss.match(/src:\s*url\(([^)]+)\)/)?.[1] ?? '';
const jetBrainsMono = await fetch(monoFontUrl).then((r) => r.arrayBuffer());

const avatarBuffer = await readFile(resolve('src/assets/avatar-color.png'));
const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

// Bypass ultrahtml's auto-escaping by passing the full HTML as a single static string
function rawHtml(str: string) {
	const tmpl = Object.assign([str], { raw: [str] }) as TemplateStringsArray;
	return html(tmpl);
}

function getAccentColor(tags: string[]): string {
	if (tags.some((t) => ['design', 'ui-ux'].includes(t))) return '#e91e8c';
	if (tags.some((t) => ['ai'].includes(t))) return '#00c27a';
	if (tags.some((t) => ['engineering'].includes(t))) return '#7c3aed';
	if (tags.some((t) => ['react-native', 'react', 'frontend'].includes(t))) return '#00b2d4';
	if (tags.some((t) => ['reading', 'startups'].includes(t))) return '#f59000';
	return '#1d4ed8';
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await fetchPosts();
	return posts.map((post) => ({
		params: { slug: post.slug },
		props: {
			title: post.title,
			description: post.description,
			tags: post.tags,
		},
	}));
};

interface Props {
	title: string;
	description: string;
	tags: string[];
}

export async function GET({ props }: { props: Props }) {
	const { title, description, tags } = props;
	const accent = getAccentColor(tags);

	const surface = '#fafafa';
	const emphasis = '#09090b';
	const body = '#3f3f46';
	const muted = '#71717a';

	const letter = title.charAt(0).toLowerCase();
	const titleSize = title.length > 55 ? 32 : title.length > 35 ? 42 : 54;

	const markup = rawHtml(
		`<div style="display:flex;width:100%;height:100%;background-color:${surface};overflow:hidden;"><div style="display:flex;flex-shrink:0;width:16px;height:100%;background-color:${accent};"></div><div style="display:flex;flex:1;flex-direction:column;padding:52px 60px;"><div style="display:flex;flex:1;flex-direction:column;gap:18px;max-width:700px;padding-top:20px;"><div style="display:flex;color:${emphasis};font-size:${titleSize}px;font-weight:700;line-height:1.2;letter-spacing:-0.03em;">${title}</div><div style="display:flex;color:${body};font-size:28px;font-weight:400;line-height:1.5;">${description}</div></div><div style="display:flex;height:1px;background:linear-gradient(to right, #e4e4e7, transparent 70%);"></div><div style="display:flex;align-items:center;justify-content:space-between;padding-top:20px;"><div style="display:flex;align-items:center;gap:16px;"><img src="${avatarBase64}" style="width:80px;height:80px;border-radius:14px;mix-blend-mode:multiply;" /><div style="display:flex;flex-direction:column;gap:4px;"><div style="display:flex;color:${emphasis};font-size:24px;font-weight:700;letter-spacing:-0.01em;">Jatin Thummar</div><div style="display:flex;color:${muted};font-size:17px;font-weight:400;">@jatinthummarx</div></div></div></div></div><div style="display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-end;width:380px;flex-shrink:0;overflow:hidden;padding-right:40px;"><div style="display:flex;flex-shrink:0;color:${accent};font-family:JetBrainsMono;font-size:680px;font-weight:700;line-height:1;letter-spacing:-0.05em;opacity:0.15;">${letter}</div></div></div>`
	);

	const svg = await satori(markup, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Inter', data: interBold, weight: 700, style: 'normal' },
			{ name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
			{ name: 'JetBrainsMono', data: jetBrainsMono, weight: 700, style: 'normal' },
		],
	});

	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: 1800 },
	});
	const pngData = resvg.render().asPng();

	return new Response(new Uint8Array(pngData), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
}
