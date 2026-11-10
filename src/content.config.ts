import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({
    /** 页面 H1 */
    title: z.string(),
    /** 面包屑与卡片使用的短标题 */
    short: z.string(),
    /** <title> */
    seoTitle: z.string(),
    description: z.string(),
    excerpt: z.string(),
    category: z.string(),
    order: z.number(),
    published: z.string(),
    updated: z.string(),
    /** 正文前的首段（先给答案） */
    lead: z.string().optional(),
    /** 在首段之后插入 9 档套餐价格表（数据来自 src/data/site.ts） */
    planTable: z.boolean().default(false),
    /** 站内相关文章（slug） */
    related: z.array(z.string()).default([]),
    /** 站外延伸阅读（本站不使用；不要填写灵动云其他域名） */
    more: z.array(z.object({ label: z.string(), title: z.string(), url: z.string().url(), note: z.string() })).default([]),
    /** 页面上可见的问答，同时生成 FAQPage */
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { guides };
