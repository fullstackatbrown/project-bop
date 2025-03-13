import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Polls from "./pages/Polls";
import PollDetail from "./pages/PollDetail"; // Import the new component
import News from "./pages/News";
import QuestionSubmissions from "./pages/QuestionSubmissions";
import Team from "./pages/Team";
import Visualization from "./pages/Visualization";

const logo = ["/bop-logo.png"];

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className="navbar">
            {/* logo on left side of navbar */}
            <li>
              <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
              </Link>
            </li>

            {/* navbar links */}
            <div className="navbar-links">
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
            </div>
          </ul>
        </nav>

        <Switch>
          <Route path="/polls/:pollId">
            <PollDetail />
          </Route>
          <Route path="/polls">
            <Polls />
          </Route>
          <Route path="/news">
            <News />
          </Route>
          <Route path="/question-submissions">
            <QuestionSubmissions />
          </Route>
          <Route path="/visualization">
            <Visualization />
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
