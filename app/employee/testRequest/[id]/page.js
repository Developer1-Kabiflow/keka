import React from "react";
import Navbar from "@/app/components/NavbarPage/Navbar";
import EmployeeNewRequest from "@/app/components/EmployeeRequest/EmployeeNewRequest";

const EmployeeRequestPage = ({ params }) => {
  const { id } = params;
  return (
    <div>
      <Navbar />
      {id && <EmployeeNewRequest categoryId={id} />}
    </div>
  );
};

export default EmployeeRequestPage;
