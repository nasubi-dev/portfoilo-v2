import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ params, request }) => {
  const slug = params.slug as string;

  let title = "nasubi.dev";

  // posts- または products- の場合、該当する記事のタイトルを取得
  if (slug.startsWith("posts-")) {
    const postId = slug.replace("posts-", "");
    try {
      const posts = await getCollection("post");
      const post = posts.find((p) => p.id === postId);
      if (post) {
        title = post.data.title;
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    }
  } else if (slug.startsWith("products-")) {
    const productSlug = slug.replace("products-", "");
    try {
      const products = await getCollection("products");
      const product = products.find((p) => p.id === productSlug);
      if (product) {
        title = product.data.title;
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  }

  // タイトルをエスケープ
  const escapedTitle = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // SVGでOGP画像を生成
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <text x="600" y="280" font-family="system-ui, sans-serif" font-size="48" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">
      ${escapedTitle}
    </text>
    <text x="600" y="380" font-family="system-ui, sans-serif" font-size="24" font-weight="400" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.8">
      nasubi.dev
    </text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export const getStaticPaths = async () => {
  const posts = await getCollection("post");
  const products = await getCollection("products");

  const paths = [
    // その他のページ用
    { params: { slug: "index" } },
    { params: { slug: "about" } },
    // posts用
    ...posts.map((post) => ({ params: { slug: `posts-${post.id}` } })),
    // products用
    ...products.map((product) => ({
      params: { slug: `products-${product.id}` },
    })),
  ];

  return paths;
};
