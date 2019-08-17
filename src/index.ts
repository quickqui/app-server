
import * as express from "express";
import * as bodyParser from 'body-parser'


import { env } from "./Env";



const app = express();
const port = 1111; // default port to listen




app.use(bodyParser.text());

app.get("/app", async function (req, res, next) {
    try {
        res.status(200).send("app server")
    } catch (e) {
        next(e);
    }
});



app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});




