/** @jsxImportSource react */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { ImageResponse } from "astro:api";

export const GET: APIRoute = async ({ params, request }) => {
  const slug = params.slug as string;

  let title = "nasubi.dev";

  // posts/ または products/ の場合、該当する記事のタイトルを取得
  if (slug.startsWith("posts/")) {
    const postId = slug.replace("posts/", "");
    try {
      const posts = await getCollection("post");
      const post = posts.find((p) => p.id === postId);
      if (post) {
        title = post.data.title;
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    }
  } else if (slug.startsWith("products/")) {
    const productSlug = slug.replace("products/", "");
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

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            fontWeight: "700",
            textAlign: "center",
            lineHeight: "1.2",
            maxWidth: "1000px",
            wordWrap: "break-word",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "400",
            marginTop: "40px",
            opacity: "0.8",
          }}
        >
          nasubi.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};

export const getStaticPaths = async () => {
  const posts = await getCollection("post");
  const products = await getCollection("products");

  const paths = [
    // その他のページ用
    { params: { slug: "index" } },
    { params: { slug: "about" } },
    // posts用
    ...posts.map((post) => ({ params: { slug: `posts/${post.id}` } })),
    // products用
    ...products.map((product) => ({
      params: { slug: `products/${product.id}` },
    })),
  ];

  return paths;
};
