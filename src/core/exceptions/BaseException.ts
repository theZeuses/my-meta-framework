export abstract class BaseException extends Error {  
    constructor (private readonly data: { 
        statusCode: number; 
        errorCode: number; 
        reference?: any;
        errors?: any;
        loggerOptions?: { 
            type?: string; 
            errSource?: string; 
            rawError?: any; 
            additionalData?: any; 
        }
    }) {
        super(data.errorCode.toString())
        Error.captureStackTrace(this, this.constructor);
    }

    getData () {
        return this.data;
    }
}