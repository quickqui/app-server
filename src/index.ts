import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import debug from "debug";
import { dataProvider } from "./data/Data";
import {env} from "./Env";
import {
  StringKeyObject,
  withImplementationModel
} from "@quick-qui/model-defines";
import { model } from "./Model";
import { implementationGlobal } from "@quick-qui/model-defines";
import { DataProviderParams } from "@quick-qui/data-provider";
const app = express();
const port = 4000; // default port to listen

app.use(cors());

app.use(bodyParser.json());
/*
NOTE 算是一个“内部”接口，不会被业务使用，前端的exchange用这个实现dataProvider的向后传递。
 */
/*
 NOTE 后端接口，rest之类的，属于一个单独的implementation，需要根据model动态产生。 
 */
app.post("/dataProvider", async function(req, res, next) {
  try {
    const data = await req.body;
    const type: string = data.type;
    const resource: string = data.resource;
    const params: DataProviderParams<unknown> = data.params as DataProviderParams<unknown>;
    const result: Promise<any> = (await dataProvider)(type, resource, params);
    res
      .status(200)
      .json(await result)
      .send();
  } catch (e) {
    next(e);
  }
});

model.then(async m => {
  const impl = withImplementationModel(
    m
  )?.implementationModel?.implementations.find(
    implementation => implementation.name === "back"
  );
  if (impl) {
    if (impl.injections?.includes("env")) {
      implementationGlobal["env"] = env;
    }
    if (impl.injections?.includes("dataProvider")) {
      implementationGlobal["dataProvider"] = await dataProvider;
    }
  }
  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
  });
});
