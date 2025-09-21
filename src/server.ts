import { app } from './app.js';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`📚 API docs: http://localhost:${env.PORT}/api-docs`);
});
