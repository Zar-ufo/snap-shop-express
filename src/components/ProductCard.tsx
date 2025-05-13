
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-hidden cursor-pointer" onClick={handleViewDetails}>
          <img
            src={product.image_url}
            alt={product.name}
            className="product-card-image transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 
            className="font-semibold text-lg line-clamp-1 cursor-pointer hover:text-brand-teal transition-colors"
            onClick={handleViewDetails}
          >
            {product.name}
          </h3>
          <p className="text-brand-dark/70 line-clamp-2 text-sm h-10">{product.description}</p>
          <p className="font-bold text-brand-teal mt-2">${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
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
      </CardFooter>
    </Card>
  );
}
