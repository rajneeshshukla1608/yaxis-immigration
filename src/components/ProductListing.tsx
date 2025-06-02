import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/pages/Index';

interface ProductListingProps {
  onAddToCart: (product: Product) => void;
  products: Product[];
}

export const ProductListing: React.FC<ProductListingProps> = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {(() => {
        if (!Array.isArray(products) || products.length === 0) {
          return (
            <div className="col-span-full text-center text-gray-500 py-8">
              No products available
            </div>
          );
        }
        return products.map((product) => {
          return (
            <Card key={product._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </div>
                  <Button 
                    onClick={() => onAddToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        });
      })()}
    </div>
  );
};
