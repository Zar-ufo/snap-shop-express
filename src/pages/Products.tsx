import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { getProducts, Product } from "@/lib/supabase";

const Products = () => {
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
    <div className="min-h-screen flex flex-col bg-[#f0f8ff] text-gray-900">
      <Navbar />

      <main className="flex-1 container py-10">
        <h1 className="text-4xl font-extrabold text-blue-500 drop-shadow mb-10 text-center">
          All Products
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-[400px] bg-blue-100 animate-pulse rounded-xl shadow-sm"
              ></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-20">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-10 shadow-inner">
        <div className="container text-center">
          <p className="text-sm tracking-wide">
            © 2025 <span className="text-orange-400 font-semibold">Cosmetics Wear BD</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
