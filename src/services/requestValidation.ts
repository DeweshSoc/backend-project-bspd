import isEmail from "validator/lib/isEmail";

import { isPhoneNumber } from "../util";
import { ErrorResponse } from "../interfaces";

interface IValidationResponse{
    email : string | null,
    phoneNumber : string | null
}

export const validateRequest = (body: Record<string, any>) : IValidationResponse=> {
    const { email, phoneNumber } = body;

    if (!email && !phoneNumber) {
        const err = new Error(
            "Missing parameters : email or phoneNumber"
        ) as ErrorResponse;
        err.status = 422;
        throw err;
    }

    if (typeof email !== "string" || typeof phoneNumber !== "string") {
        const err = new Error("invalid email or phone number") as ErrorResponse;
        err.status = 422;
        throw err;
    }

    if (email && !isEmail(email)) {
        const err = new Error("invalid email") as ErrorResponse;
        err.status = 422;
        throw err;
    }

    if (phoneNumber && !isPhoneNumber(phoneNumber)) {
        const err = new Error("invalid phone number") as ErrorResponse;
        err.status = 422;
        throw err;
    }

    return { email: email || null, phoneNumber: phoneNumber || null };

};
