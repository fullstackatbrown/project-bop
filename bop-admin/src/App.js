import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NewsEdit from "./pages/news/NewsEdit";
import NewsList from "./pages/news/NewsList";
import PollEdit from "./pages/poll/PollEdit";
import PollList from "./pages/poll/PollList";
import TeamEdit from "./pages/team/TeamEdit";
import TeamList from "./pages/team/TeamList";
import QuestionList from "./pages/QuestionList";
import Main from "./pages/Main";

function App() {
    return (
        <Router basename="/bop-deploy/admin">
            <LockoutView>
                <Routes>
                    <Route path="/news/:id" element={(<NewsEdit />)} />
                    <Route path="/news" element={(<NewsList />)} />
                    <Route path="/poll/:id" element={(<PollEdit />)} />
                    <Route path="/poll" element={(<PollList />)} />
                    <Route path="/team/:id" element={(<TeamEdit />)} />
                    <Route path="/team" element={(<TeamList />)} />
                    <Route path="/questions" element={(<QuestionList />)} />
                    <Route path="/" element={(<Main />)} />
                </Routes>
            </LockoutView>
        </Router>
    );
}

function LockoutView({ children }) {
    if (useLocation().search != "?IkAjOm7qM0PA52QojudUsaAK6y6NeyLo") return null;

    return children;
}

export default App;
