import { useState } from 'react';
import { Users, Calendar, Plus, Edit, MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { PostCard } from './PostCard';
import { EventCard } from './EventCard';
import { Club, Post, Event } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface AdminClubPageProps {
  club: Club;
  posts: Post[];
  events: Event[];
  onPostClick: (post: Post) => void;
  onEventClick: (event: Event) => void;
  onCreatePost: (content: string, image?: string) => void;
  onCreateEvent: (event: Omit<Event, 'id' | 'clubId' | 'clubName'>) => void;
  onUpdateClub: (updates: Partial<Club>) => void;
}

export function AdminClubPage({
  club,
  posts,
  events,
  onPostClick,
  onEventClick,
  onCreatePost,
  onCreateEvent,
  onUpdateClub
}: AdminClubPageProps) {
  const [activeTab, setActiveTab] = useState('posts');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isEditClubOpen, setIsEditClubOpen] = useState(false);

  // Post form state
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // Club edit form state
  const [clubDescription, setClubDescription] = useState(club.description);
  const [clubCategory, setClubCategory] = useState(club.category);

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast.error('Please enter post content');
      return;
    }
    
    onCreatePost(postContent, postImage || undefined);
    setPostContent('');
    setPostImage('');
    setIsCreatePostOpen(false);
    toast.success('Post created successfully!');
  };

  const handleCreateEvent = () => {
    if (!eventTitle.trim() || !eventDate || !eventTime || !eventLocation.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    onCreateEvent({
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      description: eventDescription
    });

    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventLocation('');
    setEventDescription('');
    setIsCreateEventOpen(false);
    toast.success('Event created successfully!');
  };

  const handleUpdateClub = () => {
    onUpdateClub({
      description: clubDescription,
      category: clubCategory
    });
    setIsEditClubOpen(false);
    toast.success('Club updated successfully!');
  };

  // Mock admin messages
  const adminMessages = [
    {
      id: '1',
      senderName: 'Alex Thompson',
      content: 'Hi! I\'m interested in joining the club. When is the next meeting?',
      timestamp: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      senderName: 'Jordan Lee',
      content: 'Could you share more information about membership fees?',
      timestamp: '5 hours ago',
      unread: true
    },
    {
      id: '3',
      senderName: 'Sam Wilson',
      content: 'Thanks for the quick response! I\'ll see you at the next event.',
      timestamp: '1 day ago',
      unread: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white">
      {/* Page Title */}
      <div className="bg-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-gray-900">{club.name} - Admin</h1>
        </div>
      </div>

      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Admin Mode: {club.name}
          </p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <ImageWithFallback
          src={club.coverImage}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Club Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-gray-900">{club.name}</CardTitle>
                  <Badge>{club.category}</Badge>
                </div>
                <CardDescription className="text-gray-600">
                  <Users className="w-4 h-4 inline mr-1" />
                  {club.memberCount} members
                </CardDescription>
              </div>
              
              <Dialog open={isEditClubOpen} onOpenChange={setIsEditClubOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Club Info
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Club Information</DialogTitle>
                    <DialogDescription>
                      Update your club's description and category.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={clubDescription}
                        onChange={(e) => setClubDescription(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={clubCategory}
                        onChange={(e) => setClubCategory(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditClubOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateClub}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{club.description}</p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="messages">
              Messages
              <Badge variant="destructive" className="ml-2">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>
                    Share updates, announcements, or news with your club members.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="post-content">Content</Label>
                    <Textarea
                      id="post-content"
                      placeholder="What's new with your club?"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="post-image">Image URL (optional)</Label>
                    <Input
                      id="post-image"
                      placeholder="https://example.com/image.jpg"
                      value={postImage}
                      onChange={(e) => setPostImage(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost}>Publish Post</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onPostClick={() => onPostClick(post)} />
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No posts yet. Create your first post!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Schedule a meeting, workshop, or activity for your club.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-title">Event Title *</Label>
                    <Input
                      id="event-title"
                      placeholder="e.g., Weekly Meeting"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date">Date *</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-time">Time *</Label>
                      <Input
                        id="event-time"
                        placeholder="e.g., 7:00 PM"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="event-location">Location *</Label>
                    <Input
                      id="event-location"
                      placeholder="e.g., Student Centre Room 301"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Event details..."
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent}>Create Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="grid md:grid-cols-2 gap-6">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard key={event.id} event={event} onEventClick={() => onEventClick(event)} />
                ))
              ) : (
                <Card className="md:col-span-2">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No events scheduled. Create your first event!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Member Messages</CardTitle>
                <CardDescription>Messages from members interested in your club</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminMessages.map((message) => (
                  <Card key={message.id} className={message.unread ? 'border-orange-200 bg-orange-50/50' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{message.senderName}</CardTitle>
                          <CardDescription>{message.timestamp}</CardDescription>
                        </div>
                        {message.unread && (
                          <Badge variant="destructive">New</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700">{message.content}</p>
                      <Button size="sm" variant="outline">
                        <Send className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Members ({club.memberCount})</CardTitle>
                <CardDescription>Manage your club members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Member management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
