import { defineConfig, bindings } from 'cf/config';
export default defineConfig({
  accountId: 'f8069b313659acb3cca98c6f80da161e',
  worker: {
    name: 'banque-mondiale-cinema',
    entrypoint: './worker.mjs',
    compatibilityDate: '2026-11-14',
    workersDev: true,
    assets: { htmlHandling: 'force-trailing-slash', notFoundHandling: '404-page' },
    env: { ASSETS: bindings.assets() },
  },
});
