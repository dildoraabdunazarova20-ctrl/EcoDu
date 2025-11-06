import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        video: 'video.html',
        profile: 'profile.html',
        login: 'login.html',
        register: 'register.html',
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
