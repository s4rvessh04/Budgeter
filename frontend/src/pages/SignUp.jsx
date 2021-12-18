import React from 'react';
import { Helmet } from 'react-helmet';

import { RegisterForm } from 'components';

export const SignUp = () => {
  return (
    <>
      <Helmet>
        <title>Register - Budgeter</title>
      </Helmet>
      <div className='h-screen w-screen flex justify-center overflow-auto bg-gradient-to-tl from-red-100 via-purple-50 to-green-100'>
        <RegisterForm />
      </div>
    </>
  );
};
