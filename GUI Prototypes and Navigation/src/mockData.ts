// Mock data for the Clubr application
import { Club, Post, Event, Chat, Message } from './types';

export const mockClubs: Club[] = [
  {
    id: '1',
    name: "Queen's Journal",
    description: "Queen's independent student newspaper since 1873. Join our team of writers, editors, photographers, and designers to cover campus news, arts, sports, and more.",
    coverImage: 'https://images.unsplash.com/photo-1711961530500-6e370832c9c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBqb3VybmFsaXNtJTIwc3R1ZGVudHxlbnwxfHx8fDE3NjE5NTA1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Media',
    memberCount: 87,
    isFollowing: true,
    admins: ['user1', 'user2']
  },
  {
    id: '2',
    name: 'Queen\'s Badminton Team',
    description: 'Competitive and recreational badminton for all skill levels. Weekly practices, tournaments, and a great community of athletes. Tryouts held each September!',
    coverImage: 'https://images.unsplash.com/photo-1616562007889-186b6cf7fb53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBzcG9ydHxlbnwxfHx8fDE3NjE4NzcyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Sports',
    memberCount: 45,
    isFollowing: true,
    admins: ['user3']
  },
  {
    id: '3',
    name: "Queen's Model Parliament",
    description: 'Experience Canadian parliamentary democracy firsthand. Debate current issues, develop public speaking skills, and network with politically engaged students.',
    coverImage: 'https://images.unsplash.com/photo-1742252306330-453455bd7526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJsaWFtZW50JTIwZGViYXRlfGVufDF8fHx8MTc2MTk1MDU0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Politics',
    memberCount: 63,
    isFollowing: false,
    admins: ['user4']
  },
  {
    id: '4',
    name: 'Vogue Charity Fashion Show',
    description: 'Queen\'s largest student-run fashion show raising funds for local charities. Designers, models, photographers, and organizers all welcome!',
    coverImage: 'https://images.unsplash.com/photo-1543728069-a3f97c5a2f32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvdyUyMHJ1bndheXxlbnwxfHx8fDE3NjE5NDgyODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Fashion',
    memberCount: 128,
    isFollowing: false,
    admins: ['user5']
  },
  {
    id: '5',
    name: 'CFRC 101.9 FM',
    description: 'Queen\'s campus-community radio station. Host your own show, learn audio production, and share your voice with Kingston and beyond!',
    coverImage: 'https://images.unsplash.com/photo-1760895223972-57b1d858d77e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWRpbyUyMGJyb2FkY2FzdCUyMHN0dWRpb3xlbnwxfHx8fDE3NjE5NDA3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Media',
    memberCount: 52,
    isFollowing: false,
    admins: ['user6']
  },
  {
    id: '6',
    name: 'Queen\'s Musical Theatre',
    description: 'Bringing Broadway to campus! Audition for our main stage productions, join the crew, or help with choreography, set design, and costumes.',
    coverImage: 'https://images.unsplash.com/photo-1732968452564-17a1983f8f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwbXVzaWNhbCUyMHN0YWdlfGVufDF8fHx8MTc2MTk1MDU0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Arts',
    memberCount: 94,
    isFollowing: false,
    admins: ['user7']
  },
  {
    id: '7',
    name: 'Queen\'s Engineering Society',
    description: 'Representing all engineering students. Plan events, network with industry professionals, and work on exciting technical projects and competitions.',
    coverImage: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHJvYm90aWNzfGVufDF8fHx8MTc2MTk1MDU1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Technology',
    memberCount: 267,
    isFollowing: false,
    admins: ['user8']
  },
  {
    id: '8',
    name: 'Commerce Society',
    description: 'Building the next generation of business leaders. Career development, networking events, case competitions, and social activities for Smith School students.',
    coverImage: 'https://images.unsplash.com/photo-1657812159103-1b2a52a7f5e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbW1lcmNlJTIwbmV0d29ya2luZ3xlbnwxfHx8fDE3NjE5NTA1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Business',
    memberCount: 312,
    isFollowing: false,
    admins: ['user9']
  }
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    clubId: '1',
    clubName: "Queen's Journal",
    clubAvatar: 'https://images.unsplash.com/photo-1711961530500-6e370832c9c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBqb3VybmFsaXNtJTIwc3R1ZGVudHxlbnwxfHx8fDE3NjE5NTA1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    content: "📰 This week's edition is out! Featuring an exclusive interview with the AMS President and coverage of Homecoming 2025. Pick up your copy around campus!",
    createdAt: '2 hours ago',
    likes: 34
  },
  {
    id: 'p2',
    clubId: '2',
    clubName: "Queen's Badminton Team",
    clubAvatar: 'https://images.unsplash.com/photo-1616562007889-186b6cf7fb53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBzcG9ydHxlbnwxfHx8fDE3NjE4NzcyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    content: '🏸 Huge win against U of T this weekend! 5-2 victory. Amazing teamwork everyone - OUA championships here we come! 💙💛',
    image: 'https://images.unsplash.com/photo-1616562007889-186b6cf7fb53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBzcG9ydHxlbnwxfHx8fDE3NjE4NzcyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    createdAt: '5 hours ago',
    likes: 67
  },
  {
    id: 'p3',
    clubId: '1',
    clubName: "Queen's Journal",
    clubAvatar: 'https://images.unsplash.com/photo-1711961530500-6e370832c9c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBqb3VybmFsaXNtJTIwc3R1ZGVudHxlbnwxfHx8fDE3NjE5NTA1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    content: "We're hiring! Looking for writers for our News, Arts, and Sports sections. No experience necessary - just passion for storytelling. Applications due Friday!",
    createdAt: '1 day ago',
    likes: 28
  }
];

export const mockEvents: Event[] = [
  {
    id: 'e1',
    clubId: '1',
    clubName: "Queen's Journal",
    title: 'Journalism Workshop: Investigative Reporting',
    date: '2025-11-05',
    time: '7:00 PM',
    location: 'Journal Office - Carruthers Hall',
    description: 'Learn investigative journalism techniques from our senior editors. Pizza provided!'
  },
  {
    id: 'e2',
    clubId: '2',
    clubName: "Queen's Badminton Team",
    title: 'OUA Championship Tournament',
    date: '2025-11-08',
    time: '9:00 AM',
    location: 'Queen\'s Athletics & Recreation Centre',
    description: 'Come support the Gaels as we compete for the OUA title! Spectators welcome and encouraged!'
  },
  {
    id: 'e3',
    clubId: '4',
    clubName: 'Vogue Charity Fashion Show',
    title: 'Annual Charity Fashion Show',
    date: '2025-11-10',
    time: '7:00 PM',
    location: 'Grant Hall',
    description: 'Our biggest event of the year! Showcasing student designers and raising funds for the Kingston Youth Shelter. Tickets on sale now!'
  },
  {
    id: 'e4',
    clubId: '3',
    clubName: "Queen's Model Parliament",
    title: 'Fall Parliamentary Debate Session',
    date: '2025-11-15',
    time: '6:30 PM',
    location: 'Policy Studies Building',
    description: 'This session: Climate policy and Indigenous reconciliation. All students welcome to participate or observe.'
  },
  {
    id: 'e5',
    clubId: '6',
    clubName: "Queen's Musical Theatre",
    title: 'Spring Musical Auditions',
    date: '2025-11-06',
    time: '6:00 PM',
    location: 'Theological Hall',
    description: 'Auditions for our spring production of "Into the Woods"! Prepare 16 bars of a musical theatre song. All voice types needed!'
  },
  {
    id: 'e6',
    clubId: '5',
    clubName: 'CFRC 101.9 FM',
    title: 'New DJ Training Session',
    date: '2025-11-12',
    time: '5:00 PM',
    location: 'CFRC Studio - Carruthers Hall',
    description: 'Want to host your own radio show? Come learn the basics of broadcasting, audio equipment, and FCC regulations.'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'admin1',
    senderName: 'Emma - Journal Editor',
    senderAvatar: '',
    content: 'Thanks for your interest in the Queen\'s Journal! We\'d love to have you on our writing team.',
    timestamp: '10:30 AM',
    isRead: true
  },
  {
    id: 'm2',
    senderId: 'currentUser',
    senderName: 'You',
    senderAvatar: '',
    content: 'Thank you! When is the next writers meeting?',
    timestamp: '10:32 AM',
    isRead: true
  },
  {
    id: 'm3',
    senderId: 'admin1',
    senderName: 'Emma - Journal Editor',
    senderAvatar: '',
    content: 'Our next meeting is November 5th at 7 PM in Carruthers Hall. We\'ll have a journalism workshop too. Hope to see you there!',
    timestamp: '10:35 AM',
    isRead: true
  }
];

export const mockChats: Chat[] = [
  {
    id: 'c1',
    clubId: '1',
    clubName: "Queen's Journal",
    clubAvatar: 'https://images.unsplash.com/photo-1711961530500-6e370832c9c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBqb3VybmFsaXNtJTIwc3R1ZGVudHxlbnwxfHx8fDE3NjE5NTA1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: 'Our next meeting is November 5th at 7 PM in Carruthers Hall...',
    lastMessageTime: '10:35 AM',
    unreadCount: 0,
    messages: mockMessages
  },
  {
    id: 'c2',
    clubId: '2',
    clubName: "Queen's Badminton Team",
    clubAvatar: 'https://images.unsplash.com/photo-1616562007889-186b6cf7fb53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBzcG9ydHxlbnwxfHx8fDE3NjE4NzcyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lastMessage: 'Practice is at 7pm tomorrow. Don\'t forget your racket!',
    lastMessageTime: 'Yesterday',
    unreadCount: 2,
    messages: []
  }
];

export const interests = [
  'Media',
  'Sports',
  'Politics',
  'Fashion',
  'Arts',
  'Technology',
  'Business',
  'Music',
  'Volunteering',
  'Gaming',
  'Science',
  'Culture'
];
