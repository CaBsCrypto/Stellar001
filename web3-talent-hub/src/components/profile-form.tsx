'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/lib/blockchain-service';
import { CreatorSpecialty } from '@/types';
import { Plus, X, Loader2, ExternalLink } from 'lucide-react';

interface ProfileFormProps {
  initialData?: Partial<ProfileData>;
  onSubmit: (data: ProfileData) => Promise<boolean>;
  isLoading?: boolean;
  submitText?: string;
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

export function ProfileForm({ initialData, onSubmit, isLoading, submitText = 'Create Profile' }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>({
    displayName: initialData?.displayName || '',
    bio: initialData?.bio || '',
    specialties: initialData?.specialties || [],
    portfolioLinks: initialData?.portfolioLinks || [],
    socialLinks: initialData?.socialLinks || [],
    location: initialData?.location || '',
    hourlyRate: initialData?.hourlyRate || undefined,
    availability: initialData?.availability || 'available',
  });

  const [newPortfolioLink, setNewPortfolioLink] = useState({ title: '', url: '', description: '' });
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.displayName.trim()) {
      alert('Display name is required');
      return;
    }
    
    if (!formData.bio.trim()) {
      alert('Bio is required');
      return;
    }
    
    if (formData.specialties.length === 0) {
      alert('Please select at least one specialty');
      return;
    }

    await onSubmit(formData);
  };

  const addSpecialty = (specialty: string) => {
    if (!formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty],
      }));
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty),
    }));
  };

  const addPortfolioLink = () => {
    if (newPortfolioLink.title && newPortfolioLink.url) {
      setFormData(prev => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, { ...newPortfolioLink }],
      }));
      setNewPortfolioLink({ title: '', url: '', description: '' });
    }
  };

  const removePortfolioLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((_, i) => i !== index),
    }));
  };

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setFormData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { ...newSocialLink }],
      }));
      setNewSocialLink({ platform: '', url: '' });
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Display Name *</label>
          <Input
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            placeholder="Your professional name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio *</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself and your expertise..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hourly Rate (USD)</label>
            <Input
              type="number"
              value={formData.hourlyRate || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                hourlyRate: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              placeholder="50"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Availability</label>
          <Select
            value={formData.availability}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              availability: e.target.value as 'available' | 'busy' | 'unavailable' 
            }))}
          >
            <option value="available">Available for new projects</option>
            <option value="busy">Busy but open to great opportunities</option>
            <option value="unavailable">Not available</option>
          </Select>
        </div>
      </div>

      {/* Specialties */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Specialties *</h3>
        
        <div>
          <Select
            onChange={(e) => {
              if (e.target.value) {
                addSpecialty(e.target.value);
                e.target.value = '';
              }
            }}
          >
            <option value="">Select a specialty to add</option>
            {CREATOR_SPECIALTIES.map(specialty => (
              <option key={specialty.value} value={specialty.value}>
                {specialty.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.specialties.map(specialty => {
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
      </div>

      {/* Portfolio Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Portfolio Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            value={newPortfolioLink.title}
            onChange={(e) => setNewPortfolioLink(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Project title"
          />
          <Input
            value={newPortfolioLink.url}
            onChange={(e) => setNewPortfolioLink(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://..."
          />
          <div className="flex gap-2">
            <Input
              value={newPortfolioLink.description}
              onChange={(e) => setNewPortfolioLink(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description (optional)"
            />
            <Button
              type="button"
              onClick={addPortfolioLink}
              size="sm"
              disabled={!newPortfolioLink.title || !newPortfolioLink.url}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {formData.portfolioLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{link.title}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                {link.description && (
                  <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removePortfolioLink(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            value={newSocialLink.platform}
            onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
            placeholder="Platform (e.g., Twitter)"
          />
          <Input
            value={newSocialLink.url}
            onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://..."
          />
          <Button
            type="button"
            onClick={addSocialLink}
            size="sm"
            disabled={!newSocialLink.platform || !newSocialLink.url}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">{link.platform}</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeSocialLink(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <Button type="submit" size="lg" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Profile...
            </>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
}

