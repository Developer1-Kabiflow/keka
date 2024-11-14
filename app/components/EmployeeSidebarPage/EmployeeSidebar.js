import React from "react";
import Link from "next/link";
import Image from "next/image";

const EmployeeSidebar = ({ closeSidebar }) => {
  return (
    <div className="w-64 h-full bg-blue-50 text-black fixed md:static">
      <div className="p-4 md:p-0 text-2xl font-bold flex justify-between items-center">
        {closeSidebar && (
          <button onClick={closeSidebar} className="md:hidden text-black ml-24">
            &times;
          </button>
        )}
      </div>
      <nav className="mt-0">
        <ul>
          <li className="mb-8 flex flex-col justify-center items-center bg-blue-200">
            <Image
              src="/1.jpg"
              alt="profile_pic"
              className="w-16 h-16 rounded-full mt-4"
              width={64}
              height={64}
            />
            <span className="mt-2 font-semibold">User Name</span>
            <span className="mt-1 font-semibold">User ID</span>
            <span className="mt-1 font-semibold mb-4">User Designation</span>
          </li>
      
          <li className="mb-2">
            <Link href="/employee/request">
              <span className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">Request</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/employee/task">
              <span className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">Approvals</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/employee/task">
              <span className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">Task</span>
            </Link>
          </li>
          <li className="mb-2">
            <p className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">Notification</p>
          </li>
          <li className="mb-2">
            <Link href="/employee/logout">
              <span className="block py-2 px-4 hover:bg-gray-200">Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default EmployeeSidebar;
