import { useState } from 'react';
import { Users, Heart, MessageCircle, Settings, UserPlus, Calendar, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { PostCard } from './PostCard';
import { EventCard } from './EventCard';
import { Club, Post, Event } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ClubPageProps {
  club: Club;
  posts: Post[];
  events: Event[];
  isAdmin?: boolean;
  onFollowToggle: () => void;
  onMessageAdmin: () => void;
  onPostClick: (post: Post) => void;
  onEventClick: (event: Event) => void;
}

export function ClubPage({
  club,
  posts,
  events,
  isAdmin = false,
  onFollowToggle,
  onMessageAdmin,
  onPostClick,
  onEventClick
}: ClubPageProps) {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white">
      {/* Page Title */}
      <div className="bg-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-gray-900">{club.name}</h1>
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
              
              <div className="flex gap-2">
                {!isAdmin && (
                  <>
                    <Button
                      variant={club.isFollowing ? 'outline' : 'default'}
                      onClick={onFollowToggle}
                      className="flex items-center gap-2"
                    >
                      <Heart className={`w-4 h-4 ${club.isFollowing ? 'fill-current' : ''}`} />
                      {club.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="outline" onClick={onMessageAdmin}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Admins
                    </Button>
                  </>
                )}
                
                {isAdmin && (
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Club
                  </Button>
                )}
              </div>
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
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {isAdmin && (
              <Button className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            )}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onPostClick={() => onPostClick(post)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {isAdmin && (
              <Button className="w-full md:w-auto">
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} onEventClick={() => onEventClick(event)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Members ({club.memberCount})</CardTitle>
                  {isAdmin && (
                    <Button variant="outline" size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Member list coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About {club.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{club.description}</p>
                </div>
                <div>
                  <h4 className="text-gray-700 mb-2">Category</h4>
                  <Badge>{club.category}</Badge>
                </div>
                <div>
                  <h4 className="text-gray-700 mb-2">Members</h4>
                  <p className="text-gray-600">{club.memberCount} members</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
