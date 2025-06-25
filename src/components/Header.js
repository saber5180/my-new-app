import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isListboxOpen, setIsListboxOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const listboxRef = useRef(null);
  const navigate = useNavigate();

  const navItems = [
    { name: "Accueil", path: "/" },
    { name: "Acheter", path: "/achat" },
    { name: "Louer", path: "/louer" },
    { name: "Estimation", path: "/estimation" },
    { name: "Investisseurs", path: "/investisseurs" },
    { name: "Prix immobiliers", path: "/PrixImmobliers" },
    { name: "Trouver un agent", path: "/TrouverAgent" },
  ];

  const pageOptions = [
    { name: "Prix&Contacte", path: "/Main5" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleListbox = () => {
    setIsListboxOpen(!isListboxOpen);
  };

  const selectPage = (page) => {
    setSelectedPage(page);
    setIsListboxOpen(false);
    navigate(page.path);
  };

  // Check if current path matches any of the page options
  useEffect(() => {
    const currentPageOption = pageOptions.find(page => page.path === location.pathname);
    if (currentPageOption) {
      setSelectedPage(currentPageOption);
    }
  }, [location.pathname]);

  // Close listbox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listboxRef.current && !listboxRef.current.contains(event.target)) {
        setIsListboxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsListboxOpen(false);
  }, [location.pathname]);

  // Check if the current page is in page options
  const isPageActive = pageOptions.some(page => page.path === location.pathname);

  const isLoggedIn = Boolean(localStorage.getItem('jwt'));

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
            : 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100'
        }`}
      >
        {/* Top Header Section */}
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center group">
              <img
                src={logo}
                alt="ImmoXpert"
                className="h-8 md:h-10 w-auto cursor-pointer transform transition-transform duration-200 group-hover:scale-105"
                onClick={() => navigate("/")}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center w-full px-8">
              {/* Navigation centered */}
              <div className="flex-1 flex justify-center items-center">
                <nav className="flex items-center space-x-8">
                  {navItems.map((item, index) => (
                    <div key={index} className="relative group">
                      <Link
                        to={item.path}
                        className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text ${
                          location.pathname === item.path 
                            ? "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold" 
                            : "text-gray-700"
                        }`}
                      >
                        {item.name}
                        {/* Active indicator */}
                        {location.pathname === item.path && (
                          <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
                        )}
                        {/* Hover indicator */}
                        <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </Link>
                    </div>
                  ))}

                  {/* Pages dropdown */}
                  <div className="relative group" ref={listboxRef}>
                    <button
                      onClick={toggleListbox}
                      className={`relative px-3 py-2 text-sm font-medium flex items-center space-x-1 transition-all duration-300 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text ${
                        isPageActive 
                          ? "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold" 
                          : "text-gray-700"
                      }`}
                      aria-haspopup="listbox"
                      aria-expanded={isListboxOpen}
                    >
                      <span>Pages</span>
                      <FiChevronDown
                        className={`transition-all duration-300 ${
                          isListboxOpen ? "rotate-180 text-purple-600" : "group-hover:text-purple-600"
                        }`}
                        size={16}
                      />
                      {/* Active indicator */}
                      {isPageActive && (
                        <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
                      )}
                      {/* Hover indicator */}
                      <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </button>

                    {/* Dropdown Menu */}
                    {isListboxOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden transform transition-all duration-200 animate-in slide-in-from-top-2">
                        <div className="py-2">
                          {pageOptions.map((page) => (
                            <button
                              key={page.name}
                              onClick={() => selectPage(page)}
                              className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-purple-700 ${
                                selectedPage?.name === page.name 
                                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 font-medium" 
                                  : "text-gray-700"
                              }`}
                            >
                              {page.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </nav>
              </div>

              {/* Desktop Buttons */}
              <div className="flex items-center space-x-6">
                <button
                  className={`relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    isLoggedIn 
                      ? 'text-white bg-gray-500 hover:bg-gray-600' 
                      : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (isLoggedIn) {
                      handleLogout();
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  {!isLoggedIn && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  )}
                  <span className="relative">{isLoggedIn ? 'Déconnexion' : 'Se connecter'}</span>
                </button>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="relative text-sm font-bold border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border p-3 px-6 rounded-2xl backdrop-blur">
                    <div className="absolute inset-0 bg-white rounded-2xl" />
                    <div className="relative flex items-center space-x-1">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                        Pack
                      </span>
                      <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-bold">
                        Pro
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center space-x-4">
              {/* Mobile Pack Pro Badge */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-25" />
                <div className="relative text-xs font-bold border border-purple-200 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Pack
                  </span>{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Pro
                  </span>
                </div>
              </div>
              
              <button
                onClick={toggleMobileMenu}
                className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="relative">
                  {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Gradient Line */}
        <div className="relative h-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-b border-gray-200/50 animate-in slide-in-from-top duration-300">
            <div className="pt-20 pb-6">
              <nav className="px-6 space-y-2">
                {/* Navigation Items */}
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`block py-4 px-4 rounded-xl text-base font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-purple-700 ${
                      location.pathname === item.path 
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 font-semibold" 
                        : "text-gray-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Pages Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleListbox}
                    className={`flex items-center justify-between w-full py-4 px-4 rounded-xl text-base font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-purple-700 ${
                      isPageActive 
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 font-semibold" 
                        : "text-gray-700"
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={isListboxOpen}
                  >
                    <span>Pages</span>
                    <FiChevronDown
                      className={`transition-transform duration-300 ${isListboxOpen ? 'rotate-180' : ''}`}
                      size={18}
                    />
                  </button>

                  {isListboxOpen && (
                    <div className="mt-2 ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {pageOptions.map((page) => (
                        <button
                          key={page.name}
                          onClick={() => {
                            selectPage(page);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`block w-full text-left py-3 px-4 rounded-lg text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-purple-600 ${
                            selectedPage?.name === page.name 
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-purple-600 font-medium' 
                              : 'text-gray-600'
                          }`}
                        >
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Connect Button */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <button
                    className={`w-full py-4 px-6 rounded-xl font-medium text-base transition-all duration-300 transform hover:scale-105 ${
                      isLoggedIn 
                        ? 'text-white bg-gray-500 hover:bg-gray-600' 
                        : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                    }`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (isLoggedIn) {
                        handleLogout();
                      } else {
                        navigate('/login');
                      }
                    }}
                  >
                    {isLoggedIn ? 'Déconnexion' : 'Se connecter'}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
      
      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20" />
    </>
  );
};

export default Header;