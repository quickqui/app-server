import {Model} from "@quick-qui/model-core"
import { env } from "./Env";
import axios from "axios";

export const model: Promise<Model> = axios
  .get(`${env.modelUrl}/models/default`)
  .then(_ => _.data);
