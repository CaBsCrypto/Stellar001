'use client';

import { Badge } from '@/components/ui/badge';
import { Star, Trophy, Award, Medal } from 'lucide-react';

interface ReputationDisplayProps {
  reputation: {
    totalScore: number;
    ratingsCount: number;
    averageRating: number;
    level: 'bronze' | 'silver' | 'gold' | 'platinum';
    badges: string[];
  };
  showDetails?: boolean;
}

const LEVEL_CONFIG = {
  bronze: {
    color: 'bg-amber-600',
    textColor: 'text-amber-600',
    icon: Medal,
    label: 'Bronze',
    nextLevel: 'Silver (100 points)',
    nextThreshold: 100,
  },
  silver: {
    color: 'bg-gray-400',
    textColor: 'text-gray-600',
    icon: Award,
    label: 'Silver',
    nextLevel: 'Gold (500 points)',
    nextThreshold: 500,
  },
  gold: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    icon: Trophy,
    label: 'Gold',
    nextLevel: 'Platinum (1000 points)',
    nextThreshold: 1000,
  },
  platinum: {
    color: 'bg-purple-600',
    textColor: 'text-purple-600',
    icon: Trophy,
    label: 'Platinum',
    nextLevel: 'Max Level',
    nextThreshold: null,
  },
};

export function ReputationDisplay({ reputation, showDetails = false }: ReputationDisplayProps) {
  const levelConfig = LEVEL_CONFIG[reputation.level];
  const LevelIcon = levelConfig.icon;
  
  const progressPercentage = levelConfig.nextThreshold 
    ? Math.min(100, (reputation.totalScore / levelConfig.nextThreshold) * 100)
    : 100;

  return (
    <div className="space-y-4">
      {/* Level and Score */}
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${levelConfig.color} text-white`}>
          <LevelIcon className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{levelConfig.label} Level</h3>
            <Badge variant="outline" className={levelConfig.textColor}>
              {reputation.totalScore} points
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{reputation.averageRating.toFixed(1)}</span>
            <span>({reputation.ratingsCount} ratings)</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {levelConfig.nextThreshold && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to {levelConfig.nextLevel}</span>
            <span>{reputation.totalScore}/{levelConfig.nextThreshold}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${levelConfig.color}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Badges */}
      {reputation.badges.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Badges Earned</h4>
          <div className="flex flex-wrap gap-2">
            {reputation.badges.map((badge, index) => (
              <Badge key={index} variant="secondary">
                🏆 {badge}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Stats */}
      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{reputation.totalScore}</div>
            <div className="text-sm text-gray-600">Total Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{reputation.ratingsCount}</div>
            <div className="text-sm text-gray-600">Ratings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{reputation.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{reputation.badges.length}</div>
            <div className="text-sm text-gray-600">Badges</div>
          </div>
        </div>
      )}

      {/* Level Benefits */}
      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Level Benefits</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {reputation.level === 'bronze' && (
              <>
                <li>• Basic profile visibility</li>
                <li>• Can receive ratings</li>
              </>
            )}
            {reputation.level === 'silver' && (
              <>
                <li>• Enhanced profile visibility</li>
                <li>• Can rate other creators</li>
                <li>• Silver verification badge</li>
              </>
            )}
            {reputation.level === 'gold' && (
              <>
                <li>• Priority in search results</li>
                <li>• Featured profile sections</li>
                <li>• Gold verification badge</li>
                <li>• Access to premium collaborations</li>
              </>
            )}
            {reputation.level === 'platinum' && (
              <>
                <li>• Top-tier visibility</li>
                <li>• Platinum verification badge</li>
                <li>• Premium feature access</li>
                <li>• Exclusive collaboration opportunities</li>
                <li>• Priority customer support</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

