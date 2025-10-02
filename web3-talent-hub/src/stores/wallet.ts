import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WalletConnection } from '@/types';
import { FreighterService } from '@/lib/freighter';

interface WalletState {
  connection: WalletConnection;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  checkConnection: () => Promise<void>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      connection: {
        isConnected: false,
        network: 'testnet',
      },
      isLoading: false,
      error: null,

      connect: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await FreighterService.connectWallet();
          
          if (result.success && result.publicKey) {
            set({
              connection: {
                isConnected: true,
                publicKey: result.publicKey,
                network: 'testnet',
              },
              isLoading: false,
            });
          } else {
            set({
              error: result.error || 'Failed to connect wallet',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            isLoading: false,
          });
        }
      },

      disconnect: () => {
        set({
          connection: {
            isConnected: false,
            network: 'testnet',
          },
          error: null,
        });
      },

      checkConnection: async () => {
        try {
          const isConnected = await FreighterService.isWalletConnected();
          
          if (isConnected) {
            const publicKey = await FreighterService.getPublicKey();
            
            if (publicKey) {
              set({
                connection: {
                  isConnected: true,
                  publicKey,
                  network: 'testnet',
                },
              });
            }
          } else {
            set({
              connection: {
                isConnected: false,
                network: 'testnet',
              },
            });
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
          set({
            connection: {
              isConnected: false,
              network: 'testnet',
            },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        connection: state.connection,
      }),
    }
  )
);
