
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Order, OrderItem } from "@/lib/supabase";
import { ChevronDown, ChevronUp } from "lucide-react";

const AdminPage = () => {
  const { secretKey } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  useEffect(() => {
    // Verify the secret key matches our expected value
    if (secretKey !== "zarifman11") {
      toast.error("Unauthorized access");
      navigate("/");
      return;
    }

    fetchOrders();
  }, [secretKey, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our Order type
      const transformedOrders: Order[] = data.map(order => ({
        ...order,
        items: order.items as unknown as OrderItem[]
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      // Update the local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderOrderStatus = (order: Order) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors] || "bg-gray-100"}`}>
        {order.status}
      </span>
    );
  };

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const isOrderExpanded = (orderId: number) => {
    return expandedOrders.includes(orderId);
  };

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel - Orders</h1>
        <Button onClick={() => navigate("/")} variant="outline">Back to Shop</Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">No orders found</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <Button 
                        onClick={() => toggleOrderExpand(order.id!)} 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                      >
                        {isOrderExpanded(order.id!) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.created_at ? formatDate(order.created_at) : "N/A"}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{renderOrderStatus(order)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id!, "processing")}
                          disabled={order.status === "processing"}
                        >
                          Process
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id!, "completed")}
                          disabled={order.status === "completed"}
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        >
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id!, "cancelled")}
                          disabled={order.status === "cancelled"}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isOrderExpanded(order.id!) && (
                    <TableRow>
                      <TableCell colSpan={8} className="p-0">
                        <div className="bg-gray-50 p-4 border-t border-gray-200">
                          <h3 className="font-semibold mb-2">Order Items</h3>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Subtotal</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(order.items as OrderItem[]).map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="mt-4">
                            <h3 className="font-semibold mb-2">Shipping Information</h3>
                            <p><span className="font-medium">Address:</span> {order.address}</p>
                            <p><span className="font-medium">Phone:</span> {order.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
