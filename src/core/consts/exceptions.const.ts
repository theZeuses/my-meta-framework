export const Exception = {
    BadRequestException: {
        UNKNOWN: 40000,
        VALIDATION_FAILED: 40001,
        INVALID_PARAM: 40002
    },
    ForbiddenException: {
        UNKNOWN: 40300,
        ALREADY_EXISTS: 40301,
        CODE_DOES_NOT_MATCH: 40302,
        CODE_EXPIRED: 40303,
        CODE_MAXIMUM_RETRY_LIMIT_REACHED: 40304,
        CODE_TYPE_DOES_NOT_MATCH: 40305,
        ALREADY_IN_DESIRED_STATE: 40306,
        INVALID_ACCESS_TOKEN: 40307,
        PENDING_PROFILE: 40308,
        ACCOUNT_DELETED: 40309,
        NOT_FOUND: 40310,
        IDENTIFIER_NOT_FOUND: 40311,
        INVALID_PHONE_NUMBER: 40312
    },
    InternalServerErrorException: {
        UNKNOWN: 50000,
    },
    NotFoundException: {
        UNKNOWN: 40400,
        ENTITY_NOT_FOUND: 40401
    },
    UnauthorizedException: {
        UNKNOWN: 40100,
        INVALID_CREDENTIALS: 40101,
        INCORRECT_CREDENTIALS: 40102,
        PENDING_PROFILE: 40103,
        ACCOUNT_DELETED: 40104
    },
    UnprocessableEntityException: {
        UNKNOWN: 42200,
        UNIQUE_VALIDATION_FAILED: 42201,
    },
} as const;
