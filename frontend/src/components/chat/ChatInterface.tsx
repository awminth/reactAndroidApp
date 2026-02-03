import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { Send, Bot } from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto pt-4 pb-28 px-4">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 min-h-0 custom-scrollbar pr-1 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 mt-10 animate-fade-in">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-full h-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-center shadow-xl">
                <Bot size={48} className="text-indigo-500 dark:text-indigo-400" />
              </div>
            </div>
            <p className="text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400">Start a conversation with Nebula</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full animate-slide-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 shadow-md text-sm leading-relaxed backdrop-blur-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-br-sm shadow-indigo-500/20'
                    : 'bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/50 rounded-bl-sm'
                } ${msg.isError ? 'bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' : ''}`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start w-full animate-fade-in">
             <div className="bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl rounded-bl-sm px-4 py-3 flex space-x-1.5 items-center backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Floating slightly higher to accommodate the curve */}
      <div className="fixed bottom-24 left-4 right-4 max-w-3xl mx-auto z-40">
         <div className="relative flex items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] pl-5 pr-2 py-2 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all duration-300">
            <input
              type="text"
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none text-sm font-medium"
              disabled={isLoading}
            />
            <button
              onClick={onSend}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-full transition-all duration-300 transform ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 scale-100'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed scale-95'
              }`}
            >
              <Send size={18} className={input.trim() && !isLoading ? 'translate-x-0.5 translate-y-[-1px]' : ''} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default ChatInterface;
