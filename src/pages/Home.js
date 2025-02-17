import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const topics = [
  "dating culture",
  "Brown",
  "politics",
  "campus",
  "social media",
  "climate change",
];

const carouselImages = ["/temp.png", "/temp.png", "/temp.png", "/temp.png"];

export default function Slideshow() {
  const [currentTopic, setCurrentTopic] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const topicInterval = setInterval(() => {
      setCurrentTopic((prev) => (prev + 1) % topics.length);
    }, 3000);

    return () => clearInterval(topicInterval);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <div className="relative flex items-center w-full h-[65vh] mx-auto">
      {/* Background Image with Blue Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/BrownUniversityImage.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full h-full">
        {/* Left Side - Animated Text & Button */}
        <div className="w-1/2 flex flex-col justify-center items-start text-white p-14">
          <div className="text-7xl font-bold leading-tight">
            <div>Discover how</div>
            <div>Brown students</div>
            <div>feel about</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={topics[currentTopic]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-white"
              >
                {topics[currentTopic]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Button */}
          <div className="w-full mt-6">
            <button className="w-full border-2 border-white text-white text-2xl font-semibold px-8 py-3 transition duration-300 hover:bg-white hover:text-black hover:mix-blend-difference">
              See the newest poll results
            </button>
          </div>
        </div>

        {/* Right Side - Image Slideshow with Red Overlay */}
        <div className="w-1/2 flex justify-center items-center relative">
          {/* Red Overlay */}
          <div className="absolute inset-0 bg-red-900 bg-opacity-70 z-10"></div>

          {/* Curved White Box for Carousel */}
          <div className="relative z-20 bg-white w-3/4 h-3/4 rounded-3xl shadow-lg flex items-center justify-center overflow-hidden">
            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full shadow-md"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Clickable Image */}
            <motion.img
              key={carouselImages[currentImage]}
              src={carouselImages[currentImage]}
              alt="Carousel Slide"
              className="w-full h-full object-cover rounded-3xl cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            />

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full shadow-md"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
