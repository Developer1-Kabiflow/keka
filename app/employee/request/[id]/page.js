import React from "react";
import Navbar from "@/app/components/NavbarPage/Navbar";
import EmployeeRequest from "@/app/components/EmployeeRequest/EmployeeRequest";

const EmployeeRequestPage = ({ params }) => {
  const { id } = params;
  return (
    <div>
      <Navbar />
      {id && <EmployeeRequest categoryId={id} />}
    </div>
  );
};

export default EmployeeRequestPage;
