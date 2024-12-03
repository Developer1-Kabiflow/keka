"use client";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import EmployeeSidebar from "@/app/components/EmployeeSidebarPage/EmployeeSidebar";
import { metadata } from "./metadata";
import { redirect } from "next/navigation";
import Cookies from "js-cookie";

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

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  // Define pages where the sidebar is not needed
  const pagesWithoutSidebar = ["/", "/employee/logout"]; // Add more paths here if needed

  // Determine whether the sidebar should be displayed
  const shouldDisplaySidebar = !pagesWithoutSidebar.includes(pathname);

  // Toggle sidebar visibility for mobile
  const toggleMenu = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const userId = Cookies.get("userId");
    if (!userId) {
      // Redirect to login page if no userId cookie is found
      redirect("/");
    }
  }, []); // This effect runs once on mount
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar Toggle Button for Mobile */}
          {shouldDisplaySidebar && (
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                className="bg-blue-100 inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:bg-blue-200 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {isSidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          )}

          {/* Mobile Sidebar Overlay */}
          {shouldDisplaySidebar && (
            <div
              className={`fixed inset-0 z-40 bg-gray-800 bg-opacity-75 md:hidden transition-transform ${
                isSidebarOpen ? "block" : "hidden"
              }`}
            >
              <EmployeeSidebar closeSidebar={toggleMenu} />
            </div>
          )}

          {/* Sidebar for Desktop */}
          {shouldDisplaySidebar && (
            <div className="hidden md:block md:w-64 bg-gray-900 fixed h-full">
              <EmployeeSidebar />
            </div>
          )}

          {/* Main content */}
          <main
            className={`flex-1 bg-gray-100 ${
              shouldDisplaySidebar ? "md:ml-64" : ""
            } ${isSidebarOpen ? "md:ml-0" : ""} transition-all duration-300`}
          >
            {children}
          </main>
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
