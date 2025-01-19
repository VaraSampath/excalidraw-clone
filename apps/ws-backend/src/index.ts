import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  ws.on("message", (data) => {
    ws.send("pong");
  });
});
