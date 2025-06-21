import React, { useEffect, useState, useRef } from "react";
import "./Article.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { cosmic, dateFormat } from "../cosmic";
import Markdown from "react-markdown";
import Poll from "../components/Poll";
import { publicUrl } from "../publicUrl";

function ShareBar() {
    const currentURL = window.location.href;
    const [showPopup, setShowPopup] = useState(false);
    const [copied, setCopied] = useState(false);
    const textRef = useRef(null);

    const togglePopup = () => {
        setShowPopup(!showPopup);
        setCopied(false);
    };

    const toggleCopied = () => {
        setCopied(!copied);
    };

    useEffect(() => {
        if (textRef.current) {
            const range = document.createRange();
            range.selectNodeContents(textRef.current);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, [showPopup]);

    return (
        <div className="outer">
            <div className="icons">
                <a
                    href={"https://www.facebook.com/sharer/sharer.php?u=" + currentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="facebook-share-button"
                >
                    <img
                        src={publicUrl("/facebook.png")}
                        alt="Share on Facebook"
                        className="facebook-icon"
                    />
                </a>

                <a
                    href={"https://twitter.com/intent/tweet?url=" + currentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="x-share-button"
                >
                    <img src={publicUrl("/xlogo.svg")} alt="Share on X" class="x-icon" />
                </a>
                <a
                    href={
                        "https://www.linkedin.com/sharing/share-offsite/?url=" + currentURL
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-share-button"
                >
                    <img
                        src={publicUrl("/linkedin.png")}
                        alt="Share on LinkedIn"
                        className="linkedin-icon"
                    />
                </a>
                <button className="share-button" onClick={togglePopup}>
                    <img src={publicUrl("/shareicon.png")} alt="Share icon" />
                </button>
            </div>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={togglePopup}>
                            &times;
                        </span>
                        <p>Share this page:</p>
                        <p ref={textRef} className="popup-link">
                            {" "}
                            {currentURL}{" "}
                        </p>
                        <div className="popup-buttons">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(currentURL);
                                    toggleCopied();
                                }}
                            >
                                Copy Link
                            </button>
                            <button onClick={togglePopup}> Cancel </button>
                        </div>
                    </div>

                    {copied && <p className="copied"> Copied! </p>}
                </div>
            )}
        </div>
    );
}

function RecentArticles({ posts }) {
    return (
        <div>
            <div className="recent-headers">
                <p className="recent-posts"> Recent Posts </p>
                <p className="see-all">
                    <Link to={"/news"} className="news-link">
                        See All
                    </Link>
                </p>
            </div>
            <div className="recent-news">
                {posts.map((article, idx) => {
                    return (
                        <RecentArticle
                            key={"rec" + idx}
                            image={article.image.url}
                            title={article.title}
                            slug={article.slug}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function RecentArticle({ image, title, slug }) {
    return (
        <div className="recent-article">
            <img src={image} alt="recent article img" />
            <p className="recent-title">
                <Link
                    to={`/articles/${slug}`}
                    className="article-link"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    {title.slice(0, 40) + "..."}
                </Link>
            </p>
        </div>
    );
}

export default function Article() {
    const { postSlug } = useParams();
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);
    useEffect(() => {
        (async () => {
            setPost(
                (await cosmic.objects.find({ type: "news-posts", slug: postSlug })).objects.map(
                    (raw) => {
                        return { ...raw.metadata, title: raw.title, slug: raw.slug };
                    }
                )[0]
            );

            const lastFour = (await cosmic.objects.find({ type: "news-posts", limit: 4 })).objects.map(
                (raw) => {
                    return { ...raw.metadata, title: raw.title, slug: raw.slug };
                }
            );

            setRecentPosts(
                lastFour.filter((recent) => recent.slug !== postSlug).slice(0, 3)
            );
        })();
    }, [postSlug]);

    if (!post || !recentPosts) return null;
    return (
        <div className="curr-article">
            <div className="content">
                <p className="date"> {dateFormat(post.date_published)} </p>

                <h1> {post.title} </h1>

                <figure>
                    <img src={post.image.url} alt="not found" />
                    <figcaption>{post.image_caption}</figcaption>
                </figure>

                <h2 className="author"> By {post.author}</h2>

                <div className="body">
                    {post.content.split("\n").map((line) => (
                        <>
                            {line.startsWith("BOP POLL ") ? (
                                <EmbedPoll line={line} />
                            ) : (
                                <Markdown>{line.split("¶").join("")}</Markdown>
                            )}
                            {line ? <br /> : null}
                        </>
                    ))}
                </div>
            </div>
            <ShareBar />
            <RecentArticles posts={recentPosts} />
        </div>
    );
}

function EmbedPoll({ line }) {
    const parts = line.split(" ");
    const slug = parts.slice(2, -1).join("-").toLowerCase();
    const index = parseInt(parts[parts.length - 1].slice(1)) - 1;

    const [pollGroup, setPollGroup] = useState(null);
    useEffect(() => {
        (async () => {
            setPollGroup(
                (await cosmic.objects.find({ type: "poll-groups", slug: slug })).objects.map((raw) => {
                    return { ...raw.metadata, title: raw.title };
                })[0]
            );
        })();
    }, [slug]);

    if (!pollGroup) return null;
    return (
        <div className="shadow-lg">
            <Poll
                data={JSON.parse(pollGroup.data)[index]}
                tag={parts.slice(2).join(" ")}
            />
        </div>
    );
}
