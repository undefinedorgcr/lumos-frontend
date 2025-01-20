'use client'
import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Send } from 'lucide-react';
import { Message } from '@/types/Message';

const ELIZA_API_URL = "http://localhost:3000"
const AGENT_ID = "2ec979e8-1d05-008f-a3f5-168815f3c660"

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const LoadingIndicator = () => (
    <div className="flex items-center gap-2 p-3 bg-[#4C55FF] text-white rounded-lg rounded-bl-none mb-4">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${ELIZA_API_URL}/${AGENT_ID}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userMessage.content,
          userId: "1",
          roomId: 1,
          userName: "User",
          unique: true
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      data.forEach((responseMsg: { text: string }) => {
        const botMessage: Message = {
          id: Date.now().toString() + Math.random(),
          content: responseMsg.text,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage]);
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(true)}
            className="group flex items-center justify-end gap-2 bg-white text-black rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: isHovered ? '190px' : '48px',
              height: '48px',
              padding: isHovered ? '0 20px' : '12px',
            }}
          >
            <span
              className="whitespace-nowrap overflow-hidden transition-all duration-300"
              style={{
                width: isHovered ? '110px' : '0',
                opacity: isHovered ? 1 : 0
              }}
            >
              Talk with Lumos
            </span>
            <HelpCircle className="w-6 h-6 flex-shrink-0" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="bg-white text-black p-4 flex justify-between items-center">
            <h3 className="font-light text-lg">Lumos AI Agent</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-96 p-4 overflow-y-auto bg-gray-50 scroll-smooth">
            <div className="bg-[#4C55FF] text-white p-3 rounded-lg mb-4 inline-block">
              How can I help you?
            </div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} mb-4`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser
                      ? 'bg-black text-white rounded-br-none'
                      : 'bg-[#4C55FF] text-white rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <LoadingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Scroll anchor */}
          </div>
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t border-gray-200 flex gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="text-black flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="bg-black text-white p-2 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;