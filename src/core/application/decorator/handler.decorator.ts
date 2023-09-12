import { HandlerParamType } from "@core/application/constants";
import { getHandlerParamDecorator } from "@core/application/utils/decorator.utils";

export function Param(key?: string) {
    return getHandlerParamDecorator(HandlerParamType.ROUTE_PARAM, key);
}

export function Body(key?: string) {
    return getHandlerParamDecorator(HandlerParamType.BODY, key);
}

export function Query(key?: string) {
    return getHandlerParamDecorator(HandlerParamType.QUERY, key);
}

export function Req() {
    return getHandlerParamDecorator(HandlerParamType.REQ);
}

export function Res() {
    return getHandlerParamDecorator(HandlerParamType.RES);
}