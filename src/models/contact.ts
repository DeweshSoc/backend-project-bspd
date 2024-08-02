import { DataTypes, Model, Optional } from "sequelize";
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

Contact.sync();

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

export const findSecondaryContactsByPrimary = async(primaryId : Number) : Promise<Model<any,any>[]> => {
    try{
        const contacts = await Contact.findAll({
            attributes:['id','email','phoneNumber'],
            where:{
                linkedId : primaryId,
                linkPrecedence :"secondary"
            }
        })
        console.log(contacts);
        return contacts;
    }catch(err){
        throw err;
    }
}

export const updateToSecondary = async(primaryId:Number, contact : Model<any,any>) : Promise<Model<any,any>> => {
    try{

        contact.set({
            linkedId : primaryId,
            linkedPrecedence : 'secondary'
        })

        return await contact.save();

    }catch(err){
        throw(err)
    }
}