
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
};

export type OrderItem = {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[] | CartItem[];
  total: number;
  created_at?: string;
  status?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

// Sample products data until we connect to Supabase
export const sampleProducts: Product[] = [
  {
    id: 0,
    name: "BFF Official Jersey Jersey 2024-2025",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/m1.png?raw=true",
  },
  {
    id: 1,
    name: "BFF FanMade Jersey Home 2025",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/6.png?raw=true",
  },
  {
    id: 2,
    name: "BFF Official Jersey Away 2024-2025",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/11.png?raw=true",
  },
  {
    id: 3,
    name: "BFF Away Jersey 2024-2025",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/12.png?raw=true",
  },
  {
    id: 4,
    name: "Men's Inter Miami CF 23/24 away Jersey",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last.",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/4.png?raw=true",
  },
  {
    id: 5,
    name: "Santos FC jersey 2025",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/5.png?raw=true",
  },
  {
    id: 6,
    name: "Real Madrid 2024-2025 Jersey",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/2.png?raw=true",
  },
  {id: 7,
    name: "Paris Saint-Germain (PSG) 2024/2025",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/8.png?raw=true",
  },
  { id: 8,
    name: "Paris Saint-Germain (PSG) Home Jersey 2025",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/9.png?raw=true",
  },
    {id: 9,
    name: "Argentina 2024 Home Authentic Jersey",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/10.png?raw=true",
  },
  {id: 10,
    name: "FC Barcelona 2024-2025 away jersey",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/1.png?raw=true",
  },
  {id: 11,
    name: "Real Madrid 2023/24 third kit jersey",
    price: 350,
    description: "✅ Premium quality, breathable fabric✅ Available in all sizes (S–XXL)✅ Custom name & number option✅ Lightweight & comfortable fit✅ Durable stitching – built to last",
    image_url: "https://github.com/Zar-ufo/image-publisher/blob/main/3.png?raw=true",
  }

];

export async function getProducts(): Promise<Product[]> {
  // Once connected to Supabase, this would fetch from the database
  // For now, return sample data
  return sampleProducts;
}

export async function createOrder(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert the cart items to a format suitable for JSON storage
    const orderItems = order.items.map(item => {
      if ('product' in item) {
        // It's a CartItem
        return {
          product_id: item.product.id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity
        };
      }
      // It's already an OrderItem
      return item;
    });

    const { error } = await supabase
      .from('orders')
      .insert({
        name: order.name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        items: orderItems,
        total: order.total,
        status: 'pending'
      });

    if (error) {
      console.error('Error inserting order:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating order:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
