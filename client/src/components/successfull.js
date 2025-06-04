import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Success = () => {


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-100">

      <div className="fixed inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-30 transition-opacity"></div>
        <div className="bg-white rounded-2xl p-8 shadow-lg transform transition-all flex flex-col items-center">
          <FaCheckCircle className="text-blue-600 text-5xl" />
          <h2 className="mt-5 text-3xl font-semibold text-gray-800 font-sans">Payment Completed</h2>
          <h3 className="text-lg font-normal text-center text-gray-800">
            Congratulations payment successfully received!
          </h3>
        </div>
      </div>

    </div>
  );
};

export default Success;
