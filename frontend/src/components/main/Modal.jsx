import React from 'react';
import * as Hi from 'react-icons/hi';

export const Modal = ({
  onClose,
  mainMessage,
  subMessage = null,
  icon = null,
  info = true,
}) => {
  return (
    <div
      className={
        'h-screen w-screen overflow-hidden lg:p-0 p-2 bg-gray-900 bg-opacity-5 flex justify-center items-center animate-fadeIn-medium'
      }
      onClick={info ? null : onClose}>
      <div className='z-50 w-max h-max md:max-w-lg max-w-full p-5 border border-gray-300 rounded-xl shadow-xl bg-white'>
        <div className='flex'>
          {icon}
          <div className=''>
            <div className='mb-2.5 flex justify-between items-start'>
              <h4 className='text-xl self-center ml-0 font-poppins font-semibold text-gray-900'>
                {mainMessage}
              </h4>
              <button
                onClick={onClose}
                className='flex justify-center items-center rounded-full p-1 relative hover:bg-gray-100'
                style={{ height: 'fit-content' }}>
                <Hi.HiX className='h-6 w-6 text-gray-400' />
              </button>
            </div>
            <p className='text-md text-gray-400'>{subMessage}</p>
            {info && (
              <div className='mt-4 float-right'>
                <button
                  className='py-1.5 px-3.5 mr-2.5 font-medium text-gray-600 border border-gray-300 rounded-md hover:border-gray-500 ring-inset focus:ring-2 ring-gray-500 transition-all duration-200'
                  onClick={onClose}>
                  Cancel
                </button>
                <button className='py-1.5 px-3.5 font-medium text-white bg-blue-600 rounded-md transition-all duration-200'>
                  ActionName
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
