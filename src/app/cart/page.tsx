'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getCartItems, removeFromCart, updateCartItemQuantity, clearCart } from '@/app/api';
import { useRouter } from 'next/navigation';
import { CheckoutModal } from '@/components/CheckoutModal';
import axios from 'axios';

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    isActive: boolean;
  };
  quantity: number;
  price: number;
}

interface CartResponse {
  success: boolean;
  data: {
    _id: string;
    items: CartItem[];
    subtotal: number;
    discountAmount: number;
    discountApplied: boolean;
    total: number;
  };
}

export default function CartPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching cart items...');
      
      const response = await axios.get('http://localhost:8000/api/cart', {
        withCredentials: true
      });
      
      console.log('Raw cart response:', response);
      
      if (response.data.success && response.data.data) {
        const cartData = response.data.data;
        console.log('Cart data received:', cartData);
        
        // Set cart totals from the response
        setCartSubtotal(cartData.subtotal);
        setCartTotal(cartData.total);
        setDiscountApplied(cartData.discountApplied);
        
        // Process cart items
        const items = cartData.items || [];
        console.log('Cart items array:', items);
        
        const formattedItems = items
          .filter((item: any) => {
            const hasProductId = item && item.productId;
            if (!hasProductId) {
              console.log('Filtered out item due to missing productId:', item);
            }
            return hasProductId;
          })
          .map((item: any) => {
            console.log('Processing item:', item);
            
            // Ensure we have valid numbers for price and quantity
            const price = typeof item.price === 'number' ? item.price : 
                         typeof item.price === 'string' ? parseFloat(item.price) : 0;
            const quantity = typeof item.quantity === 'number' ? item.quantity :
                            typeof item.quantity === 'string' ? parseInt(item.quantity) : 1;
            
            // Safely access productId properties
            const productId = item.productId || {};
            console.log('Product ID data:', productId);
            
            const formattedItem = {
              _id: item._id,
              productId: {
                _id: productId._id || '',
                name: productId.name || 'Unknown Product',
                price: price,
                description: productId.description || '',
                category: productId.category || '',
                isActive: productId.isActive || false
              },
              quantity: isNaN(quantity) ? 1 : Math.max(1, quantity),
              price: isNaN(price) ? 0 : price
            };
            
            console.log('Formatted item:', formattedItem);
            return formattedItem;
          });
        
        console.log('Final formatted items:', formattedItems);
        setCartItems(formattedItems);
      } else {
        console.log('No cart data received');
        setCartItems([]);
      }
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      toast.error(error.response?.data?.message || 'Failed to fetch cart items');
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setIsLoading(true);
      
      // Find the cart item to get its _id
      const cartItem = cartItems.find(item => item.productId._id === productId);
      if (!cartItem) {
        console.error('Cart item not found');
        toast.error('Item not found in cart');
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/api/cart/${cartItem._id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        await fetchCartItems();
        toast.success('Item removed from cart');
      } else {
        toast.error(response.data.message || 'Failed to remove item');
      }
    } catch (error: any) {
      console.error('Error removing item:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }
    try {
      setIsLoading(true);
      
      const cartItem = cartItems.find(item => item._id);

      if (!cartItem) {
        console.error('Cart item not found');
        toast.error('Item not found in cart');
        return;
      }

      console.log(`Updating quantity for cart item ${cartItem._id} to ${quantity}`);

      const response = await axios.put(
        `http://localhost:8000/api/cart/${cartItem._id}/quantity`,
        { quantity },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Quantity update response:', response.data);
      
      if (response.data.success) {
        await fetchCartItems(); // Refresh cart items after successful update
        toast.success('Quantity updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update quantity');
      }
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        toast.error(error.response.data?.message || `Error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        toast.error('Failed to update quantity. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete('http://localhost:8000/api/cart/clear', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setCartItems([]);
        setCartTotal(0);
        setCartSubtotal(0);
        setDiscountApplied(false);
        toast.success('Cart cleared successfully');
      } else {
        toast.error(response.data.message || 'Failed to clear cart');
      }
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    const orderSummary = {
      items: cartItems,
      subtotal: cartSubtotal,
      bundleDiscount: cartSubtotal - cartTotal,
      total: cartTotal,
      discountApplied: discountApplied
    };
    setIsCheckoutOpen(true);
  };

  // Don't render anything until the component is mounted on the client
  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Y-Axis Overseas</h1>
                <p className="text-sm text-gray-600">Your Immigration Partner</p>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const response = await fetch('http://localhost:8000/api/auth/logout', {
                      method: 'POST',
                      credentials: 'include',
                    });
                    
                    if (response.ok) {
                      router.push('/auth/sign-in');
                    } else {
                      toast.error('Logout failed');
                    }
                  } catch (error) {
                    console.error('Logout error:', error);
                    toast.error('Logout failed');
                  }
                }}
                className="relative bg-blue-600 text-white hover:bg-blue-700"
              >
                <span className="ml-2">Logout</span>
              </Button>           
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Y-Axis Overseas</h1>
              <p className="text-sm text-gray-600">Your Immigration Partner</p>
            </div>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:8000/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                  });
                  
                  if (response.ok) {
                    router.push('/auth/sign-in');
                  } else {
                    toast.error('Logout failed');
                  }
                } catch (error) {
                  console.error('Logout error:', error);
                  toast.error('Logout failed');
                }
              }}
              className="relative bg-blue-600 text-white hover:bg-blue-700"
            >
              <span className="ml-2">Logout</span>
            </Button>           
          </div>
        </div>
      </header>
    
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {/* Cart Items Section */}
      <div className="space-y-4 mb-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="border rounded-lg p-4">
            <p className="text-gray-500">Your cart is empty</p>
            <Button 
              onClick={() => router.push('/services')}
              className="mt-4"
              variant="outline"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          cartItems.map((item) => {
            const itemPrice = typeof item.price === 'number' ? item.price : 
                            typeof item.price === 'string' ? parseFloat(item.price) : 0;
            const itemQuantity = typeof item.quantity === 'number' ? item.quantity :
                               typeof item.quantity === 'string' ? parseInt(item.quantity) : 0;
            const itemTotal = itemPrice * itemQuantity;

            return (
              <div key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg bg-white">
                <div className="flex-1">
                  <h3 className="font-medium">{item.productId?.name || 'Unknown Product'}</h3>
                  <p className="text-sm text-gray-600">${itemPrice.toFixed(2)} each</p>
                  {item.productId?.description && (
                    <p className="text-xs text-gray-500 mt-1">{item.productId.description}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.productId._id, itemQuantity - 1)}
                    className="h-8 w-8"
                    disabled={isLoading}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <Input
                    type="number"
                    value={itemQuantity.toString()}
                    onChange={(e) => {
                      const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                      handleUpdateQuantity(item.productId._id, newQuantity);
                    }}
                    className="w-16 text-center bg-white"
                    min="1"
                    disabled={isLoading}
                  />
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdateQuantity(item.productId._id, itemQuantity + 1)}
                    className="h-8 w-8"
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">${itemTotal.toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="border-t pt-4">
          {discountApplied && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-4">
              <div>
                <p className="text-sm font-medium text-green-800">Bundle Discount Applied!</p>
                <p className="text-xs text-green-600">Save 10% when you buy 2+ services</p>
              </div>
            </div>
          )}

          <div className="flex justify-between mb-4">
            <span className="font-semibold">Subtotal</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          {discountApplied && (
            <div className="flex justify-between mb-4 text-green-600">
              <span className="font-semibold">Bundle Discount (10%)</span>
              <span>-${(cartSubtotal - cartTotal).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-bold">${cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleClearCart}
              variant="outline"
              className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
              disabled={isLoading}
            >
              Clear Cart
            </Button>
            <Button 
              onClick={handleCheckout}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        orderSummary={{
          items: cartItems,
          subtotal: cartSubtotal,
          bundleDiscount: cartSubtotal - cartTotal,
          total: cartTotal,
          discountApplied: discountApplied
        }}
      />
    </div>
    </>
  );
} 