import { useState, useRef, useEffect } from 'react';
import { Home, Compass, Heart, MessageCircle, User, Menu, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Club } from '../types';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  hasFollowingClubs: boolean;
  adminClubs: Club[];
  currentAdminClub: Club | null;
  onAdminModeToggle: (club: Club | null) => void;
}

export function Navigation({ 
  currentPage, 
  onNavigate, 
  onLogout, 
  hasFollowingClubs,
  adminClubs,
  currentAdminClub,
  onAdminModeToggle 
}: NavigationProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate(hasFollowingClubs ? 'home' : 'discovery')}
            className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent hover:from-orange-600 hover:to-rose-600 transition-all"
          >
            Clubr
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {hasFollowingClubs && (
              <Button
                variant={currentPage === 'home' ? 'default' : 'ghost'}
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            )}
            <Button
              variant={currentPage === 'discovery' ? 'default' : 'ghost'}
              onClick={() => onNavigate('discovery')}
              className="flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Discovery
            </Button>
            {hasFollowingClubs && (
              <Button
                variant={currentPage === 'clubs' ? 'default' : 'ghost'}
                onClick={() => onNavigate('clubs')}
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                My Clubs
              </Button>
            )}
            <Button
              variant={currentPage === 'messages' ? 'default' : 'ghost'}
              onClick={() => onNavigate('messages')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Messages
            </Button>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <div className="md:hidden" ref={mobileRef}>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {isMobileMenuOpen && (
                <div className="absolute right-4 top-16 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {hasFollowingClubs && (
                    <button
                      onClick={() => {
                        onNavigate('home');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      Home
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onNavigate('discovery');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    Discovery
                  </button>
                  {hasFollowingClubs && (
                    <button
                      onClick={() => {
                        onNavigate('clubs');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      My Clubs
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onNavigate('messages');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Messages
                  </button>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-full p-0"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <Avatar>
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 text-sm font-semibold border-b border-gray-200">
                    My Account
                  </div>
                  
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  
                  {adminClubs.length > 0 && (
                    <>
                      <div className="border-t border-gray-200 my-1" />
                      <div className="px-4 py-2 text-sm font-semibold text-orange-600">
                        Admin Mode
                      </div>
                      {currentAdminClub && (
                        <button
                          onClick={() => {
                            onAdminModeToggle(null);
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Exit Admin Mode
                        </button>
                      )}
                      {adminClubs.map((club) => (
                        <button
                          key={club.id}
                          onClick={() => {
                            onAdminModeToggle(club);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2 ${
                            currentAdminClub?.id === club.id ? 'bg-orange-50' : ''
                          }`}
                        >
                          <Shield className="w-4 h-4" />
                          {club.name}
                          {currentAdminClub?.id === club.id && ' (Active)'}
                        </button>
                      ))}
                    </>
                  )}
                  
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={() => {
                      onLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
