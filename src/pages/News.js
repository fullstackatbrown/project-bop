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
                { id: 7, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 1, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 2, title: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 3, title: "C", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 4, title: "D", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 5, title: "E", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 6, title: "F", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 7, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 1, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 2, title: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 3, title: "C", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 4, title: "D", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 5, title: "E", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 6, title: "F", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 7, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 1, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 2, title: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 3, title: "C", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 4, title: "D", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 5, title: "E", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 6, title: "F", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 7, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 1, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 2, title: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 3, title: "C", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 4, title: "D", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 5, title: "E", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 6, title: "F", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 7, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 1, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 2, title: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 3, title: "C", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 4, title: "D", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 5, title: "E", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 6, title: "F", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 7, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 1, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 2, title: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 3, title: "C", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 4, title: "D", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 5, title: "E", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 6, title: "F", author: "A A", date: "March 6, 2025", summary: "__" },
                { id: 7, title: "AAAAAAAAAAAAAAAAAAAAAa", author: "A A", date: "March 6, 2025", summary: "__" },
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
                {currentArticles.map(article => (
                <div key={article.id} className="article-card" style={{
                    backgroundImage: `url(${article.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
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
                <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}>«</button>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}>‹</button>
                {[...Array(totalPages).keys()].slice(Math.max(0, Math.min(currentPage - 3, totalPages - 5)), Math.max(5, Math.min(totalPages, currentPage + 2))).map(page => (
                    <button 
                        key={page + 1} 
                        onClick={() => handlePageChange(page + 1)}
                        className={`pagination-btn ${currentPage === page + 1 ? 'active' : ''}`}
                    >
                        {page + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}>›</button>
                <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}>»</button>
           </div>
        </div>
    );
};

export default Articles;
