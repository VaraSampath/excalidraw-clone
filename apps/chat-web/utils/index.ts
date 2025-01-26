export function drawLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}
export function startFreePencil(
  canvas: HTMLCanvasElement,
  drawings: { x1: number; y1: number; x2: number; y2: number }[],
  ws: WebSocket,
  roomId: string
) {
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Mouse down event to start drawing
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
  });

  // Mouse move event to draw the line while moving the mouse
  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const currentX = e.offsetX;
    const currentY = e.offsetY;

    ws.send(
      parseToWsMessage("DRAW", roomId, {
        x1: lastX,
        y1: lastY,
        x2: currentX,
        y2: currentY,
      })
    );
    lastX = currentX;
    lastY = currentY;
  });

  // Mouse up event to stop drawing
  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  // Mouse out event to stop drawing if the mouse leaves the canvas
  canvas.addEventListener("mouseout", () => {
    isDrawing = false;
  });
}

export function resizeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function parseToWsMessage(
  method: string,
  roomId: string,
  sketch: { x1: number; y1: number; x2: number; y2: number }
) {
  return JSON.stringify({ method, roomId, content: JSON.stringify(sketch) });
}
export function parseFromWsMessage(message: string) {
  const parsedMessage = JSON.parse(message);
  if (parsedMessage.content) {
    parsedMessage.content = JSON.parse(parsedMessage.content);
  }
  return parsedMessage;
}
