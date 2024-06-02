import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import os from 'os';

// Set API base URL based on OS type ( Use the IP adress of the EC2 Instance or localhost)
const apiBaseUrl = os.type() === 'Linux' ? 'https://api.smartparkinglot.online' : 'http://localhost:8081';
const REACT_APP_GOOGLE_MAPS_API_KEY = 'AIzaSyC0c45KPuqZ2kVQcNWU89SLAj0m7DhKQ-A';

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
  ],
  define: {
    'process.env.API_BASE_URL': JSON.stringify(apiBaseUrl),
    'process.env.REACT_APP_GOOGLE_MAPS_API_KEY': JSON.stringify(REACT_APP_GOOGLE_MAPS_API_KEY),
  }
});