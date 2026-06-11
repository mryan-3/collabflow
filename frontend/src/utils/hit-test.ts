import { DrawingElement, Point } from "../types/board";

function distance(p1: Point, p2: Point) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function getElementAtPosition(
  elements: DrawingElement[],
  point: Point
): DrawingElement | null {
  // Search in reverse order to select top-most elements first
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];

    if (el.type === "rectangle") {
      const minX = Math.min(el.x, el.x + el.width);
      const maxX = Math.max(el.x, el.x + el.width);
      const minY = Math.min(el.y, el.y + el.height);
      const maxY = Math.max(el.y, el.y + el.height);

      if (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY) {
        return el;
      }
    } else if (el.type === "text") {
      const textLen = el.text ? el.text.length : 0;
      const width = Math.max(el.width, textLen * 9 + 10);
      const height = el.height || 24;
      if (
        point.x >= el.x &&
        point.x <= el.x + width &&
        point.y >= el.y &&
        point.y <= el.y + height
      ) {
        return el;
      }
    } else if (el.type === "pencil" && el.points) {
      const hit = el.points.some((p) => distance(p, point) < 10);
      if (hit) return el;
    }
  }
  return null;
}
