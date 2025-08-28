import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            'react-native': 'react-native-web',
        },
    },

    test: {
        environment: 'jsdom',
        setupFiles: ['vite.setup.ts'],
    },
});
