import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
      ],
      build: {
        chunkSizeWarningLimit: 900,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) return;
              if (id.includes('@google/genai')) return 'vendor-ai';
              if (id.includes('maplibre-gl')) return 'vendor-map';
              if (id.includes('framer-motion') || id.includes('lucide-react')) return 'vendor-ui';
              if (id.includes('@tanstack/react-router')) return 'vendor-router';
              return 'vendor';
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
