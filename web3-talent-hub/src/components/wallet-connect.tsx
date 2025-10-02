'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/stores/wallet';
import { formatPublicKey } from '@/lib/utils';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

export function WalletConnect() {
  const { connection, isLoading, error, connect, disconnect, checkConnection, clearError } = useWalletStore();

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleConnect = async () => {
    clearError();
    await connect();
  };

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (connection.isConnected && connection.publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm">
          <Wallet className="h-4 w-4" />
          {formatPublicKey(connection.publicKey)}
        </div>
        <Button variant="outline" size="sm" onClick={disconnect}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleConnect}>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

