"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import axios from 'axios';
import { FileText, Calendar } from 'lucide-react';

// Conversion rate
const USD_TO_INR = 83;

const formatPrice = (price: number) => {
  const inrPrice = price * USD_TO_INR;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(inrPrice);
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'pending':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'processing':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'completed':
      return 'bg-green-50 text-green-700 border border-green-200';
    case 'cancelled':
      return 'bg-red-50 text-red-700 border border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  status: string;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  createdAt: string;
}

interface OrderResponse {
  success: boolean;
  data: Order;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await axios.get<OrderResponse>('http://localhost:8000/api/checkout/order/VSA-1748755505743-32BC92F9', {
        withCredentials: true
      });
      
      console.log('Orders response:', response.data);
      
      if (response.data.success) {
        setOrders([response.data.data]);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Orders</h1>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-48 rounded-lg shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Orders</h1>
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mb-6">
                <FileText className="w-16 h-16 mx-auto text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Orders</h1>
          
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.orderId} className="overflow-hidden border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Order #{order.orderId}
                    </CardTitle>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    <span>{order.status}</span>
                  </div>
                </CardHeader>
                {/* <CardContent className="p-6 bg-white">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-medium text-gray-900">
                            {format(new Date(order.createdAt), 'PPP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                              <span className="font-medium text-gray-900">{item.name}</span>
                              <span className="text-gray-500 ml-2 text-sm">x{item.quantity}</span>
                            </div>
                            <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent> */}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
