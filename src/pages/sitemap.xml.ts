import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';

// lastmod 使用内容的真实发布/更新日期，而非构建时间
export const GET: APIRoute = async () => {
  const guides = (await getCollection('guides')).sort((a, b) => a.data.order - b.data.order);
  const latest = guides.reduce((m, g) => (g.data.updated > m ? g.data.updated : m), SITE.updated);
  const urls: { loc: string; lastmod: string }[] = [
    { loc: `${SITE.url}/`, lastmod: SITE.updated },
    { loc: `${SITE.url}/guides/`, lastmod: latest },
    ...guides.map((g) => ({ loc: `${SITE.url}/guides/${g.id}/`, lastmod: g.data.updated })),
    { loc: `${SITE.url}/sitemap/`, lastmod: latest },
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
