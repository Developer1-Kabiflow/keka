"use client";

import React, { useEffect, useState } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import EmployeeSidebar from "./components/utils/EmployeeSidebar";
import { metadata } from "./metadata";
import Navbar from "./components/utils/Navbar";
export const Metadata = metadata;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// RootLayout Component
export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Define pages where the sidebar and navbar should not be shown
  const hiddenPages = ["/", "/employee/logout", "/login", "/callback"];

  // Determine visibility of Sidebar and Navbar
  const shouldDisplaySidebar = !hiddenPages.includes(pathname);
  const shouldDisplayNavbar = !hiddenPages.includes(pathname);

  // Toggle Sidebar open/close
  const toggleMenu = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close the sidebar when clicking outside of it or on any sidebar menu item
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup the effect on component unmount or sidebar close
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen">
          {/* Mobile Sidebar with Overlay */}
          {shouldDisplaySidebar && isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
              onClick={closeSidebar} // Close the sidebar when overlay is clicked
            >
              <aside
                className="fixed left-0 top-16 w-64  z-50"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
              >
                <EmployeeSidebar closeSidebar={closeSidebar} />
              </aside>
            </div>
          )}

          {/* Sidebar for Desktop */}
          {shouldDisplaySidebar && (
            <aside className="hidden md:block md:w-64 bg-gray-900 h-full">
              <EmployeeSidebar />
            </aside>
          )}

          {/* Main Content Area */}
          <div className="flex flex-col flex-1">
            {/* Navbar */}
            {shouldDisplayNavbar && <Navbar toggleMenu={toggleMenu} />}

            {/* Main Content */}
            <main className="flex-1 bg-gray-100 ">{children}</main>
          </div>
        </div>

        {/* Toast notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
