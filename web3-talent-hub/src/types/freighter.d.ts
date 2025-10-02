declare global {
  interface Window {
    freighterApi?: {
      isConnected(): Promise<boolean>;
      requestAccess(): Promise<void>;
      getPublicKey(): Promise<string>;
      signTransaction(
        transactionXDR: string,
        options: { networkPassphrase: string }
      ): Promise<string>;
    };
  }
}

export {};
