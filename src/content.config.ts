import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

//Dateは2025-05-10T06:57+09:00のような形式で保存される

// 共通のスキーマを定義
const postSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9-]{21}$/), // 21桁のランダムな文字列
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/), // 小文字英数字とハイフンのみ
  author: z.string(),
  description: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  createdAt: z.string().transform((date) => new Date(date)),
  updatedAt: z.string().transform((date) => new Date(date)),
});

const post = defineCollection({
  // 実際のディレクトリ構造に合わせて、postsディレクトリを参照するように変更
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: postSchema.extend({
    icon: z.string().nullable().optional(),
  }),
});

const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.{md,mdx}" }),
  schema: postSchema.extend({
    thumbnail: z.string().nullable().optional(),
  }),
});

export const collections = { post, products };
