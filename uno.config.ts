import { defineConfig } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import extractorSvelte from '@unocss/extractor-svelte';

export default defineConfig({
    presets: [
        presetIcons({
            scale: 1.2,
            warn: true
        })
    ],
    extractors: [extractorSvelte()]
});
