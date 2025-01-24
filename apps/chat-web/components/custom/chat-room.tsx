"use client";

import useSocket from "@/hooks/useSocket";
import { wsMessage } from "@/types";
import { useEffect, useState } from "react";
import { wsMethods } from "@repo/common/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type pageProps = {
  token: string;
  roomId: string;
  messages: wsMessage[] | null;
};
const ChatRoom = (props: pageProps) => {
  const [messages, setMessages] = useState<wsMessage[]>(props.messages || []);
  const [ws, loading] = useSocket(`ws://localhost:8080/?token=${props.token}`);
  const [chatInput, setChatInput] = useState("");
  const sendMessage = () => {
    ws?.send(
      JSON.stringify({
        method: wsMethods.CHAT,
        roomId: props.roomId,
        content: chatInput,
      })
    );
  };
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
          console.log("event", event.data);
          const data = JSON.parse(event.data);
          if (data.method === wsMethods.CHAT) {
            console.log(data, "data");

            setMessages((prev) => [...prev, data]);
          }
        };
      };
    })();
  }, [loading, props.roomId, ws]);

  if (!ws || loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {messages?.map((message) => (
        <div key={message.content}>
          <p>{message?.content}</p>
        </div>
      ))}
      <Input
        type="text"
        onChange={(e) => setChatInput(e.target.value)}
      />
      <Button
        variant={"default"}
        onClick={sendMessage}
      >
        Send
      </Button>
    </>
  );
};

export default ChatRoom;
