import { DrawingElement, Point } from "../types/board";

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  zoom: number,
  pan: Point
) {
  ctx.save();
  ctx.strokeStyle = "#e7e5e4";
  ctx.lineWidth = 1;

  const gridSize = 30 * zoom;
  const startX = pan.x % gridSize;
  const startY = pan.y % gridSize;

  for (let x = startX; x < width; x += gridSize) {
    for (let y = startY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fillStyle = "#e7e5e4";
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawElements(
  ctx: CanvasRenderingContext2D,
  elements: DrawingElement[],
  zoom: number,
  pan: Point
) {
  ctx.save();
  ctx.translate(pan.x, pan.y);
  ctx.scale(zoom, zoom);

  elements.forEach((el) => {
    ctx.strokeStyle = el.color;
    ctx.fillStyle = el.color;
    ctx.lineWidth = el.type === "pencil" ? 3 : 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (el.type === "pencil" && el.points && el.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(el.points[0].x, el.points[0].y);
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i].x, el.points[i].y);
      }
      ctx.stroke();
    } else if (el.type === "rectangle") {
      ctx.strokeRect(el.x, el.y, el.width, el.height);
    } else if (el.type === "text" && el.text) {
      ctx.font = "16px var(--font-space-grotesk), sans-serif";
      ctx.fillText(el.text, el.x, el.y + 16);
    }
  });

  ctx.restore();
}
