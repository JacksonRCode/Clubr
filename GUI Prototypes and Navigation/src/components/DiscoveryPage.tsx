import { ClubCard } from './ClubCard';
import { EventCard } from './EventCard';
import { Club, Event } from '../types';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface DiscoveryPageProps {
  clubs: Club[];
  events: Event[];
  onClubClick: (club: Club) => void;
  onEventClick: (event: Event) => void;
  onFollowToggle: (clubId: string) => void;
}

export function DiscoveryPage({ clubs, events, onClubClick, onEventClick, onFollowToggle }: DiscoveryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-rose-50/30 to-transparent min-h-screen">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Clubs Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-gray-900 mb-4">Discover Clubs</h2>
            <p className="text-gray-600 mb-6">Recommended clubs based on your interests</p>
            
            {/* Search Bar - Enhanced Visibility */}
            <div className="relative mb-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search clubs by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-400 bg-white shadow-sm"
              />
            </div>
            {searchQuery && (
              <p className="text-gray-500 mt-2">
                {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'} found
              </p>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onClubClick={() => onClubClick(club)}
                onFollowToggle={onFollowToggle}
              />
            ))}
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-gray-900 mb-4">All Events</h3>
            <p className="text-gray-600 mb-6">Upcoming events from all clubs</p>
          </div>
          
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onEventClick={() => onEventClick(event)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}