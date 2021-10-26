import React, { useContext, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { UserContext } from 'context';
import { ContentContainer } from 'components';
import { InputBox } from 'components';

export const Security = () => {
  const [, , isAuthenticated, ,] = useContext(UserContext);

  return (
    <ContentContainer className='md:px-6 px-4 md:py-0 py-5 md:pt-0 pt-16 items-center justify-center'>
      <Helmet>
        <title>Security</title>
      </Helmet>
      {isAuthenticated ? (
        <div className='lg:w-1/2 w-full mb-8 rounded-xl shadow-lg bg-white p-5 border border-gray-200 md:mt-0 mt-5'>
          <h1 className='mb-3.5 font-poppins font-semibold text-2xl text-gray-500'>
            Security
          </h1>
          <InputBox
            type='password'
            name='old_password'
            labelName='Old Password'
            inputClassName='mb-1.5'
            required={true}
          />
          <InputBox
            type='password'
            name='new_password'
            labelName='New password'
            inputClassName='mb-2'
            required={true}
          />
          <div
            className='text-gray-400 font-normal text-xs mb-1.5'
            style={{ lineHeight: '150%' }}>
            Make sure that the password length is more than 8.
          </div>
          <InputBox
            type='password'
            name='confirm_password'
            labelName='Confirm new password'
            inputClassName='mb-7'
            required={true}
          />
          <button
            type='submit'
            className='py-2 px-3.5 font-semibold text-sm bg-green-600 text-white rounded-lg mb-2 hover:opacity-95 focus:ring-2 ring-green-700 ring-offset-2 transition-all duration-150'>
            Confirm Password
          </button>
          <div
            className='text-gray-400 font-normal text-xs'
            style={{ lineHeight: '150%' }}>
            Changing the password will redirect to login.
          </div>
        </div>
      ) : (
        <Redirect push to='/login' />
      )}
    </ContentContainer>
  );
};
