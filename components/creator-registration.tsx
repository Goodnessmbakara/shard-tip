'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Plus, 
  User, 
  Briefcase, 
  Link as LinkIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreatorRegistrationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  'DeFi', 'NFT', 'Education', 'Infrastructure', 
  'Gaming', 'Social', 'Analytics', 'Security'
];

const SOCIAL_PLATFORMS = [
  { name: 'Twitter', placeholder: 'https://twitter.com/yourhandle', icon: '🐦' },
  { name: 'GitHub', placeholder: 'https://github.com/yourusername', icon: '🐙' },
  { name: 'Discord', placeholder: 'https://discord.gg/yourserver', icon: '💬' },
  { name: 'Website', placeholder: 'https://yourwebsite.com', icon: '🌐' }
];

export default function CreatorRegistration({ onSuccess, onCancel }: CreatorRegistrationProps) {
  const { address, isConnected } = useAccount();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    avatarFile: null as File | null,
    socialLinks: {
      twitter: '',
      github: '',
      discord: '',
      website: ''
    }
  });

  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
        if (formData.name.length > 50) newErrors.name = 'Name must be less than 50 characters';
        break;
      
      case 2:
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
        if (formData.description.length > 500) newErrors.description = 'Description must be less than 500 characters';
        if (!formData.category) newErrors.category = 'Please select a category';
        break;
      
      case 3:
        // Optional validation for social links
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, avatar: 'File size must be less than 5MB' }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }));
        return;
      }

      setFormData(prev => ({ ...prev, avatarFile: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear avatar error
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.avatar;
        return newErrors;
      });
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatarFile: null }));
    setAvatarPreview(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    if (!isConnected) {
      setErrors({ submit: 'Please connect your wallet first' });
      return;
    }

    setUploading(true);

    try {
      // TODO: Implement actual registration logic
      console.log('Registering creator:', {
        ...formData,
        walletAddress: address
      });

      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      onSuccess?.();
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: User },
    { number: 2, title: 'Profile Details', icon: Briefcase },
    { number: 3, title: 'Social Links', icon: LinkIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Become a Creator
            </CardTitle>
            <p className="text-gray-400">
              Join the ShardTip creator community and start earning from your contributions
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {steps.map((stepItem, index) => {
                  const Icon = stepItem.icon;
                  const isActive = step === stepItem.number;
                  const isCompleted = step > stepItem.number;
                  
                  return (
                    <div key={stepItem.number} className="flex items-center">
                      <div className={`
                        flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                        ${isActive ? 'border-yellow-500 bg-yellow-500 text-black' : 
                          isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                          'border-gray-600 text-gray-400'}
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        isActive ? 'text-yellow-500' : 
                        isCompleted ? 'text-green-500' : 
                        'text-gray-400'
                      }`}>
                        {stepItem.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-4 ${
                          step > stepItem.number ? 'bg-green-500' : 'bg-gray-600'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white font-medium">Display Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your creator name"
                        className="bg-gray-700 border-gray-600 text-white mt-2"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white font-medium">Profile Photo</Label>
                      <div className="mt-2">
                        {avatarPreview ? (
                          <div className="relative inline-block">
                            <img
                              src={avatarPreview}
                              alt="Avatar preview"
                              className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                            />
                            <button
                              type="button"
                              onClick={removeAvatar}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm mb-2">Upload a profile photo</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                              id="avatar-upload"
                            />
                            <Button
                              type="button"
                              onClick={() => document.getElementById('avatar-upload')?.click()}
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-500"
                            >
                              Choose File
                            </Button>
                          </div>
                        )}
                        {errors.avatar && (
                          <p className="text-red-400 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.avatar}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <p className="text-yellow-400 text-sm">
                        <strong>Note:</strong> Your wallet address ({address?.slice(0, 6)}...{address?.slice(-4)}) will be associated with your creator profile.
                      </p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white font-medium">Description *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Tell us about your work, contributions, and what makes you unique..."
                        className="bg-gray-700 border-gray-600 text-white mt-2 min-h-[100px]"
                      />
                      <p className="text-gray-400 text-sm mt-1">
                        {formData.description.length}/500 characters
                      </p>
                      {errors.description && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white font-medium">Category *</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {CATEGORIES.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category }))}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                              formData.category === category
                                ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                                : 'border-gray-600 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                      {errors.category && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white font-medium">Social Links (Optional)</Label>
                      <p className="text-gray-400 text-sm mb-4">
                        Add your social media profiles to help others discover your work
                      </p>
                      
                      <div className="space-y-4">
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <div key={platform.name}>
                            <Label className="text-gray-300 text-sm flex items-center">
                              <span className="mr-2">{platform.icon}</span>
                              {platform.name}
                            </Label>
                            <Input
                              value={formData.socialLinks[platform.name.toLowerCase() as keyof typeof formData.socialLinks]}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                socialLinks: {
                                  ...prev.socialLinks,
                                  [platform.name.toLowerCase()]: e.target.value
                                }
                              }))}
                              placeholder={platform.placeholder}
                              className="bg-gray-700 border-gray-600 text-white mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-red-400 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors.submit}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <div>
                {step > 1 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                {onCancel && (
                  <Button
                    onClick={onCancel}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    {uploading ? 'Registering...' : 'Complete Registration'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

