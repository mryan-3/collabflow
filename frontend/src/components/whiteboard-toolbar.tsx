"use client";

import { useBoardStore } from "../hooks/use-board-store";
import {
  Cursor,
  PencilSimple,
  Square,
  TextT,
  ArrowCounterClockwise,
  ArrowClockwise,
  Trash,
} from "@phosphor-icons/react";

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const COLORS = ["#18181b", "#ef4444", "#3b82f6", "#10b981", "#f97316"];

export default function WhiteboardToolbar({
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}: ToolbarProps) {
  const { selectedTool, setSelectedTool, selectedColor, setSelectedColor } = useBoardStore();

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4 p-3 bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl shadow-lg">
      <div className="flex flex-col gap-1.5 border-b border-stone-100 pb-3">
        {[
          { id: "select", icon: Cursor, label: "Select" },
          { id: "pencil", icon: PencilSimple, label: "Pencil" },
          { id: "rectangle", icon: Square, label: "Rectangle" },
          { id: "text", icon: TextT, label: "Text" },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id as any)}
              title={tool.label}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-500 hover:bg-stone-50 hover:text-zinc-900"
              }`}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 border-b border-stone-100 pb-3">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
              selectedColor === color ? "border-zinc-900 scale-105" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="p-2.5 rounded-xl text-zinc-500 hover:bg-stone-50 hover:text-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all cursor-pointer"
        >
          <ArrowCounterClockwise size={20} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="p-2.5 rounded-xl text-zinc-500 hover:bg-stone-50 hover:text-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all cursor-pointer"
        >
          <ArrowClockwise size={20} />
        </button>
        <button
          onClick={onClear}
          title="Clear Board"
          className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
}
