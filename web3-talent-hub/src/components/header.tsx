'use client';

import Link from 'next/link';
import { WalletConnect } from './wallet-connect';
import { Button } from './ui/button';
import { Users, Search, Plus } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Web3 Talent Hub
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/creators" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Search className="inline h-4 w-4 mr-1" />
              Find Creators
            </Link>
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/create-profile">
                <Plus className="h-4 w-4 mr-1" />
                Join as Creator
              </Link>
            </Button>
          </nav>

          {/* Wallet Connection */}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}

