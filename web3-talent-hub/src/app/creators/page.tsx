'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { CreatorCard } from '@/components/creator-card';
import { CreatorsFilter } from '@/components/creators-filter';
import { Button } from '@/components/ui/button';
import { useCreators, CreatorFilters } from '@/hooks/use-creators';
import { Users, RefreshCw, AlertCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function CreatorsPage() {
  const [filters, setFilters] = useState<CreatorFilters>({});
  const { creators, isLoading, error, refetch } = useCreators(filters);

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Creators
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Connect with talented creators in the Web3 ecosystem. All profiles are verified on the Stellar blockchain.
            </p>
            
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/create-profile">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Join as Creator
                </Link>
              </Button>
              <Button variant="outline" onClick={refetch}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <CreatorsFilter
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Results */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isLoading ? (
                  'Loading creators...'
                ) : (
                  <>
                    {creators.length} Creator{creators.length !== 1 ? 's' : ''} Found
                  </>
                )}
              </h2>
              
              {!isLoading && creators.length > 0 && (
                <div className="text-sm text-gray-600">
                  Sorted by reputation
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading creators...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Creators</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && creators.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Creators Found</h3>
              <p className="text-gray-600 mb-6">
                {Object.keys(filters).length > 0 
                  ? "No creators match your current filters. Try adjusting your search criteria."
                  : "No creators have joined the platform yet. Be the first to create your profile!"
                }
              </p>
              
              <div className="flex justify-center gap-4">
                {Object.keys(filters).length > 0 && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
                <Button asChild>
                  <Link href="/create-profile">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Profile
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Creators Grid */}
          {!isLoading && !error && creators.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <CreatorCard key={creator.publicKey} creator={creator} />
              ))}
            </div>
          )}

          {/* Load More (Future Enhancement) */}
          {!isLoading && !error && creators.length > 0 && creators.length >= 12 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Creators
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

