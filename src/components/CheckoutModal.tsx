"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { createCheckout } from '@/app/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderSummary: any;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  orderSummary
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const handleCheckout = async () => {
    if (!userId) {
      toast.error('Please login to continue');
      return;
    }

    setIsLoading(true);

    try {
      const response = await createCheckout(orderSummary);
      toast.success('Order placed successfully!');
      onClose();
      // Redirect to orders page
      router.push('/orders');
    } catch (err) {
      toast.error('Failed to place order');
      console.error('Error placing order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderSummary) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="max-w-md bg-white z-50 border border-gray-200">
        <DialogHeader className="bg-white">
          <DialogTitle className="flex items-center space-x-2 bg-white">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span>Order Confirmed!</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 bg-white">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              Thank you for your order! Our visa experts will contact you within 24 hours to begin processing your application.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Order Summary</h3>
            
            <div className="space-y-2">
              {orderSummary.items.map((item: any) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatPrice(orderSummary.subtotal)}</span>
              </div>
              
              {orderSummary.bundleDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Bundle Discount:</span>
                  <span>-{formatPrice(orderSummary.bundleDiscount)}</span>
                </div>
              )}

              {orderSummary.couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Coupon Discount:</span>
                  <span>-{formatPrice(orderSummary.couponDiscount)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold">
                <span>Total Paid:</span>
                <span>{formatPrice(orderSummary.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check your email for order confirmation</li>
              <li>• Our team will call you within 24 hours</li>
              <li>• Prepare your documents as per our checklist</li>
              <li>• Track your application progress online</li>
            </ul>
          </div>

          <Button 
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
