import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    excerpt: z.string(),
    category: z.string(),
    keywords: z.array(z.string()),
    order: z.number(),
    published: z.string(),
    updated: z.string(),
    related: z.array(z.string()),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })),
  }),
});

export const collections = { guides };
