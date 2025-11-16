import { useState } from 'react';
import { Send, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Chat, Message } from '../types';

interface MessagesPageProps {
  chats: Chat[];
}

export function MessagesPage({ chats }: MessagesPageProps) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0] || null);
  const [messageText, setMessageText] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);

  const truncateMessage = (message: string, maxLength: number = 30) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength).trim() + '...';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const handleNewConversation = () => {
    setShowNewConversation(true);
    // In a real app, this would open a dialog to select clubs/users to message
    console.log('Starting new conversation');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-amber-50/30 to-transparent min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Messages</h2>
        <Button onClick={handleNewConversation} className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600">
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Chat List */}
        <Card className="md:col-span-1 flex flex-col overflow-hidden">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-4">
                {chats.length > 0 ? (
                  chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedChat?.id === chat.id
                          ? 'bg-gradient-to-r from-orange-50 to-rose-50 border-orange-200 border'
                          : 'hover:bg-orange-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3 max-w-full">
                        <Avatar className="flex-shrink-0 w-10 h-10">
                          <AvatarFallback>{chat.clubName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-gray-900 truncate">{chat.clubName}</p>
                            {chat.unreadCount > 0 && (
                              <Badge variant="default" className="flex-shrink-0 text-xs">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm truncate block">{truncateMessage(chat.lastMessage)}</p>
                          <p className="text-gray-400 text-xs mt-1">{chat.lastMessageTime}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No conversations yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              <CardHeader className="border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{selectedChat.clubName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedChat.clubName}</CardTitle>
                    <p className="text-gray-500">Club Admins</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4 p-6">
                    {selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.senderId === 'currentUser' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.senderName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`flex-1 max-w-md ${
                            message.senderId === 'currentUser' ? 'text-right' : ''
                          }`}
                        >
                          <p className="text-gray-600 mb-1">{message.senderName}</p>
                          <div
                            className={`inline-block px-4 py-2 rounded-lg ${
                              message.senderId === 'currentUser'
                                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                                : 'bg-gradient-to-r from-orange-50 to-rose-50 text-gray-900'
                            }`}
                          >
                            {message.content}
                          </div>
                          <p className="text-gray-400 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              <div className="border-t p-4 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}