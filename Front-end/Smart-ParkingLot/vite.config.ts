import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Smart Parking Lot',
        short_name: 'ParkingLot',
        description: 'A smart parking lot application.',
        theme_color: '#6B46C1',
        icons: [
          {
            src: '/favicon_win.ico',
            sizes: '128x128',
            type: 'image/x-icon'
          },
          {
            src: '/favicon_mac.icns',
            sizes: '128x128',
            type: 'image/x-icns'
          }
        ]
      }
    })
  ]
});