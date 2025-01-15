'use client'
import React, { useState } from 'react';
import { HelpCircle, X, Send } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
    }
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
          <div className="h-96 p-4 overflow-y-auto bg-gray-50">
            <div className="bg-[#4C55FF] text-white p-3 rounded-lg mb-4 inline-block">
              How can I help you?
            </div>
            {/* Messages would be mapped here */}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="text-black flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              className="bg-black text-white p-2 rounded-lg hover:bg-gray-900 transition-colors"
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