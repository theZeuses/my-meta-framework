import * as express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import { AppOptions, IGlobalExceptionFilter, IGuard, IValidateBody, IValidateQuery } from './interface';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { CONTROLLERS_KEY, CONTROLLER_PREFIX_KEY, DESIGN_PARAM_TYPES, GUARD_KEY, HTTP_METHOD_KEY, HTTP_STATUS_CODE_KEY, HandlerParamType, IMPORTS_KEY, PARAMS_META_KEY, PATH_KEY, PROVIDERS_KEY, VALIDATE_BODY_KEY, VALIDATE_QUERY_KEY } from './constants';
import { ServiceContainer } from './ServiceContainer';
import { BaseException } from '@core/exceptions/BaseException';
import { InternalServerErrorException, UnauthorizedException } from '@core/exceptions';
import { parse } from 'url';

export class ApplicationFactory {
    private static serviceContainer: ServiceContainer;
    private static app: Application;
    private static globalExceptionFilter: Newable<IGlobalExceptionFilter>;

    static async create(module: Newable<any>, options?: AppOptions): Promise<Application> {
        this.app = express();
        this.serviceContainer = new ServiceContainer();

        if (options?.globalExceptionFilter) this.globalExceptionFilter = options.globalExceptionFilter;

        if (options?.staticFolder) this.app.use(express.static(options.staticFolder));

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            req.query = parse(req.url, true).query;
            next();
        });

        if (options?.cookieParser) {
            if (options.cookieParser === true)
                this.app.use(cookieParser());
            else if (typeof options.cookieParser != "boolean" )
                this.app.use(cookieParser(options.cookieParser));
        }

        this.instantiateModule(module);

        return this.app;
    }

    private static instantiateModule = (module: Newable<any>) => {
        this.resolveDependencyModules(module);
        this.resolveProviders(module);
        this.resolveControllers(module);
    }

    /**
     * Instantiates imported modules and their imports iteratively and caches all instances
     */
    private static resolveDependencyModules = (module: Newable<any>) => {
        (Reflect.getMetadata(IMPORTS_KEY, module) || []).map(this.instantiateModule);
    }

    /**
     * Instantiates providers with their dependencies iteratively and caches all instances
     */
    private static resolveProviders = (module: Newable<any>) => {
        (Reflect.getMetadata(PROVIDERS_KEY, module) || []).map(this.serviceContainer.instantiateProvider);
    }

    private static resolveControllers = (module: Newable<any>) => {
        (Reflect.getMetadata(CONTROLLERS_KEY, module) || []).map((ControllerCls: Newable<any>) => {
            // instantiate the controller with all their dependencies
            const dependencies = (Reflect.getMetadata(DESIGN_PARAM_TYPES, ControllerCls) || []).map(
                (ProviderCls: Newable<any>) => {
                    if (!this.serviceContainer.has(ProviderCls))
                        throw new Error(
                            `Provider ${ProviderCls.name} not been found.`
                        );
                    return this.serviceContainer.get(ProviderCls);
                }
            );

            this.routifyController(ControllerCls, dependencies);
        });
    }

    private static routifyController = (ControllerCls: Newable<any>, dependencies: object[]) => {
        const controller = new ControllerCls(...dependencies);

        let prefix = Reflect.getMetadata(CONTROLLER_PREFIX_KEY, ControllerCls);
        if (prefix && !prefix.startsWith('/')) prefix = `/${prefix}`;

        // process each of the route handlers
        Reflect.ownKeys(ControllerCls.prototype)
            .filter((property: string) => {
                return Reflect.hasOwnMetadata(HTTP_METHOD_KEY, ControllerCls.prototype, property);
            })
            .map((method: string) => {
                const httpMethod = Reflect.getMetadata(HTTP_METHOD_KEY, controller, method);
                const path = Reflect.getMetadata(PATH_KEY, controller, method);
                const fullPath = `${prefix}${path}`;
                
                this.processHandler(controller, fullPath, httpMethod, method);
            })
    }

    private static executePipes = async (controller: object, method: string, req: Request, res: Response) => {
        const bodyValidationPipe: IValidateBody = Reflect.getMetadata(VALIDATE_BODY_KEY, controller, method);
        const queryValidationPipe: IValidateQuery = Reflect.getMetadata(VALIDATE_QUERY_KEY, controller, method);

        if (bodyValidationPipe) req.body = bodyValidationPipe.transform(req.body);
        if (queryValidationPipe) req.query = queryValidationPipe.transform(req.query);
    }

    /**
     * Tries to validate request against the guards if there any. Only Route specific guards are handled.
     * @throws { UnauthorizedException } if request doesn't satisfy any guard
     */
    private static executeGuards = async (controller: object, method: string, req: Request, res: Response) => {
        const guards: Array<Array<IGuard>> = (Reflect.getMetadata(GUARD_KEY, controller, method) || []).map(guardClassList => {
            return (guardClassList || []).map(guardClass => {
                const guard = this.serviceContainer.get(guardClass);

                if (!guard) throw new Error(`Guard ${guardClass.name} not found. Have you forgot to register is a provider?`);

                return guard;
            })
        });

        let canProceed = await Promise.all(guards.map(async guarList => {
            return (await Promise.all(guarList.map(async guard => {
                return await guard.canProceed(req, res);
            }))).some(guard => guard);
        })).then(guardLists => guardLists.every(guardList => guardList));

        if (!canProceed) throw new UnauthorizedException();
    }

    private static resolveHandlerParams = async (controller: object, method: string, req: Request, res: Response) => {
        const paramsMeta = Reflect.getMetadata(PARAMS_META_KEY, controller, method) ?? {};

        return (Reflect.getMetadata(
            // get all the params first
            DESIGN_PARAM_TYPES,
            controller,
            method
        ) || []).map((_: any, index: number) => {
            // and then map them to the actual data to be passed
            const paramMeta = paramsMeta[index];

            if (!paramMeta) return undefined;

            const params = {
                [HandlerParamType.BODY]: req.body,
                [HandlerParamType.ROUTE_PARAM]: req.params,
                [HandlerParamType.REQ]: req,
                [HandlerParamType.RES]: res,
                [HandlerParamType.QUERY]: req.query
            }[paramMeta.type];

            //sometimes user may require specific property
            if (paramMeta.key) return params[paramMeta.key];

            //other wise return the whole
            return params;
        });
    }

    private static getDefaultHttpStatusCode = async (controller: object, method: string) => {
        const httpMethodToHttpCode = {
            "get": 200,
            "post": 201,
            "patch": 200,
            "delete": 204
        }
        return Reflect.getMetadata(HTTP_STATUS_CODE_KEY, controller, method) || httpMethodToHttpCode[method] || 200;
    }

    private static processHandler = (controller: object, fullPath: string, httpMethod: string, method: string) => {
        this.app[httpMethod](fullPath, async (req: Request, res: Response) => {
            let response = undefined;
            let httpStatusCode = await this.getDefaultHttpStatusCode(controller, httpMethod);

            try {
                await this.executePipes(controller, method, req, res);
                await this.executeGuards(controller, method, req, res);

                const params = await this.resolveHandlerParams(controller, method, req, res);
                response = await controller[method](...params)
            } catch (err) {
                //handles any unhandled error
                //if any GlobalExceptionFilter was registered then uses that
                //otherwise return an InternalServer Error to client
                if (this.globalExceptionFilter) return this.serviceContainer.instantiateProvider(this.globalExceptionFilter).catch(err, req, res);
                else if (err instanceof BaseException) {
                    return res.status(err.getData().statusCode).json(err.getData())
                } else {
                    return res.status(500).json(new InternalServerErrorException())
                }
            }

            //TODO: handle manual return of res object from handler
            return res.status(httpStatusCode).send(response);
        });
    }
}