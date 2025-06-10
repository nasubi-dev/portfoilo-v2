import type { APIContext } from "astro";
import { getCollection } from "astro:content";

// ビルド時に静的にファイルを生成するため、prerenderを有効にする
export const prerender = true;

// 静的パスを生成する
export async function getStaticPaths() {
  const paths: Array<{ params: { path: string }; props: { body: string } }> =
    [];

  // postsコレクションからパスを生成
  const postEntries = await getCollection("post");
  for (const entry of postEntries) {
    paths.push({
      params: { path: `posts/${entry.data.slug}` },
      props: { body: entry.body || "" },
    });
  }

  // productsコレクションからパスを生成
  const productEntries = await getCollection("products");
  for (const entry of productEntries) {
    paths.push({
      params: { path: `products/${entry.data.slug}` },
      props: { body: entry.body || "" },
    });
  }

  return paths;
}

// GETリクエストを処理する
export function GET({ props }: APIContext<{ body: string }>) {
  // getStaticPathsのpropsから記事の本文を受け取る
  const body = props.body;

  // Responseオブジェクトで本文を返す
  return new Response(body, {
    status: 200,
    headers: {
      // Content-Typeをプレーンテキストに設定
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
