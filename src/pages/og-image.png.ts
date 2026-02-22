import satori from 'satori';
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

const avatarPath = resolve('src/assets/avatar-color.png');
const avatarBuffer = await readFile(avatarPath);
const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

// Fetch QR code for the site
const qrRes = await fetch(
	'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://jatinthummar.github.io&format=png'
);
const qrBuffer = Buffer.from(await qrRes.arrayBuffer());
const qrBase64 = `data:image/png;base64,${qrBuffer.toString('base64')}`;

// Fetch official tech logos from devicons CDN at build time
const devicon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

async function fetchLogoAsDataUri(url: string): Promise<string> {
	const res = await fetch(url);
	const svg = await res.text();
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const logoEntries = [
	{ name: 'React', url: `${devicon}/react/react-original.svg` },
	{ name: 'Expo', url: `https://cdn.simpleicons.org/expo/000020` },
	{ name: 'Next.js', url: `${devicon}/nextjs/nextjs-original.svg` },
	{ name: 'Vite', url: `${devicon}/vitejs/vitejs-original.svg` },
	{ name: 'JS', url: `${devicon}/javascript/javascript-original.svg` },
	{ name: 'TS', url: `${devicon}/typescript/typescript-original.svg` },
	{ name: 'Git', url: `${devicon}/git/git-original.svg` },
];

const logos = await Promise.all(
	logoEntries.map(async (entry) => ({
		name: entry.name,
		src: await fetchLogoAsDataUri(entry.url),
	}))
);

const row1 = logos.slice(0, 4); // React, Expo, Next.js, Vite
const row2 = logos.slice(4); // JS, TS, Git

export async function GET() {
	const cardBg = '#ffffff';
	const onSurface = '#1a1a1a';
	const muted = '#71717a';
	const accent = '#2563eb';
	const divider = '#e4e4e7';

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					backgroundColor: cardBg,
				},
				children: [
					// Left accent strip
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								width: '10px',
								height: '100%',
								backgroundColor: accent,
							},
						},
					},

					// Left content area (~75%)
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								flex: 1,
								padding: '52px 56px',
								justifyContent: 'space-between',
							},
							children: [
								// Identity block: avatar + text
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '36px',
										},
										children: [
											{
												type: 'img',
												props: {
													src: avatarBase64,
													width: 140,
													height: 140,
													style: {
														borderRadius: '24px',
														border: `2px solid ${divider}`,
													},
												},
											},
											{
												type: 'div',
												props: {
													style: {
														display: 'flex',
														flexDirection: 'column',
														gap: '4px',
													},
													children: [
														{
															type: 'div',
															props: {
																style: {
																	color: onSurface,
																	fontSize: '54px',
																	fontWeight: 700,
																	letterSpacing: '-0.03em',
																	lineHeight: 1.1,
																	display: 'flex',
																},
																children: 'Jatin Thummar',
															},
														},
														{
															type: 'div',
															props: {
																style: {
																	color: accent,
																	fontSize: '24px',
																	fontWeight: 700,
																	letterSpacing: '0.02em',
																	display: 'flex',
																},
																children: 'Frontend Engineer',
															},
														},
														{
															type: 'div',
															props: {
																style: {
																	color: muted,
																	fontSize: '22px',
																	fontWeight: 400,
																	display: 'flex',
																	marginTop: '2px',
																},
																children: '@jatinthummarx',
															},
														},
													],
												},
											},
										],
									},
								},

								// Tech icons — two rows, no separators
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											flexDirection: 'column',
											gap: '24px',
										},
										children: [
											// Row 1: React, Expo, Next.js, Vite
											{
												type: 'div',
												props: {
													style: {
														display: 'flex',
														alignItems: 'center',
														gap: '40px',
													},
													children: row1.map((logo) => ({
														type: 'div',
														props: {
															style: {
																display: 'flex',
																flexDirection: 'column' as const,
																alignItems: 'center',
																gap: '10px',
																width: '80px',
															},
															children: [
																{
																	type: 'img',
																	props: {
																		src: logo.src,
																		width: 56,
																		height: 56,
																	},
																},
																{
																	type: 'div',
																	props: {
																		style: {
																			color: muted,
																			fontSize: '14px',
																			fontWeight: 400,
																			display: 'flex',
																		},
																		children: logo.name,
																	},
																},
															],
														},
													})),
												},
											},
											// Row 2: JS, TS, Git
											{
												type: 'div',
												props: {
													style: {
														display: 'flex',
														alignItems: 'center',
														gap: '40px',
													},
													children: row2.map((logo) => ({
														type: 'div',
														props: {
															style: {
																display: 'flex',
																flexDirection: 'column' as const,
																alignItems: 'center',
																gap: '10px',
																width: '80px',
															},
															children: [
																{
																	type: 'img',
																	props: {
																		src: logo.src,
																		width: 56,
																		height: 56,
																	},
																},
																{
																	type: 'div',
																	props: {
																		style: {
																			color: muted,
																			fontSize: '14px',
																			fontWeight: 400,
																			display: 'flex',
																		},
																		children: logo.name,
																	},
																},
															],
														},
													})),
												},
											},
										],
									},
								},

								// Footer URL
								{
									type: 'div',
									props: {
										style: {
											color: muted,
											fontSize: '20px',
											fontWeight: 400,
											display: 'flex',
										},
										children: 'jatinthummar.github.io',
									},
								},
							],
						},
					},

					// Right section — QR code
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								width: '300px',
								borderLeft: `1px solid ${divider}`,
								backgroundColor: '#fafafa',
								gap: '20px',
							},
							children: [
								{
									type: 'img',
									props: {
										src: qrBase64,
										width: 200,
										height: 200,
										style: {
											borderRadius: '0px',
										},
									},
								},
								{
									type: 'div',
									props: {
										style: {
											color: muted,
											fontSize: '16px',
											fontWeight: 400,
											display: 'flex',
										},
										children: 'Scan to visit',
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{ name: 'Inter', data: interBold, weight: 700, style: 'normal' },
				{ name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
			],
		}
	);

	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: 1200 },
	});
	const pngData = resvg.render().asPng();

	return new Response(new Uint8Array(pngData), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
}
