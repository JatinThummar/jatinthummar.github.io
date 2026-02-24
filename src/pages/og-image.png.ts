import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

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
	{ name: 'JS', file: 'javascript.svg' },
	{ name: 'TS', file: 'typescript.svg' },
	{ name: 'Git', file: 'git.svg' },
];

const logos = await Promise.all(
	logoEntries.map(async (entry) => ({
		name: entry.name,
		src: await readLogoAsDataUri(entry.file),
	}))
);

const row1 = logos.slice(0, 4); // React, Expo, Next.js, Vite
const row2 = logos.slice(4); // JS, TS, Git

// Bypass ultrahtml's auto-escaping by passing full HTML as a single static string
function rawHtml(str: string) {
	const tmpl = Object.assign([str], { raw: [str] }) as TemplateStringsArray;
	return html(tmpl);
}

export async function GET() {
	const surface = '#ffffff';
	const emphasis = '#09090b';
	const muted = '#71717a';
	const accent = '#2563eb';
	const divider = '#e4e4e7';
	const sidebarBg = '#fafafa';

	const logoItem = (logo: { name: string; src: string }) => `
		<div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:80px;">
			<img src="${logo.src}" style="width:52px;height:52px;" />
			<div style="display:flex;color:${muted};font-size:13px;font-weight:400;">${logo.name}</div>
		</div>
	`;

	const markup = rawHtml(`
		<div style="display:flex;width:100%;height:100%;background-color:${surface};">

			<!-- Left accent strip -->
			<div style="display:flex;flex-shrink:0;width:16px;height:100%;background-color:${accent};"></div>

			<!-- Main left content (~75%) -->
			<div style="display:flex;flex:1;flex-direction:column;justify-content:space-between;padding:52px 56px;">

				<!-- Identity: avatar + name + title + handle -->
				<div style="display:flex;align-items:center;gap:36px;">
					<img src="${avatarBase64}" style="width:140px;height:140px;border-radius:24px;border:2px solid ${divider};" />
					<div style="display:flex;flex-direction:column;gap:6px;">
						<div style="display:flex;color:${emphasis};font-size:54px;font-weight:700;letter-spacing:-0.03em;line-height:1.1;">
							Jatin Thummar
						</div>
						<div style="display:flex;color:${accent};font-size:24px;font-weight:700;letter-spacing:0.02em;">
							Frontend Engineer
						</div>
						<div style="display:flex;color:${muted};font-size:21px;font-weight:400;margin-top:2px;">
							@jatinthummarx
						</div>
					</div>
				</div>

				<!-- Tech logos — two rows -->
				<div style="display:flex;flex-direction:column;gap:24px;">
					<div style="display:flex;align-items:center;gap:40px;">
						${row1.map(logoItem).join('')}
					</div>
					<div style="display:flex;align-items:center;gap:40px;">
						${row2.map(logoItem).join('')}
					</div>
				</div>

				<!-- Footer URL -->
				<div style="display:flex;color:${muted};font-size:20px;font-weight:400;">
					jatinthummar.github.io
				</div>

			</div>

			<!-- Right sidebar — QR code -->
			<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:300px;border-left:1px solid ${divider};background-color:${sidebarBg};gap:20px;">
				<img src="${qrBase64}" style="width:200px;height:200px;" />
				<div style="display:flex;color:${muted};font-size:16px;font-weight:400;">Scan to visit</div>
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
