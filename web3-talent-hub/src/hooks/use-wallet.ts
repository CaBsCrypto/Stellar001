import { useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { useUserStore } from '@/stores/user';

export function useWallet() {
  const walletStore = useWalletStore();
  const userStore = useUserStore();

  // Check wallet connection on mount
  useEffect(() => {
    walletStore.checkConnection();
  }, [walletStore.checkConnection]);

  // Check user registration when wallet connects
  useEffect(() => {
    if (walletStore.connection.isConnected && walletStore.connection.publicKey) {
      userStore.checkRegistration(walletStore.connection.publicKey);
    } else {
      userStore.reset();
    }
  }, [walletStore.connection.isConnected, walletStore.connection.publicKey, userStore.checkRegistration, userStore.reset]);

  return {
    // Wallet state
    isConnected: walletStore.connection.isConnected,
    publicKey: walletStore.connection.publicKey,
    isLoading: walletStore.isLoading,
    error: walletStore.error,
    
    // Wallet actions
    connect: walletStore.connect,
    disconnect: walletStore.disconnect,
    clearError: walletStore.clearError,
    
    // User state
    isRegistered: userStore.isRegistered,
    profile: userStore.profile,
    reputation: userStore.reputation,
    
    // Combined loading states
    isCheckingRegistration: userStore.isLoading,
    isRegistering: userStore.isRegistering,
    
    // User actions
    registerUser: userStore.registerUser,
    updateProfile: userStore.updateProfile,
    
    // Combined error
    combinedError: walletStore.error || userStore.error,
  };
}

