import { Model } from "sequelize";

import { pushContactEntry } from "../models";
import { Request, Response, NextFunction } from "express";
import { validateRequest, checkContactExistence } from "../services";

export const contactController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, phoneNumber } = validateRequest(req.body);

        const {
            check: checkprimary,
            primaryByEmail,
            primaryByPhoneNumber,
        } = await checkContactExistence(email, phoneNumber);

        if (checkprimary) {
            // based on email/pnumber there exists one or more primary contact

            if (primaryByEmail && primaryByPhoneNumber) {
                // if there exists primary contact by both email and number
                
                if (primaryByEmail.dataValues.id === primaryByPhoneNumber.dataValues.id) {
                    // both contacts are same

                    // createPayload(primaryByEmail);
                    // send responce
                } else {
                    // both are different primary contacts

                    // make primaryByNumber secondary and generate payload based on primaryByEmail
                    // send response
                }
            } else if (primaryByEmail) {
                //  if there exists primary contact by email only

                // make new entry with new phonenumber and make it secondary to primaryByMail
                // generate payload based on primaryByMail
            } else if (primaryByPhoneNumber) {
                //  if there exists primary contact by pnumber only

                // make new entry with new email and make it secondary to primaryByNumber
                // generate payload based on primaryByNumber
            }
        } else {
            // there is no primary id for given request. Hence this request leads to a new primary id.

            const newEntry = {
                email,
                phoneNumber,
                linkedId: null,
                linkPrecedence: "primary",
            };
            const savedEntry = await pushContactEntry(newEntry);
            console.log(savedEntry);
            // createPayload(savedEntry) -> after all new additions, this is called. it take the primary contact
        }
    } catch (err) {
        next(err);
    }
};


const consolidateContacts = async (primaryContact : Promise<Model<any,any>>) => {
    
}