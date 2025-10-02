'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreatorFilters } from '@/hooks/use-creators';
import { CreatorSpecialty } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface CreatorsFilterProps {
  filters: CreatorFilters;
  onFiltersChange: (filters: CreatorFilters) => void;
  onClearFilters: () => void;
}

const CREATOR_SPECIALTIES = [
  { value: CreatorSpecialty.YOUTUBE, label: 'YouTube Creator' },
  { value: CreatorSpecialty.TIKTOK, label: 'TikTok Creator' },
  { value: CreatorSpecialty.INSTAGRAM, label: 'Instagram Creator' },
  { value: CreatorSpecialty.TWITCH, label: 'Twitch Streamer' },
  { value: CreatorSpecialty.TWITTER, label: 'Twitter/X Creator' },
  { value: CreatorSpecialty.LINKEDIN, label: 'LinkedIn Creator' },
  { value: CreatorSpecialty.PODCAST, label: 'Podcaster' },
  { value: CreatorSpecialty.BLOG, label: 'Blogger' },
  { value: CreatorSpecialty.VIDEO_EDITING, label: 'Video Editor' },
  { value: CreatorSpecialty.GRAPHIC_DESIGN, label: 'Graphic Designer' },
  { value: CreatorSpecialty.COPYWRITING, label: 'Copywriter' },
  { value: CreatorSpecialty.PHOTOGRAPHY, label: 'Photographer' },
];

export function CreatorsFilter({ filters, onFiltersChange, onClearFilters }: CreatorsFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof CreatorFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const addSpecialty = (specialty: string) => {
    const currentSpecialties = filters.specialties || [];
    if (!currentSpecialties.includes(specialty)) {
      updateFilter('specialties', [...currentSpecialties, specialty]);
    }
  };

  const removeSpecialty = (specialty: string) => {
    const currentSpecialties = filters.specialties || [];
    updateFilter('specialties', currentSpecialties.filter(s => s !== specialty));
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search creators by name, bio, or skills..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t">
          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium mb-2">Specialties</label>
            <Select
              onChange={(e) => {
                if (e.target.value) {
                  addSpecialty(e.target.value);
                  e.target.value = '';
                }
              }}
            >
              <option value="">Add specialty filter</option>
              {CREATOR_SPECIALTIES.map(specialty => (
                <option key={specialty.value} value={specialty.value}>
                  {specialty.label}
                </option>
              ))}
            </Select>
            
            {filters.specialties && filters.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.specialties.map(specialty => {
                  const specialtyLabel = CREATOR_SPECIALTIES.find(s => s.value === specialty)?.label || specialty;
                  return (
                    <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                      {specialtyLabel}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Availability */}
            <div>
              <label className="block text-sm font-medium mb-2">Availability</label>
              <Select
                value={filters.availability || ''}
                onChange={(e) => updateFilter('availability', e.target.value || undefined)}
              >
                <option value="">Any</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </Select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <Select
                value={filters.level || ''}
                onChange={(e) => updateFilter('level', e.target.value || undefined)}
              >
                <option value="">Any Level</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </Select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Rating</label>
              <Select
                value={filters.minRating?.toString() || ''}
                onChange={(e) => updateFilter('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
              >
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </Select>
            </div>

            {/* Max Hourly Rate */}
            <div>
              <label className="block text-sm font-medium mb-2">Max Rate ($/hr)</label>
              <Input
                type="number"
                placeholder="Any"
                value={filters.maxHourlyRate || ''}
                onChange={(e) => updateFilter('maxHourlyRate', e.target.value ? parseInt(e.target.value) : undefined)}
                min="1"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              placeholder="City, Country"
              value={filters.location || ''}
              onChange={(e) => updateFilter('location', e.target.value || undefined)}
            />
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Showing creators matching your filters
            {filters.specialties && filters.specialties.length > 0 && (
              <span> • {filters.specialties.length} specialt{filters.specialties.length === 1 ? 'y' : 'ies'}</span>
            )}
            {filters.availability && (
              <span> • {filters.availability}</span>
            )}
            {filters.level && (
              <span> • {filters.level} level</span>
            )}
            {filters.minRating && (
              <span> • {filters.minRating}+ stars</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

