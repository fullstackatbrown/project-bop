import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import PollGroups from "./pages/polls/PollGroups";
import PollGroupDetail from "./pages/polls/PollGroupDetail"
import News from "./pages/news/News";
import NewsArticle from "./pages/news/NewsArticle";
import QuestionSubmissions from "./pages/QuestionSubmissions";
import Team from "./pages/Team";
import Visualization from "./pages/Visualization";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
    return (
        <Router basename="/bop-deploy">
            <div className="min-h-screen flex flex-col">
                <Navbar />

                {/* Page Content (Pushed Down to Avoid Navbar Overlap) */}
                <div className="mt-24 md:mt-28">
                    <Switch>
                        <Route path="/polls/:pollId" component={PollGroupDetail} />
                        <Route path="/polls" component={PollGroups} />
                        <Route path="/articles/:postSlug" component={NewsArticle} />
                        <Route path="/news" component={News} />
                        <Route path="/question-submissions" component={QuestionSubmissions} />
                        <Route path="/team" component={Team} />
                        <Route path="/visualization" component={Visualization} />
                        <Route path="/" component={Home} />
                    </Switch>
                </div>

                <Footer />
            </div>
        </Router>
    );
}