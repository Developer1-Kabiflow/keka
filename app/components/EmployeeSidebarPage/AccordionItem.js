"use client";

import { useState } from "react";

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200"
        onClick={toggleAccordion}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <span
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          &#9662; {/* Down arrow */}
        </span>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

export default AccordionItem;
