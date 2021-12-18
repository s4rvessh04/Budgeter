import React from 'react';
import { Helmet } from 'react-helmet';

import { LoginForm } from 'components';

export const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login - Budgeter</title>
      </Helmet>
      <div className='h-screen w-screen flex justify-center overflow-auto bg-gradient-to-br from-red-100 via-purple-50 to-green-100'>
        <LoginForm />
      </div>
    </>
  );
};
