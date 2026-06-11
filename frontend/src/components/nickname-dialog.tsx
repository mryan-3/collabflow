"use client";

import { useState } from "react";
import { useBoardStore } from "../hooks/use-board-store";
import { generateId } from "../utils/id";

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#78716c"];

export default function NicknameDialog() {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const setCurrentUser = useBoardStore((s) => s.setCurrentUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCurrentUser({
      id: generateId(),
      username: name.trim(),
      color: selectedColor,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-100/80 backdrop-blur-sm">
      <div className="w-full max-w-sm p-6 bg-white border border-stone-200 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-zinc-800 tracking-tight mb-2">Join Whiteboard</h2>
        <p className="text-sm text-stone-500 mb-6">Enter your nickname to start collaborating live.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            required
            placeholder="Nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-sans"
          />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-stone-400">Choose cursor color</span>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                    selectedColor === c ? "border-zinc-900 scale-105" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
          >
            Enter Board
          </button>
        </form>
      </div>
    </div>
  );
}
