// reflect-metadata must be imported before any decorators/entities are loaded
import 'reflect-metadata';
// Ensure env is loaded before any module that may read process.env
import './config/env.js';
import { AppDataSource } from './data-source.js';
import { app } from './app.js';


const PORT = Number(process.env.PORT) || 3000;

// Initialize DB before starting server
AppDataSource.initialize()
  .then(() => {
    console.log('✅ AppDataSource initialized');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('⛔ Failed to initialize AppDataSource', err);
    // If DB is critical, exit. If you prefer to run without DB, change policy here.
    process.exit(1);
  });
