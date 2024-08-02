import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();


let port = process.env.PORT;
if (port == null || port == "") {
    port = "5000";
}

app.listen(port, () => {
    console.log(`Server up at ${port}`);
});
