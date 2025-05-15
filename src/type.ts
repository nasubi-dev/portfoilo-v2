type CommonData = {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string | null;
  tags: string[] | null;
  createdAt: Date;
  updatedAt: Date;
};

type Product = CommonData & {
  thumbnail: string | null;
};

type Post = CommonData & {
  icon: string | null;
};

type Heading = {
  depth: number;
  text: string;
  slug: string;
};

export type { CommonData, Product, Post, Heading };
