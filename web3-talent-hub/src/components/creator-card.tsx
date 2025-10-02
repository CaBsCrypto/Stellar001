'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Creator } from '@/hooks/use-creators';
import { formatPublicKey } from '@/lib/utils';
import { 
  Star, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink,
  User,
  Trophy
} from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const { profile, reputation, publicKey } = creator;

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'unavailable': return 'destructive';
      default: return 'secondary';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'unavailable': return 'Unavailable';
      default: return availability;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'text-amber-600 bg-amber-50';
      case 'silver': return 'text-gray-600 bg-gray-50';
      case 'gold': return 'text-yellow-600 bg-yellow-50';
      case 'platinum': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{profile.displayName}</h3>
            <p className="text-sm text-gray-500">{formatPublicKey(publicKey)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {reputation && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(reputation.level)}`}>
              <Trophy className="inline h-3 w-3 mr-1" />
              {reputation.level.charAt(0).toUpperCase() + reputation.level.slice(1)}
            </div>
          )}
          <Badge variant={getAvailabilityColor(profile.availability) as any} className="text-xs">
            <Clock className="mr-1 h-3 w-3" />
            {getAvailabilityText(profile.availability)}
          </Badge>
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {profile.bio}
      </p>

      {/* Specialties */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {profile.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          ))}
          {profile.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{profile.specialties.length - 3} more
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        {reputation && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{reputation.averageRating.toFixed(1)}</span>
            <span>({reputation.ratingsCount})</span>
          </div>
        )}
        
        {profile.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
        )}
        
        {profile.hourlyRate && (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>${profile.hourlyRate}/hr</span>
          </div>
        )}
      </div>

      {/* Portfolio Links Preview */}
      {profile.portfolioLinks.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">Recent Work:</div>
          <div className="space-y-1">
            {profile.portfolioLinks.slice(0, 2).map((link, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 truncate">{link.title}</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/creator/${publicKey}`}>
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </Button>
        <Button size="sm" className="flex-1">
          Contact
        </Button>
      </div>
    </div>
  );
}

