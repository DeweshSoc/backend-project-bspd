import * as path from "path";

import dotenv from "dotenv";
import express,{Request,Response,NextFunction} from "express";

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


let port = process.env.PORT;
if (port == null || port == "") {
    port = "5000";
}

app.listen(port, () => {
    console.log(`Server up at ${port}`);
});
