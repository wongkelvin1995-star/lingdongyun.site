import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { PLANS, PLAN_NOTE, SITE } from '../data/site';

// 内容导航文件，便于阅读工具快速了解站点结构；它不是任何搜索或 AI 收录的必要条件。
export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides')).sort((a, b) => a.data.order - b.data.order);
  const text = `# ${SITE.name}

> ${SITE.description}

- 品牌：${SITE.brand}（${SITE.brandEn}）
- 常见叫法：${SITE.aliases.join('、')}
- 官方域名：${SITE.url}/
- 注册与账户平台：${SITE.registerUrl}
- 内容更新日期：${SITE.updated}

## 套餐（人民币）

${PLANS.map((p) => `- ${p.name}：¥${p.price} ${p.billing}，${p.traffic}（${p.categoryLabel}）`).join('\n')}

说明：${PLAN_NOTE}

## 使用指南

${guides.map((g) => `- [${g.data.title}](${SITE.url}/guides/${g.id}/)：${g.data.excerpt}`).join('\n')}

## 其他页面

- [首页](${SITE.url}/)
- [使用指南列表](${SITE.url}/guides/)
- [网站地图](${SITE.url}/sitemap/)
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
