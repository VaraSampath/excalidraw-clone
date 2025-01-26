"use client";

import useSocket from "@/hooks/useSocket";
import { wsMessage } from "@/types";
import { useEffect, useState } from "react";
import { wsMethods } from "@repo/common/types";
import CanvasPaint from "./CanvasPaint";
import Chats from "./chats";
import { parseFromWsMessage, parseToWsMessage } from "@/utils";
import useDrawingStore from "@/store/drawing-store";

type pageProps = {
  token: string;
  roomId: string;
  messages: wsMessage[] | null;
};
const ChatRoom = (props: pageProps) => {
  const [messages, setMessages] = useState<wsMessage[]>(props.messages || []);
  const [ws, loading] = useSocket(`ws://localhost:8080/?token=${props.token}`);

  useEffect(() => {
    (async () => {
      if (!ws || loading) {
        return;
      }
      ws.onopen = () => {
        ws.send(
          JSON.stringify({ method: wsMethods.JOIN_ROOM, roomId: props.roomId })
        );
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.method === wsMethods.CHAT) {
            setMessages((prev) => [...prev, data]);
          }
        };
        ws.onmessage = (event) => {
          const data = parseFromWsMessage(event.data);
          if (data.method === wsMethods.DRAW) {
            const { x1, y1, x2, y2 } = data.content;
            const canvas = document.querySelector("canvas");
            const ctx = canvas?.getContext("2d");
            if (ctx) {
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
          }
        };
      };
    })();
  }, [loading, props.roomId, ws]);

  if (!ws || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative">
      <CanvasPaint
        roomId={props.roomId}
        ws={ws}
      />
      <Chats
        roomId={props.roomId}
        ws={ws}
        chats={messages}
      />
    </div>
  );
};

export default ChatRoom;
