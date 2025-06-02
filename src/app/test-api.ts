import { getProducts } from './api';

async function testGetProducts() {
  try {
    const products = await getProducts();
    console.log('Products:', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

testGetProducts(); 