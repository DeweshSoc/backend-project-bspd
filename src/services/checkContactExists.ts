import { Model } from "sequelize";

import { Contact } from "../models";

interface ICheckContactExisence {
    check: Boolean;
    byEmail: Model<any, any> | null;
    byPhoneNumber: Model<any, any> | null;
}

export const checkContactExistence = async (
    email: string | null,
    phoneNumber: string | null
): Promise<ICheckContactExisence> => {
    try {
        const findOneByEmail = email
            ? await Contact.findOne({
                  where: {
                      email,
                      linkPrecedence: "primary",
                  },
              })
            : null;

        const findOneByPhoneNumber = phoneNumber
            ? await Contact.findOne({
                  where: {
                      phoneNumber,
                      linkPrecedence: "primary",
                  },
              })
            : null;

        return {
            check: !!(findOneByEmail || findOneByPhoneNumber),
            byEmail: findOneByEmail,
            byPhoneNumber: findOneByPhoneNumber,
        };
    } catch (err) {
        throw err;
    }
};
