import { CONTROLLERS_KEY, CONTROLLER_PREFIX_KEY, EXPORTS_KEY, IMPORTS_KEY, PROVIDERS_KEY } from "@core/application/constants";

export function Controller(prefix?: string) {
    return function (target: Newable<any>) {
        Reflect.defineMetadata(CONTROLLER_PREFIX_KEY, prefix ?? '', target);
    };
}

export function Module({
    imports,
    providers,
    controllers,
    exports
}: {
    imports?: Newable<any>[],
    providers?: Newable<any>[],
    controllers?: Newable<any>[],
    exports?: Newable<any>[]
}) {
    return function (target: Newable<any>) {
        Reflect.defineMetadata(IMPORTS_KEY, imports, target);
        Reflect.defineMetadata(EXPORTS_KEY, exports, target);
        Reflect.defineMetadata(PROVIDERS_KEY, providers, target);
        Reflect.defineMetadata(CONTROLLERS_KEY, controllers, target);
    };
}

export function Injectable() {
    return function (_: Newable<any>) { };
}