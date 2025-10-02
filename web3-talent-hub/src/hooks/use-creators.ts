import { useState, useEffect } from 'react';
import { BlockchainService, ProfileData } from '@/lib/blockchain-service';

export interface Creator {
  publicKey: string;
  profile: ProfileData;
  reputation?: {
    totalScore: number;
    ratingsCount: number;
    averageRating: number;
    level: 'bronze' | 'silver' | 'gold' | 'platinum';
    badges: string[];
  };
}

export interface CreatorFilters {
  specialties?: string[];
  minRating?: number;
  maxHourlyRate?: number;
  availability?: 'available' | 'busy' | 'unavailable';
  location?: string;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  search?: string;
}

export function useCreators(filters?: CreatorFilters) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCreators = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allCreators = await BlockchainService.getAllCreators();
      
      // Load reputation data for each creator
      const creatorsWithReputation = await Promise.all(
        allCreators.map(async (creator) => {
          try {
            const reputation = await BlockchainService.getUserReputation(creator.publicKey);
            return {
              ...creator,
              reputation,
            };
          } catch (error) {
            console.error(`Error loading reputation for ${creator.publicKey}:`, error);
            return creator;
          }
        })
      );

      // Apply filters
      let filteredCreators = creatorsWithReputation;

      if (filters) {
        filteredCreators = creatorsWithReputation.filter((creator) => {
          // Search filter
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const matchesName = creator.profile.displayName.toLowerCase().includes(searchTerm);
            const matchesBio = creator.profile.bio.toLowerCase().includes(searchTerm);
            const matchesSpecialties = creator.profile.specialties.some(specialty =>
              specialty.toLowerCase().includes(searchTerm)
            );
            
            if (!matchesName && !matchesBio && !matchesSpecialties) {
              return false;
            }
          }

          // Specialties filter
          if (filters.specialties && filters.specialties.length > 0) {
            const hasMatchingSpecialty = filters.specialties.some(specialty =>
              creator.profile.specialties.includes(specialty)
            );
            if (!hasMatchingSpecialty) return false;
          }

          // Availability filter
          if (filters.availability && creator.profile.availability !== filters.availability) {
            return false;
          }

          // Location filter
          if (filters.location && creator.profile.location) {
            const locationMatch = creator.profile.location
              .toLowerCase()
              .includes(filters.location.toLowerCase());
            if (!locationMatch) return false;
          }

          // Hourly rate filter
          if (filters.maxHourlyRate && creator.profile.hourlyRate) {
            if (creator.profile.hourlyRate > filters.maxHourlyRate) return false;
          }

          // Rating filter
          if (filters.minRating && creator.reputation) {
            if (creator.reputation.averageRating < filters.minRating) return false;
          }

          // Level filter
          if (filters.level && creator.reputation) {
            if (creator.reputation.level !== filters.level) return false;
          }

          return true;
        });
      }

      // Sort by reputation score (highest first)
      filteredCreators.sort((a, b) => {
        const scoreA = a.reputation?.totalScore || 0;
        const scoreB = b.reputation?.totalScore || 0;
        return scoreB - scoreA;
      });

      setCreators(filteredCreators);
    } catch (error) {
      console.error('Error loading creators:', error);
      setError(error instanceof Error ? error.message : 'Failed to load creators');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCreators();
  }, [JSON.stringify(filters)]); // Re-run when filters change

  const refetch = () => {
    loadCreators();
  };

  return {
    creators,
    isLoading,
    error,
    refetch,
  };
}

export function useCreator(publicKey: string) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCreator = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [profile, reputation] = await Promise.all([
          BlockchainService.getUserProfile(publicKey),
          BlockchainService.getUserReputation(publicKey),
        ]);

        if (profile) {
          setCreator({
            publicKey,
            profile,
            reputation,
          });
        } else {
          setError('Creator not found');
        }
      } catch (error) {
        console.error('Error loading creator:', error);
        setError(error instanceof Error ? error.message : 'Failed to load creator');
      } finally {
        setIsLoading(false);
      }
    };

    if (publicKey) {
      loadCreator();
    }
  }, [publicKey]);

  return {
    creator,
    isLoading,
    error,
  };
}

