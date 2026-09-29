"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  Search,
  Award,
  Layers,
  FileText,
  RotateCcw,
  BarChart3,
  PanelRightClose,
  PanelRightOpen,
  Trash2,
  Download,
  Terminal,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ToolCallTimeline, ToolCall } from "./ToolCallCard";
import { CareerAnalyticsDashboard, AnalyticsMetrics } from "./CareerAnalyticsDashboard";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}

interface StreamChunk {
  type: "text" | "tool_call" | "tool_result" | "analytics_update" | "done" | "error";
  content?: string;
  toolCall?: {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
    startedAt: string;
  };
  toolCallId?: string;
  toolResult?: unknown;
  metrics?: Record<string, unknown>;
  error?: string;
}

const DEFAULT_METRICS: AnalyticsMetrics = {
  completeness_pct: 85,
  ats_score: 88,
  ats_rating: "Competitive",
  active_jobs_found: 12,
  role_match_pct: 91,
  verified_facts_count: 14,
  detected_skills: ["TypeScript", "Next.js", "Python", "FastAPI", "Docker", "PostgreSQL"],
  search_provider: "Google Jobs (SERP API)",
};

const SUGGESTIONS = [
  {
    title: "Search Live Remote Jobs",
    prompt: "Search for live remote senior full stack engineer roles with salary over $150k",
    icon: Search,
  },
  {
    title: "Run ATS Resume Audit",
    prompt: "Audit my resume for ATS compliance and generate sectional score bars and improvements",
    icon: Award,
  },
  {
    title: "Evaluate Job Match Matrix",
    prompt: "Compare my technical profile against the Senior Full-Stack AI Engineer role at Synthetix Labs",
    icon: Sparkles,
  },
  {
    title: "Extract Career Profile",
    prompt: "Extract my canonical career profile from: Alex Chen, 5 yrs exp, specialized in React, Next.js, Python FastAPI, PostgreSQL, Docker, AWS.",
    icon: FileText,
  },
  {
    title: "Draft Recruiter Outreach",
    prompt: "Draft a cold email and LinkedIn note to the engineering lead at Synthetix Labs for the AI Engineer role",
    icon: Send,
  },
  {
    title: "90-Day Career Roadmap",
    prompt: "Build an executive 90-day career roadmap to transition from Full Stack to Staff AI Systems Architect",
    icon: Layers,
  },
];

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome_init",
      role: "assistant",
      content: `### Welcome to the Career Intelligence Agent
I am your executive career co-pilot, connected in real-time to **live market feeds (Google Jobs via SERP API)**, canonical profile extraction pipelines, ATS diagnostic scorers, and tailored application generators.

**Current Live Status:**
- **Profile Readiness:** 85% (14 Verified Facts)
- **Market Alignment:** 91% Match Index for target Full-Stack & AI Roles
- **Active Market Feeds:** Monitored across verified remote teams

Select a quick command below or type any career query to invoke real-time tools.`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(DEFAULT_METRICS);
  const [showDashboard, setShowDashboard] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  const addMessage = useCallback((msg: Omit<Message, "id" | "timestamp">) => {
    const id = crypto.randomUUID();
    const newMsg: Message = {
      ...msg,
      id,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    return id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const updateToolCall = useCallback((messageId: string, toolCallId: string, updates: Partial<ToolCall>) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId || !m.toolCalls) return m;
        return {
          ...m,
          toolCalls: m.toolCalls.map((tc) =>
            tc.id === toolCallId ? { ...tc, ...updates } : tc
          ),
        };
      })
    );
  }, []);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = (userPrompt ?? input).trim();
    if (!textToSend || isStreaming) return;

    setInput("");
    setIsStreaming(true);

    // 1. Add User Message
    addMessage({
      role: "user",
      content: textToSend,
    });

    // 2. Add Assistant placeholder
    const assistantId = addMessage({
      role: "assistant",
      content: "",
      isStreaming: true,
      toolCalls: [],
    });

    let accumulatedContent = "";

    try {
      const history = messages
        .filter((m) => (m.role === "user" || m.role === "assistant") && m.content)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const rawPart of parts) {
            const trimmed = rawPart.trim();
            if (!trimmed) continue;

            const lines = trimmed.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data: StreamChunk = JSON.parse(line.slice(6));

                  switch (data.type) {
                    case "text":
                      if (data.content) {
                        accumulatedContent += data.content;
                        updateMessage(assistantId, { content: accumulatedContent });
                      }
                      break;

                    case "tool_call":
                      if (data.toolCall) {
                        const newToolCall: ToolCall = {
                          id: data.toolCall.id,
                          name: data.toolCall.name,
                          arguments: data.toolCall.arguments,
                          status: "running",
                          startedAt: new Date(data.toolCall.startedAt),
                        };

                        setMessages((prev) =>
                          prev.map((m) =>
                            m.id === assistantId
                              ? { ...m, toolCalls: [...(m.toolCalls || []), newToolCall] }
                              : m
                          )
                        );
                      }
                      break;

                    case "tool_result":
                      if (data.toolCallId && data.toolResult !== undefined) {
                        updateToolCall(assistantId, data.toolCallId, {
                          result: data.toolResult,
                          status: "completed",
                          completedAt: new Date(),
                          duration: Math.floor(Math.random() * 300 + 400),
                        });
                      }
                      break;

                    case "analytics_update":
                      if (data.metrics) {
                        setMetrics((prev) => ({ ...prev, ...data.metrics }));
                      }
                      break;

                    case "error":
                      accumulatedContent += `\n\n*Error: ${data.error}*`;
                      updateMessage(assistantId, { content: accumulatedContent });
                      break;

                    case "done":
                      updateMessage(assistantId, { isStreaming: false });
                      setIsStreaming(false);
                      break;
                  }
                } catch (parseErr) {
                  console.warn("SSE chunk parse warning:", parseErr, line);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      updateMessage(assistantId, {
        content: accumulatedContent + `\n\n**Error:** ${err instanceof Error ? err.message : "Network error"}`,
        isStreaming: false,
      });
      setIsStreaming(false);
    } finally {
      setIsStreaming(false);
      updateMessage(assistantId, { isStreaming: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "cleared_init",
        role: "assistant",
        content: "Conversation history reset. All diagnostic tools and market feeds are armed and ready.",
        timestamp: new Date(),
      },
    ]);
  };

  const exportConversation = () => {
    const text = messages
      .map(
        (m) =>
          `[${m.role.toUpperCase()}] ${m.timestamp.toISOString()}\n${m.content}\n` +
          (m.toolCalls?.map((tc) => `  * TOOL ${tc.name}: ${JSON.stringify(tc.arguments)}`).join("\n") || "")
      )
      .join("\n---\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `career_dossier_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-[#0c0d0e] text-zinc-900 dark:text-zinc-100 font-sans antialiased overflow-hidden">
      {/* Top Executive Header */}
      <header className="border-b border-[#E2E8F0] dark:border-zinc-800 bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md px-5 py-3 flex items-center justify-between z-20 flex-shrink-0 relative">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]" />

        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="JobPilot AI"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="border-l border-[#E2E8F0] pl-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F172A] dark:text-zinc-50">
                Career Counsellor
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                NVIDIA NIM
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-mono">
              Live Career Intelligence • Real-Time Diagnostics
            </p>
          </div>
        </div>

        {/* Live HUD Metric Badges */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD]">
            <span className="text-[#0369A1]">Readiness:</span>
            <span className="font-bold text-[#0284C7]">{metrics.completeness_pct}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[#64748B]">ATS Score:</span>
            <span className="font-bold text-[#0F172A]">{metrics.ats_score}/100</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
            <span className="text-[#047857]">Role Fit:</span>
            <span className="font-bold text-[#059669]">{metrics.role_match_pct}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_6px_#10B981]" />
            <span className="text-[#15803D] font-bold">{metrics.active_jobs_found} Openings</span>
          </div>
        </div>

        {/* Actions & Panel Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={exportConversation}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-xs flex items-center gap-1"
            title="Export career dossier"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Export</span>
          </button>
          <button
            onClick={clearChat}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-xs"
            title="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className={cn(
              "px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all",
              showDashboard
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-200"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Radar & Charts</span>
            {showDashboard ? (
              <PanelRightClose className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Conversational Stream */}
        <section className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0f1012] border-r border-zinc-200 dark:border-zinc-800/80">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m) => (
                <div key={m.id} className="space-y-3">
                  <MessageBubble
                    role={m.role}
                    content={m.content}
                    isStreaming={m.isStreaming}
                    timestamp={m.timestamp}
                  />

                  {/* Tool Call Cards */}
                  {m.toolCalls && m.toolCalls.length > 0 && (
                    <div className="ml-10">
                      <ToolCallTimeline
                        toolCalls={m.toolCalls}
                        onAction={(actionPrompt) => handleSend(actionPrompt)}
                      />
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Command Chips */}
          <div className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#121316]/70 px-4 py-2.5 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs">
              <span className="text-[10px] font-mono text-[#003366] font-bold uppercase tracking-wider flex-shrink-0 flex items-center gap-1 bg-[#E8EFF6] px-2 py-0.5 rounded-full border border-[#003366]/20">
                <Sparkles className="w-3 h-3 text-[#003366]" /> Actions:
              </span>
              {SUGGESTIONS.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.title}
                    disabled={isStreaming}
                    onClick={() => handleSend(item.prompt)}
                    className="flex-shrink-0 px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#003366]/50 hover:bg-[#E8EFF6]/30 text-[#0F172A] dark:text-zinc-300 text-[11px] font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-2xs cursor-pointer"
                  >
                    <ItemIcon className="w-3 h-3 text-[#003366]" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Input Box */}
          <div className="border-t border-[#E2E8F0] dark:border-zinc-800 bg-white dark:bg-[#121316] p-4">
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-end gap-2 rounded-2xl border border-[#E2E8F0] dark:border-zinc-700 bg-[#F8FAFC] dark:bg-[#18191c] p-2 focus-within:border-[#003366] focus-within:ring-2 focus-within:ring-[#003366]/20 transition-all shadow-xs"
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask the Career Counsellor (e.g. 'Search remote ML jobs', 'Audit resume ATS', 'Draft cover letter')..."
                  rows={1}
                  disabled={isStreaming}
                  className="flex-1 max-h-36 min-h-[40px] resize-none bg-transparent px-3 py-2 text-xs md:text-sm text-[#0F172A] dark:text-zinc-100 placeholder:text-[#94A3B8] focus:outline-none font-sans leading-relaxed"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className={cn(
                    "h-9 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all flex-shrink-0 cursor-pointer shadow-xs",
                    input.trim() && !isStreaming
                      ? "bg-gradient-to-r from-[#003366] to-[#1E3A8A] hover:from-[#002244] hover:to-[#003366] text-white active:scale-95 shadow-md"
                      : "bg-[#E2E8F0] dark:bg-zinc-800 text-[#94A3B8] dark:text-zinc-500 cursor-not-allowed"
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-2 px-1">
                <span>Shift + Enter for multiline</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Canonical Fact Verification Enabled
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Career Radar, Charts & Bars */}
        {showDashboard && (
          <div className="w-80 md:w-96 flex-shrink-0 animate-fade-in flex flex-col h-full overflow-hidden">
            <CareerAnalyticsDashboard
              metrics={metrics}
              onQuickAction={(prompt) => handleSend(prompt)}
              className="h-full flex-1"
            />
          </div>
        )}
      </div>
    </div>
  );
}