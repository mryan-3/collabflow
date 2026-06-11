import { create } from "zustand";
import { DrawingElement, UserPresence, Point } from "../types/board";

interface BoardState {
  elements: DrawingElement[];
  users: UserPresence[];
  currentUser: UserPresence | null;
  selectedTool: "select" | "pencil" | "rectangle" | "text";
  selectedColor: string;
  zoom: number;
  pan: Point;
  myCreatedIds: string[];
  myRedoStack: DrawingElement[];
  setElements: (elements: DrawingElement[]) => void;
  setUsers: (users: UserPresence[]) => void;
  setCurrentUser: (user: UserPresence | null) => void;
  setSelectedTool: (tool: "select" | "pencil" | "rectangle" | "text") => void;
  setSelectedColor: (color: string) => void;
  setZoom: (zoom: number | ((z: number) => number)) => void;
  setPan: (pan: Point | ((p: Point) => Point)) => void;
  updateLocalElement: (el: DrawingElement) => void;
  deleteLocalElement: (id: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  elements: [],
  users: [],
  currentUser: null,
  selectedTool: "pencil",
  selectedColor: "#18181b",
  zoom: 1,
  pan: { x: 0, y: 0 },
  myCreatedIds: [],
  myRedoStack: [],

  setElements: (elements) => set({ elements }),
  setUsers: (users) => set({ users }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  setSelectedTool: (selectedTool) => set({ selectedTool }),
  setSelectedColor: (selectedColor) => set({ selectedColor }),
  setZoom: (zoom) =>
    set((state) => ({
      zoom: typeof zoom === "function" ? zoom(state.zoom) : zoom,
    })),
  setPan: (pan) =>
    set((state) => ({
      pan: typeof pan === "function" ? pan(state.pan) : pan,
    })),

  updateLocalElement: (el) =>
    set((state) => {
      const idx = state.elements.findIndex((item) => item.id === el.id);
      if (idx > -1) {
        const next = [...state.elements];
        next[idx] = el;
        return { elements: next };
      }
      return { elements: [...state.elements, el] };
    }),

  deleteLocalElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((item) => item.id !== id),
    })),
}));
