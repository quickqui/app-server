import { Model } from "@quick-qui/model-core";
import { env } from "./Env";
import axios from "axios";
import { waitForUrlPort } from "./Util";

export const model: Promise<Model> = waitForUrlPort(env.modelUrl).then(_ =>
  axios.get(`${env.modelUrl}/models/default`).then(_ => _.data)
);
