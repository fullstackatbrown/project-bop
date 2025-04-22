import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createBucketClient } from "@cosmicjs/sdk";
import { queryObjects } from "../cosmic";
import Slider from "react-slick";
import Poll from "../Poll";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


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
  const [news, setNews] = useState(null);

  // useEffect(() => {
  //   const fetchMembers = async () => {
  //     try {
  //       const cosmic = createBucketClient({
  //         bucketSlug: "bop-backend-production",
  //         readKey: "8N6HiTQekcWvzJbMA4qSeTbIcb11wLI04UpzC68HzLyd2uuiXz",
  //       });
  //       const response = await cosmic.objects
  //         .find({ type: "news-pages" })
  //         .limit(10)
  //         .props("slug,title,metadata,type")
  //         .depth(1);

  //       let newsList = [];
  //       for (const member of response.objects) {
  //         newsList.push(member);
  //       }
  //       setNews(newsList);

  //       setLoading(false);
  //     } catch (err) {
  //       console.log("Failed to fetch");
  //       setLoading(false);
  //     }
  //   };

  //   fetchMembers();
  // }, []);
  useEffect(() => {
    (async () => {
      setNews(
        (await queryObjects({ type: "news-posts" }, 4))
          .map(raw => { return { ...raw.metadata, title: raw.title, slug: raw.slug } })
      );
    })();
  }, []);

  if (!news) return null;
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
          <div className="absolute inset-0 bg-blue-900 bg-opacity-80 bottom-1/2 md:bottom-0 md:right-1/2 md:w-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
          {/* Left Side - Animated Text & Button */}
          <div className="w-full md:w-1/2 flex flex-row md:flex-col justify-center text-white p-4 sm:p-8 md:p-14">
            <div className="w-1/2 md:w-full ml-8 md:ml-0 items-start text-2xl md:text-4xl xl:text-5xl font-bold leading-tight">
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
              <button className="md:w-1/2 border-2 rounded-lg border-white text-white text-sm md:text-2xl font-semibold px-3 md:px-8 py-3 transition duration-300 hover:bg-white hover:text-black hover:mix-blend-difference">
                See the newest poll results
              </button>
            </div>
          </div>

          {/* Right Side - Image Slideshow with Red Overlay */}
          <div className="w-full h-60 sm:h-70 md:h-auto md:w-1/2 flex justify-center items-center relative">
            {/* Red Overlay */}
            <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(226, 28, 33, 0.65)' }}></div>

            {/* Curved White Box for Carousel */}
            <div className="relative z-20 bg-white h-3/4 shadow-lg flex items-center justify-center overflow-hidden rounded-3xl">
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-1 sm:p-2 rounded-full shadow-md"
              >
                <ChevronLeft size={20} />
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
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 'News!' Section */}
      <section className="relative w-full flex flex-col items-center py-4 sm:py-8 mt-0 sm:mt-0 min-h-[90vh] sm:h-auto px-4">
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
                  src={news[0].image.url}
                  alt={news[0].image_caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text div */}
              <div className="p-4 sm:p-6 flex flex-col">
                <p className="text-xs py-2">{news[0].date}</p>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 overflow-hidden text-ellipsis line-clamp-2">
                  {news[0].title}
                </h3>
                <p className="text-sm overflow-hidden text-ellipsis line-clamp-3">
                  By {news[0].author} "{news[0].quote}"{" "}
                  {news[0].content} ...
                </p>
              </div>
            </div>

            {/* Secondary articles container */}
            <div className="w-full md:w-2/5 flex flex-col gap-4">
              {/* Individual articles */}
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="w-full flex flex-row items-center bg-white shadow-md"
                >
                  {/* Text div */}
                  <div className="w-4/5 sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-3/4 p-3 sm:p-4 flex flex-col justify-center">
                    <h3 className="text-xs md:text-lg font-bold mb-2 overflow-hidden text-ellipsis line-clamp-2">
                      {news[index].title}
                    </h3>
                    <p className="text-xs">{news[index].author}</p>
                    <p className="text-xs">{news[index].date}</p>
                  </div>

                  {/* Article image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 overflow-hidden rounded-md">
                    <img
                      src={news[index].image.url}
                      alt={news[index].caption}
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
      <LatestPolls />
    </div>
  );
}

function LatestPolls() {
  const latestPollGroupSlug = "february-2025";
  const [pollGroup, setPollGroup] = useState(null);
  useEffect(() => {
    (async () => {
      setPollGroup(
        (await queryObjects({ type: "poll-groups", slug: latestPollGroupSlug }))
          .map(raw => { return { ...raw.metadata, title: raw.title } })
        [0]
      );
    })();
  }, []);

  console.log(pollGroup)

  if (!pollGroup) return null;
  return (
    <div className="home-polls">
      <h4>Check out our latest polls!</h4>
      <Slider
        dots={true}
        infinite={true}
        speed={500}
        slidesToShow={2}
        slidesToScroll={1}
        arrows={true}
        className="home-poll-slider">
        {JSON.parse(pollGroup.data).slice(5).map((pollData, index) => (
          <div className="home-poll-outer-box">
            <div className="home-poll-box">
              <Poll data={pollData} tag={`${latestPollGroupSlug.split("-").join(" ")} #${index + 6}`} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}