import { IValidateBody } from '@core/application/interface';
import { Exception } from '@core/consts';
import { BadRequestException } from '@core/exceptions';
import { ZodEffects, ZodObject } from 'zod';

export class ZodValidationPipe implements IValidateBody {
  constructor(private schema: ZodEffects<any> | ZodObject<any>) {}

  transform(value: Record<string, any>) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      const errors = error.issues.map(err => ({
        path: err.path,
        message: err.message
      }));

      //throw a formatted error to be picked up by global exception handler
      throw new BadRequestException(Exception.BadRequestException.VALIDATION_FAILED, {
        errors
      });
    }
  }
}
