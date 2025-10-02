'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { ReputationDisplay } from '@/components/reputation-display';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/use-wallet';
import { 
  User, 
  Settings, 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  Clock,
  Wallet,
  AlertCircle,
  Edit3,
  Eye,
  TrendingUp
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    isConnected, 
    isRegistered, 
    profile, 
    reputation, 
    publicKey,
    isCheckingRegistration,
    connect,
    combinedError 
  } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <Wallet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
              <p className="text-gray-600 mb-6">
                Please connect your wallet to access your dashboard.
              </p>
              <Button onClick={connect} size="lg" className="w-full">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingRegistration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold mb-4">Loading...</h1>
              <p className="text-gray-600">Checking your registration status...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Create Your Profile</h1>
              <p className="text-gray-600 mb-6">
                You haven't created your creator profile yet. Start building your Web3 reputation today!
              </p>
              <Button onClick={() => router.push('/create-profile')} size="lg" className="w-full">
                Create Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !reputation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Error Loading Profile</h1>
              <p className="text-gray-600 mb-6">
                {combinedError || 'Unable to load your profile data. Please try again.'}
              </p>
              <Button onClick={() => window.location.reload()} size="lg" className="w-full">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile.displayName}!
              </h1>
              <p className="text-gray-600">
                Manage your profile, track your reputation, and discover new opportunities.
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" onClick={() => router.push(`/creator/${publicKey}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Public Profile
              </Button>
              <Button onClick={() => router.push('/dashboard/edit-profile')}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Overview */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-semibold">Profile Overview</h2>
                  <Badge variant={getAvailabilityColor(profile.availability) as any}>
                    <Clock className="mr-1 h-3 w-3" />
                    {getAvailabilityText(profile.availability)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700">{profile.bio}</p>
                  
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
                  </div>

                  {/* Specialties */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Links */}
              {profile.portfolioLinks.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                  <div className="space-y-3">
                    {profile.portfolioLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">{link.title}</h3>
                          {link.description && (
                            <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                          )}
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
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
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium">{link.platform}</span>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Reputation Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Reputation</h2>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <ReputationDisplay reputation={reputation} showDetails />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/creators')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Browse Creators
                  </Button>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collaborations</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Ratings</span>
                    <span className="font-semibold">{reputation.ratingsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

