'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Clock,
  User,
  Coins
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TipSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHash: string;
  amount: string;
  recipient: string;
  recipientName: string;
  explorerUrl: string;
}

export function TipSuccessModal({
  isOpen,
  onClose,
  transactionHash,
  amount,
  recipient,
  recipientName,
  explorerUrl
}: TipSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTransactionHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Tip Sent Successfully!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          {/* Transaction Details */}
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Amount</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Coins className="w-3 h-3 mr-1" />
                  {amount} ETH
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Recipient</span>
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="text-sm font-medium">{recipientName}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Address</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{formatAddress(recipient)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(recipient)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Transaction</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{formatTransactionHash(transactionHash)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transactionHash)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => window.open(explorerUrl, '_blank')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Transaction confirmed on Sepolia testnet</span>
          </div>

          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-green-600"
            >
              Copied to clipboard!
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
