import isEmail from "validator/lib/isEmail";

import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../interfaces";

export const contactController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, phoneNumber } = validateRequest(req.body);
    } catch (err) {
        next(err);
    }
};

const validateRequest = (body: Record<string, any>) => {
    const { email, phoneNumber } = body;

    if (!email && !phoneNumber) {
        const err = new Error(
            "Missing parameters : email or phoneNumber"
        ) as ErrorResponse;
        err.status = 422;
        throw err;
    }

    if (email && !isEmail(email)) {
        const err = new Error("Invalid Email") as ErrorResponse;
        err.status = 422;
        throw err;
    }

    if (phoneNumber && !isPhoneNumber(phoneNumber)) {
        const err = new Error("Invalid Phone Number") as ErrorResponse;
        err.status = 422;
        throw err;
    }

    return { email, phoneNumber };
};

const isPhoneNumber = (phoneNumber: String) => {
    const allowed = "+0123456789".split("");
    for (let digit of phoneNumber) {
        if (!allowed.includes(digit)) return false;
    }
    return true;
};
