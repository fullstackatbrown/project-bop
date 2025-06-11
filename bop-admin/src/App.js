import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewsList from "./pages/NewsList";
import NewsEdit from "./pages/NewsEdit";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/news" element={(<NewsList />)} />
                <Route path="/news/:id" element={(<NewsEdit />)} />
            </Routes>
        </Router>
    );
}

export default App;
