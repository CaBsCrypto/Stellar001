import { isConnected, getPublicKey, signTransaction, requestAccess } from '@stellar/freighter-api';

export class FreighterService {
  static async isWalletConnected(): Promise<boolean> {
    try {
      return await isConnected();
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  }

  static async requestAccess(): Promise<boolean> {
    try {
      await requestAccess();
      return true;
    } catch (error) {
      console.error('Error requesting wallet access:', error);
      return false;
    }
  }

  static async getPublicKey(): Promise<string | null> {
    try {
      const publicKey = await getPublicKey();
      return publicKey;
    } catch (error) {
      console.error('Error getting public key:', error);
      return null;
    }
  }

  static async signTransaction(transactionXDR: string, networkPassphrase: string): Promise<string | null> {
    try {
      const signedTransaction = await signTransaction(transactionXDR, {
        networkPassphrase,
      });
      return signedTransaction;
    } catch (error) {
      console.error('Error signing transaction:', error);
      return null;
    }
  }

  static async connectWallet(): Promise<{ success: boolean; publicKey?: string; error?: string }> {
    try {
      const isWalletConnected = await this.isWalletConnected();
      
      if (!isWalletConnected) {
        const accessGranted = await this.requestAccess();
        if (!accessGranted) {
          return { success: false, error: 'Access denied by user' };
        }
      }

      const publicKey = await this.getPublicKey();
      if (!publicKey) {
        return { success: false, error: 'Could not retrieve public key' };
      }

      return { success: true, publicKey };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return { success: false, error: 'Failed to connect wallet' };
    }
  }
}
