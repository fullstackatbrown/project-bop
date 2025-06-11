import { useEffect } from "react";

function loadBootstrap() {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    link.rel = "stylesheet";
    link.id = "bootstrap-css";
    document.head.appendChild(link);

    return () => {
        document.head.removeChild(link);
    };
}

export default function AdminNewsList() {
    useEffect(loadBootstrap, []);

    return (
        <div className="container">
            <h2>BOP Admin/News Posts</h2>
        </div>
    );
}