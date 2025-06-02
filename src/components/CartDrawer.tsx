"use client"
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/pages/Index';
import { clearCart } from '@/app/api';
import { toast } from 'sonner';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (productId: string) => Promise<void>;
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
  onCheckout: (summary: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout
}) => {
  const [applyDiscount, setApplyDiscount] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveItem = async (productId: string) => {
    try {
      setIsProcessing(true);
      await onRemoveItem(productId);
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsProcessing(true);
      await clearCart();
      // Clear cart items in parent component
      onRemoveItem('all');
      toast.success('Cart cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cart');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsProcessing(true);
      await onUpdateQuantity(productId, quantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateSubtotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 
                   typeof item.price === 'string' ? parseFloat(item.price) : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity :
                      typeof item.quantity === 'string' ? parseInt(item.quantity) : 0;
      return total + (price * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const bundleDiscount = cartItems.length >= 2 && applyDiscount ? subtotal * 0.1 : 0;
  const total = subtotal - bundleDiscount;

  const handleCheckout = () => {
    const summary = {
      items: cartItems,
      subtotal,
      discount: bundleDiscount,
      total,
      discountApplied: applyDiscount && cartItems.length >= 2
    };
    onCheckout(summary);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-white z-50">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg mb-4">Your cart is empty</p>
            <Button onClick={onClose} variant="outline">
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col bg-white z-50">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartItems.length} items)</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          {isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemPrice = typeof item.price === 'number' ? item.price : 
                                typeof item.price === 'string' ? parseFloat(item.price) : 0;
                const itemQuantity = typeof item.quantity === 'number' ? item.quantity :
                                   typeof item.quantity === 'string' ? parseInt(item.quantity) : 0;
                const itemTotal = itemPrice * itemQuantity;

                return (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg bg-white">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">${itemPrice.toFixed(2)} each</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item._id, itemQuantity - 1)}
                        className="h-8 w-8"
                        disabled={isProcessing}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        value={itemQuantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          handleUpdateQuantity(item._id, newQuantity);
                        }}
                        className="w-16 text-center bg-white"
                        min="1"
                        disabled={isProcessing}
                      />
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item._id, itemQuantity + 1)}
                        className="h-8 w-8"
                        disabled={isProcessing}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">${itemTotal.toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isProcessing}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-4 bg-white">
          {cartItems.length >= 2 && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">Bundle Discount Available!</p>
                <p className="text-xs text-green-600">Save 10% when you buy 2+ services</p>
              </div>
              <Button
                variant={applyDiscount ? "default" : "outline"}
                size="sm"
                onClick={() => setApplyDiscount(!applyDiscount)}
              >
                {applyDiscount ? "Applied" : "Apply"}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {bundleDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Bundle Discount (10%):</span>
                <span>-${bundleDiscount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleClearCart}
              variant="outline"
              className="flex-1"
              disabled={isProcessing}
            >
              Clear Cart
            </Button>
            <Button 
              onClick={handleCheckout}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
              disabled={isProcessing}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
