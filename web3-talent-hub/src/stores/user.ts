import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlockchainService, ProfileData } from '@/lib/blockchain-service';
import { ReputationData } from '@/contracts/reputation-system';

interface UserState {
  // User data
  isRegistered: boolean;
  profile: ProfileData | null;
  reputation: ReputationData | null;
  
  // Loading states
  isLoading: boolean;
  isRegistering: boolean;
  isUpdatingProfile: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  checkRegistration: (publicKey: string) => Promise<void>;
  registerUser: (profileData: ProfileData) => Promise<boolean>;
  updateProfile: (profileData: ProfileData) => Promise<boolean>;
  loadUserData: (publicKey: string) => Promise<void>;
  submitRating: (targetPublicKey: string, rating: number, category: string, projectId?: string) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  isRegistered: false,
  profile: null,
  reputation: null,
  isLoading: false,
  isRegistering: false,
  isUpdatingProfile: false,
  error: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      checkRegistration: async (publicKey: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const isRegistered = await BlockchainService.isUserRegistered(publicKey);
          set({ isRegistered, isLoading: false });
          
          if (isRegistered) {
            await get().loadUserData(publicKey);
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to check registration',
            isLoading: false,
          });
        }
      },

      registerUser: async (profileData: ProfileData) => {
        set({ isRegistering: true, error: null });
        
        try {
          const result = await BlockchainService.registerUser(profileData);
          
          if (result.success) {
            set({
              isRegistered: true,
              profile: profileData,
              isRegistering: false,
            });
            return true;
          } else {
            set({
              error: result.error || 'Registration failed',
              isRegistering: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isRegistering: false,
          });
          return false;
        }
      },

      updateProfile: async (profileData: ProfileData) => {
        set({ isUpdatingProfile: true, error: null });
        
        try {
          const result = await BlockchainService.updateUserProfile(profileData);
          
          if (result.success) {
            set({
              profile: profileData,
              isUpdatingProfile: false,
            });
            return true;
          } else {
            set({
              error: result.error || 'Profile update failed',
              isUpdatingProfile: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Profile update failed',
            isUpdatingProfile: false,
          });
          return false;
        }
      },

      loadUserData: async (publicKey: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const [profile, reputation] = await Promise.all([
            BlockchainService.getUserProfile(publicKey),
            BlockchainService.getUserReputation(publicKey),
          ]);
          
          set({
            profile,
            reputation,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load user data',
            isLoading: false,
          });
        }
      },

      submitRating: async (
        targetPublicKey: string,
        rating: number,
        category: string,
        projectId?: string
      ) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await BlockchainService.submitRating(
            targetPublicKey,
            rating,
            category,
            projectId
          );
          
          if (result.success) {
            set({ isLoading: false });
            return true;
          } else {
            set({
              error: result.error || 'Failed to submit rating',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to submit rating',
            isLoading: false,
          });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        isRegistered: state.isRegistered,
        profile: state.profile,
        reputation: state.reputation,
      }),
    }
  )
);
