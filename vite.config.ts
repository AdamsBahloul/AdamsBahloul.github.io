import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This is a user site/custom domain, so the deployed app is served from the domain root.
export default defineConfig({ base: '/', plugins: [react()] });
