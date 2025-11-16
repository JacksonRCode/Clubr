import { ClubCard } from './ClubCard';
import { Club } from '../types';

interface MyClubsPageProps {
  clubs: Club[];
  onClubClick: (club: Club) => void;
  onFollowToggle: (clubId: string) => void;
}

export function MyClubsPage({ clubs, onClubClick, onFollowToggle }: MyClubsPageProps) {
  const followedClubs = clubs.filter(club => club.isFollowing);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">My Clubs</h2>
        <p className="text-gray-600">Clubs you're following</p>
      </div>

      {followedClubs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {followedClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              onClubClick={() => onClubClick(club)}
              onFollowToggle={onFollowToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You're not following any clubs yet</p>
          <p className="text-gray-400">Explore the Discovery page to find clubs that interest you!</p>
        </div>
      )}
    </div>
  );
}
