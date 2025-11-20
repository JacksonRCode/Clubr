import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { InterestSelection } from './components/InterestSelection';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { DiscoveryPage } from './components/DiscoveryPage';
import { ClubPage } from './components/ClubPage';
import { AdminClubPage } from './components/AdminClubPage';
import { MessagesPage } from './components/MessagesPage';
import { MyClubsPage } from './components/MyClubsPage';
import { ProfilePage } from './components/ProfilePage';
import { mockClubs, mockPosts, mockEvents, mockChats } from './mockData';
import { Club, Post, Event } from './types';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type AppState = 'login' | 'interests' | 'app';
type PageType = 'home' | 'discovery' | 'club' | 'messages' | 'clubs' | 'profile';

export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentPage, setCurrentPage] = useState<PageType>('discovery');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubs, setClubs] = useState(mockClubs);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [posts, setPosts] = useState(mockPosts);
  const [events, setEvents] = useState(mockEvents);

  // Admin mode state - for demo, user is admin of Queen's Journal and Badminton Team
  const [userAdminClubIds] = useState(['1', '2']); // IDs of clubs where user is admin
  const [currentAdminClub, setCurrentAdminClub] = useState<Club | null>(null);

  // Check if user is following any clubs
  const hasFollowingClubs = clubs.some(club => club.isFollowing);

  // Get clubs where user is admin
  const adminClubs = clubs.filter(club => userAdminClubIds.includes(club.id));

  const handleLogin = () => {
    // Check if user has selected interests - if not, show interest selection
    if (userInterests.length === 0) {
      setAppState('interests');
    } else {
      setAppState('app');
      // If user has following clubs, go to home, otherwise go to discovery
      setCurrentPage(hasFollowingClubs ? 'home' : 'discovery');
    }
  };

  const handleSignUp = () => {
    setAppState('interests');
  };

  const handleInterestsComplete = (interests: string[]) => {
    setUserInterests(interests);
    setAppState('app');
    setCurrentPage('discovery');
    toast.success('Welcome to Clubr! Discover clubs based on your interests.');
  };

  const handleLogout = () => {
    setAppState('login');
    setCurrentPage('discovery');
    setSelectedClub(null);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
    if (page !== 'club') {
      setSelectedClub(null);
    }
  };

  const handleClubClick = (club: Club) => {
    setSelectedClub(club);
    setCurrentPage('club');
  };

  const handleFollowToggle = (clubId: string) => {
    setClubs(prevClubs =>
      prevClubs.map(club =>
        club.id === clubId
          ? { ...club, isFollowing: !club.isFollowing }
          : club
      )
    );

    const club = clubs.find(c => c.id === clubId);
    if (club) {
      if (!club.isFollowing) {
        toast.success(`You are now following ${club.name}`);
      } else {
        toast.info(`You unfollowed ${club.name}`);
      }
    }
  };

  const handlePostClick = (post: Post) => {
    const club = clubs.find(c => c.id === post.clubId);
    if (club) {
      handleClubClick(club);
    }
  };

  const handleEventClick = (event: Event) => {
    const club = clubs.find(c => c.id === event.clubId);
    if (club) {
      handleClubClick(club);
    }
  };

  const handleMessageAdmin = () => {
    setCurrentPage('messages');
    toast.info('Opening chat with club admins');
  };

  const handleAdminModeToggle = (club: Club | null) => {
    setCurrentAdminClub(club);
    if (club) {
      setSelectedClub(club);
      setCurrentPage('club');
      toast.success(`Switched to admin mode for ${club.name}`);
    } else {
      toast.info('Exited admin mode');
    }
  };

  const handleCreatePost = (content: string, image?: string) => {
    if (!currentAdminClub) return;

    const newPost: Post = {
      id: `p${posts.length + 1}`,
      clubId: currentAdminClub.id,
      clubName: currentAdminClub.name,
      clubAvatar: currentAdminClub.coverImage,
      content,
      image,
      createdAt: 'Just now',
      likes: 0
    };

    setPosts([newPost, ...posts]);
  };

  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'clubId' | 'clubName'>) => {
    if (!currentAdminClub) return;

    const newEvent: Event = {
      id: `e${events.length + 1}`,
      clubId: currentAdminClub.id,
      clubName: currentAdminClub.name,
      ...eventData
    };

    setEvents([...events, newEvent]);
  };

  const handleUpdateClub = (updates: Partial<Club>) => {
    if (!currentAdminClub) return;

    setClubs(prevClubs =>
      prevClubs.map(club =>
        club.id === currentAdminClub.id
          ? { ...club, ...updates }
          : club
      )
    );

    setCurrentAdminClub(prev => prev ? { ...prev, ...updates } : null);
    setSelectedClub(prev => prev ? { ...prev, ...updates } : null);
  };

  // Filter data based on following status
  const followedClubs = clubs.filter(club => club.isFollowing);
  const discoveryClubs = clubs.filter(club => !club.isFollowing);
  const followedPosts = posts.filter(post =>
    followedClubs.some(club => club.id === post.clubId)
  );
  const followedEvents = events.filter(event =>
    followedClubs.some(club => club.id === event.clubId)
  );

  // Get posts and events for selected club
  const selectedClubPosts = selectedClub
    ? posts.filter(post => post.clubId === selectedClub.id)
    : [];
  const selectedClubEvents = selectedClub
    ? events.filter(event => event.clubId === selectedClub.id)
    : [];

  // Render based on app state
  if (appState === 'login') {
    return <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  if (appState === 'interests') {
    return <InterestSelection onComplete={handleInterestsComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-rose-50/30 to-amber-50/50">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        hasFollowingClubs={hasFollowingClubs}
        adminClubs={adminClubs}
        currentAdminClub={currentAdminClub}
        onAdminModeToggle={handleAdminModeToggle}
      />

      {currentPage === 'home' && (
        <HomePage
          posts={followedPosts}
          events={followedEvents}
          onPostClick={handlePostClick}
          onEventClick={handleEventClick}
        />
      )}

      {currentPage === 'discovery' && (
        <DiscoveryPage
          clubs={discoveryClubs}
          events={events}
          onClubClick={handleClubClick}
          onEventClick={handleEventClick}
          onFollowToggle={handleFollowToggle}
        />
      )}

      {currentPage === 'club' && selectedClub && (
        <>
          {currentAdminClub?.id === selectedClub.id ? (
            <AdminClubPage
              club={selectedClub}
              posts={selectedClubPosts}
              events={selectedClubEvents}
              onPostClick={handlePostClick}
              onEventClick={handleEventClick}
              onCreatePost={handleCreatePost}
              onCreateEvent={handleCreateEvent}
              onUpdateClub={handleUpdateClub}
            />
          ) : (
            <ClubPage
              club={selectedClub}
              posts={selectedClubPosts}
              events={selectedClubEvents}
              isAdmin={false}
              onFollowToggle={() => handleFollowToggle(selectedClub.id)}
              onMessageAdmin={handleMessageAdmin}
              onPostClick={handlePostClick}
              onEventClick={handleEventClick}
            />
          )}
        </>
      )}

      {currentPage === 'messages' && (
        <MessagesPage chats={mockChats} />
      )}

      {currentPage === 'clubs' && (
        <MyClubsPage
          clubs={clubs}
          onClubClick={handleClubClick}
          onFollowToggle={handleFollowToggle}
        />
      )}

      {currentPage === 'profile' && (
        <ProfilePage
          userClubs={clubs}
          adminClubIds={userAdminClubIds}
          onNavigateToClub={handleClubClick}
        />
      )}

      <Toaster />
    </div>
  );
}
