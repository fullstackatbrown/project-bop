import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NewsList from "./pages/NewsList";
import NewsEdit from "./pages/NewsEdit";
import PollList from "./pages/PollList";
import PollEdit from "./pages/PollEdit";
import Main from "./pages/Main";
import TeamEdit from "./pages/TeamEdit";
import TeamList from "./pages/TeamList";
import QuestionList from "./pages/QuestionList";

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
