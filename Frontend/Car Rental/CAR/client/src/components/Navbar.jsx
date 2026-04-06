import React, { useState, useEffect } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const Navbar = ({ setShowLogin, isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Get username and role from localStorage when component mounts or isLoggedIn changes
    if (isLoggedIn) {
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      
      setUsername(storedUsername || '');
      setUserRole(storedRole || '');

      // If user is admin, fetch admin data from Spring Boot backend
      if (storedRole === 'admin' && storedUserId) {
        fetchAdminData(storedUserId);
      }
    } else {
      setUsername('');
      setUserRole('');
      setAdminData(null);
    }
  }, [isLoggedIn]);

  // Function to fetch admin data from Spring Boot backend
  const fetchAdminData = async (adminId) => {
    try {
      const admin = await adminService.getAdminProfile(adminId);
      setAdminData(admin);
      // Update username with actual admin name from database
      if (admin && admin.name) {
        setUsername(admin.name);
        localStorage.setItem('username', admin.name);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      // Fallback to stored username if API call fails
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUsername('');
    setUserRole('');
    setAdminData(null);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?brand=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setOpen(false);
    }
  };

  const mobileHidden = window.innerWidth < 640 && !open;

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative ${
        location.pathname === '/' ? 'bg-light' : 'bg-white'
      }`}
    >
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-8" />
      </Link>

      <div
        className={`fixed sm:static top-0 right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 p-4 sm:p-0 transition-transform duration-300 z-50 border-borderColor ${
          location.pathname === '/' ? 'bg-light' : 'bg-white'
        } ${mobileHidden ? 'translate-x-full' : 'translate-x-0'}`}
      >
        {menuLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setOpen(false)}>
            {link.name}
          </Link>
        ))}

        <form
          onSubmit={handleSearchSubmit}
          className="w-full lg:w-auto flex items-center border border-borderColor px-3 rounded-full max-w-56"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search cars by brand"
          />
          <button type="submit">
            <img src={assets.search_icon} alt="search" className="h-5 w-5" />
          </button>
        </form>

        <div className="flex items-center gap-6">
          {/* Show Dashboard button for admin users, Admin Login for others */}
          {userRole === 'admin' ? (
            <button
              type="button"
              onClick={() => navigate('/owner')}
              className="text-sm cursor-pointer"
            >
              Dashboard
            </button>
          ) : (
            <button
              type="button"
              onClick={() => (window.location.href = '/admin-login.html')}
              className="text-sm cursor-pointer"
            >
              Admin Login
            </button>
          )}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 font-medium">
                Welcome, {username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => (window.location.href = '/index.html')}
              className="px-4 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg text-sm"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          alt="menu"
          className="h-6 w-6"
        />
      </button>
    </div>
  );
};

export default Navbar;
