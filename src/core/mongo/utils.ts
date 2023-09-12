import { Exception } from "@core/consts";
import { BadRequestException } from "@core/exceptions";
import { isValidObjectId } from "mongoose";

/**
 * Validates an id. If the Id is not valid ObjectId()
 * then throws an error 
 * @throws {BadRequestException}
 */
export function validateObjectId(id: string) {
    if(isValidObjectId(id)) {
        return true;
    }

    throw new BadRequestException(Exception.BadRequestException.INVALID_PARAM);
}