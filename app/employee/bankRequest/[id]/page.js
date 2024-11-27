// app/employee/bankRequest/[id]/page.js
import React from 'react';
import Navbar from '@/app/components/NavbarPage/Navbar';
import EmployeeBankRequest from '@/app/components/EmployeeBankRequestPage/EmployeeBankRequest';

const EmployeeBankRequestPage = ({ params }) => {
  const { id } = params; 
  return (
    <div>
      <Navbar />
      {id && <EmployeeBankRequest categoryId={id} />}
    </div>
  );
};

export default EmployeeBankRequestPage;
