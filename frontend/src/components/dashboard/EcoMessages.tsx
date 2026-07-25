import React from "react";
import { MessageSquare, ChevronRight } from "lucide-react";
import { audioEngine } from "../AudioEngine";

export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

export interface EcoMessagesProps {
  chatsData: Record<string, ChatMessage[]>;
  activeChatPartner: string | null;
  onSelectPartner: (name: string) => void;
}

export const EcoMessages: React.FC<EcoMessagesProps> = ({
  chatsData,
  activeChatPartner,
  onSelectPartner,
}) => {
  return (
    <div className="bg-[#09090b]/80 border border-white/5 p-4.5 rounded-3xl backdrop-blur-md text-left transition-all hover:border-emerald-500/20">
      <div className="flex items-center justify-between mb-3.5">
        <h4 className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" /> Eco Messages
        </h4>
        <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
          {Object.keys(chatsData).length} Threads
        </span>
      </div>

      <div className="space-y-2.5">
        {Object.keys(chatsData).map((name) => {
          const messages = chatsData[name] || [];
          const lastMsg = messages[messages.length - 1];
          const isSelected = activeChatPartner === name;

          return (
            <div
              key={name}
              onClick={() => {
                audioEngine.playTick();
                onSelectPartner(name);
              }}
              className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer transition-all duration-200 group ${
                isSelected
                  ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-950/20"
                  : "bg-white/[0.01] hover:bg-white/[0.04] border-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-sm font-black border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
                    {name.charAt(0)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#09090b] rounded-full" />
                </div>
                <div className="truncate text-left min-w-0">
                  <span className="text-xs font-bold text-white block leading-tight truncate">
                    {name}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate block mt-0.5 font-light">
                    {lastMsg ? lastMsg.text : "No conversations yet."}
                  </span>
                </div>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-colors shrink-0 ${
                  isSelected
                    ? "text-emerald-400"
                    : "text-gray-500 group-hover:text-white"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
