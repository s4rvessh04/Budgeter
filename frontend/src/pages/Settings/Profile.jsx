import React, { useContext, useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Hi from 'react-icons/hi';

import { UserContext } from 'context';
import { useFetcher, useSubmit } from 'hooks';
import { ContentContainer, InputBox, Loader, ToastPortal } from 'components';
import { handleApiUrl } from 'shared';

export const Profile = () => {
  const [, , isAuthenticated, ,] = useContext(UserContext);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [maxExpense, setMaxExpense] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toastRef = useRef();

  const addToast = (mainMessage, subMessage, icon) => {
    toastRef.current.addMessage({
      mainMessage: mainMessage,
      subMessage: subMessage,
      icon: icon,
    });
  };

  const user = useSubmit({
    url: handleApiUrl('/user/'),
    method: 'PUT',
    body: formData,
  });

  const userMaxExpense = useSubmit({
    url: handleApiUrl('/max_expense/'),
    method: 'PUT',
    body: formData,
  });

  const userFetcher = useFetcher({
    url: handleApiUrl('/user/'),
  });

  const userMaxExpenseFetcher = useFetcher({
    url: handleApiUrl('/max_expense/'),
  });

  const handleName = (e) => setName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handleMaxExpense = (e) => setMaxExpense(e.target.value);
  const handleIsSubmitted = () => {
    if (!name && !email && !maxExpense) return;
    else setIsSubmitted(!isSubmitted);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const userRequest = name || email ? await user.submitRequest() : false;
    const userMaxExpenseRequest = maxExpense
      ? await userMaxExpense.submitRequest()
      : false;

    if (userRequest || userMaxExpenseRequest) {
      addToast(
        'Updated Successfully',
        'Request was completed without errors.',
        <Hi.HiOutlineCheckCircle className='flex-shrink-0 h-6 w-6 mr-3 text-green-400' />
      );
    } else {
      addToast(
        'Update Unsuccessful',
        'Check entered data carefully.',
        <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
      );
    }
  };

  useEffect(() => {
    setFormData({ name: name, email: email, amount: maxExpense });
  }, [name, email, maxExpense]);

  // useEffect(() => {
  //   if (!userFetcher.isLoading && !userMaxExpense.isLoading) {
  //     const name = userFetcher.data.name;
  //     const email = userFetcher.data.email;
  //     const maxExpense =
  //       userMaxExpenseFetcher.data != null
  //         ? userMaxExpenseFetcher.data.amount
  //         : '-';
  //     setName(name);
  //     setEmail(email);
  //     setMaxExpense(maxExpense);
  //   }
  // }, [userFetcher.isLoading, userMaxExpenseFetcher.isLoading]);

  return (
    <ContentContainer className='md:px-6 md:py-0 md:pt-0 px-4 py-5 pt-16 items-center justify-center'>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      {isAuthenticated ? (
        !userFetcher.isLoading && !userMaxExpenseFetcher.isLoading ? (
          <form
            action='POST'
            onSubmit={handleForm}
            className='lg:w-1/2 w-full mb-8 rounded-xl shadow-lg bg-white p-5 border border-gray-200 md:mt-0 mt-5'>
            <h1 className='mb-3.5 font-poppins font-semibold text-2xl text-gray-500'>
              Profile Settings
            </h1>
            <InputBox
              type='text'
              name='name'
              labelName='Name'
              inputClassName='mb-1.5'
              required={!isSubmitted}
              onChange={handleName}
              placeholder={userFetcher.data.name}
            />
            <InputBox
              type='email'
              name='email'
              labelName='Email'
              inputClassName='mb-1.5'
              required={!isSubmitted}
              onChange={handleEmail}
              placeholder={userFetcher.data.email}
            />
            <InputBox
              type='text'
              name='max_expense'
              labelName='Max Expense'
              inputClassName='mb-2'
              required={!isSubmitted}
              onChange={handleMaxExpense}
              placeholder={
                userMaxExpenseFetcher.data != null
                  ? userMaxExpenseFetcher.data.amount
                  : '-'
              }
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
              onClick={handleIsSubmitted}
              className='py-2 px-3.5 font-semibold text-sm bg-green-600 text-white rounded-lg hover:opacity-95 focus:ring-2 ring-green-700 ring-offset-2 transition-all duration-150'>
              Update Profile
            </button>
          </form>
        ) : (
          <Loader name='Loading' />
        )
      ) : (
        <Redirect push to='/login' />
      )}
      <ToastPortal ref={toastRef} autoClose={true} />
    </ContentContainer>
  );
};
