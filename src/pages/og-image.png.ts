import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';

const fontRes = await fetch(
	'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf'
);
const interBold = await fontRes.arrayBuffer();

const fontResRegular = await fetch(
	'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf'
);
const interRegular = await fontResRegular.arrayBuffer();

// Read all assets from disk — no external image fetches during build
const avatarBuffer = await readFile(resolve('src/assets/avatar-color.png'));
const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

const qrBuffer = await readFile(resolve('src/assets/qr-code.png'));
const qrBase64 = `data:image/png;base64,${qrBuffer.toString('base64')}`;

async function readLogoAsDataUri(filename: string): Promise<string> {
	const svg = await readFile(resolve(`src/assets/logos/${filename}`), 'utf-8');
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const logoEntries = [
	{ name: 'React', file: 'react.svg' },
	{ name: 'Expo', file: 'expo.svg' },
	{ name: 'Next.js', file: 'nextjs.svg' },
	{ name: 'Vite', file: 'vite.svg' },
	{ name: 'Tailwind', file: 'tailwind.svg' },
	{ name: 'JS', file: 'javascript.svg' },
	{ name: 'TS', file: 'typescript.svg' },
	{ name: 'Git', file: 'git.svg' },
	{ name: 'Shopify', file: 'shopify.svg' },
	{ name: 'Medusa', file: 'medusa.svg' },
];

const logos = await Promise.all(
	logoEntries.map(async (entry) => ({
		name: entry.name,
		src: await readLogoAsDataUri(entry.file),
	}))
);

const row1 = logos.slice(0, 5); // React, Expo, Next.js, Vite, Tailwind
const row2 = logos.slice(5);    // JS, TS, Git, Shopify, Medusa

// Bypass ultrahtml's auto-escaping by passing full HTML as a single static string
function rawHtml(str: string) {
	const tmpl = Object.assign([str], { raw: [str] }) as TemplateStringsArray;
	return html(tmpl);
}

export async function GET() {
	const surface = '#161618';
	const emphasis = '#f4f4f5';
	const muted = '#c4c4c8';
	const accent = '#3b82f6';
	const divider = '#27272a';
	const sidebarBg = '#1e1e20';

	const logoItem = (logo: { name: string; src: string }) => `
		<div style="display:flex;">
			<img src="${logo.src}" style="width:66px;height:66px;" />
		</div>
	`;

	const markup = rawHtml(`
		<div style="display:flex;width:100%;height:100%;background-color:${surface};">

			<!-- Left accent strip -->
			<div style="display:flex;flex-shrink:0;width:16px;height:100%;background-color:${accent};"></div>

			<!-- Main left content (~75%) -->
			<div style="display:flex;flex:1;flex-direction:column;justify-content:space-between;padding:52px 56px;">

				<!-- Identity: avatar + name + title + handle -->
				<div style="display:flex;align-items:center;gap:40px;">
					<img src="${avatarBase64}" style="width:160px;height:160px;border-radius:24px;border:2px solid ${divider};" />
					<div style="display:flex;flex-direction:column;gap:8px;">
						<div style="display:flex;color:${emphasis};font-size:57px;font-weight:700;letter-spacing:-0.03em;line-height:1.05;">
							Jatin Thummar
						</div>
						<div style="display:flex;color:#60a5fa;font-size:32px;font-weight:700;letter-spacing:0.01em;">
							Frontend Engineer
						</div>
						<div style="display:flex;color:${muted};font-size:24px;font-weight:400;margin-top:2px;">
							@jatinthummarx
						</div>
					</div>
				</div>

				<!-- Tech logos — two rows -->
				<div style="display:flex;flex-direction:column;gap:24px;">
					<div style="display:flex;align-items:center;gap:32px;">
						${row1.map(logoItem).join('')}
					</div>
					<div style="display:flex;align-items:center;gap:32px;">
						${row2.map(logoItem).join('')}
					</div>
				</div>

				<!-- Spacer -->
				<div style="display:flex;"></div>

			</div>

			<!-- Right sidebar — QR code -->
			<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:300px;border-left:1px solid ${divider};background-color:${sidebarBg};gap:20px;">
				<div style="display:flex;background-color:#ffffff;padding:12px;border-radius:16px;">
					<img src="${qrBase64}" style="width:210px;height:210px;" />
				</div>
				<div style="display:flex;color:${muted};font-size:22px;font-weight:400;">jatinthummar.github.io</div>
			</div>

		</div>
	`);

	const svg = await satori(markup, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Inter', data: interBold, weight: 700, style: 'normal' },
			{ name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
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
