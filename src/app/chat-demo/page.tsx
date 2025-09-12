'use client';

import { ChatButton } from '@/components/chat';

export default function ChatDemoPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Chat Demo</h1>
        <p className="text-muted-foreground mb-8">
          This page demonstrates the chatbot integration. 
          Click the chat button in the bottom right corner to start chatting.
        </p>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Features Implemented:</h3>
          <ul className="text-sm space-y-1 text-left">
            <li>✅ Floating chat button</li>
            <li>✅ Chat window with messages</li>
            <li>✅ Authentication integration</li>
            <li>✅ Error handling</li>
            <li>✅ Conversation persistence</li>
            <li>✅ Typing indicators</li>
          </ul>
        </div>
      </div>
      <ChatButton />
    </div>
  );
}