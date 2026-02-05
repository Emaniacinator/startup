import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import path from 'path';
const resolve = path.resolve

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login_page: resolve(__dirname, 'login-page.html'),
                game_creation_page: (__dirname, 'game-creation-page.html'),
                game_page_template: (__dirname, 'game-page-template.html')
            },
        },
    },
});

