import { DataTypes, Model } from "sequelize";
import connection from "../../connection";

export const Contact = connection.define(
    "Contact",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        email: DataTypes.STRING,

        phoneNumber: DataTypes.STRING,

        linkedId: DataTypes.INTEGER,

        linkPrecedence: {
            type: DataTypes.ENUM("primary", "secondary"),
            allowNull: false,
        },
    },
    {
        timestamps: true, // for createdAt, updatedAt
        paranoid: true, // Calling destroy will not delete the model, but instead set a deletedAt timestamp
    }
);


import { Optional } from "sequelize";

export const pushContactEntry = async (entryData: Optional<any, string>) => {
    try {
        const savedContact = await Contact.create(entryData);
        return savedContact;
    } catch (err) {
        throw err;
    }
};

export const findOneByEmail = async( email : string) : Promise<Model<any,any> | null> => {
    try{
        const contact = await Contact.findOne({ 
            where: {
                email,
                linkPrecedence: "primary",
            },
        });
        return contact;
    }catch(err){
        throw err;
    }
}

export const findOneByPhoneNumber = async( phoneNumber : string) : Promise<Model<any,any> | null> => {
    try{
        const contact = await Contact.findOne({ 
            where: {
                phoneNumber,
                linkPrecedence: "primary",
            },
        });
        return contact;
    }catch(err){
        throw err;
    }
}
