import type { GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { fetchPosts } from '../../utils/blog';

// Fetch Inter Bold at build time (runs once, cached across all slugs)
const fontRes = await fetch(
	'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf'
);
const interBold = await fontRes.arrayBuffer();

// Also fetch regular weight for tags/meta
const fontResRegular = await fetch(
	'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf'
);
const interRegular = await fontResRegular.arrayBuffer();

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await fetchPosts();
	return posts.map((post) => ({
		params: { slug: post.slug },
		props: {
			title: post.title,
			tags: post.tags,
		},
	}));
};

interface Props {
	title: string;
	tags: string[];
}

export async function GET({ props }: { props: Props }) {
	const { title, tags } = props;

	// Dots pattern background
	const dots: any[] = [];
	for (let row = 0; row < 16; row++) {
		for (let col = 0; col < 30; col++) {
			dots.push({
				type: 'div',
				props: {
					style: {
						position: 'absolute',
						top: row * 40 + 20,
						left: col * 40 + 20,
						width: 3,
						height: 3,
						borderRadius: '50%',
						backgroundColor: 'rgba(161, 161, 170, 0.12)',
					},
				},
			});
		}
	}

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '60px',
					backgroundColor: '#161618',
					position: 'relative',
					overflow: 'hidden',
				},
				children: [
					// Dots pattern
					{
						type: 'div',
						props: {
							style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexWrap: 'wrap' as const },
							children: dots,
						},
					},
					// Top: branding
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								gap: '12px',
								position: 'relative',
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											width: 36,
											height: 36,
											borderRadius: '8px',
											backgroundColor: '#efefef',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#161618',
											fontSize: '18px',
											fontWeight: 700,
										},
										children: 'JT',
									},
								},
								{
									type: 'div',
									props: {
										style: {
											color: '#a1a1aa',
											fontSize: '18px',
											fontWeight: 400,
										},
										children: 'jatinthummar.github.io',
									},
								},
							],
						},
					},
					// Center: title
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								position: 'relative',
								flex: 1,
								justifyContent: 'center',
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											color: '#ffffff',
											fontSize: title.length > 40 ? 44 : 52,
											fontWeight: 700,
											lineHeight: 1.2,
											letterSpacing: '-0.02em',
										},
										children: title,
									},
								},
							],
						},
					},
					// Bottom: tags
					tags.length > 0
						? {
								type: 'div',
								props: {
									style: {
										display: 'flex',
										gap: '12px',
										flexWrap: 'wrap' as const,
										position: 'relative',
									},
									children: tags.map((tag) => ({
										type: 'div',
										props: {
											style: {
												color: '#a1a1aa',
												fontSize: '16px',
												fontWeight: 400,
												backgroundColor: 'rgba(39, 39, 42, 0.8)',
												padding: '6px 14px',
												borderRadius: '20px',
											},
											children: `#${tag}`,
										},
									})),
								},
							}
						: {
								type: 'div',
								props: { style: { display: 'flex' }, children: [] },
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
	const png = resvg.render().asPng();

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
}
