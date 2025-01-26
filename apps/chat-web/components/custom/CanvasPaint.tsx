"use client";

import { useDrawingStore } from "@/store/drawing-store";
import { resizeCanvas, startFreePencil } from "@/utils";
import { useEffect, useRef } from "react";

const CanvasPaint = ({
  roomId,
  ws,
}: {
  roomId: string;

  ws: WebSocket;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const populateDrawings = useDrawingStore.getState().increase;
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    resizeCanvas(canvas);
    window.addEventListener("resize", () => resizeCanvas(canvas));
    return () => {
      window.removeEventListener("resize", () => resizeCanvas(canvas));
    };
  }, []);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    startFreePencil(canvas, ws, roomId);
  }, [populateDrawings, roomId, ws]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  }, [roomId, ws]);
  return (
    <div className="h-dvh w-dvw">
      <canvas
        ref={canvasRef}
        id="canvas"
      ></canvas>
    </div>
  );
};

export default CanvasPaint;
