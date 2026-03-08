export const errorHandler = (err, req, res, next) => {
  console.error('[QAmatic] Error:', err.message);

  const status = err.status || 500;
  const message = err.status ? err.message : 'Internal server error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
