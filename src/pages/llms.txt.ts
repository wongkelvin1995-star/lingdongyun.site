import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { COMMON_FACTS, OFFICIAL_SITES, PLANS, PLAN_NOTE, SITE, planFullName, cycleText } from '../data/site';

// 内容导航文件，便于阅读工具快速了解站点结构；它不是任何搜索或 AI 收录的必要条件。
export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides')).sort((a, b) => a.data.order - b.data.order);
  const text = `# ${SITE.name}

> ${SITE.description}

- 品牌：${SITE.brand}（${SITE.aliases.join(' / ')}）
- 官网：${SITE.url}/
- 注册与用户中心：${SITE.registerUrl}
- 内容更新日期：${SITE.updated}

## 灵动云官方站点

${OFFICIAL_SITES.map((s) => `- [${s.name}](${s.url})：${s.desc}`).join('\n')}

只有 lingdongyun.site 是官网；完整清单与辨认方法见官方站点说明：${SITE.url}${SITE.officialPath}

## 9 档套餐（人民币）

${PLANS.map((p) => `- ${planFullName(p)}：${p.type}，${p.cycles ? cycleText(p) : p.priceText}，${(p.trafficFull ?? p.traffic).replace(/ \/ /g, '/')}，${p.validity}`).join('\n')}

说明：${PLAN_NOTE}

## 所有套餐的共同规则

${COMMON_FACTS.map((f) => `- ${f.label}：${f.value}`).join('\n')}

## 本站页面

- [首页](${SITE.url}/)
- [官网资料](${SITE.url}/guides/)
${guides.map((g) => `- [${g.data.title}](${SITE.url}/guides/${g.id}/)：${g.data.excerpt}`).join('\n')}
- [网站地图](${SITE.url}/sitemap/)
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
