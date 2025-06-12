import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewsList from "./pages/NewsList";
import NewsEdit from "./pages/NewsEdit";
import PollList from "./pages/PollList";
import PollEdit from "./pages/PollEdit";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/news" element={(<NewsList />)} />
                <Route path="/news/:id" element={(<NewsEdit />)} />
                <Route path="/poll" element={(<PollList />)} />
                <Route path="/poll/:id" element={(<PollEdit />)} />
            </Routes>
        </Router>
    );
}

export default App;
