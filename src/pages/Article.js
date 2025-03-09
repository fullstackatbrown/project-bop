import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import "./Article.css";
import { Link } from "react-router-dom";
import { createBucketClient } from "@cosmicjs/sdk";

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
          className="facebook-share-button"
        >
          <img
            src="/facebook.png"
            alt="Share on Facebook"
            className="facebook-icon"
          />
        </a>

        <a
          href={"https://twitter.com/intent/tweet?url=" + currentURL}
          target="_blank"
          className="x-share-button"
        >
          <img src="/xlogo.svg" alt="Share on X" class="x-icon" />
        </a>
        <a
          href={
            "https://www.linkedin.com/sharing/share-offsite/?url=" + currentURL
          }
          target="_blank"
          className="linkedin-share-button"
        >
          <img
            src="/linkedin.png"
            alt="Share on LinkedIn"
            className="linkedin-icon"
          />
        </a>
        <a>
          <img src="/shareicon.png" onClick={togglePopup} />
        </a>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={togglePopup}>
              &times;
            </span>
            <p>Share this page:</p>
            <p ref={textRef} className="popup-link"> {currentURL} </p>
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

          {copied && (
            <p className="copied"> Copied! </p>
          )}
        </div>
      )}
    </div>
  );
}

function RecentArticles({ currTitle, lastFour }) {
  let lastThree = [];

  for (const article of lastFour) {
    if (article.article_title != currTitle) {
      lastThree.push(article);
    }
  }

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
        {lastThree.map((article, idx) => {
          return (
            <RecentArticle
              key={"rec" + idx}
              image={article.image.url}
              title={article.article_title}
            />
          );
        })}
      </div>
    </div>
  );
}

function RecentArticle({ image, title }) {
  return (
    <div className="recent-article">
      <img src={image} />
      <p className="recent-title">
        <Link
          to={`/articles/${encodeURIComponent(title.replace(/%/g, ""))}`}
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
  const location = useLocation();
  const currentURL = window.location.href;
  const { state } = location || {};
  const {
    authorRec,
    imageRec,
    quoteRec,
    captionRec,
    dateRec,
    titleRec,
    bodyRec,
    lastFourRec,
  } = state || {};

  const [author, setAuthor] = useState(authorRec || undefined);
  const [image, setImage] = useState(imageRec || undefined);
  const [quote, setQuote] = useState(quoteRec || undefined);
  const [caption, setCaption] = useState(captionRec || undefined);
  const [date, setDate] = useState(dateRec || undefined);
  const [title, setTitle] = useState(titleRec || undefined);
  const [body, setBody] = useState(bodyRec || undefined);
  const [lastFour, setLastFour] = useState(lastFourRec || undefined);
  const [loading, setLoading] = useState(state === undefined ? true : false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const cosmic = createBucketClient({
          bucketSlug: "bop-backend-production",
          readKey: "8N6HiTQekcWvzJbMA4qSeTbIcb11wLI04UpzC68HzLyd2uuiXz",
        });
        const response = await cosmic.objects
          .find({ type: "news-pages" })
          .limit(100)
          .props("metadata")
          .depth(1);

        let newsList = [];
        let currentURL = window.location.href;
        let currTitle = currentURL.split("articles/")[1];
        for (const member of response.objects) {
          if (
            encodeURIComponent(member.metadata.article_title).replace(
              /[^a-zA-Z]/g,
              ""
            ) === currTitle.replace(/[^a-zA-Z]/g, "")
          ) {
            setAuthor(member.metadata.author);
            setImage(member.metadata.image.url);
            setQuote(member.metadata.quote);
            setCaption(member.metadata.caption);
            setDate(member.metadata.date);
            setTitle(member.metadata.article_title);
            setBody(member.metadata.body);
          }

          newsList.push(member.metadata);
        }

        newsList.reverse();
        setLastFour(newsList.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.log("Failed to fetch");
        setLoading(false);
      }
    };

    fetchMembers();
  }, [state, currentURL]);

  if (loading || body === undefined) {
    return <div className="loading">Loading article...</div>;
  }

  const paragraphs = body.split("¶").map((paragraph) => paragraph.trim());

  return (
    <div className="curr-article">
      <div className="content">
        <p className="date"> {date} </p>

        <h1> {title} </h1>

        <figure>
          <img src={image} alt="Image not found" />
          <figcaption>{caption}</figcaption>
        </figure>

        <h2 className="author"> {"By " + author} </h2>

        <p className="quote"> {quote} </p>

        <div className="body">
          {paragraphs.map((paragraph, idx) => {
            return (
              <div key={title + idx}>
                <p> {paragraph} </p>
                <br />
              </div>
            );
          })}
        </div>
      </div>
      <ShareBar />
      <RecentArticles currTitle={title} lastFour={lastFour} />
    </div>
  );
}