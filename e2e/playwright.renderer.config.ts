import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './',
    testMatch: ['renderer.test.ts'],
    webServer: {
        command: 'pnpm dev --host 127.0.0.1 --port 4173',
        port: 4173,
        reuseExistingServer: true,
        timeout: 120000
    },
    use: {
        baseURL: 'http://127.0.0.1:4173'
    }
});
