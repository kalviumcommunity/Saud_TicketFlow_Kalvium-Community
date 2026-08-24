"use client";

import React, { useState, useOptimistic, useRef, useTransition } from "react";
import { Ticket, Reply, Attachment } from "@/types";
import { addReplyAction } from "@/app/actions/ticketActions";

interface TicketReplyFormProps {
  ticket: Ticket;
}

export function TicketReplyForm({ ticket }: TicketReplyFormProps) {
  const [replyMode, setReplyMode] = useState<"public" | "internal">("public");
  const [replyText, setReplyText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optimistic UI Hook for replies
  const [optimisticReplies, addOptimisticReply] = useOptimistic(
    ticket.replies || [],
    (currentReplies: Reply[], newReply: Reply) => [...currentReplies, newReply]
  );

  // Handle file selection / drag-and-drop
  const handleFiles = (files: FileList | File[]) => {
    setUploadError(null);
    setIsUploading(true);

    const fileArray = Array.from(files);
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit

    const newAttachments: Attachment[] = [];
    let errorMsg = null;

    for (const file of fileArray) {
      if (file.size > MAX_SIZE) {
        errorMsg = `File "${file.name}" exceeds maximum allowed size (5MB).`;
        break;
      }

      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        url: URL.createObjectURL(file),
      });
    }

    setTimeout(() => {
      setIsUploading(false);
      if (errorMsg) {
        setUploadError(errorMsg);
      } else {
        setAttachments((prev) => [...prev, ...newAttachments]);
      }
    }, 400);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && attachments.length === 0) return;

    const contentToSubmit = replyText.trim();
    const attachmentsToSubmit = [...attachments];
    const isInternalNote = replyMode === "internal";

    // Build optimistic reply object
    const optimisticReply: Reply = {
      id: `opt-${Date.now()}`,
      ticketId: ticket.id,
      userId: "usr-agent-01",
      userName: "Agent Alex (Sending...)",
      userRole: "AGENT",
      content: contentToSubmit,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      isInternal: isInternalNote,
      attachments: attachmentsToSubmit,
    };

    // Clear form state immediately for snappy user experience
    setReplyText("");
    setAttachments([]);
    setUploadError(null);

    // Apply optimistic update immediately
    startTransition(async () => {
      addOptimisticReply(optimisticReply);

      // Perform Server Action in background
      const result = await addReplyAction(
        ticket.id,
        contentToSubmit,
        attachmentsToSubmit,
        isInternalNote
      );

      if (!result.success) {
        setUploadError(`Failed to send reply: ${result.error}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Conversation Thread */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Conversation History ({optimisticReplies.length})
          </h2>
        </div>

        <div className="space-y-4">
          {optimisticReplies.length > 0 ? (
            optimisticReplies.map((reply) => {
              const isAgent = reply.userRole === "AGENT";
              return (
                <div
                  key={reply.id}
                  className={`rounded-xl border p-5 transition-all ${
                    reply.isOptimistic
                      ? "border-amber-500/50 bg-amber-950/20 animate-pulse ml-2 sm:ml-6"
                      : isAgent
                      ? "border-indigo-500/30 bg-indigo-950/20 ml-2 sm:ml-6"
                      : "border-zinc-800 bg-zinc-900/40 mr-2 sm:mr-6"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isAgent
                            ? "bg-indigo-600 text-white"
                            : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        }`}
                      >
                        {reply.userName
                          ? reply.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "U"}
                      </div>
                      <span className="text-xs font-semibold text-zinc-200">
                        {reply.userName}
                      </span>
                      {reply.isOptimistic && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">
                          Sending...
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                          isAgent
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {reply.isInternal ? "INTERNAL NOTE" : reply.userRole || "AGENT"}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {new Date(reply.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-9 whitespace-pre-line">
                    {reply.content}
                  </p>

                  {/* Render attachments if present */}
                  {reply.attachments && reply.attachments.length > 0 && (
                    <div className="mt-3 pl-9 flex items-center gap-2 flex-wrap">
                      {reply.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-indigo-300 font-mono"
                        >
                          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span>{att.name}</span>
                          <span className="text-[10px] text-zinc-500">
                            ({(att.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 text-center text-xs text-zinc-500">
              No replies posted yet. Be the first agent to respond!
            </div>
          )}
        </div>
      </div>

      {/* Reply Input Form */}
      <form
        onSubmit={handleSubmitReply}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="rounded-xl border border-indigo-500/30 bg-zinc-900/70 p-5 space-y-4 shadow-xl"
      >
        {/* Header / Mode Selector */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReplyMode("public")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                replyMode === "public"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              Public Customer Reply
            </button>
            <button
              type="button"
              onClick={() => setReplyMode("internal")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                replyMode === "internal"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              Internal Agent Note
            </button>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            Optimistic UI Active
          </span>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Rich Editor / File Tool Bar */}
        <div className="flex items-center gap-2 text-zinc-400 text-xs px-2 py-1 bg-zinc-950/60 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>Attach File</span>
          </button>
          <span className="text-[11px] text-zinc-500">
            Or drag & drop files here (Max 5MB)
          </span>
        </div>

        {/* Error / Upload Status Banners */}
        {uploadError && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center justify-between">
            <span>{uploadError}</span>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-rose-300 font-bold hover:text-white"
            >
              &times;
            </button>
          </div>
        )}

        {isUploading && (
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 animate-pulse font-mono">
            Processing attachments...
          </div>
        )}

        {/* Selected Attachments List */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/80">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-200"
              >
                <span className="font-mono truncate max-w-[140px]">{att.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {(att.size / 1024).toFixed(0)}KB
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-zinc-500 hover:text-rose-400 font-bold ml-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={
            replyMode === "public"
              ? "Type your customer reply here..."
              : "Type an internal agent note..."
          }
          className="w-full p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans resize-y"
        />

        {/* Footer Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-zinc-500">
            Server Actions &bull; Revalidates page upon completion
          </span>

          <button
            type="submit"
            disabled={isPending || (!replyText.trim() && attachments.length === 0)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all border border-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>{isPending ? "Submitting..." : "Submit Reply"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
