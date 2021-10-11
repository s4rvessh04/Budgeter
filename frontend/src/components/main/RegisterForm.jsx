import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { useSubmit } from 'hooks';
import { handleApiUrl } from 'shared';
import { UserContext } from 'context';
import { InputBox } from 'components';

export const RegisterForm = () => {
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [, , isAuthenticated] = useContext(UserContext);

  const reqBody = JSON.stringify({
    name: name,
    username: username,
    email: email,
    password: password,
  });

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: reqBody,
  };

  const { submitRequest } = useSubmit({
    url: handleApiUrl('/user/'),
    requestOptions: requestOptions,
  });

  const submitRegistration = async () => {
    const { response, data, errorMessage } = await submitRequest();
    if (!response.ok) {
      setErrorMessage(errorMessage);
    } else setData(data);
  };

  // const submitRegistration = async (url) => {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: reqBody,
  //   };
  //   const response = await fetch(url, requestOptions);
  //   if (!response.ok) {
  //     setErrorMessage(data.detail);
  //   } else setData(await response.json());
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length > 5) {
      if (password !== confirmPassword)
        setErrorMessage('Passwords did not match.');
      else submitRegistration();
    } else {
      setErrorMessage('Length of password must be at least 8 characters');
      return;
    }
  };

  const handleRedirect = () => {
    return <Redirect to='/user' />;
  };

  return (
    <>
      {isAuthenticated ? (
        handleRedirect()
      ) : (
        <div
          className='xl:w-1/4 md:w-2/5 w-4/5 my-7 px-7 py-5 border rounded-2xl shadow-md bg-white border-gray-300'
          style={{ height: 'fit-content' }}>
          <h1 className='text-2xl font-poppins font-semibold text-gray-900'>
            Budgeter
          </h1>
          <h2 className='text-base font-semibold text-gray-500'>Sign Up</h2>
          <h3 className='mt-3 mb-4 text-xs font-medium text-red-500 text-center'>
            {errorMessage}
          </h3>
          <form action='POST' onSubmit={handleSubmit}>
            <InputBox
              name='name'
              type='text'
              value={name}
              labelName='Name'
              onChange={(e) => setName(e.target.value)}
              required={true}
              inputClassName='mb-4'
            />
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
              name='email'
              type='email'
              value={email}
              labelName='Email'
              onChange={(e) => setEmail(e.target.value)}
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
            <InputBox
              name='confirmPassword'
              type='password'
              value={confirmPassword}
              labelName='Confirm Password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={true}
              inputClassName='mb-4'
            />
            <button
              type='submit'
              className='w-full py-3 mt-3 text-lg font-semibold rounded-lg bg-green-600 text-white hover:opacity-90 focus:opacity-90 focus:ring-2 ring-offset-2 ring-green-600 transition-all duration-150'>
              Sign Up
            </button>
            <h4 className='my-7 text-sm text-gray-600'>
              Already have an account?
              <Link to='/login' className='text-blue-600'>
                {' '}
                Log In.
              </Link>
            </h4>
            {data && handleRedirect()}
          </form>
        </div>
      )}
    </>
  );
};
