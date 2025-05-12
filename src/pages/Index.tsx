
import React, { useEffect, useState } from "react";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { getProducts, Product } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        
        <section className="container py-12">
          <h2 className="text-3xl font-bold text-center mb-2">Featured Products</h2>
          <div className="flex justify-center mb-8">
            <Separator className="w-20 bg-brand-teal h-1" />
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-[400px] bg-gray-200 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/products" className="inline-block bg-brand-teal hover:bg-brand-teal/80 text-white px-6 py-2 rounded-md transition-colors">
              View All Products
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-brand-dark text-white py-8">
        <div className="container text-center">
          <p>© 2025 SnapShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

import { Link } from "react-router-dom";

export default Index;
