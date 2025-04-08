import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Icon for hamburger menu
import Home from "./pages/Home";
import Polls from "./pages/Polls";
import PollDetail from "./pages/PollDetail"; // Import the new component
import News from "./pages/News";
import QuestionSubmissions from "./pages/QuestionSubmissions";
import Team from "./pages/Team";
import Visualization from "./pages/Visualization";
import Article from "./pages/Article";
import Footer from "./Footer";

const logo = "/bop-logo.png";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md z-50 w-full fixed py-0 px-0">
          <div className="flex justify-between items-center py-4 px-8 w-full">
            {/* Logo */}
            <Link to="/" onClick={() => setIsOpen(false)}>
              <img src={logo} alt="Logo" className="w-60 md:w-72" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 px-8">
              <Link to="/" className="text-lg font-semibold text-gray-800 hover:text-gray-500">Home</Link>
              <Link to="/polls" className="text-lg font-semibold text-gray-800 hover:text-gray-500">Polls</Link>
              <Link to="/news" className="text-lg font-semibold text-gray-800 hover:text-gray-500">News</Link>
              <Link to="/question-submissions" className="text-lg font-semibold text-gray-800 hover:text-gray-500">Question Submissions</Link>
              <Link to="/team" className="text-lg font-semibold text-gray-800 hover:text-gray-500">Team</Link>
            </div>

            {/* Hamburger Button (Mobile) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-black focus:outline-none"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
          
          {/* Mobile Menu - Inside the nav but below the main container */}
          {isOpen && (
            <div className="md:hidden bg-white shadow-md w-full">
              <ul className="flex flex-col items-center space-y-4 py-4">
                <li>
                  <Link to="/" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
                </li>
                <li>
                  <Link to="/polls" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>Polls</Link>
                </li>
                <li>
                  <Link to="/news" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>News</Link>
                </li>
                <li>
                  <Link to="/question-submissions" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>Question Submissions</Link>
                </li>
                <li>
                  <Link to="/team" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>Team</Link>
                </li>
              </ul>
            </div>
          )}
        </nav>

        {/* Page Content (Pushed Down to Avoid Navbar Overlap) */}
        <div className="mt-24 md:mt-28">
          <Switch>
            <Route path="/polls" component={Polls} />
            <Route path="/news" component={News} />
            <Route path="/question-submissions" component={QuestionSubmissions} />
            <Route path="/team" component={Team} />
            <Route path="/visualization" component={Visualization} />
            <Route path="/" component={Home} />
          </Switch>
        </div>

        <Footer/>
      </div>
    </Router>
  );
}