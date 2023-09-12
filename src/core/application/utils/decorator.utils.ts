import 'reflect-metadata';
import { HttpMethod, HandlerParamType, PARAMS_META_KEY, HTTP_METHOD_KEY, PATH_KEY, HTTP_STATUS_CODE_KEY, GUARD_KEY, VALIDATE_BODY_KEY, VALIDATE_QUERY_KEY } from "@core/application/constants";
import { IGuard, IValidateBody, IValidateQuery } from '../interface';

export function getRouteDecorator(httpMethod: valueof<typeof HttpMethod>, path: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata(HTTP_METHOD_KEY, httpMethod, target, key);
      Reflect.defineMetadata(PATH_KEY, path, target, key);
    }
}

export function getStatusCodeDecorator(code: number) {
  return function (target: any, key: string) {
    Reflect.defineMetadata(HTTP_STATUS_CODE_KEY, code, target, key);
  }
}

export function getHandlerParamDecorator(type: valueof<typeof HandlerParamType>, key?: string) {
    return function (target: any, methodName: string, index: number) {
      const paramsMeta = Reflect.getMetadata(PARAMS_META_KEY, target, methodName) ?? {};
      paramsMeta[index] = { key, type };
      Reflect.defineMetadata(PARAMS_META_KEY, paramsMeta, target, methodName);
    };
}

export function getGuardDecorator(guards: Newable<IGuard>[]) {
  return function (target: any, key: string) {
    const guardsMeta = Reflect.getMetadata(GUARD_KEY, target, key) ?? [];
    guardsMeta.push(guards);
    Reflect.defineMetadata(GUARD_KEY, guardsMeta, target, key);
  }
}

export function getValidateBodyDecorator(validationPipe: IValidateBody) {
  return function (target: any, key: string) {
    Reflect.defineMetadata(VALIDATE_BODY_KEY, validationPipe, target, key);
  }
}

export function getValidateQueryDecorator(validationPipe: IValidateQuery) {
  return function (target: any, key: string) {
    Reflect.defineMetadata(VALIDATE_QUERY_KEY, validationPipe, target, key);
  }
}