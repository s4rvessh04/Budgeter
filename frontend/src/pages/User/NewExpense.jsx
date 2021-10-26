import React from 'react';
import { Helmet } from 'react-helmet';
import * as Hi from 'react-icons/hi';

import { InputBox } from 'components';

export const NewExpense = () => {
  return (
    <>
      <Helmet>
        <title>New-Expense</title>
      </Helmet>
      <div className='flex flex-col flex-1 items-center max-h-screen overflow-auto md:px-6 md:pt-0 px-4 py-5 pt-16'>
        <div className='lg:w-1/2 w-full px-5 py-2.5 mb-8 mt-5 rounded-xl shadow-lg bg-white border border-gray-200'>
          <h1 className='mb-3.5 font-poppins font-semibold text-2xl text-gray-500'>
            Expense Details
          </h1>
          <InputBox
            type='text'
            name='description'
            labelName='Description'
            inputClassName='mb-4'
            required={true}
          />
          <InputBox
            type='text'
            name='tag'
            labelName='Tag'
            inputClassName='mb-4'
            required={true}
          />
        </div>
        <div className='lg:w-1/2 w-full px-5 py-2.5 mb-8 rounded-xl shadow-lg bg-white border border-gray-200'>
          <h1 className='mb-3.5 font-poppins font-semibold text-2xl text-gray-500'>
            Amount Details
          </h1>
          <InputBox
            type='text'
            name='Amount'
            labelName='Amount'
            inputClassName='mb-4'
            required={true}
          />
          <InputBox
            type='text'
            name='members'
            labelName='Member(s)'
            inputClassName='mb-4'
            required={true}
          />
          <button className='border p-2 mb-2.5 font-semibold text-sm rounded-md text-gray-500 hover:border-gray-500 ring-inset focus:ring-2 ring-gray-500 transition-all duration-200'>
            Custom Split
          </button>
        </div>
        <div className='lg:w-1/2 w-full px-5 py-2.5 flex justify-between rounded-xl shadow-lg bg-white border-2 border-blue-600'>
          <div>
            <h1 className='font-poppins font-semibold text-2xl text-gray-900'>
              Final Amount
            </h1>
            <h5 className='mb-1.5 text-xs font-semibold text-gray-400'>
              ₹400.00 / 3
            </h5>
            <h3 className='mb-2.5 text-xl font-bold text-gray-600'>
              ₹133.33 <small className='font-semibold text-current'>each</small>
            </h3>
          </div>
          <div className='self-center'>
            <button className='px-8 py-2 flex items-center rounded-lg font-poppins font-bold text-white bg-blue-600 hover:opacity-90 focus:ring-2 focus:ring-blue-600 ring-offset-2 transition-all duration-150'>
              Confirm <Hi.HiCheck className='h-5 w-5 ml-1' />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
