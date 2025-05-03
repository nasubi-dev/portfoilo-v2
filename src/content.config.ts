import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// 共通のスキーマを定義
const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  // Transform string to Date object
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
});

const blog = defineCollection({
  // 実際のディレクトリ構造に合わせて、postsディレクトリを参照するように変更
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: postSchema,
});

const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.{md,mdx}" }),
  schema: postSchema,
});

export const collections = { blog, products };
