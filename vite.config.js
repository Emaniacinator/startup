import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";

import path from 'path';

const resolve = path.resolve

export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                jsxIndex: resolve(__dirname, 'index.jsx'),
                HomePage: resolve(__dirname, 'src/home-page/home-page.jsx'),
                LoginPage: resolve(__dirname, 'src/login-page/login-page.jsx'),
                GameCreationPage: resolve(__dirname, 'src/game-creation-page/game-creation-page.jsx'),
                GamePageTemplate: resolve(__dirname, 'src/game-page-template/game-page-template.jsx')
            },
        },
    },
    server: {
        proxy: {
            '/api': 'http://localhost:4000',
            '/ws': {
                target: 'ws://localhost:4000',
                ws: true,
            },
        },
    },
});

