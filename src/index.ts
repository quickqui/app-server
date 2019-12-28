import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { dataProvider } from "./data/Data";
import { StringKeyObject } from "@quick-qui/model-defines";

const app = express();
const port = 4000; // default port to listen

app.use(cors());

app.use(bodyParser.json());
/*
NOTE 算是一个“内部”接口，不会被业务使用，前端的exchange用这个实现dataProvider的向后传递。
 */
/*
 TODO 后端接口，rest之类的，需要根据model动态产生。 
 */
app.post("/dataProvider", async function(req, res, next) {
  try {
    const data = await req.body;
    const type: string = data.type;
    const resource: string = data.resource;
    const params: StringKeyObject = data.params;
    const result: Promise<any> = (await dataProvider)(type, resource, params);
    res
      .status(200)
      .json(await result)
      .send();
  } catch (e) {
    next(e);
  }
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
