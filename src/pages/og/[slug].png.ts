import type { GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { fetchPosts, formatDate } from '../../utils/blog';

const fontRes = await fetch(
	'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf'
);
const interBold = await fontRes.arrayBuffer();

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
			publishDate: post.publishDate,
		},
	}));
};

interface Props {
	title: string;
	publishDate: Date;
}

export async function GET({ props }: { props: Props }) {
	const { title, publishDate } = props;

	const dateStr = formatDate(publishDate);

	// Light theme tokens
	const surface = '#fafafa';
	const onSurface = '#1a1a1a';
	const muted = '#71717a';
	const border = '#e4e4e7';
	const accent = '#2563eb';

	// Large typographic first letter — bold brand element
	const firstLetter = title.charAt(0).toLowerCase();

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					backgroundColor: surface,
					position: 'relative',
				},
				children: [
					// Large letter (right side, positioned on root)
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								right: '60px',
								top: 0,
								bottom: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: onSurface,
								fontSize: '480px',
								fontWeight: 700,
								lineHeight: 1,
								letterSpacing: '-0.05em',
								opacity: 0.08,
							},
							children: firstLetter,
						},
					},

					// Left accent strip
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								width: '20px',
								height: '100%',
								backgroundColor: accent,
							},
						},
					},

					// Main content
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								flex: 1,
								padding: '48px 56px',
								position: 'relative',
							},
							children: [
								// Top: BLOG label + date
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
														color: accent,
														fontSize: '20px',
														fontWeight: 700,
														letterSpacing: '0.08em',
														display: 'flex',
													},
													children: 'BLOG',
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
													},
													children: `—  ${dateStr}`,
												},
											},
										],
									},
								},

								// Title — hero
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											flex: 1,
											alignItems: 'center',
											position: 'relative',
											maxWidth: '660px',
										},
										children: [
											{
												type: 'div',
												props: {
													style: {
														color: onSurface,
														fontSize: title.length > 50 ? 44 : title.length > 30 ? 54 : 64,
														fontWeight: 700,
														lineHeight: 1.15,
														letterSpacing: '-0.03em',
													},
													children: title,
												},
											},
										],
									},
								},

								// Bottom: name + URL
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											paddingTop: '18px',
											borderTop: `1px solid ${border}`,
											position: 'relative',
										},
										children: [
											{
												type: 'div',
												props: {
													style: {
														color: onSurface,
														fontSize: '24px',
														fontWeight: 700,
														display: 'flex',
														letterSpacing: '-0.01em',
													},
													children: 'Jatin Thummar',
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
													},
													children: 'jatinthummar.github.io',
												},
											},
										],
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
