"use client"
import React, { useEffect, useState } from 'react';
import { ProductListing } from '@/components/ProductListing';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  addToCart as addToCartApi, 
  getCartItems, 
  removeFromCart as removeFromCartApi,
  updateCartItemQuantity,
  getProducts
} from '@/app/api';
import { useRouter } from 'next/navigation';

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartResponseItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

const Index = () => {
  const [products, setProducts] = useState({
    success: false,
    count: 0,
    data: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [isCartLoading, setIsCartLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      fetchCartItems();
    }
  }, [isCartOpen]);

  const fetchCartItems = async () => {
    try {
      setIsCartLoading(true);
      const response = await getCartItems();
      console.log('Cart response:', response); // Debug log
      if (response && response.data) {
        const items = Array.isArray(response.data) ? response.data : [response.data];
        const formattedItems = items.map((item: CartResponseItem) => {
          // Ensure we have valid numbers for price and quantity
          const price = typeof item.price === 'number' ? item.price : 
                       typeof item.price === 'string' ? parseFloat(item.price) : 0;
          const quantity = typeof item.quantity === 'number' ? item.quantity :
                          typeof item.quantity === 'string' ? parseInt(item.quantity) : 0;
          
          return {
            _id: item._id,
            name: item.name,
            price: price,
            description: item.description || '',
            quantity: quantity
          };
        });
        console.log('Formatted cart items:', formattedItems); // Debug log
        setCartItems(formattedItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart items');
      setCartItems([]);
    } finally {
      setIsCartLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      setIsCartLoading(true);
      const response = await addToCartApi(product._id);
      console.log('Add to cart response:', response); // Debug log
      await fetchCartItems();
      toast.success(`${product.name} added to cart`, {
        description: "You can continue shopping or view your cart",
        action: {
          label: "View Cart",
          onClick: () => router.push('/cart')
        },
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart', {
        duration: 3000,
      });
    } finally {
      setIsCartLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setIsCartLoading(true);
      await removeFromCartApi(productId);
      await fetchCartItems();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsCartLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      setIsCartLoading(true);
      const response = await updateCartItemQuantity(productId, quantity);
      console.log('Update quantity response:', response); // Debug log
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsCartLoading(false);
    }
  };

  const getTotalItems = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const handleCheckout = (summary: any) => {
    setOrderSummary(summary);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Y-Axis Overseas</h1>
              <p className="text-sm text-gray-600">Your Immigration Partner</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/cart')}
                className="relative bg-blue-600 text-white hover:bg-blue-700"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
                <span className="ml-2">View Cart</span>
              </Button>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Visa Services</h2>
          <p className="text-gray-600">Choose from our comprehensive range of visa and immigration services</p>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : products.count === 0 ? (
          <div className="text-center text-gray-500 py-8">No products available</div>
        ) : (
          <ProductListing products={products.data} onAddToCart={addToCart} />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        orderSummary={orderSummary}
      />
    </div>
  );
};

export default Index;
