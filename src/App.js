import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Polls from "./pages/Polls";
import News from "./pages/News";
import QuestionSubmissions from "./pages/QuestionSubmissions";
import Team from "./pages/Team";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className="navbar">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/polls">Polls</Link>
            </li>
            <li>
              <Link to="/news">News</Link>
            </li>
            <li>
              <Link to="/question-submissions">Question Submissions</Link>
            </li>
            <li>
              <Link to="/team">Team</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/polls">
            <Polls />
          </Route>
          <Route path="/news">
            <News />
          </Route>
          <Route path="/question-submissions">
            <QuestionSubmissions />
          </Route>
          <Route path="/team">
            <Team />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
