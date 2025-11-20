import { useState } from 'react';
import { User, Upload, MapPin, Calendar, Mail, Edit2, Shield, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Club } from '../types';
import { toast } from 'sonner';

interface ProfilePageProps {
  userClubs: Club[];
  adminClubIds: string[];
  onNavigateToClub: (club: Club) => void;
}

export function ProfilePage({ userClubs, adminClubIds, onNavigateToClub }: ProfilePageProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState('Alex Thompson');
  const [userEmail] = useState('alex.thompson@queensu.ca');
  const [userBio, setUserBio] = useState('Third-year Commerce student passionate about community building and trying new activities! Love meeting new people and exploring different interests.');
  const [userLocation, setUserLocation] = useState('Kingston, ON');
  const [userJoinDate] = useState('September 2023');
  
  // Temporary state for editing
  const [tempName, setTempName] = useState(userName);
  const [tempBio, setTempBio] = useState(userBio);
  const [tempLocation, setTempLocation] = useState(userLocation);

  const handleSaveProfile = () => {
    setUserName(tempName);
    setUserBio(tempBio);
    setUserLocation(tempLocation);
    setIsEditingProfile(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setTempName(userName);
    setTempBio(userBio);
    setTempLocation(userLocation);
    setIsEditingProfile(false);
  };

  const handlePhotoUpload = () => {
    toast.info('Photo upload feature coming soon!');
  };

  // Get clubs user is following
  const followingClubs = userClubs.filter(club => club.isFollowing);
  const adminClubs = userClubs.filter(club => adminClubIds.includes(club.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="w-32 h-32">
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-rose-400 text-white">
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handlePhotoUpload}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload className="w-8 h-8 text-white" />
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={handlePhotoUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="mb-1">{userName}</h1>
                    <div className="flex items-center gap-4 text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {userEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {userLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Joined {userJoinDate}
                    </div>
                  </div>

                  <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Update your profile information
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={tempLocation}
                            onChange={(e) => setTempLocation(e.target.value)}
                            placeholder="City, Province"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={tempBio}
                            onChange={(e) => setTempBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <p className="text-gray-700">{userBio}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                      {followingClubs.length}
                    </div>
                    <p className="text-sm text-gray-600">Clubs Joined</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                      {adminClubs.length}
                    </div>
                    <p className="text-sm text-gray-600">Admin Roles</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                      {userClubs.length}
                    </div>
                    <p className="text-sm text-gray-600">Total Clubs</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Clubs Section */}
        {adminClubs.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                Admin Roles
              </CardTitle>
              <CardDescription>
                Clubs you manage and moderate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminClubs.map((club) => (
                  <div
                    key={club.id}
                    className="flex items-center gap-4 p-4 border border-orange-200 rounded-lg bg-gradient-to-br from-orange-50 to-rose-50 hover:border-orange-300 transition-all cursor-pointer"
                    onClick={() => onNavigateToClub(club)}
                  >
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 mb-1 truncate">{club.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          Admin
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {club.memberCount} members
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Clubs Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-orange-500" />
              My Clubs
            </CardTitle>
            <CardDescription>
              Clubs you're a member of
            </CardDescription>
          </CardHeader>
          <CardContent>
            {followingClubs.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">You haven't joined any clubs yet</p>
                <Button variant="outline">
                  Discover Clubs
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followingClubs.map((club) => (
                  <div
                    key={club.id}
                    className="group cursor-pointer"
                    onClick={() => onNavigateToClub(club)}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3 aspect-video bg-gradient-to-br from-orange-100 to-rose-100">
                      <img
                        src={club.coverImage}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {adminClubIds.includes(club.id) && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-orange-500 text-white">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        </div>
                      )}
                    </div>
                    <h3 className="text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                      {club.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{club.category}</Badge>
                      <span className="text-sm text-gray-600">
                        {club.memberCount} members
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
