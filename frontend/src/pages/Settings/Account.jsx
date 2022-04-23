import { useContext, useEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Hi from 'react-icons/hi';

import { UserContext } from 'context';
import { useFetcher, useSubmit } from 'hooks';
import { handleApiUrl } from 'shared';
import {
  ContentContainer,
  InputBox,
  ToastPortal,
  ModalPortal,
} from 'components';
import { Loader } from 'components/main/Loader';

export const Account = () => {
  const [, , isAuthenticated, , logout] = useContext(UserContext);
  const [username, setUsername] = useState(null);
  const [formData, setFormData] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const history = useHistory();

  const toastRef = useRef();

  const addToast = (mainMessage, subMessage, icon) => {
    toastRef.current.addMessage({
      mainMessage: mainMessage,
      subMessage: subMessage,
      icon: icon,
    });
  };

  const modalRef = useRef();

  const addModal = (mainMessage, subMessage, icon, secondaryAction) => {
    modalRef.current.addMessage({
      mainMessage: mainMessage,
      subMessage: subMessage,
      icon: icon,
      secondaryAction: secondaryAction,
    });
  };

  const userFetcher = useFetcher({
    url: handleApiUrl('/user/'),
  });

  const user = useSubmit({
    url: handleApiUrl('/user/'),
    method: isDeleting ? 'DELETE' : 'PUT',
    body: formData,
  });

  const handleForm = async (e) => {
    e.preventDefault();
    const { response, data } = await user.submitRequest();
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
  };

  const handleUsername = (e) => setUsername(e.target.value);
  const handleAccountDelete = () => {
    addModal(
      'Confirm Deleting',
      'All associated data will be lost. This method is irreversible.',
      <Hi.HiOutlineExclamation className='flex-shrink-0 mt-0.5 h-8 w-8 mr-3 text-red-500' />,
      <button
        onClick={() => setIsDeleting(!isDeleting)}
        className='py-1.5 px-3.5 font-medium text-white bg-red-600 rounded-md hover:opacity-95 focus:ring-2 ring-red-700 ring-offset-2 transition-all duration-150'>
        Confirm
      </button>
    );
  };

  useEffect(() => {
    async function handleAccountDelete() {
      await user.submitRequest();
      logout();
      history.push('/login');
      setIsDeleting(!isDeleting);
    }

    if (isDeleting) handleAccountDelete();
  }, [isDeleting, history, logout, user]);

  useEffect(() => {
    setFormData({ username: username });
  }, [username]);

  return (
    <ContentContainer className='md:px-6 px-4 md:py-0 py-5 md:pt-0 pt-16 items-center justify-center'>
      <Helmet>
        <title>Account</title>
      </Helmet>
      {isAuthenticated ? (
        !userFetcher.isLoading ? (
          <form
            method='POST'
            onSubmit={handleForm}
            className='lg:w-1/2 w-full mb-8 rounded-xl shadow-lg bg-white border border-gray-200 md:mt-0 mt-5'>
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
                onChange={handleUsername}
                placeholder={userFetcher.data.username}
              />
              <div
                className='text-gray-400 font-normal text-xs mb-2.5'
                style={{ lineHeight: '150%' }}>
                Changing the username will lead to logout when successful.
              </div>
              <div className='flex space-x-4'>
                <button
                  type='submit'
                  className='py-2 px-3.5 font-semibold text-sm bg-green-600 text-white rounded-lg hover:opacity-95 focus:ring-2 ring-green-700 active ring-offset-2 transition-all duration-150'>
                  Confirm
                </button>
                {/* <button
                type='submit'
                onClick={handleEditButton}
                className='py-2 px-3.5 font-semibold text-sm bg-purple-600 text-white rounded-lg hover:opacity-95 focus:ring-2 ring-purple-700 active ring-offset-2 transition-all duration-150'>
                Edit
              </button> */}
              </div>
            </div>
            <div className='p-5'>
              <div
                className='text-gray-400 font-medium text-sm mb-3.5'
                style={{ lineHeight: '150%' }}>
                In order to delete your account you must not have any
                outstanding expenses associated with any member.
              </div>
              <button
                type='button'
                onClick={handleAccountDelete}
                className='py-2 px-3.5 font-semibold text-sm bg-red-600 text-white rounded-lg mb-2 hover:opacity-95 focus:ring-2 ring-red-700 ring-offset-2 transition-all duration-150'>
                Delete Account
              </button>
              <div
                className='text-gray-400 font-normal text-xs'
                style={{ lineHeight: '150%' }}>
                Deleting the account will delete all your data from the server.
              </div>
            </div>
          </form>
        ) : (
          <Loader name='Loading' />
        )
      ) : (
        <Redirect push to='/login' />
      )}
      <ToastPortal ref={toastRef} autoClose={true} />
      <ModalPortal ref={modalRef} />
    </ContentContainer>
  );
};
