export const HTTP_METHOD_KEY = Symbol('method');
export const HTTP_STATUS_CODE_KEY = Symbol('status-code');
export const VALIDATE_BODY_KEY = Symbol('validate-body');
export const VALIDATE_QUERY_KEY = Symbol('validate-query');
export const GUARD_KEY = Symbol('guard');
export const PATH_KEY = Symbol('path');
export const PARAMS_META_KEY = Symbol('params-meta');
export const IMPORTS_KEY = Symbol('imports');
export const EXPORTS_KEY = Symbol('exports');
export const PROVIDERS_KEY = Symbol('providers');
export const CONTROLLERS_KEY = Symbol('controllers');
export const CONTROLLER_PREFIX_KEY = Symbol('controller-prefix');
export const DESIGN_PARAM_TYPES = 'design:paramtypes';

export const HandlerParamType = {
    ROUTE_PARAM: 'ROUTE_PARAM',
    BODY: 'BODY',
    QUERY: 'QUERY',
    REQ: 'REQ',
    RES: 'RES',
} as const;
  
export const HttpMethod = {
    GET: 'get',
    POST: 'post',
    PATCH: 'patch',
    DELETE: 'delete'
} as const;