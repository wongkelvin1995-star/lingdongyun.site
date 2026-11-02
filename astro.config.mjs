import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lingdongyun.site',
  trailingSlash: 'always',
  // CSS 直接写进页面，少一次阻塞渲染的请求（跨境访问时每次往返都慢）
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
});
