import { Server, Networks, Keypair, TransactionBuilder, Operation, Asset } from 'stellar-sdk';

// Stellar configuration
export const STELLAR_CONFIG = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
  horizonUrl: process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_PASSPHRASE || Networks.TESTNET,
};

// Initialize Stellar server
export const server = new Server(STELLAR_CONFIG.horizonUrl);

// Utility functions for Stellar operations
export class StellarService {
  static async getAccount(publicKey: string) {
    try {
      return await server.loadAccount(publicKey);
    } catch (error) {
      console.error('Error loading account:', error);
      throw error;
    }
  }

  static async submitTransaction(transaction: any) {
    try {
      const result = await server.submitTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Error submitting transaction:', error);
      throw error;
    }
  }

  static generateKeypair() {
    return Keypair.random();
  }

  static async fundTestnetAccount(publicKey: string) {
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error funding testnet account:', error);
      throw error;
    }
  }
}

export { Networks, Keypair, TransactionBuilder, Operation, Asset };
