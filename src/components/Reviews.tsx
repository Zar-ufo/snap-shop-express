
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StarIcon, StarHalfIcon, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    rating: 5,
    content: "I absolutely love this product! The quality is outstanding and it arrived sooner than expected. Would definitely recommend to friends and family.",
    date: "2025-05-02",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@example.com",
    rating: 4,
    content: "Great value for the price. The product exceeded my expectations in terms of functionality, though there were some minor issues with the packaging.",
    date: "2025-04-28",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    rating: 5,
    content: "This is exactly what I was looking for! Perfect size, color, and design. I'll definitely be shopping here again in the future.",
    date: "2025-04-15",
  },
];

interface Review {
  id: number;
  name: string;
  email: string;
  rating: number;
  content: string;
  date: string;
}

const reviewSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  rating: z.number().min(1).max(5),
  content: z.string().min(10, { message: "Review must be at least 10 characters" }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewsProps {
  productId: number;
}

export function Reviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 5,
      content: "",
    },
  });

  const onSubmit = (values: ReviewFormValues) => {
    const newReview = {
      id: reviews.length + 1,
      ...values,
      date: new Date().toISOString().split('T')[0],
    };
    
    setReviews([newReview, ...reviews]);
    form.reset();
    toast.success("Your review has been submitted!");
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} className="text-yellow-500 fill-yellow-500" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half-star" className="text-yellow-500" size={16} />);
    }
    
    return stars;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon 
                          key={star}
                          onClick={() => form.setValue("rating", star)} 
                          className={`cursor-pointer ${field.value >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          size={24}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts about this product..." 
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="bg-brand-teal hover:bg-brand-teal/80 text-white"
            >
              Submit Review
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare size={20} />
          Customer Feedback ({reviews.length})
        </h3>
        
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="mb-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 rounded-full p-2">
                      <User size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{review.name}</div>
                      <div className="text-xs text-gray-500">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-700">{review.content}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
}
