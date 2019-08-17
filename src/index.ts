
import * as express from "express";
import * as bodyParser from 'body-parser'


import { env } from "./Env";
import { provrider } from "./data";



const app = express();
const port = 1111; // default port to listen




app.use(bodyParser.json())

app.get("/app", async function (req, res, next) {
    try {
        res.status(200).send("hello world")
    } catch (e) {
        next(e);
    }
})

app.post("/app", async function (req, res, next) {
    try {
        res.status(200).json(req.body).send()
    } catch (e) {
        next(e);
    }
});


app.post("/dataProvider", async function (req, res, next) {
    try {
        const data = await req.body
        console.log(data)
        const type: string = data.type
        const resource: string = data.resource
        const params: { [key: string]: any; } = data.params
        const p = await provrider
        const result = p(type, resource, params)
        res.status(200).json(result).send()
    } catch (e) {
        next(e);
    }
})

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});




