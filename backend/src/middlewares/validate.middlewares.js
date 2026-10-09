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
      if (req.file && req.file.path) {
        import("fs").then((fs) => {
          if (fs.existsSync(req.file.path)) {
            try {
              fs.unlinkSync(req.file.path);
            } catch (e) {}
          }
        });
      }

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
