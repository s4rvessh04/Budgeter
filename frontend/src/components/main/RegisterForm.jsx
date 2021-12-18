import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Hi from 'react-icons/hi';

import { handleApiUrl } from 'shared';
import { InputBox, ToastPortal } from 'components';
import { useSubmit } from 'hooks';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const history = useHistory();
  const toastRef = useRef();

  const addToast = (mainMessage, subMessage, icon) => {
    toastRef.current.addMessage({
      mainMessage: mainMessage,
      subMessage: subMessage,
      icon: icon,
    });
  };

  const reqBody = {
    name: name,
    username: username,
    email: email,
    password: password,
  };

  const { submitRequest } = useSubmit({
    url: handleApiUrl('/user/'),
    method: 'POST',
    headers: { 'Content-Type': 'application/json', allow_redirects: true },
    body: reqBody,
  });

  const submitRegistration = async () => {
    const { response, data } = await submitRequest();
    if (!response.ok) {
      const message = data.detail;
      console.log(message);
      setErrorMessage(message);
      addToast(
        'Registration Failed',
        message,
        <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length > 5) {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords did not match.');
        addToast(
          'Registration Failed',
          errorMessage,
          <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
        );
      } else {
        addToast(
          'Registration Successful',
          'Redirecting to Login...',
          <Hi.HiOutlineCheckCircle className='flex-shrink-0 h-6 w-6 mr-3 text-green-400' />
        );
        setTimeout(() => {
          submitRegistration();
          history.push('/login');
        }, 1700);
      }
    } else {
      setErrorMessage('Length of password must be at least 8 characters');
      addToast(
        'Registration Failed',
        errorMessage,
        <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
      );
      return;
    }
  };

  return (
    <>
      <div
        className='xl:w-2/6 lg:w-2/5 md:w-3/4 w-4/5 my-7 px-7 py-5 border rounded-2xl shadow-md bg-white border-gray-300'
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
        </form>
      </div>
      <ToastPortal ref={toastRef} autoClose={true} />
    </>
  );
};
