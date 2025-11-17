import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Post } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PostCardProps {
  post: Post;
  onPostClick?: () => void;
}

export function PostCard({ post, onPostClick }: PostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-orange-200 border-orange-50" onClick={onPostClick}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{post.clubName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-gray-900">{post.clubName}</p>
            <p className="text-gray-500">{post.createdAt}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-800">{post.content}</p>
        {post.image && (
          <ImageWithFallback
            src={post.image}
            alt="Post image"
            className="w-full h-64 object-cover rounded-lg"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          {post.likes}
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
