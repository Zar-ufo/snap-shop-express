
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/supabase";
import { Trash2 } from "lucide-react";

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const [submitting, setSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
      valid = false;
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      return;
    }
    
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const order = {
        ...formData,
        items: cart,
        total: getTotalPrice(),
      };
      
      const { success, error } = await createOrder(order);
      
      if (success) {
        clearCart();
        navigate("/confirmation");
      } else {
        console.error("Error creating order:", error);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-16 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-8 text-gray-600">Add some products to your cart to proceed with checkout</p>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-md shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Your Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-md shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="flex items-center space-x-3 p-4 border rounded-md bg-brand-light">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked
                  readOnly
                  className="w-4 h-4 accent-brand-teal"
                />
                <label htmlFor="cod" className="text-brand-dark font-medium">Cash on Delivery</label>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-md shadow-sm border sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded-md">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 py-1">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={submitting || cart.length === 0}
                className="w-full mt-6 bg-brand-teal hover:bg-brand-teal/80"
              >
                {submitting ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
