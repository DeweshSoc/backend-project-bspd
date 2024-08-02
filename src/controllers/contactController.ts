import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../interfaces";


export const contactController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try{

    }catch(err){
        next(err);
    }
};

