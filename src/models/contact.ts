import { DataTypes } from "sequelize";
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
