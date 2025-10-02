import { StellarService } from '@/lib/stellar';
import { TransactionBuilder, Operation, Keypair } from '@/lib/stellar';

export interface Rating {
  fromUser: string;
  toUser: string;
  rating: number; // 1-5
  category: string;
  projectId?: string;
  timestamp: number;
}

export interface ReputationData {
  totalScore: number;
  ratingsCount: number;
  averageRating: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  badges: string[];
}

export class ReputationSystemContract {
  private static readonly REPUTATION_PREFIX = 'REP_';
  private static readonly RATING_PREFIX = 'RATING_';
  private static readonly BADGE_PREFIX = 'BADGE_';

  /**
   * Submit a rating for a user
   */
  static async submitRating(
    raterKeypair: Keypair,
    targetUserPublicKey: string,
    rating: number,
    category: string,
    projectId?: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        return { success: false, error: 'Rating must be between 1 and 5' };
      }

      const account = await StellarService.getAccount(raterKeypair.publicKey());
      const ratingId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const ratingData = JSON.stringify({
        fromUser: raterKeypair.publicKey(),
        toUser: targetUserPublicKey,
        rating,
        category,
        projectId,
        timestamp: Date.now(),
      });

      const transaction = new TransactionBuilder(account, {
        fee: '100000',
        networkPassphrase: 'Test SDF Network ; September 2015',
      })
        // Store the rating
        .addOperation(
          Operation.manageData({
            name: `${this.RATING_PREFIX}${ratingId}`,
            value: ratingData,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(raterKeypair);
      
      const result = await StellarService.submitTransaction(transaction);

      // Update target user's reputation (this would be done by the contract in a real implementation)
      await this.updateUserReputation(targetUserPublicKey, rating);
      
      return {
        success: true,
        transactionHash: result.hash,
      };
    } catch (error) {
      console.error('Error submitting rating:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update user reputation score (internal method)
   */
  private static async updateUserReputation(
    userPublicKey: string,
    newRating: number
  ): Promise<void> {
    try {
      // In a real implementation, this would be handled by the smart contract
      // For MVP, we simulate the reputation calculation
      const currentReputation = await this.getUserReputation(userPublicKey);
      const newScore = Math.min(1000, currentReputation.totalScore + (newRating * 10));
      
      // This is a simplified approach - in production, we'd need the user's keypair
      // or implement this logic in a proper smart contract
      console.log(`Updated reputation for ${userPublicKey}: ${newScore}`);
    } catch (error) {
      console.error('Error updating reputation:', error);
    }
  }

  /**
   * Get user reputation data
   */
  static async getUserReputation(publicKey: string): Promise<ReputationData> {
    try {
      const account = await StellarService.getAccount(publicKey);
      
      // Get reputation score
      const reputationData = account.data_attr[`${this.REPUTATION_PREFIX}SCORE`];
      let totalScore = 0;
      
      if (reputationData) {
        totalScore = parseInt(Buffer.from(reputationData, 'base64').toString(), 10) || 0;
      }

      // Calculate level based on score
      let level: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
      if (totalScore >= 1000) level = 'platinum';
      else if (totalScore >= 500) level = 'gold';
      else if (totalScore >= 100) level = 'silver';

      // Get badges
      const badges = this.getUserBadges(account.data_attr);

      // For MVP, we'll simulate ratings count and average
      const ratingsCount = Math.floor(totalScore / 50) || 1;
      const averageRating = Math.min(5, Math.max(1, totalScore / (ratingsCount * 10)));

      return {
        totalScore,
        ratingsCount,
        averageRating: Math.round(averageRating * 10) / 10,
        level,
        badges,
      };
    } catch (error) {
      console.error('Error getting user reputation:', error);
      return {
        totalScore: 0,
        ratingsCount: 0,
        averageRating: 0,
        level: 'bronze',
        badges: [],
      };
    }
  }

  /**
   * Award a badge to a user
   */
  static async awardBadge(
    adminKeypair: Keypair,
    userPublicKey: string,
    badgeName: string,
    badgeDescription: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const account = await StellarService.getAccount(adminKeypair.publicKey());
      
      const badgeData = JSON.stringify({
        name: badgeName,
        description: badgeDescription,
        awardedBy: adminKeypair.publicKey(),
        awardedTo: userPublicKey,
        timestamp: Date.now(),
      });

      const transaction = new TransactionBuilder(account, {
        fee: '100000',
        networkPassphrase: 'Test SDF Network ; September 2015',
      })
        .addOperation(
          Operation.manageData({
            name: `${this.BADGE_PREFIX}${badgeName.toUpperCase()}`,
            value: badgeData,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(adminKeypair);
      
      const result = await StellarService.submitTransaction(transaction);
      
      return {
        success: true,
        transactionHash: result.hash,
      };
    } catch (error) {
      console.error('Error awarding badge:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get user badges from account data
   */
  private static getUserBadges(accountData: Record<string, string>): string[] {
    const badges: string[] = [];
    
    Object.keys(accountData).forEach(key => {
      if (key.startsWith(this.BADGE_PREFIX)) {
        try {
          const badgeData = JSON.parse(Buffer.from(accountData[key], 'base64').toString());
          badges.push(badgeData.name);
        } catch (error) {
          console.error('Error parsing badge data:', error);
        }
      }
    });

    return badges;
  }

  /**
   * Check if user can rate another user (prevent spam)
   */
  static async canUserRate(
    raterPublicKey: string,
    targetPublicKey: string
  ): Promise<boolean> {
    try {
      // Prevent self-rating
      if (raterPublicKey === targetPublicKey) {
        return false;
      }

      // In a real implementation, we'd check for recent ratings between these users
      // For MVP, we'll allow all ratings
      return true;
    } catch (error) {
      console.error('Error checking rating permissions:', error);
      return false;
    }
  }

  /**
   * Get reputation level requirements
   */
  static getReputationLevels(): Record<string, { minScore: number; benefits: string[] }> {
    return {
      bronze: {
        minScore: 0,
        benefits: ['Basic profile', 'Can receive ratings'],
      },
      silver: {
        minScore: 100,
        benefits: ['Enhanced visibility', 'Can rate others', 'Silver badge'],
      },
      gold: {
        minScore: 500,
        benefits: ['Priority in search', 'Gold badge', 'Featured profile'],
      },
      platinum: {
        minScore: 1000,
        benefits: ['Top tier visibility', 'Platinum badge', 'Premium features'],
      },
    };
  }
}
