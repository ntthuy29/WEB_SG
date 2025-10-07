
import 'reflect-metadata';

import './config/env.js';
import { AppDataSource } from './data-source.js';
import { app } from './app.js';


const PORT = Number(process.env.PORT) || 3000;


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

    process.exit(1);
  });
