// 构建后检查：node scripts/check-site.mjs（需先 npm run build）
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const ORIGIN = 'https://lingdongyun.site';
const REGISTER = 'https://varnexa.lingdongaff.com/#/?code=HHoxxHGa';
const ORG_ID = 'https://lingdongyun.site/#org';
// [卡片名称, 价格, 价格后缀, 卡片上的流量写法]
const PLANS = [
  ['灵动·拂风', 20, '/ 月起', '100GB / 月'], ['灵动·驭浪', 50, '/ 月起', '300GB / 月'],
  ['灵动·破晓', 100, '/ 月起', '700GB / 月'], ['灵动·凌霄', 180, '/ 月起', '1.5TB / 月'],
  ['灵动·穿云', 99, '/ 年', '每月 70GB'], ['灵动·闲云', 199, '/ 一次性', '150GB 总流量'],
  ['灵动·惊云', 499, '/ 一次性', '400GB 总流量'], ['灵动·飞云', 899, '/ 一次性', '800GB 总流量'],
  ['灵动云·至尊私人定制', 680, '/ 月', '500GB / 月（专线独享）'],
];
const BANNED = [/(?<![0-9.])(8|八)\s*(档|款)/, /BGP/, /VIP/, /秒级/, /7\s*[×xX*]\s*24/, /1\s*对\s*1/, /仿冒/, /最稳定|最快的/];

let errors = 0;
const fail = (m) => { errors++; console.log('  ✗ ' + m); };
const ok = (m) => console.log('  ✓ ' + m);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const toRoute = (f) => { const r = '/' + path.relative(DIST, f).replace(/\\/g, '/'); return r.endsWith('/index.html') ? r.slice(0, -10) : r; };
const fileOf = (route) => (route.endsWith('/') ? path.join(DIST, route, 'index.html') : path.join(DIST, route));
const exists = (route) => fs.existsSync(fileOf(route.split('#')[0].split('?')[0]));
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '');
const graphOf = (html) => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return m ? JSON.parse(m[1])['@graph'] || [] : [];
};

console.log(`\n[页面] 共 ${htmlFiles.length} 个 HTML 文件`);
let registerCount = 0;
for (const f of htmlFiles) {
  const route = toRoute(f);
  const raw = fs.readFileSync(f, 'utf8');
  const html = raw.replace(/ data-astro-cid-\w+/g, '');
  const is404 = route === '/404.html';
  const issues = [];
  if (!/<html lang="zh-CN"/.test(html)) issues.push('缺少 lang=zh-CN');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) issues.push(`H1 数量=${h1}`);
  if (!/<title>[^<]+<\/title>/.test(html)) issues.push('缺少 title');
  if (!/<meta name="description" content="[^"]+"/.test(html)) issues.push('缺少 description');
  if (/<meta name="keywords"/.test(html)) issues.push('不应使用 meta keywords');
  if (!/name="viewport"/.test(html)) issues.push('缺少 viewport');
  if (!/property="og:image"/.test(html)) issues.push('缺少 og:image');
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (is404) {
    if (!/name="robots" content="noindex"/.test(html)) issues.push('404 应为 noindex');
  } else {
    if (/noindex/.test(html)) issues.push('正式页面含 noindex');
    if (!canon) issues.push('缺少 canonical');
    else if (canon[1] !== ORIGIN + route) issues.push(`canonical 不匹配：${canon[1]}`);
    if (!html.includes('href="/guides/lingdongyun-official/"')) issues.push('缺少官方站点说明链接（页脚声明）');
  }
  for (const re of BANNED) if (re.test(strip(html))) issues.push(`含不允许的表述：${re}`);
  // 链接
  for (const m of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (href === REGISTER) { registerCount++; continue; }
    if (href.includes('lingdongaff.com') && href !== REGISTER) issues.push(`注册链接被修改：${href}`);
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (id && !html.includes(`id="${id}"`)) issues.push(`锚点不存在：${href}`);
      continue;
    }
    if (href.startsWith(ORIGIN)) { if (!exists(href.slice(ORIGIN.length) || '/')) issues.push(`死链：${href}`); continue; }
    if (/^https?:/.test(href)) continue;
    if (!href.startsWith('/')) { issues.push(`相对链接：${href}`); continue; }
    const [p, hash] = href.split('#');
    if (!p.endsWith('/') && !/\.[a-z]+$/.test(p)) issues.push(`缺少尾斜杠：${href}`);
    if (!exists(p)) { issues.push(`死链：${href}`); continue; }
    if (hash && p.endsWith('/') && !fs.readFileSync(fileOf(p), 'utf8').includes(`id="${hash}"`)) issues.push(`锚点不存在：${href}`);
  }
  // JSON-LD
  try {
    const graph = graphOf(raw);
    const txt = JSON.stringify(graph);
    if (/AggregateRating|aggregateRating|"Review"|SearchAction/.test(txt)) issues.push('JSON-LD 含评分 / 评论 / SearchAction');
    for (const n of graph) if (n['@type'] === 'Organization' && n['@id'] !== ORG_ID) issues.push('Organization @id 不统一');
  } catch { issues.push('JSON-LD 解析失败'); }
  issues.length ? (fail(`${route}`), issues.forEach((i) => console.log('      - ' + i))) : ok(`${route}`);
}
console.log(`  注册入口链接总数：${registerCount}（全部为完整原始链接）`);

console.log('\n[首页] 套餐、板块与官方站点区块');
const homeRaw = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const home = homeRaw.replace(/ data-astro-cid-\w+/g, '');
const cards = [...home.matchAll(/<li class="plan card[^"]*"[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
cards.length === 9 ? ok('套餐卡片 9 张') : fail(`套餐卡片数量 ${cards.length}`);
const catalog = graphOf(homeRaw).find((n) => n['@type'] === 'OfferCatalog');
const offers = catalog ? catalog.itemListElement : [];
PLANS.forEach(([name, price, bill, traffic], i) => {
  const c = cards[i] || '';
  const t = strip(c);
  const good = t.includes(name) && c.includes(`<span class="num">${price}</span>`) && t.includes(bill) && t.includes(traffic) && c.includes(`href="${REGISTER}"`);
  const o = offers[i];
  const ldGood = o && o.name.startsWith(name) && o.price === price.toFixed(2) && o.priceCurrency === 'CNY';
  good && ldGood ? ok(`${name} ¥${price} ${bill} ${traffic}`) : fail(`${name} 不一致`);
});
strip(home).includes('价格以用户中心实时显示为准') ? ok('价格说明文字存在') : fail('缺少“价格以用户中心实时显示为准”');
const order = ['id="pricing"', 'id="service"', 'id="sites"', 'id="faq"', '<footer'].map((s) => home.indexOf(s));
order.every((v, i) => v > -1 && (i === 0 || v > order[i - 1])) ? ok('板块顺序：套餐 → 服务说明 → 官方站点 → FAQ → 页脚') : fail('板块顺序错误');
home.includes('data-ldy-family') ? ok('官方站点区块（data-ldy-family）存在') : fail('缺少官方站点区块');
for (const u of ['https://lingdongyun.website/', 'https://lingdongyun.best/', 'https://lingdongyun.sbs/', 'https://lingdongyun.lol/']) {
  if (!home.includes(`href="${u}"`)) fail(`首页缺少官方站点链接 ${u}`);
}
const faqCount = (home.match(/<details class="faq-item/g) || []).length;
faqCount >= 5 ? ok(`FAQ 共 ${faqCount} 条（details/summary）`) : fail('FAQ 不足 5 条');

console.log('\n[官网资料] 正文汉字数、链接与结构化数据');
const guideRoutes = htmlFiles.map(toRoute).filter((r) => /^\/guides\/[^/]+\/$/.test(r));
for (const r of guideRoutes) {
  const html = fs.readFileSync(path.join(DIST, r, 'index.html'), 'utf8');
  const body = html.match(/<article class="prose"[^>]*>([\s\S]*?)<\/article>/)[1].replace(/<section[^>]*data-ldy-family[\s\S]*?<\/section>/, '');
  const hanzi = (strip(body).match(/[一-鿿]/g) || []).length;
  const links = new Set([...body.matchAll(/href="([^"]+)"/g)].map((m) => m[1]));
  const h2 = (body.match(/<h2/g) || []).length;
  const rel = (html.match(/<section class="related"[\s\S]*?<\/section>/) || [''])[0];
  const relCount = (rel.match(/<li/g) || []).length;
  const hasNav = html.includes('返回官网资料') && html.includes('返回首页') && html.includes('href="/#pricing"');
  const graph = graphOf(html);
  const article = graph.find((n) => n['@type'] === 'Article');
  const issues = [];
  if (hanzi < 1500 || hanzi > 2600) issues.push(`汉字数 ${hanzi}（应为 1500–2600）`);
  if (links.size < 2) issues.push('正文链接不足 2 个');
  if (h2 < 3) issues.push(`H2 数 ${h2}`);
  if (relCount < 1 || rel.includes(`href="${r}"`)) issues.push('相关阅读异常');
  if (!hasNav) issues.push('缺少返回 / 套餐入口');
  if (!graph.some((n) => n['@type'] === 'BreadcrumbList') || !html.includes('aria-label="面包屑导航"')) issues.push('缺少面包屑');
  if (!article || article.author?.['@id'] !== ORG_ID || article.publisher?.['@id'] !== ORG_ID) issues.push('Article 结构化数据异常');
  if (!html.includes('更新于')) issues.push('缺少可见的更新日期');
  issues.length ? (fail(r), issues.forEach((i) => console.log('      - ' + i))) : ok(`${r}  汉字 ${hanzi}｜正文链接 ${links.size}｜H2 ${h2}｜相关阅读 ${relCount}`);
}

console.log('\n[sitemap / robots / llms / _redirects]');
const sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const smBad = locs.filter((l) => !l.startsWith(ORIGIN + '/') || l.includes('#') || l.includes('?') || l.includes('404') || !exists(l.slice(ORIGIN.length)));
smBad.length ? fail('sitemap 异常：' + smBad.join(', ')) : ok(`sitemap.xml 共 ${locs.length} 个 URL，全部存在且为正式域名`);
const indexable = htmlFiles.map(toRoute).filter((r) => r !== '/404.html').map((r) => ORIGIN + r);
const missing = indexable.filter((u) => !locs.includes(u));
missing.length ? fail('sitemap 缺少：' + missing.join(', ')) : ok('全部可索引页面均已收录到 sitemap.xml');
const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8').trim();
robots === 'User-agent: *\nAllow: /\n\nSitemap: https://lingdongyun.site/sitemap.xml' ? ok('robots.txt 内容正确') : fail('robots.txt 内容不符');
fs.existsSync(path.join(DIST, 'llms.txt')) ? ok('llms.txt 已生成') : fail('缺少 llms.txt');
const redirects = fs.existsSync(path.join(DIST, '_redirects'))
  ? fs.readFileSync(path.join(DIST, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#'))
  : [];
redirects.length === 20 && redirects.every((l) => / 301$/.test(l.trim()))
  ? ok('_redirects：10 篇已迁出文章 × 2 种写法，全部 301')
  : fail(`_redirects 规则数 ${redirects.length}`);
for (const a of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'og-image.png', 'logo-512.png']) fs.existsSync(path.join(DIST, a)) ? ok(a) : fail('缺少 ' + a);

console.log(errors ? `\n结果：${errors} 项问题\n` : '\n结果：全部检查通过\n');
process.exit(errors ? 1 : 0);
