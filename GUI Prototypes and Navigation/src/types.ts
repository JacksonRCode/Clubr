// Types for the Clubr application
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  interests: string[];
  adminClubs: string[]; // IDs of clubs where user is admin
}

export interface Club {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  category: string;
  memberCount: number;
  isFollowing?: boolean;
  admins: string[];
}

export interface Post {
  id: string;
  clubId: string;
  clubName: string;
  clubAvatar: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
}

export interface Event {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  clubId: string;
  clubName: string;
  clubAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}
