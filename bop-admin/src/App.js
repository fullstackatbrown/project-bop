import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewsList from "./pages/NewsList";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/news" element={(<NewsList />)} />
            </Routes>
        </Router>
    );
}

export default App;
