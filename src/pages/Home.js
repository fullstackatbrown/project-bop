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

const carouselImages = ["/temp_poll.png", "/temp_poll.png", "/temp_poll.png", "/temp_poll.png"];

const previousPollsImages = [
  "/temp_poll.png",
  "/temp_poll.png",
  "/temp_poll.png",
  "/temp_poll.png",
  "/temp_poll.png",
  "/temp_poll.png",
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
          .find({ type: "news-pages" })
          .limit(10)
          .props("slug,title,metadata,type")
          .depth(1);

        let newsList = [];
        for (const member of response.objects) {
          newsList.push(member);
        }
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
      <section className="relative flex flex-col w-full h-auto md:h-[60vh] mx-auto">
        {/* Background Image with Blue Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/BrownUniversityImage.jpg')" }}
        >
          <div className="absolute inset-0 bg-blue-900 bg-opacity-80 right-1/2 w-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
          {/* Left Side - Animated Text & Button */}
          <div className="w-full md:w-1/2 flex flex-row md:flex-col justify-center text-white p-4 sm:p-8 md:p-14">
            <div className="w-1/2 md:w-full ml-8 md:ml-0 items-start text-3xl md:text-4xl xl:text-5xl font-bold leading-tight">
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
            <div className="flex w-1/2 md:w-full mt-6 items-center justify-start py-2">
              <button className="w-1/2 border-2 rounded-lg border-white text-white text-md md:text-2xl font-semibold px-3 md:px-8 py-3 transition duration-300 hover:bg-white hover:text-black hover:mix-blend-difference">
                See the newest poll results
              </button>
            </div>
          </div>

          {/* Right Side - Image Slideshow with Red Overlay */}
          <div className="w-full h-64 sm:h-72 md:h-auto md:w-1/2 flex justify-center items-center relative">
            {/* Red Overlay */}
            <div className="absolute inset-0 z-10"  style={{ backgroundColor: 'rgba(226, 28, 33, 0.65)' }}></div>

            {/* Curved White Box for Carousel */}
            <div className="relative z-20 bg-white h-3/4 shadow-lg flex items-center justify-center overflow-hidden rounded-3xl">
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-1 sm:p-2 rounded-full shadow-md"
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
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-1 sm:p-2 rounded-full shadow-md"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 'News!' Section */}
      <section className="relative w-full flex flex-col items-center py-4 sm:py-8 mt-0 sm:mt-0 min-h-[90vh] sm:h-auto">
        {/* Main article */}
        <div className="w-full px-0 sm:w-11/12 md:w-10/12 lg:w-4/5 max-w-6xl">
          {/* News heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-950 mb-4 py-8">
            News
          </h2>

          {/* Main article container */}
          <div className="w-full flex flex-col md:flex-row gap-4">
            {/* Headline article container */}
            <div className="w-full md:w-3/5 flex flex-col bg-white shadow-md">
              {/* Article image */}
              <div className="w-full h-48 sm:h-64 md:h-72 bg-slate-800 overflow-hidden rounded-md">
                <img
                  src={news[0].metadata.image.imgix_url}
                  alt={news[0].metadata.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text div */}
              <div className="p-4 sm:p-6 flex flex-col">
                <p className="text-xs py-2">{news[0].metadata.date}</p>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 overflow-hidden text-ellipsis line-clamp-2">
                  {news[0].metadata.article_title}
                </h3>
                <p className="text-sm overflow-hidden text-ellipsis line-clamp-3">
                  By {news[0].metadata.author} "{news[0].metadata.quote}"{" "}
                  {news[0].metadata.body} ...
                </p>
              </div>
            </div>

            {/* Secondary articles container */}
            <div className="w-full md:w-2/5 flex flex-col gap-4">
              {/* Individual articles */}
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="w-full flex flex-row items-center bg-white shadow-md"
                >
                  {/* Text div */}
                  <div className="w-4/5 sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-3/4 p-3 sm:p-4 flex flex-col justify-center">
                    <h3 className="text-xs md:text-lg font-bold mb-2 overflow-hidden text-ellipsis line-clamp-2">
                      {news[index].metadata.article_title}
                    </h3>
                    <p className="text-xs">{news[index].metadata.author}</p>
                    <p className="text-xs">{news[index].metadata.date}</p>
                  </div>

                  {/* Article image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 overflow-hidden rounded-md">
                    <img
                      src={news[index].metadata.image.imgix_url}
                      alt={news[index].metadata.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 'Check out our previous polls!' Section */}
      <section className="relative w-full flex flex-col items-center bg-blue-900 py-16 min-h-[72vh]">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-14">
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
          className="absolute left-2 sm:left-14 top-1/2 transform -translate-y-1/2 text-white p-1 sm:p-2"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextPreviousPollsSlide}
          className="absolute right-2 sm:right-14 top-1/2 transform -translate-y-1/2 text-white p-1 sm:p-2"
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
                  className="w-auto h-96 object-contain"
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
        <div className="w-30 mt-12">
          <button className="border-2 border-white text-white text-md md:text-xl font-semibold px-8 py-3 transition duration-300 hover:bg-white hover:text-black rounded-3xl">
            View past polls
          </button>
        </div>
      </section>
    </div>
  );
}
