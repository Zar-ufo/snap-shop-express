
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
    id: 1,
    name: "Classic White Sneakers",
    price: 79.99,
    description: "Clean, minimalist design for everyday wear. Comfortable cushioning and durable construction.",
    image_url: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    name: "Vintage Denim Jacket",
    price: 119.99,
    description: "Classic denim jacket with a worn-in look. Perfect for layering in any season.",
    image_url: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 3,
    name: "Designer Sunglasses",
    price: 149.99,
    description: "UV protection with stylish frames. Lightweight and comfortable for all-day wear.",
    image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 4,
    name: "Leather Weekender Bag",
    price: 199.99,
    description: "Handcrafted from premium leather. Spacious interior with multiple compartments.",
    image_url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 5,
    name: "Wireless Headphones",
    price: 129.99,
    description: "Immersive sound quality with noise cancellation. Comfortable fit for extended listening.",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug",
    price: 24.99,
    description: "Handcrafted ceramic with unique glaze. Microwave and dishwasher safe.",
    image_url: "https://images.unsplash.com/photo-1577937147486-e224d45fab77?auto=format&fit=crop&q=80&w=1000",
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
