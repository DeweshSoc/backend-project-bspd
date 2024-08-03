import { DataTypes, Model, Optional, QueryTypes } from "sequelize";
import connection from "../../connection";



/**
 * @description Contact Model
 */

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




/**
 * @description Given entry data, make an entry in Contact model
 *
 * @async
 * @param {Optional<any, string>} entryData
 * @returns {promise<Model<any,any>>}
 */
export const pushContactEntry = async (entryData: Optional<any, string>) : Promise<Model<any,any>> => {
    try {
        const dupliacteContact = await Contact.findOne({
            where: { ...entryData },
        });
        if (!dupliacteContact) {
            const savedContact = await Contact.create(entryData);
            return savedContact;
        }
        return dupliacteContact;
    } catch (err) {
        throw err;
    }
};





/**
 * @description Given an email, find the primary contact that is associated with it.
 *
 * @async
 * @param {string} email
 * @returns {(Promise<Model<any,any> | null>)}
 */
export const findOneByEmail = async( email : string) : Promise<Model<any,any> | null> => {
    try{
        let primaryContact = await Contact.findOne({ 
            where: {
                email,
                linkPrecedence: "primary",
            },
        });
        if(!primaryContact){

            [primaryContact] = await connection.query(`select p.* from Contacts p INNER JOIN Contacts s ON s.linkedId = p.id where s.email = '${email}'`,{
                type:QueryTypes.SELECT,
                model:Contact
            });

        }
        return primaryContact;
    }catch(err){
        throw err;
    }
}




/**
 * @description Given the phoneNumber find the primary contact associated with it
 *
 * @async
 * @param {string} phoneNumber
 * @returns {(Promise<Model<any,any> | null>)}
 */
export const findOneByPhoneNumber = async( phoneNumber : string) : Promise<Model<any,any> | null> => {
    try{
       let primaryContact = await Contact.findOne({ 
            where: {
                phoneNumber,
                linkPrecedence: "primary",
            },
        });
        if(!primaryContact){

            [primaryContact] = await connection.query(`select p.* from Contacts p INNER JOIN Contacts s ON s.linkedId = p.id where s.phoneNumber = '${phoneNumber}'`,{
                type:QueryTypes.SELECT,
                model:Contact
            });
            
        }
        return primaryContact;
    }catch(err){
        throw err;
    }
}





/**
 * @description Given the primary contact id, find all secondary contacts 
 *
 * @async
 * @param {Number} primaryId
 * @returns {Promise<Model<any,any>[]>}
 */
export const findSecondaryContactsByPrimary = async(primaryId : Number) : Promise<Model<any,any>[]> => {
    try{
        const contacts = await Contact.findAll({
            attributes:['id','email','phoneNumber'],
            where:{
                linkedId : primaryId,
                linkPrecedence :"secondary"
            }
        })
        return contacts;
    }catch(err){
        throw err;
    }
}






/**
 * @description Given the primary contact id and a contact, make the contact secondary to the given primary id
 *
 * @async
 * @param {Number} primaryId
 * @param {Model<any,any>} contact
 */
export const updateToSecondary = async(primaryId:Number, contact : Model<any,any>) => {
    try{
        await Contact.update(
            {
                linkedId: primaryId,
                linkPrecedence: 'secondary',
            },
            {
                where: {
                    id: contact.dataValues.id,
                },
            }
        );


    }catch(err){
        throw(err)
    }
}