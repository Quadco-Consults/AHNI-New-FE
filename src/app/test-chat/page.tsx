'use client';

import { useState } from 'react';
import { ChatButton, ChatWindow, ConversationHistory } from '@/components/chat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TestChatPage() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Chat Integration Test</h1>
          <p className="text-muted-foreground">
            Test the chatbot functionality with different components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chat Button Test */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Chat Button</h2>
            <p className="text-muted-foreground mb-4">
              Click the floating chat button in the bottom right to open the chat window.
            </p>
            <div className="relative h-40 bg-muted rounded-lg">
              <ChatButton />
            </div>
          </Card>

          {/* Conversation History Test */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Conversation History</h2>
            <div className="space-y-4">
              <Button 
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
              >
                {showHistory ? 'Hide' : 'Show'} History Panel
              </Button>
              {showHistory && (
                <div className="border rounded-lg">
                  <ConversationHistory />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Integration Instructions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Integration Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">1. Add to your main layout:</h3>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`import { ChatButton } from '@/components/chat';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatButton />
      </body>
    </html>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Required Environment Variables:</h3>
              <pre className="bg-muted p-3 rounded text-xs">
{`NEXT_PUBLIC_API_URL=http://localhost:8000/api`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Backend API Endpoints Needed:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>POST /api/chat/message/ - Send message and get bot response</li>
                <li>POST /api/chat/conversations/ - Create new conversation</li>
                <li>GET /api/chat/conversations/ - Get user's conversations</li>
                <li>GET /api/chat/conversations/:id/ - Get specific conversation</li>
                <li>DELETE /api/chat/conversations/:id/ - Delete conversation</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}