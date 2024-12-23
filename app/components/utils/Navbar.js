"use client";

import React from "react";
import { FaBell } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Navbar Component
const Navbar = ({ toggleMenu }) => {
  return (
    <nav className="bg-blue-100 w-full h-16 shadow-md">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between md:justify-start">
        {/* Mobile Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 focus:outline-none absolute left-4"
          aria-label="Toggle Sidebar"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo (Centered in Mobile View) */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/logo.png"
            alt="My Logo"
            priority
            width={100}
            height={50}
          />
        </div>

        {/* Desktop Menu Items (Notification & Logout) */}
        <div className="hidden md:flex items-center space-x-4 text-gray-800">
          {/* Notification Icon */}
          <Link href="/">
            <span className="space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">
              <FaBell className="w-5 h-5" />
            </span>
          </Link>

          {/* Logout Link */}
          <Link href="/employee/logout">
            <span className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">
              Logout
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
