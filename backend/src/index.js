import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`[QAmatic] Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[QAmatic] Failed to start server:', error);
    process.exit(1);
  }
};

start();
