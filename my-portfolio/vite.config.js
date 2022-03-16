// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portfolio: resolve(__dirname, 'nested', 'portfolio.html'),
        contact: resolve(__dirname, 'nested', 'contact.html')
      }
    }
  }
})