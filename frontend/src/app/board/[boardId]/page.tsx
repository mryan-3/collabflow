"use client";

import { use } from "react";
import { useBoardStore } from "../../../hooks/use-board-store";
import NicknameDialog from "../../../components/nickname-dialog";
import BoardContainer from "../../../components/board-container";

interface PageProps {
  params: Promise<{ boardId: string }>;
}

export default function BoardPage({ params }: PageProps) {
  const { boardId } = use(params);
  const currentUser = useBoardStore((s) => s.currentUser);

  if (!currentUser) {
    return <NicknameDialog />;
  }

  return <BoardContainer boardId={boardId} />;
}
