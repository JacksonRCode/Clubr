import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onEventClick?: () => void;
}

export function EventCard({ event, onEventClick }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer hover:border-orange-200 border-orange-50 bg-gradient-to-br from-white to-orange-50/30" 
      onClick={onEventClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-1">{event.title}</CardTitle>
            <CardDescription>{event.clubName}</CardDescription>
          </div>
          <Badge variant="secondary">{formattedDate}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
      </CardContent>
    </Card>
  );
}
