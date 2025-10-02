export class FreighterService {
  static async isWalletConnected(): Promise<boolean> {
    try {
      console.log('🔍 Checking if Freighter is connected...');
      
      // Try npm package first
      try {
        const { isConnected } = await import('@stellar/freighter-api');
        const connected = await isConnected();
        console.log('✅ Freighter connection status (npm):', connected);
        return connected;
      } catch (npmError) {
        console.log('⚠️ NPM package failed, trying window API...');
        
        // Fallback to window API
        if (typeof window !== 'undefined' && window.freighterApi) {
          const connected = await window.freighterApi.isConnected();
          console.log('✅ Freighter connection status (window):', connected);
          return connected;
        } else {
          console.log('❌ Freighter API not available');
          return false;
        }
      }
    } catch (error) {
      console.error('❌ Error checking wallet connection:', error);
      return false;
    }
  }

  static async requestAccess(): Promise<boolean> {
    try {
      console.log('🔑 Requesting Freighter access...');
      
      // Try npm package first
      try {
        const { requestAccess } = await import('@stellar/freighter-api');
        await requestAccess();
        console.log('✅ Freighter access granted (npm)');
        return true;
      } catch (npmError) {
        console.log('⚠️ NPM package failed, trying window API...');
        
        // Fallback to window API
        if (typeof window !== 'undefined' && window.freighterApi) {
          await window.freighterApi.requestAccess();
          console.log('✅ Freighter access granted (window)');
          return true;
        } else {
          console.log('❌ Freighter API not available');
          return false;
        }
      }
    } catch (error) {
      console.error('❌ Error requesting wallet access:', error);
      return false;
    }
  }

  static async getPublicKey(): Promise<string | null> {
    try {
      // Try npm package first
      try {
        const { getPublicKey } = await import('@stellar/freighter-api');
        const publicKey = await getPublicKey();
        console.log('✅ Public key retrieved (npm)');
        return publicKey;
      } catch (npmError) {
        console.log('⚠️ NPM package failed, trying window API...');
        
        // Fallback to window API
        if (typeof window !== 'undefined' && window.freighterApi) {
          const publicKey = await window.freighterApi.getPublicKey();
          console.log('✅ Public key retrieved (window)');
          return publicKey;
        } else {
          console.log('❌ Freighter API not available');
          return null;
        }
      }
    } catch (error) {
      console.error('Error getting public key:', error);
      return null;
    }
  }

  static async signTransaction(transactionXDR: string, networkPassphrase: string): Promise<string | null> {
    try {
      // Try npm package first
      try {
        const { signTransaction } = await import('@stellar/freighter-api');
        const signedTransaction = await signTransaction(transactionXDR, {
          networkPassphrase,
        });
        console.log('✅ Transaction signed (npm)');
        return signedTransaction;
      } catch (npmError) {
        console.log('⚠️ NPM package failed, trying window API...');
        
        // Fallback to window API
        if (typeof window !== 'undefined' && window.freighterApi) {
          const signedTransaction = await window.freighterApi.signTransaction(transactionXDR, {
            networkPassphrase,
          });
          console.log('✅ Transaction signed (window)');
          return signedTransaction;
        } else {
          console.log('❌ Freighter API not available');
          return null;
        }
      }
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

