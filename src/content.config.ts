import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

//Dateは2025-05-10T06:57+09:00の形式で保存されている

// 共通のスキーマを定義
const commonSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9-]{21}$/), // 21桁のランダムな文字列
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/), // 小文字英数字とハイフンのみ
  author: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  createdAt: z.string().transform((date) => new Date(date)),
  updatedAt: z.string().transform((date) => new Date(date)),
});

const post = defineCollection({
  // 実際のディレクトリ構造に合わせて、postsディレクトリを参照するように変更
  loader: glob({ base: "./src/content/posts", pattern: "**/*.md" }),
  schema: commonSchema.extend({
    icon: z.string().nullable(),
  }),
});

const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.md" }),
  schema: commonSchema.extend({
    thumbnail: z.string().nullable(),
    carousel: z.array(z.string()).nullable(),
  }),
});

// プロフィール関連のマークダウンファイル用のコレクション
const profiles = defineCollection({
  loader: glob({ base: "./src/content/about", pattern: "**/*.md" }),
});

export const collections = { post, products, profiles };
