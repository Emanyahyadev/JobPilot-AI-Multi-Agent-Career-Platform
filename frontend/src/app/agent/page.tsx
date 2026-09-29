"use client";

import { AgentChat } from "@/components/agent-chat/AgentChat";

export default function AgentPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-[#0c0d0e]">
      <AgentChat />
    </main>
  );
}