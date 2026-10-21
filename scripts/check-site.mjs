// 构建后检查：node scripts/check-site.mjs（需先 npm run build）
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const ORIGIN = 'https://lingdongyun.site';
const REGISTER = 'https://varnexa.lingdongaff.com/#/?code=HHoxxHGa';
const FRIENDS = [
  '<a href="https://jichangreview.net/" target="_blank" rel="noopener">机场测评</a>',
  '<a href="https://jichangguide.net/" target="_blank" rel="noopener">机场教程</a>',
];
const PLANS = [
  ['灵动·拂风', 20, '/ 月起', '100GB / 月'], ['灵动·驭浪', 50, '/ 月起', '300GB / 月'],
  ['灵动·破晓', 100, '/ 月起', '700GB / 月'], ['灵动·凌霄', 180, '/ 月起', '1.5TB / 月'],
  ['灵动·穿云', 99, '/ 年', '70GB / 月'], ['灵动·闲云', 199, '/ 一次性', '150GB 总流量'],
  ['灵动·惊云', 499, '/ 一次性', '400GB 总流量'], ['灵动·飞云', 899, '/ 一次性', '800GB 总流量'],
];

let errors = 0;
const fail = (m) => { errors++; console.log('  ✗ ' + m); };
const ok = (m) => console.log('  ✓ ' + m);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const toRoute = (f) => { const r = '/' + path.relative(DIST, f).replace(/\\/g, '/'); return r.endsWith('/index.html') ? r.slice(0, -10) : r; };
const exists = (route) => {
  const p = route.split('#')[0].split('?')[0];
  if (p.endsWith('/')) return fs.existsSync(path.join(DIST, p, 'index.html'));
  return fs.existsSync(path.join(DIST, p));
};
const strip = (s) => s.replace(/<[^>]+>/g, '');

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
  if (!/name="viewport"/.test(html)) issues.push('缺少 viewport');
  if (!/property="og:image"/.test(html)) issues.push('缺少 og:image');
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (is404) {
    if (!/name="robots" content="noindex"/.test(html)) issues.push('404 应为 noindex');
  } else {
    if (/noindex/.test(html)) issues.push('正式页面含 noindex');
    if (!canon) issues.push('缺少 canonical');
    else if (canon[1] !== ORIGIN + route) issues.push(`canonical 不匹配：${canon[1]}`);
  }
  // 站内链接
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
    if (!href.split('#')[0].endsWith('/') && !/\.[a-z]+$/.test(href.split('#')[0])) issues.push(`缺少尾斜杠：${href}`);
    if (!exists(href)) issues.push(`死链：${href}`);
    if (href.includes('#') && href.startsWith('/#')) {
      const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
      if (!home.includes(`id="${href.slice(2)}"`)) issues.push(`首页锚点不存在：${href}`);
    }
  }
  // 友情链接
  if (/jichang(review|guide)\.net/.test(html)) issues.push('仍包含已删除的友情链接');
  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); if (/AggregateRating|"Review"/.test(m[1])) issues.push('JSON-LD 含评分/评论'); void j; } catch { issues.push('JSON-LD 解析失败'); }
  }
  issues.length ? (fail(`${route}`), issues.forEach((i) => console.log('      - ' + i))) : ok(`${route}`);
}
console.log(`  注册入口链接总数：${registerCount}（全部为完整原始链接）`);

console.log('\n[套餐] 首页可见数据与 JSON-LD Offer 核对');
const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8').replace(/ data-astro-cid-\w+/g, '');
const cards = [...home.matchAll(/<li class="plan card[^"]*"[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
if (cards.length !== 8) fail(`套餐卡片数量 ${cards.length}`);
const ld = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const offers = ld['@graph'][0].hasOfferCatalog.itemListElement;
PLANS.forEach(([name, price, bill, traffic], i) => {
  const c = cards[i] || '';
  const t = strip(c);
  const good = t.includes(name) && c.includes(`<span class="num">${price}</span>`) && t.includes(bill) && t.includes(traffic) && c.includes(`href="${REGISTER}"`);
  const o = offers[i];
  const ldGood = o && o.name === name && o.price === price.toFixed(2) && o.priceCurrency === 'CNY';
  good && ldGood ? ok(`${name} ¥${price} ${bill} ${traffic}`) : fail(`${name} 不一致`);
});
if (!strip(home).includes('套餐信息以注册后台实际展示为准。年付套餐为每月 70GB；一次性流量包为总流量。')) fail('缺少套餐说明'); else ok('套餐说明文字存在');
const order = ['id="guides"', 'id="scenarios"', 'id="faq"', '<footer'].map((s) => home.indexOf(s));
order.every((v, i) => i === 0 || v > order[i - 1]) ? ok('板块顺序：文章 → 适用场景 → FAQ → 页脚') : fail('板块顺序错误');
const faqCount = (home.match(/<details class="faq-item/g) || []).length;
faqCount >= 7 ? ok(`FAQ 共 ${faqCount} 条（details/summary）`) : fail('FAQ 不足 7 条');

console.log('\n[文章] 正文汉字数、内链与相关阅读');
const guideRoutes = htmlFiles.map(toRoute).filter((r) => /^\/guides\/[^/]+\/$/.test(r));
for (const r of guideRoutes) {
  const html = fs.readFileSync(path.join(DIST, r, 'index.html'), 'utf8');
  const body = html.match(/<article class="prose"[^>]*>([\s\S]*?)<\/article>/)[1];
  const hanzi = (strip(body).match(/[一-鿿]/g) || []).length;
  const inlinks = [...body.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]).filter((h) => h.startsWith('/guides/') && h !== r);
  const h2 = (body.match(/<h2/g) || []).length;
  const rel = (html.match(/<section class="related"[\s\S]*?<\/section>/) || [''])[0];
  const relCount = (rel.match(/<li/g) || []).length;
  const hasNav = html.includes('返回文章列表') && html.includes('返回首页') && html.includes('href="/#pricing"');
  const crumbs = html.includes('"BreadcrumbList"') && html.includes('aria-label="面包屑导航"');
  const posting = html.includes('"BlogPosting"');
  const issues = [];
  if (hanzi < 800 || hanzi > 1500) issues.push(`汉字数 ${hanzi}`);
  if (new Set(inlinks).size < 2) issues.push('正文内链不足 2 个');
  if (h2 < 5 || h2 > 7) issues.push(`H2 数 ${h2}`);
  if (relCount !== 3 || rel.includes(`href="${r}"`)) issues.push('相关阅读异常');
  if (!hasNav) issues.push('缺少返回/套餐入口');
  if (!crumbs || !posting) issues.push('缺少面包屑或 BlogPosting');
  issues.length ? (fail(r), issues.forEach((i) => console.log('      - ' + i))) : ok(`${r}  汉字 ${hanzi}｜正文内链 ${new Set(inlinks).size}｜H2 ${h2}｜相关阅读 ${relCount}`);
}

console.log('\n[sitemap / robots / llms]');
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
for (const a of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'og-image.png', 'logo-512.png']) fs.existsSync(path.join(DIST, a)) ? ok(a) : fail('缺少 ' + a);

console.log(errors ? `\n结果：${errors} 项问题\n` : '\n结果：全部检查通过\n');
process.exit(errors ? 1 : 0);
