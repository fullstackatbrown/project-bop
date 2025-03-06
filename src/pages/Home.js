import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createBucketClient } from "@cosmicjs/sdk";

const topics = [
  "dating culture",
  "Brown",
  "politics",
  "campus",
  "social media",
  "climate change",
];

const carouselImages = ["/temp.png", "/temp.png", "/temp.png", "/temp.png"];

const previousPollsImages = [
  "/temp.png",
  "/temp.png",
  "/temp.png",
  "/temp.png",
  "/temp.png",
  "/temp.png",
];

export default function Home() {
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

  {
    /* For 'Check out our previous polls!' Section */
  }
  const [currentPreviousPollsImageIndex, setCurrentPreviousPollsImageIndex] =
    useState(0);
  const [selectedPreviousPollsImage, setSelectedPreviousPollsImage] =
    useState(null);

  const nextPreviousPollsSlide = () => {
    setCurrentPreviousPollsImageIndex(
      (prevIndex) => (prevIndex + 1) % previousPollsImages.length
    );
  };

  const prevPreviousPollsSlide = () => {
    setCurrentPreviousPollsImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + previousPollsImages.length) %
        previousPollsImages.length
    );
  };

  const previousPollsVisibleImages = [
    previousPollsImages[
      (currentPreviousPollsImageIndex - 1 + previousPollsImages.length) %
        previousPollsImages.length
    ], // Left cut-off
    previousPollsImages[currentPreviousPollsImageIndex], // Fully visible
    previousPollsImages[
      (currentPreviousPollsImageIndex + 1) % previousPollsImages.length
    ], // Fully visible
    previousPollsImages[
      (currentPreviousPollsImageIndex + 2) % previousPollsImages.length
    ], // Fully visible
    previousPollsImages[
      (currentPreviousPollsImageIndex + 3) % previousPollsImages.length
    ], // Right cut-off
  ];

  const [news, setNews] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const cosmic = createBucketClient({
          bucketSlug: "bop-backend-production",
          readKey: "8N6HiTQekcWvzJbMA4qSeTbIcb11wLI04UpzC68HzLyd2uuiXz",
        });
        const response = await cosmic.objects
          .findOne({
            type: "news-pages",
            slug: "test-page",
          })
          .props("metadata")
          .depth(1);

        let newsList = [];
        newsList.push(response);

        setNews(newsList);

        setLoading(false);
      } catch (err) {
        console.log("Failed to fetch");
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  console.log(news);

  return (
    <div>
      {/* 'Discover how Brown students feel about ...' Section */}
      <section className="relative flex items-center w-full h-[65vh] mx-auto">
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
      </section>

      {/* 'News!' Section */}
      <section>{/* Add more content here as needed */}</section>

      {/* 'Check out our previous polls!' Section */}
      <section className="relative w-full flex flex-col items-center bg-blue-900 py-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          Check out our previous polls!
        </h2>

        {/* Carousel Container */}
        <div className="relative w-4/5 overflow-hidden">
          {/* Images */}
          <div className="flex justify-center items-center space-x-4">
            {previousPollsVisibleImages.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt={`Poll ${index}`}
                className={`cursor-pointer object-cover rounded-lg transition-all ${
                  index === 1 || index === 2 || index === 3
                    ? "w-1/4 opacity-100" // Fully visible
                    : "w-1/6 opacity-50" // Cut-off effect
                }`}
                onClick={() => setSelectedPreviousPollsImage(img)}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevPreviousPollsSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextPreviousPollsSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
        >
          <ChevronRight size={32} />
        </button>

        {/* Modal for Enlarged Image */}
        <AnimatePresence>
          {selectedPreviousPollsImage && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative">
                <motion.img
                  src={selectedPreviousPollsImage}
                  alt="Enlarged"
                  className="w-auto h-96 object-contain rounded-lg"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                />
                <button
                  onClick={() => setSelectedPreviousPollsImage(null)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Button */}
        <div className="w-30 mt-6">
          <button className="w-full border-2 border-white text-white text-2xl font-semibold px-8 py-3 transition duration-300 hover:bg-white hover:text-black">
            View past polls
          </button>
        </div>
      </section>
    </div>
  );
}
