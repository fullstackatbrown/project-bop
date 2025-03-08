import { useParams, useLocation } from "react-router-dom";

export default function Article() {
  const location = useLocation();
  const { state } = location || {};
  const { author, image, quote, caption, date, title, body } = state || {};

  return (
    <div className="curr-article">
      <p> {date} </p>
      <h1> {title} </h1>
      <figure>
        <img src={image} alt="Image not found" />
        <figcaption>{caption}</figcaption>
      </figure>
      <p> {author} </p>
      <p> {quote} </p>
      <p> {body} </p>
    </div>
  );
}
