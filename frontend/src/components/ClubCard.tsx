import { Users, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Club } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ClubCardProps {
  club: Club;
  onClubClick?: () => void;
  onFollowToggle?: (clubId: string) => void;
}

export function ClubCard({ club, onClubClick, onFollowToggle }: ClubCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-orange-100">
      <div className="relative h-48 cursor-pointer" onClick={onClubClick}>
        <ImageWithFallback
          src={club.coverImage}
          alt={club.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="cursor-pointer" onClick={onClubClick}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{club.name}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="secondary">{club.category}</Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="cursor-pointer" onClick={onClubClick}>
        <p className="text-gray-600 line-clamp-2">{club.description}</p>
        <div className="flex items-center gap-2 mt-4 text-gray-500">
          <Users className="w-4 h-4" />
          <span>{club.memberCount} members</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={club.isFollowing ? 'outline' : 'default'}
          className="w-full"
          onClick={(e: any) => {
            e.stopPropagation();
            onFollowToggle?.(club.id);
          }}
        >
          {club.isFollowing ? (
            <>
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Following
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 mr-2" />
              Follow
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
