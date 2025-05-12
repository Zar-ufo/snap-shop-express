
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

const slides: SlideProps[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1920",
    title: "Summer Collection",
    subtitle: "Discover fresh styles for the season",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920",
    title: "New Arrivals",
    subtitle: "Be the first to shop our latest products",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920",
    title: "Limited Edition",
    subtitle: "Exclusive items for a limited time only",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slider relative w-full">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-item ${index === currentSlide ? "active" : ""}`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{slide.title}</h1>
            <p className="text-xl md:text-2xl mb-6 text-center">{slide.subtitle}</p>
            <Button className="bg-brand-teal hover:bg-brand-teal/80 text-white">Shop Now</Button>
          </div>
        </div>
      ))}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
