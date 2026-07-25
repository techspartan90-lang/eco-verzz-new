import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles } from "lucide-react";
import { ChatMessage } from "./EcoMessages";
import { audioEngine } from "../AudioEngine";

export interface EcoChatOverlayProps {
  activeChatPartner: string | null;
  chatsData: Record<string, ChatMessage[]>;
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onSendChat: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const EcoChatOverlay: React.FC<EcoChatOverlayProps> = ({
  activeChatPartner,
  chatsData,
  chatInput,
  onChatInputChange,
  onSendChat,
  onClose,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = activeChatPartner ? chatsData[activeChatPartner] || [] : [];

  // Auto-scroll to bottom of chat on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeChatPartner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-24 right-6 md:right-8 bg-[#09090b]/95 border border-emerald-500/30 w-80 sm:w-88 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden backdrop-blur-2xl text-left"
      >
        {/* Header */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-gray-950 font-black flex items-center justify-center text-xs shadow-md">
                {activeChatPartner.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-[#09090b] rounded-full" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">
                {activeChatPartner}
              </span>
              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Eco Verified Guardian
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              audioEngine.playTick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="h-56 overflow-y-auto p-3.5 space-y-3 flex flex-col justify-start font-sans">
          {messages.length === 0 ? (
            <div className="text-center my-auto py-8">
              <p className="text-xs text-gray-500 font-mono">
                Start an eco-collaboration message! 🌱
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "me" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-2.5 rounded-2xl max-w-[85%] text-[11px] leading-relaxed shadow-sm ${
                    msg.sender === "me"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 rounded-tr-none font-medium"
                      : "bg-white/10 text-gray-100 rounded-tl-none font-light border border-white/5"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8px] text-gray-500 font-mono mt-0.5 px-1">
                  {msg.time}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Form Input */}
        <form
          onSubmit={onSendChat}
          className="p-2.5 border-t border-white/10 flex gap-2 bg-black/40"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={chatInput}
            onChange={(e) => onChatInputChange(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-gray-950 rounded-xl hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};
