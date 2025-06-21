import "./Navbar.css";
import { useState } from "react";
import { publicUrl } from "../publicUrl";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md z-50 w-full fixed py-0 px-0">
            <div className="flex justify-between items-center py-4 px-8 w-full">
                {/* Logo */}
                <Link to="/" onClick={() => setIsOpen(false)}>
                    <img src={publicUrl("/logos/bop_text.png")} alt="Logo" className="w-60 md:w-72" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 px-8">
                    <Link to="/" className="text-lg font-semibold text-gray-800 hover:text-gray-500">home</Link>
                    <Link to="/polls" className="text-lg font-semibold text-gray-800 hover:text-gray-500">polls</Link>
                    <Link to="/news" className="text-lg font-semibold text-gray-800 hover:text-gray-500">news</Link>
                    <Link to="/question-submissions" className="text-lg font-semibold text-gray-800 hover:text-gray-500">question submissions</Link>
                    <Link to="/team" className="text-lg font-semibold text-gray-800 hover:text-gray-500">team</Link>
                    <Link to="/visualization" className="text-lg font-semibold text-gray-800 hover:text-gray-500">visualizer</Link>
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
                            <Link to="/" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>home</Link>
                        </li>
                        <li>
                            <Link to="/polls" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>polls</Link>
                        </li>
                        <li>
                            <Link to="/news" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>news</Link>
                        </li>
                        <li>
                            <Link to="/question-submissions" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>question submissions</Link>
                        </li>
                        <li>
                            <Link to="/team" className="text-lg font-semibold text-gray-800 hover:text-blue-600" onClick={() => setIsOpen(false)}>team</Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}