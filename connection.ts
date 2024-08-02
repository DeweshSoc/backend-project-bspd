import { Sequelize } from "sequelize";

const host = process.env.DB_ENDPOINT || null;
const username = process.env.DB_USERNAME || null;
const password = process.env.DB_PASSWORD || null;
const port = Number(process.env.DB_PORT) || 3306;
const dialect = 'mysql';

if (!host || !username || !password) {
    console.table({host,username,password});
    throw Error("connection attempt failed: missing parameters");
}

const connection = new Sequelize("", username, password, { host, port, dialect });

export default connection;