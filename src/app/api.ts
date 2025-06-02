import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('userId');
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = async (userData: { name: string; email: string; password: string }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;

  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
  }
};

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Logout failed');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to get user data');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Product APIs
export const getProducts = async () => {
  try {
    const response = await api.get('products/');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch products');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const getProductsByCategory = async (category: string) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Cart APIs
export const addToCart = async (productId: string) => {
  try {
    const response = await api.post('/cart', { productId });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to add item to cart');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const getCartItems = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch cart items');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const removeFromCart = async (productId: string) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to remove item from cart');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to clear cart');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const updateCartItemQuantity = async (productId: string, quantity: number) => {
  try {
    const response = await api.put(`/cart/${productId}/quantity`, { quantity });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update item quantity');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Checkout APIs
export const createCheckout = async (orderSummary: any) => {
  const response = await api.post('/checkout', { orderSummary });
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderStatus = async (orderId: string) => {
  const response = await api.get(`/order/${orderId}`);
  return response.data;
}; 