export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: "pencil" | "rectangle" | "circle" | "line" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  points?: Point[];
  color: string;
  text?: string;
  createdBy: string;
}

export interface UserPresence {
  id: string;
  username: string;
  color: string;
  cursor?: Point;
}
