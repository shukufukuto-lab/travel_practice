'use client';

import { ReactNode } from 'react';

interface MessageBubbleProps {
  type: 'user' | 'ai';
  children: ReactNode;
  timestamp?: Date;
}

export default function MessageBubble({ type, children, timestamp }: MessageBubbleProps) {
  const isUser = type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          } shadow-sm`}
        >
          {children}
        </div>
        {timestamp && (
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium ml-2 order-2 flex-shrink-0">
          AI
        </div>
      )}
    </div>
  );
}
