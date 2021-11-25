import React, { useContext, useEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Hi from 'react-icons/hi';

import { UserContext } from 'context';
import { useFetcher, useSubmit } from 'hooks';
import { ContentContainer, InputBox, ToastPortal } from 'components';
import { handleApiUrl } from 'shared';

export const Security = () => {
  const [, , isAuthenticated, , logout] = useContext(UserContext);
  const [newPassword, setNewPassword] = useState('');
  const [againNewPassword, setAgainNewPassword] = useState('');

  const history = useHistory();
  const toastRef = useRef();

  const addToast = (mainMessage, subMessage, icon) => {
    toastRef.current.addMessage({
      mainMessage: mainMessage,
      subMessage: subMessage,
      icon: icon,
    });
  };

  const handleNewPassword = (e) => setNewPassword(e.target.value);
  const handleAgainNewPassword = (e) => setAgainNewPassword(e.target.value);
  const handleFieldReset = () => {
    setNewPassword('');
    setAgainNewPassword('');
  };

  const userPassword = useSubmit({
    url: handleApiUrl('/user/'),
    method: 'PUT',
    body: { password: againNewPassword },
  });

  const handleForm = async (e) => {
    e.preventDefault();
    if (newPassword !== againNewPassword) {
      addToast(
        'Validity Error',
        'Passwords did not matched!',
        <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
      );
    } else if (newPassword.length < 8) {
      addToast(
        'Validity Error',
        'Password too small!',
        <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
      );
    } else {
      const { response, data } = await userPassword.submitRequest();
      if (response.ok) {
        addToast(
          'Updated Successfully',
          'Redirecting to login...',
          <Hi.HiOutlineCheckCircle className='flex-shrink-0 h-6 w-6 mr-3 text-green-400' />
        );
        setTimeout(() => {
          logout();
          history.push('/login');
        }, 1700);
      } else {
        addToast(
          'Error Occured',
          data.detail,
          <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
        );
      }
    }
    handleFieldReset();
  };

  return (
    <ContentContainer className='md:px-6 px-4 md:py-0 py-5 md:pt-0 pt-16 items-center justify-center'>
      <Helmet>
        <title>Security</title>
      </Helmet>
      {isAuthenticated ? (
        <form
          method='POST'
          onSubmit={handleForm}
          className='lg:w-1/2 w-full mb-8 rounded-xl shadow-lg bg-white p-5 border border-gray-200 md:mt-0 mt-5'>
          <h1 className='mb-3.5 font-poppins font-semibold text-2xl text-gray-500'>
            Security
          </h1>
          <InputBox
            type='password'
            name='new_password'
            labelName='New password'
            inputClassName='mb-2'
            required={true}
            onChange={handleNewPassword}
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
            onChange={handleAgainNewPassword}
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
        </form>
      ) : (
        <Redirect push to='/login' />
      )}
      <ToastPortal ref={toastRef} autoClose={true} />
    </ContentContainer>
  );
};
