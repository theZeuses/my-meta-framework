import { isEmptyObject } from '@core/application/utils/object.utils';
import { z } from 'zod';

export const getReportQuerySchema = z
  .object({
    limit: z.string().optional(),
    skip: z.string().optional()
  })
  .strict()
  .transform((arg, ctx) => {
    if(isEmptyObject(arg)) return undefined;

    const limit = parseInt(arg?.limit || "NaN");
    const skip = parseInt(arg?.skip || "NaN");

    if (isNaN(limit) || isNaN(skip)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid Query Param",
        });
        return z.NEVER;
    }
    return {
        limit,
        skip
    };
  });

export type GetReportQueryDto = z.infer<typeof getReportQuerySchema>;