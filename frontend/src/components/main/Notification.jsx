import React, { useState } from 'react';
import * as Hi from 'react-icons/hi';

export const Notification = () => {
  const [active, isActive] = useState(false);
  console.log(active);

  return (
    <>
      <button onClick={() => isActive(!active)}>Activate</button>
      {/* <div className='absolute right-6 top-5 w-1/4'> */}
      <div
        className={
          active
            ? 'z-50 absolute top-5 w-1/4 flex justify-between p-4 mb-3.5 truncate border border-gray-300 rounded-xl shadow-md bg-white'
            : 'z-50 absolute top-5 w-1/4 flex justify-between p-4 mb-3.5 truncate border border-gray-300 rounded-xl shadow-md bg-white'
        }>
        <div className='flex'>
          <Hi.HiOutlineCheckCircle className='h-6 w-6 mr-3 text-green-400' />
          <div>
            <h6 className='text-sm font-semibold mb-1 text-gray-800'>
              Message will be displayed here
            </h6>
            <h6 className='text-sm font-medium text-gray-400'>
              Sub Messages here
            </h6>
          </div>
        </div>
        <button
          className='flex justify-center items-center rounded-full p-1 relative -top-1 -right-1 hover:bg-gray-100'
          style={{ height: 'fit-content' }}>
          <Hi.HiX className='h-5 w-5 text-gray-400' />
        </button>
      </div>
      {/* <div className='flex justify-between items-center p-4 mb-3.5 truncate border border-gray-300 rounded-xl shadow-md bg-white'>
          <div className='flex items-center'>
            <Hi.HiOutlineExclamationCircle className='h-6 w-6 mr-3 text-red-500' />
            <h6 className='text-sm font-semibold text-gray-800'>
              Message will be displayed here
            </h6>
          </div>
          <button
            className='flex justify-center items-center rounded-full p-1 hover:bg-gray-100'
            style={{ height: 'fit-content' }}>
            <Hi.HiX className='h-5 w-5 text-gray-400' />
          </button>
        </div>
        <div className='flex justify-between items-center p-4 mb-3.5 truncate border border-gray-300 rounded-xl shadow-md bg-white'>
          <div className='flex items-center'>
            <Hi.HiOutlineExclamation className='h-6 w-6 mr-3 text-yellow-400' />
            <h6 className='text-sm font-semibold text-gray-800'>
              Message will be displayed here
            </h6>
          </div>
          <button
            className='flex justify-center items-center rounded-full p-1 hover:bg-gray-100'
            style={{ height: 'fit-content' }}>
            <Hi.HiX className='h-5 w-5 text-gray-400' />
          </button>
        </div> */}
      {/* </div> */}
    </>
  );
};
