import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

const slides: SlideProps[] = [
  {
    imageUrl: "https://github.com/Zar-ufo/image-publisher/blob/main/h1.png?raw=true",
    title: "Summer Collection",
    subtitle: "Discover fresh styles for the season",
  },
  {
    imageUrl: "https://github.com/Zar-ufo/image-publisher/blob/main/h2.png?raw=true",
    title: "New Arrivals",
    subtitle: "Be the first to shop our latest products",
  },
  {
    imageUrl: "https://github.com/Zar-ufo/image-publisher/blob/main/h3.png?raw=true",
    title: "Limited Edition",
    subtitle: "Exclusive items for a limited time only",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateText, setAnimateText] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  let touchStartX = 0;

  const nextSlide = () => {
    setAnimateText(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setAnimateText(true);
    }, 50);
  };

  const prevSlide = () => {
    setAnimateText(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setAnimateText(true);
    }, 50);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchStartX - touchEndX < -50) prevSlide();
  };

  return (
    <div
      ref={sliderRef}
      className="hero-slider relative w-full h-[500px] overflow-hidden rounded-2xl shadow-lg"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          style={{
            backgroundImage: `linear-gradient(rgba(35, 35, 55, 0.4), rgba(35, 35, 55, 0.6)), url(${slide.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full text-center text-white px-4 backdrop-blur-sm">
            <h1 className={`text-4xl md:text-6xl font-extrabold text-blue-500 drop-shadow-md mb-4 ${animateText ? "typewriter" : ""}`}>
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-orange-400 font-medium drop-shadow-sm mb-6">{slide.subtitle}</p>
            
            <a
              href="products"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-lg transition-transform transform hover:scale-105 shadow-md inline-block"
            >
              Shop Now
            </a>
          </div>
        </div>
      ))}

      {/* Always visible arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-600/80 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600/80 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
