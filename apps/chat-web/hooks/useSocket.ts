"use client";
import { useEffect, useState } from "react";

const useSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);
    setLoading(false);
    return () => {
      ws.close();
    };
  }, [url]);

  return [socket, loading] as const;
};

export default useSocket;
