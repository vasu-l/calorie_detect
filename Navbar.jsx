import { Link, useNavigate } from "react-router-dom";
import { Home as HomeIcon, Info, Mail, User, LogOut, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You are not logged in. Redirecting to login...");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    alert("You have been logged out.");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Food Detection App</h1>
        
        <button
          className="lg:hidden block text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>

        <ul
          className={`lg:flex lg:space-x-6 absolute lg:static top-16 left-0 w-full lg:w-auto bg-gray-900 lg:bg-transparent lg:flex-row flex-col space-y-4 lg:space-y-0 p-4 lg:p-0 transition-all duration-300 ${menuOpen ? "block" : "hidden"}`}
        >
          <li>
            <Link to="/" className="flex items-center gap-2 hover:text-gray-400">
              <HomeIcon size={20} /> Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="flex items-center gap-2 hover:text-gray-400">
              <Info size={20} /> About
            </Link>
          </li>
          <li>
            <Link to="/upload" className="flex items-center gap-2 hover:text-gray-400">
              <Mail size={20} /> Upload
            </Link>
          </li>
          <li>
            <Link to="/calcal" className="flex items-center gap-2 hover:text-gray-400">
              <Mail size={20} />Energy calculator
            </Link>
          </li>
          {/* <li>
            <Link to="/profile" className="flex items-center gap-2 hover:text-gray-400">
              <User size={20} /> Profile
            </Link>
          </li> */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700"
            >
              <LogOut size={20} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
