'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function FreighterTest() {
  const [status, setStatus] = useState<string>('Not tested');
  const [publicKey, setPublicKey] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testFreighterAvailability = async () => {
    setStatus('Testing...');
    setError('');
    
    try {
      // Check if Freighter is available
      if (typeof window === 'undefined') {
        throw new Error('Window is undefined');
      }

      console.log('🔍 Testing Freighter availability...');
      
      // Try to import the Freighter API
      const freighterApi = await import('@stellar/freighter-api');
      console.log('✅ Freighter API imported successfully');
      console.log('Available methods:', Object.keys(freighterApi));

      // Test isConnected
      const isConnected = await freighterApi.isConnected();
      console.log('Connection status:', isConnected);
      
      if (!isConnected) {
        setStatus('Freighter available but not connected');
        return;
      }

      // Test getPublicKey
      const key = await freighterApi.getPublicKey();
      console.log('Public key:', key);
      
      setPublicKey(key);
      setStatus('✅ Connected successfully!');
      
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Unknown error');
      setStatus('❌ Error occurred');
    }
  };

  const requestAccess = async () => {
    setStatus('Requesting access...');
    setError('');
    
    try {
      const freighterApi = await import('@stellar/freighter-api');
      await freighterApi.requestAccess();
      setStatus('✅ Access granted!');
      
      // Now try to get public key
      const key = await freighterApi.getPublicKey();
      setPublicKey(key);
      
    } catch (err: any) {
      console.error('❌ Access error:', err);
      setError(err.message || 'Access denied');
      setStatus('❌ Access failed');
    }
  };

  const checkWindow = () => {
    console.log('Window object:', typeof window);
    console.log('Navigator:', typeof navigator);
    console.log('User agent:', navigator?.userAgent);
    
    // Check for Freighter-specific objects
    console.log('window.freighterApi:', typeof (window as any).freighterApi);
    console.log('window.stellar:', typeof (window as any).stellar);
    
    setStatus('Check console for window info');
  };

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">🔧 Freighter Debug Tool</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Status: <span className="font-normal">{status}</span></p>
          {publicKey && (
            <p className="text-sm font-medium">Public Key: <span className="font-mono text-xs">{publicKey}</span></p>
          )}
          {error && (
            <p className="text-sm text-red-600">Error: {error}</p>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button onClick={checkWindow} variant="outline" size="sm">
            Check Window
          </Button>
          <Button onClick={testFreighterAvailability} variant="outline" size="sm">
            Test Availability
          </Button>
          <Button onClick={requestAccess} size="sm">
            Request Access
          </Button>
        </div>
      </div>
    </div>
  );
}
