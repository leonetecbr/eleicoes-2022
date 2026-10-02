import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import { cloudflare } from "@cloudflare/vite-plugin";
import react, { reactCompilerPreset } from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        cloudflare(),
    ],
    server: {
        open: true,
    },
});