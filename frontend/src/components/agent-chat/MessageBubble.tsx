"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Bot, User } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant" | "tool";
  content: string;
  isStreaming?: boolean;
  timestamp?: Date;
}

export function MessageBubble({
  role,
  content,
  isStreaming,
  timestamp,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple formatting helper for markdown headings, bold, bullet points
  const renderFormattedContent = (raw: string) => {
    if (!raw) return null;

    const lines = raw.split("\n");
    return lines.map((line, i) => {
      // Heading 3
      if (line.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-1 tracking-tight"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }
      // Heading 2 or 1
      if (line.startsWith("## ") || line.startsWith("# ")) {
        return (
          <h2
            key={i}
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-3 mb-1 tracking-tight"
          >
            {line.replace(/^#+\s*/, "")}
          </h2>
        );
      }
      // Bullet point
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        const text = line.trim().replace(/^[-•]\s*/, "");
        return (
          <div key={i} className="flex items-start gap-2 ml-1 my-0.5 text-zinc-700 dark:text-zinc-300">
            <span className="text-zinc-400 select-none">•</span>
            <span>{parseInlineMarkdown(text)}</span>
          </div>
        );
      }
      // Numbered item
      const numMatch = line.trim().match(/^(\d+)\.\s*(.*)/);
      if (numMatch) {
        return (
          <div key={i} className="flex items-start gap-2 ml-1 my-0.5 text-zinc-700 dark:text-zinc-300">
            <span className="font-mono text-zinc-400 select-none text-xs">{numMatch[1]}.</span>
            <span>{parseInlineMarkdown(numMatch[2])}</span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={i} className="h-1.5" />;
      }
      // Normal paragraph
      return (
        <p key={i} className="my-0.5 leading-relaxed text-zinc-700 dark:text-zinc-300">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-zinc-900 dark:text-zinc-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="font-mono px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded text-xs"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={cn(
        "group flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold select-none border",
          isUser
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-700 dark:border-zinc-300"
            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
        )}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "relative max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed transition-all",
          isUser
            ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-normal shadow-sm"
            : "bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-sm"
        )}
      >
        {/* Content */}
        <div className="space-y-0.5 text-xs">
          {renderFormattedContent(content)}
        </div>

        {/* Streaming cursor */}
        {isStreaming && (
          <span className="inline-block w-1.5 h-3.5 bg-zinc-400 dark:bg-zinc-500 animate-pulse ml-1 align-middle" />
        )}

        {/* Footer timestamp & copy */}
        <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] text-zinc-400 font-mono">
          <span>
            {timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
          </span>

          {!isUser && !isStreaming && content && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}