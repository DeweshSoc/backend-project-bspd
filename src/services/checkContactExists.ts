import { Model } from "sequelize";

import { Contact, findOneByEmail, findOneByPhoneNumber } from "../models";

interface ICheckContactExisence {
    check: Boolean;
    primaryByEmail: Model<any, any> | null;
    primaryByPhoneNumber: Model<any, any> | null;
}

export const checkContactExistence = async (
    email: string | null,
    phoneNumber: string | null
): Promise<ICheckContactExisence> => {
    try {
        const contactByEmail = email ? await findOneByEmail(email) : null;
        const contactByPhoneNumber = phoneNumber ? await findOneByPhoneNumber(phoneNumber) : null;

        return {
            check: !!(contactByEmail || contactByPhoneNumber),
            primaryByEmail: contactByEmail,
            primaryByPhoneNumber: contactByPhoneNumber,
        };

    } catch (err) {
        throw err;
    }
};
