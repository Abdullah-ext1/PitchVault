export const notFoundHandler = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
};
