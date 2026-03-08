import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/qamatic';

  mongoose.connection.on('connected', () => {
    console.log('[QAmatic] MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[QAmatic] MongoDB error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('[QAmatic] MongoDB disconnected');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('[QAmatic] MongoDB connection closed (app termination)');
    process.exit(0);
  });

  await mongoose.connect(uri);
};
