'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { ProfileForm } from '@/components/profile-form';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';

export default function CreateProfilePage() {
  const router = useRouter();
  const { 
    isConnected, 
    isRegistered, 
    isRegistering, 
    registerUser, 
    connect, 
    combinedError 
  } = useWallet();

  const handleProfileSubmit = async (profileData: any) => {
    const success = await registerUser(profileData);
    if (success) {
      router.push('/dashboard');
    }
    return success;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <Wallet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
              <p className="text-gray-600 mb-6">
                To create your creator profile, you need to connect your Stellar wallet first.
              </p>
              <Button onClick={connect} size="lg" className="w-full">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
              {combinedError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">{combinedError}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Already Registered</h1>
              <p className="text-gray-600 mb-6">
                You already have a creator profile. You can view and edit it from your dashboard.
              </p>
              <Button onClick={() => router.push('/dashboard')} size="lg" className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your Creator Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the Web3 Talent Hub and start building your decentralized reputation. 
              Your profile will be secured on the Stellar blockchain.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <ProfileForm
              onSubmit={handleProfileSubmit}
              isLoading={isRegistering}
              submitText="Create Profile & Join Web3"
            />
          </div>

          {/* Error Display */}
          {combinedError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{combinedError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🔒 Your Data is Secure
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Profile hash stored on Stellar blockchain for immutability</li>
              <li>• You maintain full control of your data</li>
              <li>• Reputation system prevents fraud and builds trust</li>
              <li>• Decentralized architecture ensures no single point of failure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
