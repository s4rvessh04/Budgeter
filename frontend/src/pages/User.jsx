import React, { useContext, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import * as Hi from 'react-icons/hi';

import { UserContext } from 'context';
import { ToastPortal } from 'components';
import { ModalPortal } from 'components';
import { useFetcher } from 'hooks';
import { handleApiUrl } from 'shared';

export const User = () => {
  const [, , isAuthenticated, , logout] = useContext(UserContext);

  const { data } = useFetcher({
    url: handleApiUrl('/user/'),
  });

  const toastRef = useRef();

  const addToast = (mainMessage, subMessage, icon) => {
    toastRef.current.addMessage({
      mainMessage: mainMessage,
      subMessage: subMessage,
      icon: icon,
    });
  };

  const modalRef = useRef();

  const addModal = (mainMessage, subMessage, icon) => {
    modalRef.current.addMessage({
      mainMessage: mainMessage,
      subMessage: subMessage,
      icon: icon,
    });
  };

  return (
    <>
      {isAuthenticated ? (
        <div className='h-screen w-screen'>
          <h1>This is userpage</h1>
          <button type='submit' onClick={() => logout()}>
            Logout
          </button>
          <div className='flex flex-col'>
            <button
              type='submit'
              onClick={() =>
                addModal(
                  'Foo is not the bar',
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat doloribus laudantium, dicta provident eaque deleniti repellat quod? ',
                  <Hi.HiOutlineCheckCircle className='flex-shrink-0 h-8 w-8 mr-3 text-green-400' />
                )
              }>
              Activate modal
            </button>
            <button
              type='submit'
              onClick={() =>
                addToast(
                  'Foo',
                  'Bar',
                  <Hi.HiOutlineCheckCircle className='flex-shrink-0 h-6 w-6 mr-3 text-green-400' />
                )
              }>
              Add Success Toast
            </button>
            <button
              type='submit'
              onClick={() =>
                addToast(
                  'Foo',
                  'Bar',
                  <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
                )
              }>
              Add Danger Toast
            </button>
            <button
              type='submit'
              onClick={() =>
                addToast(
                  'Foo',
                  'Bar',
                  <Hi.HiOutlineExclamation className='flex-shrink-0 h-6 w-6 mr-3 text-yellow-400' />
                )
              }>
              Add Warning Toast
            </button>
          </div>
          {data && console.log(data)}
        </div>
      ) : (
        <Redirect push to='/login' />
      )}
      <ToastPortal ref={toastRef} />
      <ModalPortal ref={modalRef} />
    </>
  );
};
