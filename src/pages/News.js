import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiShare } from "react-icons/hi";
import "./News.css";
import { cosmic, dateFormat } from "../cosmic";
import { publicUrl } from "../publicUrl";

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 4;
    const dropdownRefs = useRef([]);

    useEffect(() => {
        (async () => {
            setArticles(
                (await cosmic.objects.find({ type: "news-posts" })).objects
                    .map(raw => { return { ...raw.metadata, title: raw.title, slug: raw.slug } })
                    .sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime())
            );
        })();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            dropdownRefs.current.forEach((ref) => {
                if (ref && !ref.contains(event.target)) {
                    ref.classList.remove("show-dropdown");
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getEncodedURL = (slug) => {
        const fullURL = `https://www.brownopinionproject.org/post/${slug}`;
        return encodeURIComponent(fullURL);
    };

    const getShareLinks = (slug) => {
        const encoded = getEncodedURL(slug);
        return {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
            x: `https://x.com/intent/post?url=${encoded}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
        };
    };

    return (
        <div className="articles-container">
            <div className="articles-grid">
                {currentArticles.map((article, idx) => {
                    const articlePhoto = article.image ? article.image.url : "";
                    const slug = article.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "");
                    const shareLinks = getShareLinks(slug);

                    return (
                        <div
                            key={idx}
                            className="article-card"
                            style={{
                                backgroundImage: `url(${articlePhoto})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="article-overlay"></div>

                            <div className="article-share-container">
                                <button
                                    className="article-share-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const dropdown = dropdownRefs.current[idx];
                                        if (dropdown) dropdown.classList.toggle("show-dropdown");
                                    }}
                                >
                                    <HiShare size={20} />
                                </button>
                                <div
                                    className="share-dropdown"
                                    id={`dropdown-${idx}`}
                                    ref={(el) => (dropdownRefs.current[idx] = el)}
                                >
                                    <div className="dropdown-title">Share</div>
                                    <ul>
                                        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                                            <li>
                                                <div className="share-icon">
                                                    <img src={publicUrl("/facebook.png")} alt="Facebook" />
                                                </div>
                                                <span className="share-label">Facebook</span>
                                            </li>
                                        </a>
                                        <a href={shareLinks.x} target="_blank" rel="noopener noreferrer">
                                            <li>
                                                <div className="share-icon">
                                                    <img src={publicUrl("/xlogo.svg")} alt="X" />
                                                </div>
                                                <span className="share-label">X</span>
                                            </li>
                                        </a>
                                        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                            <li>
                                                <div className="share-icon">
                                                    <img src={publicUrl("/linkedin-icon.png")} alt="LinkedIn" />
                                                </div>
                                                <span className="share-label">LinkedIn</span>
                                            </li>
                                        </a>
                                        <li
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `https://www.brownopinionproject.org/post/${slug}`
                                                );
                                                alert("Link copied!");
                                            }}
                                        >
                                            <div className="share-icon">
                                                <img src={publicUrl("/link-icon.png")} alt="Copy Link" />
                                            </div>
                                            <span className="share-label">Copy Link</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="article-author tracking-tight">
                                <h2>
                                    <p style={{ fontSize: 20 }}>
                                        {article.author}
                                    </p>
                                </h2>
                                <p className="card-date">{dateFormat(article.date_published)}</p>
                            </div>

                            <div className="article-title">
                                <h2>
                                    <Link
                                        to={{
                                            pathname: `/articles/${article.slug}`
                                        }}
                                        className="article-link"
                                    >
                                        {article.title}
                                    </Link>
                                </h2>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pagination-container">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
                >
                    «
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
                >
                    ‹
                </button>
                {[...Array(totalPages).keys()]
                    .slice(
                        Math.max(0, Math.min(currentPage - 3, totalPages - 5)),
                        Math.max(5, Math.min(totalPages, currentPage + 2))
                    )
                    .map((page) => (
                        <button
                            key={page + 1}
                            onClick={() => handlePageChange(page + 1)}
                            className={`pagination-btn ${currentPage === page + 1 ? "active" : ""
                                }`}
                        >
                            {page + 1}
                        </button>
                    ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""
                        }`}
                >
                    ›
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""
                        }`}
                >
                    »
                </button>
            </div>
        </div>
    );
};

export default Articles;