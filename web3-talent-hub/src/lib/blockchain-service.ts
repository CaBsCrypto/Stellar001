import { UserRegistryContract } from '@/contracts/user-registry';
import { ReputationSystemContract } from '@/contracts/reputation-system';
import { StellarService } from './stellar';
import { FreighterService } from './freighter';
import { Keypair } from 'stellar-sdk';

export interface ProfileData {
  displayName: string;
  bio: string;
  specialties: string[];
  portfolioLinks: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  location?: string;
  hourlyRate?: number;
  availability: 'available' | 'busy' | 'unavailable';
}

export class BlockchainService {
  /**
   * Register a new user with profile data
   */
  static async registerUser(
    profileData: ProfileData
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      // Get user's public key from wallet
      const publicKey = await FreighterService.getPublicKey();
      if (!publicKey) {
        return { success: false, error: 'Wallet not connected' };
      }

      // Check if user is already registered
      const isRegistered = await UserRegistryContract.isUserRegistered(publicKey);
      if (isRegistered) {
        return { success: false, error: 'User already registered' };
      }

      // Create profile hash (in production, this would be stored on IPFS)
      const profileHash = this.createProfileHash(profileData);

      // For MVP, we'll simulate the keypair (in production, user would sign with Freighter)
      // This is a limitation we'll address in the next phase
      const simulatedKeypair = Keypair.random();
      
      // Fund the testnet account for demo purposes
      await StellarService.fundTestnetAccount(simulatedKeypair.publicKey());
      
      // Wait a bit for the account to be funded
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Register user on blockchain
      const result = await UserRegistryContract.registerUser(
        simulatedKeypair,
        profileHash
      );

      if (result.success) {
        // Store profile data locally (in production, this would be on IPFS)
        this.storeProfileLocally(publicKey, profileData);
      }

      return result;
    } catch (error) {
      console.error('Error registering user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    profileData: ProfileData
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const publicKey = await FreighterService.getPublicKey();
      if (!publicKey) {
        return { success: false, error: 'Wallet not connected' };
      }

      const profileHash = this.createProfileHash(profileData);
      
      // For MVP, simulate keypair (limitation to be addressed)
      const simulatedKeypair = Keypair.random();
      
      const result = await UserRegistryContract.updateUserProfile(
        simulatedKeypair,
        profileHash
      );

      if (result.success) {
        this.storeProfileLocally(publicKey, profileData);
      }

      return result;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get user profile data
   */
  static async getUserProfile(publicKey: string): Promise<ProfileData | null> {
    try {
      // Check if user is registered on blockchain
      const isRegistered = await UserRegistryContract.isUserRegistered(publicKey);
      if (!isRegistered) {
        return null;
      }

      // For MVP, get profile from local storage
      // In production, this would be fetched from IPFS using the hash from blockchain
      return this.getProfileLocally(publicKey);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Submit a rating for a user
   */
  static async submitRating(
    targetUserPublicKey: string,
    rating: number,
    category: string,
    projectId?: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const raterPublicKey = await FreighterService.getPublicKey();
      if (!raterPublicKey) {
        return { success: false, error: 'Wallet not connected' };
      }

      // Check if user can rate
      const canRate = await ReputationSystemContract.canUserRate(
        raterPublicKey,
        targetUserPublicKey
      );
      if (!canRate) {
        return { success: false, error: 'Cannot rate this user' };
      }

      // For MVP, simulate keypair
      const simulatedKeypair = Keypair.random();
      await StellarService.fundTestnetAccount(simulatedKeypair.publicKey());
      await new Promise(resolve => setTimeout(resolve, 2000));

      return await ReputationSystemContract.submitRating(
        simulatedKeypair,
        targetUserPublicKey,
        rating,
        category,
        projectId
      );
    } catch (error) {
      console.error('Error submitting rating:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get user reputation
   */
  static async getUserReputation(publicKey: string) {
    try {
      return await ReputationSystemContract.getUserReputation(publicKey);
    } catch (error) {
      console.error('Error getting user reputation:', error);
      return {
        totalScore: 0,
        ratingsCount: 0,
        averageRating: 0,
        level: 'bronze' as const,
        badges: [],
      };
    }
  }

  /**
   * Check if user is registered
   */
  static async isUserRegistered(publicKey: string): Promise<boolean> {
    try {
      return await UserRegistryContract.isUserRegistered(publicKey);
    } catch (error) {
      console.error('Error checking user registration:', error);
      return false;
    }
  }

  /**
   * Create a hash of profile data (simplified for MVP)
   */
  private static createProfileHash(profileData: ProfileData): string {
    const dataString = JSON.stringify(profileData);
    // In production, use proper hashing (SHA-256, etc.)
    return Buffer.from(dataString).toString('base64').substring(0, 32);
  }

  /**
   * Store profile data locally (MVP implementation)
   */
  private static storeProfileLocally(publicKey: string, profileData: ProfileData): void {
    try {
      const profiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
      profiles[publicKey] = {
        ...profileData,
        updatedAt: Date.now(),
      };
      localStorage.setItem('user_profiles', JSON.stringify(profiles));
    } catch (error) {
      console.error('Error storing profile locally:', error);
    }
  }

  /**
   * Get profile data from local storage (MVP implementation)
   */
  private static getProfileLocally(publicKey: string): ProfileData | null {
    try {
      const profiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
      return profiles[publicKey] || null;
    } catch (error) {
      console.error('Error getting profile locally:', error);
      return null;
    }
  }

  /**
   * Get all registered creators (for directory)
   */
  static async getAllCreators(): Promise<Array<{ publicKey: string; profile: ProfileData }>> {
    try {
      // For MVP, get from local storage
      // In production, this would query the blockchain and IPFS
      const profiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
      
      return Object.entries(profiles).map(([publicKey, profile]) => ({
        publicKey,
        profile: profile as ProfileData,
      }));
    } catch (error) {
      console.error('Error getting all creators:', error);
      return [];
    }
  }
}
