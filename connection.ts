import { Sequelize } from "sequelize";
import { ErrorResponse } from "./src/interfaces";

const host = process.env.DB_ENDPOINT || null;
const username = process.env.DB_USERNAME || null;
const password = process.env.DB_PASSWORD || null;
const port = Number(process.env.DB_PORT) || 3306;
const dialect = "mysql";

if (!host || !username || !password) {
    console.table({ host, username, password });
    const err = Error(
        "connection attempt failed: missing parameters"
    ) as ErrorResponse;
    err.status = 500;
    throw err;
}

const connection = new Sequelize("", username, password, {
    host,
    port,
    dialect,
    pool: { idle: 30, max: 5 },
});

export default connection;
