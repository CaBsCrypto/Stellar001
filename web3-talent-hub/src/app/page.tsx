import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { FreighterTest } from '@/components/freighter-test';
import { Users, Star, Shield, Zap, ArrowRight, Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            The Future of{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Web3 Talent
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with top creators, build your reputation on-chain, and collaborate 
            in the decentralized economy. Powered by Stellar blockchain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/create-profile">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/creators">
                <Play className="mr-2 h-5 w-5" />
                Explore Creators
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Debug Tool - Remove in production */}
        <div className="max-w-2xl mx-auto mt-8">
          <FreighterTest />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Web3 Talent Hub?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for the decentralized future with transparency, trust, and innovation at its core.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-white shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Blockchain Trust</h3>
            <p className="text-gray-600">
              All reputations and transactions are recorded on Stellar blockchain, 
              ensuring transparency and immutable trust scores.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reputation Rewards</h3>
            <p className="text-gray-600">
              Earn tokens and badges for quality work. Higher reputation means 
              better visibility and more opportunities.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Matching</h3>
            <p className="text-gray-600">
              AI-powered matching connects creators with the perfect opportunities 
              based on skills, reputation, and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">1,000+</div>
              <div className="text-gray-300">Active Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-300">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">$2M+</div>
              <div className="text-gray-300">Total Earned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">4.9/5</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Future?</h2>
          <p className="text-xl mb-6 opacity-90">
            Start building your Web3 reputation today and connect with amazing opportunities.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/create-profile">
              <Users className="mr-2 h-5 w-5" />
              Create Your Profile
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Web3 Talent Hub. Built with ❤️ for the decentralized future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
