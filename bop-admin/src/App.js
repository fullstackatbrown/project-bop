import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NewsList from "./pages/NewsList";
import NewsEdit from "./pages/NewsEdit";
import PollList from "./pages/PollList";
import PollEdit from "./pages/PollEdit";
import Main from "./pages/Main";

function App() {
    return (
        <Router>
            <LockoutView>
                <Routes>
                    <Route path="/news/:id" element={(<NewsEdit />)} />
                    <Route path="/news" element={(<NewsList />)} />
                    <Route path="/poll/:id" element={(<PollEdit />)} />
                    <Route path="/poll" element={(<PollList />)} />
                    <Route path="/" element={(<Main />)} />
                </Routes>
            </LockoutView>
        </Router>
    );
}

function LockoutView({ children }) {
    if (useLocation().search != "?abcde") return null;

    return children;
}

export default App;
