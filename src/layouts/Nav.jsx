"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import { useTheme } from "next-themes";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

// Custom Mountain Icon component
const MountainIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);
const Nav = ({ isLogin, setIsLogin }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const userName = localStorage.getItem("userName") || "";

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("userName");
        setIsLogin(false);
        navigate("/");
        setIsMenuOpen(false);
        location.reload();
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-2">
              <MountainIcon className="h-6 w-6 text-gray-900 dark:text-white" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Acme Inc
              </span>
            </a>
          </div>

          {}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 ${
                  link.path === location.pathname
                    ? "text-gray-900 dark:text-white bg-background2 rounded-full px-4 py-2"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {}
          <div className="flex items-center gap-4">
            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLogin ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                    <AccountCircleIcon className="w-5 h-5" />
                    <span className="font-medium">{userName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-linear-to-r from-[--color-primary] to-[--color-secondary] font-medium hover:opacity-90 transition-opacity duration-200"
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="cursor-pointer hover:text-text2 transition duration-300 mr-4"
              >
                {theme === "dark" ? (
                  <LightModeOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </button>
            </div>

            {}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="cursor-pointer hover:text-text2 transition duration-300 mr-4"
              >
                {theme === "dark" ? (
                  <LightModeOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-text1 hover:text-primary dark:hover:text-secondary hover:bg-background2 dark:hover:bg-background1/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50 dark:focus:ring-secondary/50 transition-all duration-300"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform ${
                  isMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                } ${
                  location.pathname === link.path
                    ? "bg-background2 dark:bg-background1 text-text1 dark:text-text1"
                    : "text-text1/70 dark:text-text1/50 hover:bg-background2/50 dark:hover:bg-background1/50 hover:text-text1 dark:hover:text-text2"
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 0.1}s` : "0s",
                }}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-full pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              {isLogin ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <AccountCircleIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {userName}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/signup"
                  className="block w-full text-center px-4 py-2 rounded-full bg-gradient-to-r from-[--color-primary] to-[--color-secondary] font-medium hover:opacity-90 transition-opacity duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
