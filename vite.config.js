import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";

import path from 'path';
import { GameCreationPage } from './src/game-creation-page/game-creation-page';
import { GamePageTemplate } from './src/game-page-template/game-page-template';
import { HomePage } from './src/home-page/home-page';
import { LoginPage } from './src/login-page/login-page';
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
});

