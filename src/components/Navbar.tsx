
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export function Navbar() {
  const { getTotalItems } = useCart();
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand-teal">
          SnapShop
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-brand-dark hover:text-brand-teal transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-brand-dark hover:text-brand-teal transition-colors">
            Products
          </Link>
        </nav>
        
        <Link to="/checkout" className="relative">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="text-brand-dark" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
