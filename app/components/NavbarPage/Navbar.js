'use client'
import React, { useState } from 'react';
import { FaBell } from "react-icons/fa";
import Link from 'next/link';

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
                <span className="flex px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  <FaBell className='w-4 h-4 flex justify-center items-center' />
                </span>
              </Link>
              <Link href="/logout">
                <span className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Logout
                </span>
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/">
              <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Home
              </span>
            </Link>
            <Link href="/about">
              <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                About
              </span>
            </Link>
            <Link href="/services">
              <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Services
              </span>
            </Link>
            <Link href="/contact">
              <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Contact
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
