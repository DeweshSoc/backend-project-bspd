import * as path from "path";

import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import * as swaggerUI from "swagger-ui-express";
import * as swaggerDoc from "./src/json/swagger.json";

import { identificationRoute } from "./src/routes";
import { ErrorResponse } from "./src/interfaces";
import rdsConnection from "./connection";



const app = express();

// configurations
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));

// cors
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});


// documentation route middleware
const swaggerOptions:swaggerUI.SwaggerUiOptions = { 
  customCssUrl: '/swagger/main.css',
  customSiteTitle: "Dewesh Jha - BE task",
  customfavIcon: "/swagger/assets/images/favicon/favicon.ico" 
};




// handle requests

app.use("/identify", identificationRoute);


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc,swaggerOptions));


app.use("/", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(
        "BAD REQUEST : invalid endpoint url => " + req.url
    ) as ErrorResponse;
    err.status = 400;
    throw err;
});




// Error Handling
app.use(
    (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
        console.log(`\x1b[41m\x1b[1m\x1b[97m `, req.body, err, `\x1b[0m`);
        err.message = err.status ? err.message : "Some server error occured.";
        res.status(err.status || 500).json({
            error: {
                status: err.status,
                message: err.message,
            },
        });
    }
);




// connect to DB and spin server
const startServer = async () => {
    try {
        await rdsConnection.authenticate();
        console.log("connected to database");
        let port = process.env.PORT || "5000";
        app.listen(port, () => {
            console.log(`Server up at ${port}`);
        });
    } catch (err) {
        console.error("some error occured", err);
    }
};

startServer();
