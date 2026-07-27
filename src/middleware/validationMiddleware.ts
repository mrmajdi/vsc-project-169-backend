// @vsc repo:vsc-project-169-backend file:src/middleware/validationMiddleware.ts task:b16-src-middleware-validationmiddleware-ts module:backend session:169
import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware factory that validates request data using a Zod schema.
 *
 * @param schema - Zod schema to validate against.
 * @param source - Part of request to validate: 'body', 'query', or 'params'. Defaults to 'body'.
 * @returns Express middleware function.
 */
export function validate(
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    const result = schema.safeParse(data);

    if (result.success) {
      // Attach validated (and possibly coerced) data back to the request object.
      req[source] = result.data;
      return next();
    }

    const error = new Error('Validation failed');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).status = 400;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).errors = result.error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    return next(error);
  };
}
