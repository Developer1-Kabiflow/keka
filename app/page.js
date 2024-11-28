"use client";
import Navbar from "@/app/components/NavbarPage/Navbar";
import EmployeeLoginPage from "@/app/components/EmployeeLoginPage/EmployeeLogin";

export default function Home() {
  return (
    <div>
      {" "}
      <Navbar />
      <EmployeeLoginPage />
    </div>
  ); // Optional: Display a redirecting message
}
