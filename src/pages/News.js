import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiShare } from "react-icons/hi";
import "./News.css";
import { createBucketClient } from "@cosmicjs/sdk";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;

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
          .props("metadata")
          .depth(1);

        let newsList = [];
        for (const member of response.objects) {
          newsList.push(member.metadata);
        }

        newsList.reverse();
        setArticles(newsList);

        setLoading(false);
      } catch (err) {
        console.log("Failed to fetch");
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div className="loading">Loading articles...</div>;
  }

  return (
    <div className="articles-container">
      <div className="articles-grid">
        {currentArticles.map((article) => {
            let articlePhoto = article.image ? article.image.url : "";
            return (
          <div
            key={article.id}
            className="article-card"
            style={{
              backgroundImage: `url(${articlePhoto})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="article-overlay"></div>
            <div className="article-author tracking-tight">
              <h2>
                <Link to={``} className="article-link">
                  {article.author}
                </Link>
              </h2>
              <p>{article.date}</p>
            </div>
            <button className="article-share-btn">
              <HiShare size={20} />
            </button>
            <div className="article-title">
              <h2>
                <Link to={`/articles/${article.id}`} className="article-link">
                  {article.article_title}
                </Link>
              </h2>
            </div>
          </div>
            );
        })}
      </div>
      {/* Pagination Controls */}
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
              className={`pagination-btn ${
                currentPage === page + 1 ? "active" : ""
              }`}
            >
              {page + 1}
            </button>
          ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`pagination-btn ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          ›
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`pagination-btn ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Articles;
