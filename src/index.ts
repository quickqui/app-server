import dote from "dotenv";
dote.config();

import express from "express";
import cors from "cors";
import http from "http";

import { dataProvider } from "./data/Data";
import { env } from "./Env";
import { withImplementationModel } from "@quick-qui/implementation-model";
import { model } from "./Model";
import { implementationGlobal } from "@quick-qui/implementation-model";
import { DataProviderParams } from "@quick-qui/data-provider";
import { log } from "./Util";
import { newWss } from "./socket";
import { bus, events } from "./event";

const app = express();
const port = process.env.PORT || 4000; // default port to listen

app.use(cors());

app.use(express.json());

const jsonErrorHandler = async (err, req, res, next) => {
  log.warn("in json error handle", err);
  res.status(500).send({ error: err.message });
};


/*
NOTE 算是一个“内部”接口，不会被业务使用，前端的exchange用这个实现dataProvider的向后传递。
 */
/*
 NOTE 后端接口，rest之类的，属于一个单独的implementation，需要根据model动态产生。 
 */
app.post("/dataProvider", async function (req, res, next) {
  try {
    const data = await req.body;
    const type: string = data.type;
    const resource: string = data.resource;
    const params: DataProviderParams<unknown> =
      data.params as DataProviderParams<unknown>;
    const result: Promise<any> = (await dataProvider)(type, resource, params);
    res
      .status(200)
      .json(await result)
      .send();
  } catch (e) {
    log.error(e)
    next(e);
  }
});
app.use(jsonErrorHandler);

model.then(async (m) => {
  const impl = withImplementationModel(
    m
  )?.implementationModel?.implementations.find(
    (implementation) => implementation.name === env.implementationName
  );
  log.info("implementation name - ", env.implementationName);
  log.debug(impl);

  if (impl) {
    if (impl.injections?.includes("env")) {
      implementationGlobal["env"] = env;
    } else {
      log.warn("env injection is disable");
    }
    if (impl.injections?.includes("dataProvider")) {
      implementationGlobal["dataProvider"] = await dataProvider;
    } else {
      log.warn("dataProvider injection is disable");
    }
    if (impl.injections?.includes("eventBus")) {
      implementationGlobal["eventBus"] = bus;
    } else {
      log.warn("eventBus injection is disable");
    }
    //setup event source.
    events(m);
  }
  const server = http.createServer(app);
  newWss(server);

  server.listen(port, () => {
    // tslint:disable-next-line:no-console
    log.info(`server started at :${port}`);
  });
});
