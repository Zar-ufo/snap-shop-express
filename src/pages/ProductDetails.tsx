
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { getProducts, Product } from "@/lib/supabase";
import { Reviews } from "@/components/Reviews";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const foundProduct = products.find(p => p.id === Number(productId));
        
        if (foundProduct) {
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back to Products
        </Button>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[400px] bg-gray-200 animate-pulse rounded-md"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/4"></div>
              <div className="h-40 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
        ) : product ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-2xl font-bold text-brand-teal">${product.price.toFixed(2)}</p>
                <Separator />
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="outline"
                    className="flex-1 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    className="flex-1 bg-brand-coral hover:bg-brand-coral/80 text-white"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="my-12" />
            <Reviews productId={product.id} />
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
            <Button 
              className="mt-4 bg-brand-teal hover:bg-brand-teal/80"
              onClick={() => navigate("/products")}
            >
              View All Products
            </Button>
          </div>
        )}
      </main>
      
      <footer className="bg-brand-dark text-white py-8">
        <div className="container text-center">
          <p>© 2025 SnapShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;
