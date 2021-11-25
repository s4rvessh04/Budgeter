import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import * as Hi from 'react-icons/hi';

import { useSubmit } from 'hooks';
import { UserContext } from 'context';
import { handleApiUrl } from 'shared';
import { InputBox } from 'components';
import { ToastPortal } from 'components';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setErrorMessage] = useState('');

  const [, setToken, isAuthenticated, setIsAuthenticated] =
    useContext(UserContext);

  const toastRef = useRef();

  const addToast = (mainMessage, subMessage, icon) => {
    toastRef.current.addMessage({
      mainMessage: mainMessage,
      subMessage: subMessage,
      icon: icon,
    });
  };

  const { submitRequest } = useSubmit({
    url: handleApiUrl('/auth/token'),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(
      `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
    ),
  });

  const submitLogin = async () => {
    const { response, data } = await submitRequest();
    if (!response.ok) {
      const message = data.detail;
      setErrorMessage(message);
      setUsername('');
      setPassword('');
      addToast(
        'Authentication Failed',
        message,
        <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
      );
    } else if (response.ok) {
      addToast(
        'Authentication Successful',
        'Redirecting...',
        <Hi.HiOutlineCheckCircle className='flex-shrink-0 h-6 w-6 mr-3 text-green-400' />
      );
      setTimeout(() => {
        setIsAuthenticated(true);
        setToken(data.access_token);
      }, 1700);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated ? (
        <Redirect to='/user' />
      ) : (
        <div
          className='xl:w-1/4 md:w-2/5 w-4/5 my-7 px-7 py-5 border rounded-2xl shadow-md bg-white border-gray-300'
          style={{ height: 'fit-content' }}>
          <h1 className='text-2xl font-poppins font-semibold text-gray-900'>
            Budgeter
          </h1>
          <h2 className='text-base font-semibold text-gray-500 mb-7'>Login</h2>
          <form action='POST' onSubmit={handleSubmit}>
            <InputBox
              name='username'
              type='text'
              value={username}
              labelName='Username'
              onChange={(e) => setUsername(e.target.value)}
              required={true}
              inputClassName='mb-4'
            />
            <InputBox
              name='password'
              type='password'
              value={password}
              labelName='Password'
              onChange={(e) => setPassword(e.target.value)}
              required={true}
              inputClassName='mb-4'
            />
            <button
              type='submit'
              className='w-full py-3 mt-3 text-lg font-semibold rounded-lg bg-green-600 text-white hover:opacity-90 focus:opacity-90 focus:ring-2 ring-offset-2 ring-green-600 transition-all duration-150'>
              Log In
            </button>
            <h4 className='my-7 text-sm text-gray-600'>
              New to budgeter?
              <Link to='/signup' className='text-blue-600'>
                {' '}
                Create free account.
              </Link>
            </h4>
          </form>
        </div>
      )}
      <ToastPortal ref={toastRef} autoClose={true} />
    </>
  );
};
