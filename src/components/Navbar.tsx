import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import logo from "../../assets/favicon.png";

export function Navbar() {
  const { getTotalItems } = useCart();

  return (
    <header className="sticky top-0 z-10 px-8 py-5 border-b shadow-md bg-[#fdf0e7] animate-fadeIn">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-10">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Clothing Wear BD"
            className="w-16 h-16 rounded-xl shadow-lg border border-brand-orange"
          />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center space-x-10 font-poppins text-lg font-semibold">
          <Link to="/" className="text-brand-blue hover:text-brand-orange transition duration-300 hover:scale-105">
            Home
          </Link>
          <Link to="/products" className="text-brand-blue hover:text-brand-orange transition duration-300 hover:scale-105">
            Products
          </Link>
        </nav>

        {/* Cart Icon */}
        <Link to="/checkout" className="relative">
          <Button variant="ghost" size="icon" className="group scale-[2.2] px-4 py-4">
            <ShoppingCart className={`w-10 h-10 text-brand-blue group-hover:scale-110 transition-transform duration-300 ${getTotalItems() > 0 ? "animate-bounce" : ""}`} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
