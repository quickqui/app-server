import { env } from "./Env";
import axios from "axios";

export const model: Promise<object> = axios
  .get(`${env.modelUrl}/models/default`)
  .then(_ => _.data);
