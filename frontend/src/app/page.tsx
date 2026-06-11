"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight } from "@phosphor-icons/react";

export default function Home() {
  const router = useRouter();
  const [boardId, setBoardId] = useState("");

  const handleCreate = () => {
    const newId = crypto.randomUUID();
    router.push(`/board/${newId}`);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardId.trim()) {
      router.push(`/board/${boardId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50/50 p-6">
      <div className="w-full max-w-md p-8 bg-white border border-stone-200 rounded-3xl shadow-xl flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
            CollabFlow
          </h1>
          <p className="text-stone-500 text-sm">
            Draw, design, and brainstorm with your team in real time.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} weight="bold" />
            Create Whiteboard
          </button>

          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-stone-200" />
            <span className="px-3 text-xs text-stone-400 font-bold uppercase select-none">
              or
            </span>
            <div className="flex-grow border-t border-stone-200" />
          </div>

          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter Board ID"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              className="flex-grow px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-sans"
            />
            <button
              type="submit"
              className="p-2.5 bg-stone-100 hover:bg-stone-200 text-zinc-800 rounded-xl transition-all cursor-pointer"
            >
              <ArrowRight size={20} weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
