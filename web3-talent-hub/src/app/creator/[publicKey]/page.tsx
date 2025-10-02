'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { ReputationDisplay } from '@/components/reputation-display';
import { RatingForm } from '@/components/rating-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreator } from '@/hooks/use-creators';
import { useWallet } from '@/hooks/use-wallet';
import { formatPublicKey } from '@/lib/utils';
import { 
  User, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink,
  Star,
  MessageCircle,
  AlertCircle,
  Copy,
  Check,
  Share2
} from 'lucide-react';

export default function CreatorProfilePage() {
  const params = useParams();
  const publicKey = params.publicKey as string;
  const { creator, isLoading, error } = useCreator(publicKey);
  const { isConnected, publicKey: currentUserKey, submitRating } = useWallet();
  
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwnProfile = currentUserKey === publicKey;

  const handleRatingSubmit = async (rating: number, category: string, projectId?: string) => {
    setIsSubmittingRating(true);
    try {
      const success = await submitRating(publicKey, rating, category, projectId);
      if (success) {
        setShowRatingForm(false);
        // Optionally refresh creator data
        window.location.reload();
      }
      return success;
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const copyPublicKey = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${creator?.profile.displayName} - Web3 Talent Hub`,
          text: `Check out ${creator?.profile.displayName}'s profile on Web3 Talent Hub`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile URL copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading creator profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Creator Not Found</h1>
              <p className="text-gray-600 mb-6">
                {error || 'The creator profile you\'re looking for doesn\'t exist or hasn\'t been created yet.'}
              </p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { profile, reputation } = creator;

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
      case 'available': return 'Available for new projects';
      case 'busy': return 'Busy but open to opportunities';
      case 'unavailable': return 'Not available';
      default: return availability;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-6 mb-6 md:mb-0">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
                
                {/* Basic Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.displayName}</h1>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-600">{formatPublicKey(publicKey)}</span>
                    <button
                      onClick={copyPublicKey}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <Badge variant={getAvailabilityColor(profile.availability) as any} className="mb-3">
                    <Clock className="mr-1 h-3 w-3" />
                    {getAvailabilityText(profile.availability)}
                  </Badge>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                    {profile.hourlyRate && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${profile.hourlyRate}/hour
                      </div>
                    )}
                    {reputation && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {reputation.averageRating.toFixed(1)} ({reputation.ratingsCount} ratings)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={shareProfile}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                
                {!isOwnProfile && isConnected && (
                  <>
                    <Button variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                    <Button onClick={() => setShowRatingForm(true)}>
                      <Star className="mr-2 h-4 w-4" />
                      Rate Creator
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
              </div>

              {/* Specialties */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Portfolio */}
              {profile.portfolioLinks.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                  <div className="space-y-4">
                    {profile.portfolioLinks.map((link, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{link.title}</h3>
                            {link.description && (
                              <p className="text-gray-600 text-sm mb-2">{link.description}</p>
                            )}
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              View Project
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {profile.socialLinks.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4">Social Media</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profile.socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium">{link.platform}</span>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Form */}
              {showRatingForm && !isOwnProfile && (
                <RatingForm
                  targetPublicKey={publicKey}
                  onSubmit={handleRatingSubmit}
                  onCancel={() => setShowRatingForm(false)}
                  isLoading={isSubmittingRating}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Reputation */}
              {reputation && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4">Reputation</h2>
                  <ReputationDisplay reputation={reputation} showDetails />
                </div>
              )}

              {/* Contact Info */}
              {!isOwnProfile && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                  <div className="space-y-3">
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full">
                      Propose Collaboration
                    </Button>
                  </div>
                </div>
              )}

              {/* Verification */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Verification</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Stellar Wallet Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Profile on Blockchain</span>
                  </div>
                  {reputation && reputation.ratingsCount > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Community Rated</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

