import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 Marketplace Server Started                             ║
╠════════════════════════════════════════════════════════════╣
║  Environment: ${config.nodeEnv.padEnd(42)}║
║  Port:        ${String(config.port).padEnd(42)}║
║  Frontend:    ${config.frontendUrl.padEnd(42)}║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
