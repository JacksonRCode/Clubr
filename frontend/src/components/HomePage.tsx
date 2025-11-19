import { PostCard } from './PostCard';
import { EventCard } from './EventCard';
import { Post, Event } from '../types';

interface HomePageProps {
  posts: Post[];
  events: Event[];
  onPostClick: (post: Post) => void;
  onEventClick: (event: Event) => void;
}

export function HomePage({ posts, events, onPostClick, onEventClick }: HomePageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-orange-50/30 to-transparent min-h-screen">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-gray-900 mb-4">Following Feed</h2>
            <p className="text-gray-600 mb-6">Latest posts from clubs you follow</p>
          </div>
          
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onPostClick={() => onPostClick(post)} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No posts yet. Follow some clubs to see their updates!</p>
              </div>
            )}
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-gray-900 mb-4">Upcoming Events</h3>
            <p className="text-gray-600 mb-6">From clubs you follow</p>
          </div>
          
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} event={event} onEventClick={() => onEventClick(event)} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming events</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
