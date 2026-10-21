# 灵动云官网（lingdongyun.site）

Astro 5 + TypeScript + 原生 CSS 构建的纯静态网站。首页、文章列表与文章正文都直接输出在 HTML 中，不依赖浏览器端 JavaScript 渲染（JS 仅用于手机菜单与套餐筛选）。

## 本地运行

需要 Node.js 18.20+ / 20.3+ / 22+。

```bash
npm install        # 安装依赖
npm run dev        # 本地开发：http://localhost:4321
npm run build      # 构建静态文件到 dist/
npm run preview    # 预览构建结果
npm run check:site # 构建后自动检查（链接、canonical、套餐、字数、sitemap 等）
```

## 目录结构

```
src/
  data/site.ts            品牌信息、注册链接、8 档套餐、FAQ（全站唯一数据源）
  content/guides/*.md     8 篇文章正文（Markdown）
  content.config.ts       文章字段定义
  layouts/Base.astro      公共 <head>、SEO 标签、页头页脚
  components/             Header / Footer / HeroArt（原创 SVG 插画）/ Logo / Icon / Breadcrumb
  pages/
    index.astro           首页
    guides/index.astro    文章列表 /guides/
    guides/[slug].astro   文章页 /guides/<slug>/
    sitemap/index.astro   HTML 网站地图 /sitemap/
    sitemap.xml.ts        XML 网站地图（lastmod 取内容真实日期）
    llms.txt.ts           内容导航 /llms.txt
    404.astro             404 页面（noindex）
public/                   favicon、分享图 og-image.png、robots.txt
scripts/check-site.mjs    构建后检查脚本
dist/                     构建产物（直接部署这个目录）
```

## 修改内容

- **套餐 / 注册链接 / FAQ**：只改 `src/data/site.ts`，首页、结构化数据和 llms.txt 会同步更新。
- **文章**：编辑 `src/content/guides/*.md`。实质修改后同步更新 frontmatter 的 `updated` 日期（会写入页面和 sitemap 的 lastmod）。
- **站点更新日期**：修改首页内容后，同步更新 `src/data/site.ts` 中的 `updated`。

## 部署到 lingdongyun.site

构建命令 `npm run build`，输出目录 `dist`。任选一种：

### 方式 A：Cloudflare Pages / Netlify / Vercel（推荐）

1. 把本项目推送到 GitHub / GitLab 仓库（`node_modules`、`dist` 不需要提交）。
2. 在平台新建项目并连接仓库：
   - Framework preset：Astro
   - Build command：`npm run build`
   - Output directory：`dist`
   - Node 版本：20 或 22
3. 在平台的“自定义域名”中添加 `lingdongyun.site`（可再加 `www.lingdongyun.site` 并设置 301 跳转到不带 www 的正式域名）。
4. 按平台给出的记录到域名注册商处修改 DNS（CNAME 或 A 记录）。DNS 修改需要你本人操作。
5. 平台会自动签发 HTTPS 证书。确认 `http://` 自动跳转到 `https://`。

这几个平台会自动把 `dist/404.html` 作为不存在路径的页面，并返回 404 状态码。

### 方式 B：自有服务器（Nginx）

把 `dist/` 内的全部文件上传到服务器，例如 `/var/www/lingdongyun.site`，Nginx 配置示例：

```nginx
server {
  listen 80;
  server_name lingdongyun.site www.lingdongyun.site;
  return 301 https://lingdongyun.site$request_uri;
}
server {
  listen 443 ssl http2;
  server_name www.lingdongyun.site;
  # ssl_certificate ... ;
  return 301 https://lingdongyun.site$request_uri;
}
server {
  listen 443 ssl http2;
  server_name lingdongyun.site;
  # ssl_certificate     /etc/letsencrypt/live/lingdongyun.site/fullchain.pem;
  # ssl_certificate_key /etc/letsencrypt/live/lingdongyun.site/privkey.pem;
  root /var/www/lingdongyun.site;
  index index.html;

  # 无尾斜杠的目录统一 301 到带尾斜杠的地址
  location / {
    try_files $uri $uri/ =404;
  }
  error_page 404 /404.html;   # 不存在的路径返回 404，而不是首页 + 200

  location ~* \.(css|js|png|svg|jpg|webp|woff2)$ {
    expires 30d;
    add_header Cache-Control "public";
  }
}
```

HTTPS 证书可用 Let's Encrypt（certbot）免费签发。

### 上线后检查

- 访问 `https://lingdongyun.site/`、`/guides/`、任意文章页正常打开；
- 访问一个不存在的地址（如 `/abc/`）返回 404 页面且状态码为 404；
- `https://lingdongyun.site/robots.txt`、`/sitemap.xml` 可访问；
- 可在 Google Search Console、Bing Webmaster Tools、百度搜索资源平台验证站点后提交 sitemap.xml（是否收录与排名由搜索引擎决定）。
