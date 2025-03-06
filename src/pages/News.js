import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiShare } from 'react-icons/hi';
import './News.css';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 4;

    useEffect(() => {
        // Simulating API delay with a timeout
        setTimeout(() => {
            setArticles([
                { id: 1, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 2, title: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 3, title: "C", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 4, title: "D", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 5, title: "E", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 6, title: "F", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 7, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" }
            ]);
            setLoading(false);
        }, 500); // 1-second delay to simulate fetching
    }, []);

//   useEffect(() => {
//     fetch('') //backend
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         setArticles(data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching articles:', error);
//         setError(error.message);
//         setLoading(false);
//       });

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    if (loading) {
        return <div className="loading">Loading articles...</div>;
    }

    return (
        <div className="articles-container">
            <div className="articles-grid">
                {currentArticles.map(article => (
                <div key={article.id} className="article-card">
                    <div className="article-overlay"></div>
                    <div className="article-author tracking-tight">
                        <h2>
                            <Link to={``} className="article-link">{article.author}</Link>
                        </h2>
                        <p>{article.date}</p>
                    </div>
                    <button className="article-share-btn">
                        <HiShare size={20} />
                    </button>
                    <div className="article-title">
                        <h2>
                            <Link to={`/articles/${article.id}`} className="article-link">{article.title}</Link>
                        </h2>
                    </div>
                </div>
                ))}
            </div>
            {/* Pagination Controls */}
            <div className="pagination-container">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
                    &lt;
                </button>
                <span className="pagination-info">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default Articles;
