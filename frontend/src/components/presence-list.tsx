"use client";

import { useBoardStore } from "../hooks/use-board-store";

export default function PresenceList() {
  const users = useBoardStore((s) => s.users);

  return (
    <div className="absolute right-6 top-6 z-10 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-md">
      <div className="flex -space-x-2 overflow-hidden">
        {users.slice(0, 5).map((user) => (
          <div
            key={user.id}
            title={user.username}
            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white transition-transform hover:scale-110 select-none uppercase"
            style={{ backgroundColor: user.color }}
          >
            {user.username.charAt(0)}
          </div>
        ))}
        {users.length > 5 && (
          <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 select-none">
            +{users.length - 5}
          </div>
        )}
      </div>
      <div className="text-xs text-stone-500 font-medium pr-1 select-none">
        {users.length} {users.length === 1 ? "editor" : "editors"}
      </div>
    </div>
  );
}
