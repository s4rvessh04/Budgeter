import React, { useState, useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { useSubmit } from 'hooks';
import { UserContext } from 'context';
import { InputBox } from 'components';
import { handleApiUrl } from 'shared';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [, setToken, isAuthenticated, setIsAuthenticated] =
    useContext(UserContext);

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, [isAuthenticated]);

  // const submitLogin = async () => {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: JSON.stringify(
  //       `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
  //     ),
  //   };

  //   const response = await fetch(handleApiUrl('/auth/token'), requestOptions);
  //   const data = await response.json();

  //   if (!response.ok) {
  //     setErrorMessage(data.detail);
  //     setUsername('');
  //     setPassword('');
  //   } else {
  //     setIsAuthenticated(true);
  //     setToken(data.access_token);
  //   }
  // };

  const { submitRequest } = useSubmit({
    url: handleApiUrl('/auth/token'),
    requestOptions: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(
        `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
      ),
    },
  });

  const submitLogin = async () => {
    const { response, data, errorMessage } = await submitRequest();
    if (response) {
      if (errorMessage) {
        setErrorMessage(errorMessage);
        setUsername('');
        setPassword('');
      } else {
        setIsAuthenticated(true);
        setToken(data.access_token);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

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
          <h2 className='text-base font-semibold text-gray-500'>Login</h2>
          <h3 className='mt-3 mb-7 text-xs font-medium text-red-500 text-center'>
            {errorMessage}
          </h3>
          <form action='POST' onSubmit={handleSubmit}>
            <InputBox
              name='username'
              type='text'
              value={username}
              labelName='Username'
              onChange={(e) => setUsername(e.target.value)}
              required={true}
              inputClassName='mb-7'
            />
            <InputBox
              name='password'
              type='password'
              value={password}
              labelName='Password'
              onChange={(e) => setPassword(e.target.value)}
              required={true}
              inputClassName='mb-7'
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
    </>
  );
};
