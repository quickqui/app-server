import {
  withInfoModel,
  parseRefWithProtocolInsure,
} from "@quick-qui/model-defines";
import { v4 as uuidV4 } from "uuid";

import { Model } from "@quick-qui/model-core";
import _ from "lodash";
import { resolve } from "../Resolve";
import { log } from "../Util";

export class Bus {
  wss = null;
  clients: WebSocket[] = [];
  emit = (type: string, name: string, payload: any) => {
    const message = eventEmitMessage(payload, type, name);
    if (this.wss) {
      this.clients.forEach((w) => {
        log.debug("event through websocket");
        w.send(JSON.stringify(message));
      });
    } else {
        log.info('no web socket find yet')
      //throw new Error("no web socket found");
    }
  };
}
export const bus = new Bus();

export async function events(model: Model) {
  const infoModel = withInfoModel(await model)?.infoModel;
  const infos =
    infoModel?.infos?.filter((info) => {
      return (
        info.type === "event" && info.annotations?.implementation?.at === "back"
      );
    }) ?? [];
  if (!_.isEmpty(infos)) {
    log.debug("infos of event - ", infos);
    infos.forEach(async (info) => {
      const base = info.annotations?.buildingContext?.modelFile?.repositoryBase;
      if (info.annotations?.implementation?.source?.startsWith("resolve"))
        await resolve<any>(
          parseRefWithProtocolInsure(info.annotations?.implementation?.source)
            .path,
          base
        );
    });
  }
}
function meta(eventType: string, eventName: string) {
  return {
    id: uuidV4(),
    timestamp: new Date(),
    type: eventType,
    name: eventName,
    version: new Date().getTime(),
  };
}
export const eventEmitMessage = (
  eventObject: any,
  eventType: string,
  eventName: string
) => {
  return {
    type: "QQ/EVENT/" + eventType,
    payload: {
      event: { ...meta(eventType, eventName), payload: { ...eventObject } },
    },
  };
};
