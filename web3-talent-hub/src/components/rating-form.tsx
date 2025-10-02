'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Star, Loader2 } from 'lucide-react';

interface RatingFormProps {
  targetPublicKey: string;
  onSubmit: (rating: number, category: string, projectId?: string) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RATING_CATEGORIES = [
  { value: 'quality', label: 'Quality of Work' },
  { value: 'communication', label: 'Communication' },
  { value: 'timeliness', label: 'Timeliness' },
  { value: 'professionalism', label: 'Professionalism' },
];

export function RatingForm({ targetPublicKey, onSubmit, onCancel, isLoading }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');
  const [projectId, setProjectId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (!category) {
      alert('Please select a category');
      return;
    }

    const success = await onSubmit(rating, category, projectId || undefined);
    if (success) {
      // Reset form
      setRating(0);
      setHoveredRating(0);
      setCategory('');
      setComment('');
      setProjectId('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Rate This Creator</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Rating *</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 hover:scale-110 transition-transform"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && (
                <>
                  {rating} star{rating !== 1 ? 's' : ''}
                  {rating === 1 && ' - Poor'}
                  {rating === 2 && ' - Fair'}
                  {rating === 3 && ' - Good'}
                  {rating === 4 && ' - Very Good'}
                  {rating === 5 && ' - Excellent'}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {RATING_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Project ID (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">Project ID (Optional)</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project ID if this rating is for a specific project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        </div>

        {/* Comment (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
          <Textarea
            placeholder="Share your experience working with this creator..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading || rating === 0 || !category}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Rating'
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Ratings are recorded on the Stellar blockchain and cannot be deleted. 
          Please ensure your rating is fair and accurate.
        </p>
      </div>
    </div>
  );
}
