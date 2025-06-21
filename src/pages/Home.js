import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cosmic, dateFormat } from "../cosmic";
import Slider from "react-slick";
import Poll from "../components/Poll";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { publicUrl } from "../publicUrl";

const topics = [
    "dating culture",
    "Brown",
    "politics",
    "campus",
    "social media",
    "climate change",
];

export default function Home() {
    const [currentTopic, setCurrentTopic] = useState(0);

    useEffect(() => {
        const topicInterval = setInterval(() => {
            setCurrentTopic((prev) => (prev + 1) % topics.length);
        }, 3000);

        return () => clearInterval(topicInterval);
    }, []);

    const [news, setNews] = useState(null);

    useEffect(() => {
        (async () => {
            setNews(
                (await cosmic.objects.find({ type: "news-posts", limit: 4 })).objects.map((raw) => {
                    return { ...raw.metadata, title: raw.title, slug: raw.slug };
                })
            );
        })();
    }, []);

    if (!news) return null;
    return (
        <div>
            {/* "Discover how Brown students feel about ..." Section */}
            <section className="relative flex flex-col w-full h-auto md:h-[60vh] mx-auto">
                {/* Background Image with Blue Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${publicUrl("/BrownUniversityImage.jpg")})` }}
                >
                    <div className="absolute inset-0 bg-blue-900 bg-opacity-80 bottom-1/2 md:bottom-0 md:right-1/2 md:w-1/2"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
                    {/* Left Side - Animated Text & Button */}
                    <div className="w-full md:w-1/2 flex flex-row md:flex-col items-center justify-center text-white p-4 sm:p-5 md:p-14">
                        <div className="w-1/2 md:w-full ml-8 md:ml-0 flex flex-col items-center text-2xl md:text-4xl xl:text-5xl font-bold leading-tight mobile-hide">
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
                        <div className="md:w-full ml-8 md:ml-0 items-start text-2xl md:text-4xl xl:text-5xl font-bold leading-tight mobile-show overflow-hidden">
                            <div>Discover how Brown students</div>
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
                        <div className="flex w-1/2 md:w-full mt-6 items-center justify-center py-2">
                            <Link
                                to="/polls"
                                className="flex flex-col items-center"
                                style={{ width: "100%" }}
                            >
                                <button className="md:w-[55%] border-2 rounded-lg bg-blue-900 bg-opacity-60 border-white text-white text-md md:text-2xl font-semibold px-3 md:px-4 py-3 transition duration-300 hover:bg-white hover:text-black hover:mix-blend-difference mobile-hide">
                                    See the latest poll results
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Image Slideshow with Red Overlay */}
                    <div className="w-full h-80 sm:h-70 md:h-auto md:w-1/2 flex justify-center items-center relative red-box">
                        {/* Red Overlay */}
                        <div
                            className="absolute inset-0 z-10"
                            style={{ backgroundColor: "rgba(226, 28, 33, 0.65)" }}
                        ></div>

                        {/* Curved White Box for Carousel */}
                        <div
                            className="relative z-20 bg-white shadow-lg flex items-top justify-center overflow-hidden rounded-3xl"
                            style={{ height: "90%" }}
                        >
                            <InstagramEmbed postUrl="https://www.instagram.com/p/DJ7v4PQN8nm" />
                        </div>

                        <a
                            href="/polls"
                            style={{ width: "100%", textAlign: "center" }}
                            className="mobile-show"
                        >
                            <button className="relative z-20 border-2 rounded-lg bg-[#e21c21b0] border-white text-white text-lg md:text-2xl font-semibold px-3 md:px-8 py-3 transition duration-300 hover:bg-white hover:text-black">
                                See the latest poll results
                            </button>
                        </a>
                    </div>
                </div>
            </section>

            {/* "News!" Section */}
            <section className="relative w-full flex flex-col items-center py-4 sm:py-8 mt-0 sm:mt-0 sm:h-auto px-4 mb-14">
                {/* Main article */}
                <div className="w-full px-0 sm:w-11/12 md:w-10/12 lg:w-4/5 max-w-6xl">
                    {/* News heading */}
                    <h2 className="text-3xl md:text-3xl xl:text-4xl font-bold text-slate-950 mb-4 py-2">
                        News
                    </h2>

                    {/* Main article container */}
                    <div className="w-full flex flex-col md:flex-row gap-4">
                        {/* Headline article container */}
                        <Link to={`/articles/${news[0].slug}`} className="md:w-3/5">
                            <div className="w-full flex flex-col bg-white shadow-md rounded-lg">
                                {/* Article image */}
                                <div className="w-full h-48 sm:h-64 md:h-72 bg-slate-800 overflow-hidden rounded-t-lg">
                                    <img
                                        src={news[0].image.url}
                                        alt={news[0].image_caption}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Text div */}
                                <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6 sm:pt-2 flex flex-col">
                                    <p className="text-xs py-2">{news[0].date}</p>
                                    <h3 className="text-xl sm:text-2xl leading-6 sm:leading-[1.75rem] md:leading-6 lg:leading-6 font-bold mb-2 overflow-hidden text-ellipsis line-clamp-2">
                                        <span>{news[0].title}</span>
                                    </h3>
                                    <p className="text-sm overflow-hidden text-ellipsis line-clamp-3">
                                        By {news[0].author} -&nbsp;
                                        {news[0].content.split("\n").slice(2).join("")} ...
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Secondary articles container */}
                        <div className="w-full md:w-2/5 flex flex-col gap-4">
                            {/* Individual articles */}
                            {[1, 2, 3].map((index) => (
                                <Link to={`/articles/${news[index].slug}`}>
                                    <div
                                        key={index}
                                        className="w-full flex flex-row items-start justify-between bg-white shadow-md rounded-lg pr-4"
                                    >
                                        {/* Text div */}
                                        <div className="flex-grow p-3 sm:p-4 flex flex-col justify-center">
                                            <h3 className="text-lg md:text-lg font-bold mb-2 overflow-hidden text-ellipsis line-clamp-2 leading-5 md:leading-5">
                                                <span>
                                                    {news[index].title}
                                                </span>
                                            </h3>
                                            <p className="text-sm">{news[index].author}</p>
                                            <p className="text-sm">
                                                {dateFormat(news[index].date_published)}
                                            </p>
                                        </div>

                                        {/* Article image */}
                                        <div className="flex-shrink-0 my-4 w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 overflow-hidden rounded-md">
                                            <img
                                                src={news[index].image.url}
                                                alt={news[index].caption}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* "Check out our previous polls!" Section */}
            <LatestPolls />
        </div>
    );
}

function LatestPolls() {
    const [pollGroup, setPollGroup] = useState(null);
    useEffect(() => {
        (async () => {
            setPollGroup(
                (await cosmic.objects.find({ type: "poll-groups", limit: 1 })).objects
                    .map((raw) => {
                        return { ...raw.metadata, title: raw.title, slug: raw.slug };
                    })[0]
            );
        })();
    }, []);

    if (!pollGroup) return null;
    return (
        <div className="home-polls px-5 py-10 sm:py-14">
            <h4 className="text-center text-3xl md:text-4xl xl:text-4xl font-bold mb-2">
                Check out our latest polls!
            </h4>
            <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={2}
                slidesToScroll={1}
                arrows={true}
                className="home-poll-slider"
                responsive={[
                    {
                        breakpoint: 768, // Tailwind"s "md" breakpoint is 768px
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: false,
                        },
                    },
                ]}
            >
                {JSON.parse(pollGroup.data)
                    .slice(5)
                    .map((pollData, index) => (
                        <div className="home-poll-outer-box">
                            <div className="home-poll-box shadow-lg">
                                <Poll
                                    data={pollData}
                                    tag={`${pollGroup.slug.split("-").join(" ")} #${index + 6
                                        }`}
                                />
                            </div>
                        </div>
                    ))}
            </Slider>
        </div>
    );
}

function InstagramEmbed({ postUrl }) {
    useEffect(() => {
        // Create and append the Instagram embed script
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);

        // Cleanup: remove script on unmount
        return () => {
            document.body.removeChild(script);
        };
    }, [postUrl]);

    return (
        <blockquote
            className="instagram-media"
            data-instgrm-permalink={postUrl}
            data-instgrm-version="14"
            style={{
                width: "100%",
                maxWidth: "540px",
                margin: "1rem auto",
                padding: 0,
                border: "none",
                overflow: "hidden",
            }}
        ></blockquote>
    );
}
