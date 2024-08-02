import { Contact } from "../models";
import { Optional } from "sequelize";


export const pushEntry = async (entryData : Optional<any,string>) => {
    try {
        const savedContact = await Contact.create(entryData);
        return savedContact;
    } catch (err) {
        throw err;
    }
};
