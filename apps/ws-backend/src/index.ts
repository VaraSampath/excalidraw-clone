import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@repo/backend-common/config";
import { wsMethods } from "@repo/common/types";
const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, { ws: WebSocket; userId: string }[]>();

const getUser = async (token: string) => {
  if (!token) {
    return null;
  }
  try {
    const decoded = await jwt.verify(token, SECRET_KEY);

    if (typeof decoded === "string") {
      return null;
    }
    return decoded.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

wss.on("connection", async (ws, req) => {
  const url = new URLSearchParams(req?.url?.split("?")[1] ?? "");
  const token = url.get("token");

  try {
    if (token) {
      const userId = await getUser(token);

      if (userId === null) {
        ws.close();
        return null;
      }
      ws.on("message", (data) => {
        const parsedData = JSON.parse(data as unknown as string);
        console.log(parsedData);

        if (parsedData.method === wsMethods.JOIN_ROOM) {
          const { roomId } = parsedData;
          if (!rooms.has(roomId)) {
            rooms.set(roomId, []);
          }
          rooms.get(roomId)?.push({ ws, userId });
        }
        if (parsedData.method === wsMethods.CHAT) {
          const { roomId, content } = parsedData;
          const room = rooms.get(roomId) ?? [];
          for (const user of room) {
            user.ws.send(
              JSON.stringify({
                method: wsMethods.CHAT,
                roomId,
                content,
              })
            );
          }
        }
        if (parsedData.method === wsMethods.DRAW) {
          const { roomId, content } = parsedData;
          const room = rooms.get(roomId) ?? [];
          for (const user of room) {
            user.ws.send(
              JSON.stringify({
                method: wsMethods.DRAW,
                roomId,
                content,
              })
            );
          }
        }
        if (parsedData.method === wsMethods.LEAVE_ROOM) {
          const { roomId, userId } = parsedData;
          const room = rooms.get(roomId) ?? [];
          rooms.set(
            roomId,
            room.filter((user) => user.userId !== userId)
          );
        }
      });
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
});
