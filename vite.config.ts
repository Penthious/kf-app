import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tsconfigPaths(),
    ],
    test: {
        // put your Vitest options here if needed
        // environment: 'node',
        // globals: true,
    },
});
