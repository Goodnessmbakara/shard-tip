'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Plus, 
  TrendingUp, 
  Users, 
  Filter,
  ExternalLink,
  Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { tipCreator, getCreatorStats } from '@/lib/shardeum-api';

interface Creator {
  address: string;
  name: string;
  description: string;
  avatarUrl: string;
  category: string;
  totalTipsReceived: string;
  totalPoolsCreated: number;
  socialLinks: string[];
  isActive: boolean;
}

const TIP_AMOUNTS = [5, 10, 25, 50];
const CATEGORIES = ['All', 'DeFi', 'NFT', 'Education', 'Infrastructure', 'Gaming', 'Social'];

export default function CreatorsPage() {
  const { address, isConnected } = useAccount();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockCreators: Creator[] = [
      {
        address: '0x1234...5678',
        name: 'Carlos Rodriguez',
        description: 'Built secure bridge infrastructure for seamless asset transfers between Stacks and other blockchains',
        avatarUrl: '/avatars/carlos.jpg',
        category: 'Infrastructure',
        totalTipsReceived: '1250',
        totalPoolsCreated: 3,
        socialLinks: ['https://twitter.com/carlos', 'https://github.com/carlos'],
        isActive: true
      },
      {
        address: '0x2345...6789',
        name: 'Emma Thompson',
        description: 'Built interactive tutorials and courses to onboard developers into the Stacks ecosystem',
        avatarUrl: '/avatars/emma.jpg',
        category: 'Education',
        totalTipsReceived: '890',
        totalPoolsCreated: 2,
        socialLinks: ['https://twitter.com/emma', 'https://github.com/emma'],
        isActive: true
      },
      {
        address: '0x3456...7890',
        name: 'Sarah Martinez',
        description: 'Created an innovative NFT marketplace with royalty splitting and community voting features',
        avatarUrl: '/avatars/sarah.jpg',
        category: 'NFT',
        totalTipsReceived: '2100',
        totalPoolsCreated: 4,
        socialLinks: ['https://twitter.com/sarah', 'https://github.com/sarah'],
        isActive: true
      },
      {
        address: '0x4567...8901',
        name: 'Priya Patel',
        description: 'Developed SDK for seamless integration of decentralized storage with Stacks applications',
        avatarUrl: '/avatars/priya.jpg',
        category: 'Infrastructure',
        totalTipsReceived: '750',
        totalPoolsCreated: 1,
        socialLinks: ['https://twitter.com/priya', 'https://github.com/priya'],
        isActive: true
      },
      {
        address: '0x5678...9012',
        name: 'Alex Chen',
        description: 'Building next-generation DeFi protocols with focus on yield farming and liquidity mining',
        avatarUrl: '/avatars/alex.jpg',
        category: 'DeFi',
        totalTipsReceived: '3200',
        totalPoolsCreated: 6,
        socialLinks: ['https://twitter.com/alex', 'https://github.com/alex'],
        isActive: true
      },
      {
        address: '0x6789...0123',
        name: 'Maya Johnson',
        description: 'Creating immersive gaming experiences with blockchain integration and NFT rewards',
        avatarUrl: '/avatars/maya.jpg',
        category: 'Gaming',
        totalTipsReceived: '1800',
        totalPoolsCreated: 3,
        socialLinks: ['https://twitter.com/maya', 'https://github.com/maya'],
        isActive: true
      }
    ];

    setCreators(mockCreators);
    setFilteredCreators(mockCreators);
    setLoading(false);
  }, []);

  // Filter creators based on search and category
  useEffect(() => {
    let filtered = creators;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(creator => creator.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(creator =>
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCreators(filtered);
  }, [creators, searchQuery, selectedCategory]);

  const handleTip = async (creatorAddress: string, amount: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      await tipCreator(creatorAddress, amount);
      // Refresh creator stats
      // await refreshCreatorStats(creatorAddress);
    } catch (error) {
      console.error('Failed to tip creator:', error);
      alert('Failed to send tip. Please try again.');
    }
  };

  const getShortAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading creators...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Support Amazing Creators</h1>
              <p className="text-gray-300 mt-2">Discover and support talented builders in the Shardeum ecosystem</p>
            </div>
            <Button
              onClick={() => setShowRegisterForm(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Become a Creator
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search creators by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-yellow-500 text-black" : "border-gray-600 text-gray-300"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Total Creators</p>
                    <p className="text-2xl font-bold text-white">{creators.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Total Tips Sent</p>
                    <p className="text-2xl font-bold text-white">
                      {creators.reduce((sum, creator) => sum + parseInt(creator.totalTipsReceived), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Wallet className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Active Pools</p>
                    <p className="text-2xl font-bold text-white">
                      {creators.reduce((sum, creator) => sum + creator.totalPoolsCreated, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator, index) => (
            <motion.div
              key={creator.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                        <AvatarFallback className="bg-yellow-500 text-black font-bold">
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-yellow-500 transition-colors">
                          {creator.name}
                        </h3>
                        <p className="text-sm text-gray-400">{getShortAddress(creator.address)}</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                      {creator.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {creator.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-400">
                      <span className="text-white font-medium">{creator.totalTipsReceived}</span> SHM received
                    </div>
                    <div className="text-gray-400">
                      <span className="text-white font-medium">{creator.totalPoolsCreated}</span> pools
                    </div>
                  </div>

                  {/* Social Links */}
                  {creator.socialLinks.length > 0 && (
                    <div className="flex space-x-2">
                      {creator.socialLinks.map((link, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(link, '_blank')}
                          className="border-gray-600 text-gray-400 hover:border-yellow-500 hover:text-yellow-500"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Tip Buttons */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {TIP_AMOUNTS.slice(0, 2).map((amount) => (
                        <Button
                          key={amount}
                          size="sm"
                          onClick={() => handleTip(creator.address, amount)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        >
                          {amount} SHM
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {TIP_AMOUNTS.slice(2).map((amount) => (
                        <Button
                          key={amount}
                          size="sm"
                          onClick={() => handleTip(creator.address, amount)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        >
                          {amount} SHM
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-500"
                    >
                      View Pools & Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No creators found matching your search.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Creator Registration Modal */}
      {showRegisterForm && (
        <CreatorRegistrationModal
          isOpen={showRegisterForm}
          onClose={() => setShowRegisterForm(false)}
          onSuccess={() => {
            setShowRegisterForm(false);
            // Refresh creators list
          }}
        />
      )}
    </div>
  );
}

// Creator Registration Modal Component
interface CreatorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreatorRegistrationModal({ isOpen, onClose, onSuccess }: CreatorRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    socialLinks: [''],
    avatarFile: null as File | null
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // TODO: Implement creator registration logic
      console.log('Registering creator:', formData);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatarFile: file }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Become a Creator</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your creator name"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell us about your work and contributions..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              {formData.avatarFile && (
                <p className="text-sm text-gray-400 mt-1">
                  Selected: {formData.avatarFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Social Links (optional)
              </label>
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...formData.socialLinks];
                      newLinks[index] = e.target.value;
                      setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                    }}
                    placeholder="https://twitter.com/yourhandle"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {index === formData.socialLinks.length - 1 && (
                    <Button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        socialLinks: [...prev.socialLinks, ''] 
                      }))}
                      className="bg-gray-600 hover:bg-gray-500"
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                {uploading ? 'Registering...' : 'Register as Creator'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

