
import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Confirmation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-brand-teal/20 rounded-full flex items-center justify-center mb-6">
            <Check className="text-brand-teal w-8 h-8" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
          
          <p className="text-gray-600 mb-8">
            Thank you! We will soon contact you for confirmation!
          </p>
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full bg-brand-teal hover:bg-brand-teal/80">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;
