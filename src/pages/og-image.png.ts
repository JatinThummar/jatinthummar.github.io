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

const avatarBuffer = await readFile(resolve('src/assets/avatar-color.png'));
const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

const qrBuffer = await readFile(resolve('src/assets/qr-code.png'));
const qrBase64 = `data:image/png;base64,${qrBuffer.toString('base64')}`;

async function readLogoAsDataUri(filename: string): Promise<string> {
	const svg = await readFile(resolve(`src/assets/logos/${filename}`), 'utf-8');
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Logo files in orbit order
const logoFiles = [
	'react.svg',
	'expo.svg',
	'nextjs.svg',
	'typescript.svg',
	'vite.svg',
	'tailwind.svg',
	'javascript.svg',
	'shopify.svg',
	'git.svg',
	'medusa.svg',
];

// Place logos along an ellipse centered on the main content area
// Content area: 904×630 (1200 - 16 accent - 280 sidebar)
const cx = 440; // ellipse center x
const cy = 308; // ellipse center y
const rx = 370; // horizontal radius
const ry = 250; // vertical radius
const angleOffset = Math.PI / 10; // rotate 18° so no logo lands exactly at 12 o'clock
// Alternate sizes for visual rhythm: larger at cardinal points, smaller between
const sizes = [64, 54, 62, 52, 60, 56, 58, 52, 62, 50];

const orbitLogos = logoFiles.map((file, i) => {
	const angle = angleOffset + (i / logoFiles.length) * 2 * Math.PI;
	const size = sizes[i];
	return {
		file,
		x: Math.round(cx + rx * Math.cos(angle) - size / 2),
		y: Math.round(cy + ry * Math.sin(angle) - size / 2),
		size,
	};
});

const logoData = await Promise.all(
	orbitLogos.map(async (l) => ({
		...l,
		src: await readLogoAsDataUri(l.file),
	}))
);

function rawHtml(str: string) {
	const tmpl = Object.assign([str], { raw: [str] }) as TemplateStringsArray;
	return html(tmpl);
}

export async function GET() {
	const surface = '#161618';
	const emphasis = '#f4f4f5';
	const muted = '#a1a1aa';
	const accent = '#3b82f6';
	const divider = '#27272a';
	const sidebarBg = '#1e1e20';

	const floatingLogos = logoData
		.map(
			(l) =>
				`<img src="${l.src}" style="position:absolute;left:${l.x}px;top:${l.y}px;width:${l.size}px;height:${l.size}px;opacity:0.4;" />`
		)
		.join('');

	const markup = rawHtml(`
		<div style="display:flex;width:100%;height:100%;background-color:${surface};">

			<!-- Left accent strip with gradient -->
			<div style="display:flex;flex-shrink:0;width:16px;height:100%;background:linear-gradient(to bottom, #6366f1, ${accent}, #06b6d4);"></div>

			<!-- Main content area with floating logos -->
			<div style="display:flex;flex:1;position:relative;overflow:hidden;">

				<!-- Radial glow behind center -->
				<div style="display:flex;position:absolute;left:280px;top:120px;width:360px;height:360px;border-radius:999px;background:radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);"></div>

				<!-- Orbit logos (background) -->
				${floatingLogos}

				<!-- Centered profile -->
				<div style="display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:24px;">

					<!-- Avatar with glow ring -->
					<div style="display:flex;position:relative;align-items:center;justify-content:center;">
						<div style="display:flex;position:absolute;width:200px;height:200px;border-radius:999px;border:1.5px solid rgba(59,130,246,0.2);"></div>
						<img src="${avatarBase64}" style="width:170px;height:170px;border-radius:999px;border:3px solid ${divider};" />
					</div>

					<!-- Name -->
					<div style="display:flex;color:${emphasis};font-size:56px;font-weight:700;letter-spacing:-0.03em;">
						Jatin Thummar
					</div>

					<!-- Title -->
					<div style="display:flex;align-items:center;gap:12px;">
						<div style="display:flex;width:10px;height:10px;border-radius:999px;background-color:${accent};"></div>
						<div style="display:flex;color:#60a5fa;font-size:30px;font-weight:700;">
							Frontend Engineer
						</div>
					</div>

					<!-- Handle -->
					<div style="display:flex;color:${muted};font-size:22px;font-weight:400;">
						@jatinthummarx
					</div>

				</div>
			</div>

			<!-- Right sidebar — QR code -->
			<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:280px;border-left:1px solid ${divider};background-color:${sidebarBg};gap:18px;">
				<div style="display:flex;background-color:#ffffff;padding:12px;border-radius:16px;">
					<img src="${qrBase64}" style="width:190px;height:190px;" />
				</div>
				<div style="display:flex;color:${muted};font-size:20px;font-weight:400;">jatinthummar.github.io</div>
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
