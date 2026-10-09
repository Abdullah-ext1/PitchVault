import { z } from "zod";
import ApiError from "../utils/apiErrorHandler.js";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const parsed = schema.parse(data);
      
      if (source === "body") {
        req.body = parsed;
      } else if (source === "params") {
        req.params = { ...req.params, ...parsed };
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new ApiError(422, "Validation failed", errors);
      }
      throw error;
    }
  };
};
