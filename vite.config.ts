import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Keep the dev and production pipelines aligned; Vite handles SCSS through Sass.
export default defineConfig({ base: './', plugins: [react()] });
