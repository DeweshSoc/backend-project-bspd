import * as path from "path";

import dotenv from "dotenv";
import express,{Request,Response,NextFunction} from "express";

import { ErrorResponse } from "./src/interfaces";

dotenv.config();

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


// Error Handling
app.use((err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
        console.log(`\x1b[41m\x1b[1m\x1b[97m `, err.stack, `\x1b[0m`);
        err.message = err.status ? err.message : "Some server error occured.";
        res.status(err.status || 500).json({
            error: {
                status: err.status,
                message: err.message,
            },
        });
    }
);


let port = process.env.PORT;
if (port == null || port == "") {
    port = "5000";
}

app.listen(port, () => {
    console.log(`Server up at ${port}`);
});
