"use client";
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-gray-800 font-bold text-xl">MyLogo</div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 text-gray-800">
              <Link href="/">
                <span className="flex px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">
                  <FaBell className="w-4 h-4 flex justify-center items-center" />
                </span>
              </Link>
              <Link href="/employee/logout">
                <span className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-300">
                  Logout
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
