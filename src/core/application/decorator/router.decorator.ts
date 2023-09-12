import { getGuardDecorator, getRouteDecorator, getStatusCodeDecorator, getValidateBodyDecorator, getValidateQueryDecorator } from "@core/application/utils/decorator.utils";
import { HttpMethod } from "@core/application/constants";
import { IGuard, IValidateBody } from "../interface";


export function Get(path: string) {
    return getRouteDecorator(HttpMethod.GET, path);
}

export function Post(path: string) {
    return getRouteDecorator(HttpMethod.POST, path);
}

export function Patch(path: string) {
    return getRouteDecorator(HttpMethod.PATCH, path);
}

export function Delete(path: string) {
    return getRouteDecorator(HttpMethod.DELETE, path);
}

export function HttpCode(code: number) {
    return getStatusCodeDecorator(code);
}

export function UseGuard(...guardClasses: Newable<IGuard>[]) {
    return getGuardDecorator(guardClasses);
}

export function ValidateBody(validationPipe: IValidateBody) {
    return getValidateBodyDecorator(validationPipe);
}

export function ValidateQuery(validationPipe: IValidateBody) {
    return getValidateQueryDecorator(validationPipe);
}