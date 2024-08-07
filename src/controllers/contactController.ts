import { Model } from "sequelize";

import { pushContactEntry, findSecondaryContactsByPrimary, updateToSecondary } from "../models";
import { Request, Response, NextFunction } from "express";
import { validateRequest, checkContactExistence } from "../services";



interface IIdentityReconciliation {
    contact: {
        primaryContactId: Number;
        emails:string[];
        phoneNumbers:string[];
        secondaryContactIds:Number[];
    };
}


/**
 * Controller for Contact model
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * 
 */
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
                    // both contacts are same, then nothing to do just generate payload on basis of any one
                    
                    const payload = await consolidateContacts(primaryByEmail);
                    return res.status(200).json(payload);

                } else {
                    // both are different primary contacts
                    // make primaryByNumber as secondary and generate payload based on primaryByEmail

                    await updateToSecondary(primaryByEmail.dataValues.id,primaryByPhoneNumber);
                    const payload = await consolidateContacts(primaryByEmail);
                    return res.status(200).json(payload);
                }

            } else if (primaryByEmail) {
                //  if there exists primary contact by email only
                // make new entry, make it secondary. generate payload on basis of primaryByemail

                if(phoneNumber){
                    const newEntry = {
                        email,
                        phoneNumber,
                        linkedId: primaryByEmail.dataValues.id,
                        linkPrecedence : 'secondary'
                    }
                    await pushContactEntry(newEntry);
                }

                const payload = await consolidateContacts(primaryByEmail);
                return res.status(200).json(payload);

            } else if (primaryByPhoneNumber) {
                //  if there exists primary contact by pnumber only
                // make new entry, make it secondary. generate payload on basis of primaryByPhoneNumber 

                if(email){
                    const newEntry = {
                        email,
                        phoneNumber,
                        linkedId: primaryByPhoneNumber.dataValues.id,
                        linkPrecedence: "secondary",
                    };
                    await pushContactEntry(newEntry);
                }

                const payload = await consolidateContacts(primaryByPhoneNumber);
                return res.status(200).json(payload);

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
            const payload = await consolidateContacts(savedEntry);
            return res.status(200).json(payload);
            
        }
    } catch (err) {
        next(err);
    }
};






/**
 * @description Given a primary contact, gather all secondary contacts' emails, phoneNumbers, ids
 * @async
 * @param {Model<any,any>} primaryContact
 * @returns {Promise<IIdentityReconciliation>}
 */

const consolidateContacts = async (primaryContact : Model<any,any>) : Promise<IIdentityReconciliation> => {
    try{
        const secondaryContacts = await findSecondaryContactsByPrimary(primaryContact.dataValues.id);
        
        const emails = [
            primaryContact.dataValues.email,
            ...secondaryContacts
                .filter(
                    (contact) =>
                        contact.dataValues.email !== null &&
                        contact.dataValues.email !==
                            primaryContact.dataValues.email
                )
                .map((contact) => contact.dataValues.email),
        ];

        const phoneNumbers = [
            primaryContact.dataValues.phoneNumber,
            ...secondaryContacts
                .filter(
                    (contact) =>
                        contact.dataValues.phoneNumber !== null &&
                        contact.dataValues.phoneNumber !==
                            primaryContact.dataValues.phoneNumber
                )
                .map((contact) => contact.dataValues.phoneNumber),
        ];

        const secondaryContactIds = secondaryContacts.map(contact => contact.dataValues.id);

        return {
            contact:{
                primaryContactId : primaryContact.dataValues.id,
                emails,
                phoneNumbers,
                secondaryContactIds
            }
        }

    }catch(err){
        throw err;
    }
}   
