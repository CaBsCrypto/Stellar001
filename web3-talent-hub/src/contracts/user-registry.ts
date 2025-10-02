import { StellarService } from '@/lib/stellar';
import { TransactionBuilder, Operation, Asset, Keypair } from 'stellar-sdk';

export interface UserRegistration {
  publicKey: string;
  profileHash: string;
  timestamp: number;
  reputation: number;
}

export class UserRegistryContract {
  private static readonly DATA_KEY_PREFIX = 'USER_';
  private static readonly REPUTATION_KEY_PREFIX = 'REP_';

  /**
   * Register a new user on the blockchain
   * For MVP, we'll use account data entries to store user info
   */
  static async registerUser(
    userKeypair: Keypair,
    profileHash: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const account = await StellarService.getAccount(userKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: '100000', // 0.01 XLM
        networkPassphrase: 'Test SDF Network ; September 2015',
      })
        // Store profile hash
        .addOperation(
          Operation.manageData({
            name: `${this.DATA_KEY_PREFIX}PROFILE`,
            value: profileHash,
          })
        )
        // Initialize reputation to 0
        .addOperation(
          Operation.manageData({
            name: `${this.REPUTATION_KEY_PREFIX}SCORE`,
            value: '0',
          })
        )
        // Store registration timestamp
        .addOperation(
          Operation.manageData({
            name: `${this.DATA_KEY_PREFIX}REGISTERED`,
            value: Date.now().toString(),
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(userKeypair);
      
      const result = await StellarService.submitTransaction(transaction);
      
      return {
        success: true,
        transactionHash: result.hash,
      };
    } catch (error) {
      console.error('Error registering user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if a user is registered
   */
  static async isUserRegistered(publicKey: string): Promise<boolean> {
    try {
      const account = await StellarService.getAccount(publicKey);
      const profileData = account.data_attr[`${this.DATA_KEY_PREFIX}PROFILE`];
      return !!profileData;
    } catch (error) {
      console.error('Error checking user registration:', error);
      return false;
    }
  }

  /**
   * Get user profile hash from blockchain
   */
  static async getUserProfile(publicKey: string): Promise<string | null> {
    try {
      const account = await StellarService.getAccount(publicKey);
      const profileData = account.data_attr[`${this.DATA_KEY_PREFIX}PROFILE`];
      
      if (profileData) {
        return Buffer.from(profileData, 'base64').toString();
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile hash
   */
  static async updateUserProfile(
    userKeypair: Keypair,
    newProfileHash: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const account = await StellarService.getAccount(userKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: '100000',
        networkPassphrase: 'Test SDF Network ; September 2015',
      })
        .addOperation(
          Operation.manageData({
            name: `${this.DATA_KEY_PREFIX}PROFILE`,
            value: newProfileHash,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(userKeypair);
      
      const result = await StellarService.submitTransaction(transaction);
      
      return {
        success: true,
        transactionHash: result.hash,
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get user reputation score
   */
  static async getUserReputation(publicKey: string): Promise<number> {
    try {
      const account = await StellarService.getAccount(publicKey);
      const reputationData = account.data_attr[`${this.REPUTATION_KEY_PREFIX}SCORE`];
      
      if (reputationData) {
        const score = Buffer.from(reputationData, 'base64').toString();
        return parseInt(score, 10) || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Error getting user reputation:', error);
      return 0;
    }
  }

  /**
   * Get user registration timestamp
   */
  static async getUserRegistrationDate(publicKey: string): Promise<Date | null> {
    try {
      const account = await StellarService.getAccount(publicKey);
      const registeredData = account.data_attr[`${this.DATA_KEY_PREFIX}REGISTERED`];
      
      if (registeredData) {
        const timestamp = Buffer.from(registeredData, 'base64').toString();
        return new Date(parseInt(timestamp, 10));
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user registration date:', error);
      return null;
    }
  }
}
