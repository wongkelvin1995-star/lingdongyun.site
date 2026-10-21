import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lingdongyun.site',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
});
