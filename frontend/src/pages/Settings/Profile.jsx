import React, { useContext, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { UserContext } from 'context';
import { ContentContainer } from 'components';
import { InputBox } from 'components';

export const Profile = () => {
  const [, , isAuthenticated, ,] = useContext(UserContext);

  return (
    <ContentContainer className='md:px-6 md:py-0 md:pt-0 px-4 py-5 pt-16 items-center justify-center'>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      {isAuthenticated ? (
        <div className='lg:w-1/2 w-full mb-8 rounded-xl shadow-lg bg-white p-5 border border-gray-200 md:mt-0 mt-5'>
          <h1 className='mb-3.5 font-poppins font-semibold text-2xl text-gray-500'>
            Profile Settings
          </h1>
          <InputBox
            type='text'
            name='name'
            labelName='Name'
            inputClassName='mb-1.5'
            required={true}
          />
          <InputBox
            type='text'
            name='email'
            labelName='Email'
            inputClassName='mb-1.5'
            required={true}
          />
          <InputBox
            type='text'
            name='max_expense'
            labelName='Max Expense'
            inputClassName='mb-2'
            required={true}
          />
          <div
            className='text-gray-400 font-normal text-xs mb-8'
            style={{ lineHeight: '150%' }}>
            Max expense will be responsible for all the calculations of change
            in savings, expenses and history of expenses choose the value
            wisely. You can’t leave this value to 0 or less.
          </div>
          <button
            type='submit'
            className='py-2 px-3.5 font-semibold text-sm bg-green-600 text-white rounded-lg hover:opacity-95 focus:ring-2 ring-green-700 ring-offset-2 transition-all duration-150'>
            Update Profile
          </button>
        </div>
      ) : (
        <Redirect push to='/login' />
      )}
    </ContentContainer>
  );
};
