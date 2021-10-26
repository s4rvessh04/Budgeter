import React, { useContext, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { UserContext } from 'context';
import { ContentContainer } from 'components';
import { InputBox } from 'components';

export const Account = () => {
  const [, , isAuthenticated, ,] = useContext(UserContext);

  return (
    <ContentContainer className='md:px-6 px-4 md:py-0 py-5 md:pt-0 pt-16 items-center justify-center'>
      <Helmet>
        <title>Account</title>
      </Helmet>
      {isAuthenticated ? (
        <div className='lg:w-1/2 w-full mb-8 rounded-xl shadow-lg bg-white border border-gray-200 md:mt-0 mt-5'>
          <div className='p-5 border-b border-gray-200'>
            <h1 className='mb-3.5 font-poppins font-semibold text-2xl text-gray-500'>
              Account Settings
            </h1>
            <InputBox
              type='text'
              name='username'
              labelName='Username'
              inputClassName='mb-2'
              required={true}
            />
            <div
              className='text-gray-400 font-normal text-xs mb-2.5'
              style={{ lineHeight: '150%' }}>
              Changing the username will lead to logout when successful.
            </div>
            <div className='flex space-x-4'>
              <button
                type='submit'
                className='py-2 px-3.5 font-semibold text-sm bg-purple-600 text-white rounded-lg hover:opacity-95 focus:ring-2 ring-purple-700 ring-offset-2 transition-all duration-150'>
                Edit
              </button>
              <button
                type='submit'
                className='py-2 px-3.5 font-semibold text-sm bg-green-600 text-white rounded-lg hover:opacity-95 focus:ring-2 ring-green-700 ring-offset-2 transition-all duration-150'>
                Confirm
              </button>
            </div>
          </div>
          <div className='p-5'>
            <div
              className='text-gray-500 font-normal text-sm mb-3.5'
              style={{ lineHeight: '150%' }}>
              In order to delete your account you must not have any outstanding
              expenses associated with any member.
            </div>
            <button
              type='submit'
              className='py-2 px-3.5 font-semibold text-sm bg-red-600 text-white rounded-lg mb-2 hover:opacity-95 focus:ring-2 ring-red-700 ring-offset-2 transition-all duration-150'>
              Delete Account
            </button>
            <div
              className='text-gray-400 font-normal text-xs'
              style={{ lineHeight: '150%' }}>
              Deleting the account will delete all your data from the server.
            </div>
          </div>
        </div>
      ) : (
        <Redirect push to='/login' />
      )}
    </ContentContainer>
  );
};
