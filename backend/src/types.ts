export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: "pencil" | "rectangle" | "text";
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

export type WSMessage =
  | { type: "init"; payload: { elements: DrawingElement[]; users: UserPresence[] } }
  | { type: "user_joined"; payload: UserPresence }
  | { type: "user_left"; payload: { id: string } }
  | { type: "cursor_update"; payload: { id: string; cursor: Point } }
  | { type: "element_update"; payload: DrawingElement }
  | { type: "element_delete"; payload: { id: string } }
  | { type: "element_undo"; payload: { elementId: string } }
  | { type: "clear_board" };
