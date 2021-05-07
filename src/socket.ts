import WebSocket from "ws";
import { Server } from "http";
import { log } from "./Util";
import { implementationGlobal } from "@quick-qui/model-defines";
export function newWss(server: Server) {
  const wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
        implementationGlobal["eventBus"].wss = wss;

    implementationGlobal["eventBus"].clients.push(ws);
    log.info("ws client connected");
    //connection is up, let's add a simple simple event
    ws.on("message", (message: string) => {
      //log the received message and send it back to the client
      log.info("received: %s", message);
      ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    ws.send("Hi there, I am a WebSocket server");
  });
}
