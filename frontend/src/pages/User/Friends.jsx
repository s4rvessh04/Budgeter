import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import * as Hi from 'react-icons/hi';

import { useFetcher, useSubmit } from 'hooks';
import { UserContext } from 'context';
import { handleApiUrl } from 'shared';
import { Redirect } from 'react-router';
import {
  AddFriendCard,
  DisplayFriendCard,
  ErrorPromptAction,
  Loader,
} from 'components';

export const Friends = () => {
  const [reqBody, setReqBody] = useState(null);
  const [switchPage, setSwitchPage] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(false);
  const [newFriendRequestBody, setNewFriendReqBody] = useState(null);
  const [friendRequestAcceptedId, setFriendRequestAcceptedId] = useState([]);
  const [friendRequestDeniedId, setFriendRequestDeniedId] = useState([]);
  const [pendingRequestMethod, setPendingRequestMethod] = useState('');

  const [, , isAuthenticated, ,] = useContext(UserContext);

  const { data, isLoading } = useFetcher({
    url: handleApiUrl(switchPage ? '/friends/addFriends/' : '/friends/'),
  });

  const newFriendRequest = useFetcher({
    url: handleApiUrl('/friends/pending'),
  });

  const { submitRequest } = useSubmit({
    method: switchPage ? 'POST' : 'DELETE',
    url: handleApiUrl('/friends/'),
    body: reqBody,
  });

  const pendingRequest = useSubmit({
    method: pendingRequestMethod.toUpperCase(),
    url: handleApiUrl('/friends/'),
    body: newFriendRequestBody,
  });

  useEffect(() => {
    if (reqBody) submitRequest();
    if (newFriendRequestBody) pendingRequest.submitRequest();
  }, [isLoading, reqBody, newFriendRequestBody]);

  const handlePageToggle = () => setSwitchPage(!switchPage);
  const handlenewFriendRequestToggle = () => setPendingToggle(!pendingToggle);

  const handleSubmissions = (id) => {
    if (switchPage) setReqBody({ friend_id: id, request_status: false });
    else setReqBody([id]);
  };

  const handleFriendRequests = (method, id) => {
    const reqMethod = method.toUpperCase();
    setPendingRequestMethod(reqMethod);
    if (reqMethod === 'PUT') {
      setFriendRequestAcceptedId([...friendRequestAcceptedId, id]);
      setNewFriendReqBody({ friend_id: id, request_status: true });
    } else if (reqMethod === 'DELETE') {
      setFriendRequestDeniedId([...friendRequestDeniedId, id]);
      setNewFriendReqBody([id]);
    }
  };

  const checkFriendRequestId = (id) => {
    if (friendRequestAcceptedId.some((currentId) => currentId === id))
      return 'inAccepted';
    if (friendRequestDeniedId.some((currentId) => currentId === id))
      return 'inDenied';
    else return false;
  };

  return (
    <>
      <Helmet>
        <title>Friends</title>
      </Helmet>
      {isAuthenticated ? (
        <div className='max-h-screen overflow-auto flex flex-col flex-1 md:py-5 pt-20 pb-5'>
          {/* Header content */}
          <div className='flex md:px-6 px-4 sticky top-0'>
            <div className='lg:w-1/2 bg-white text-base py-2 px-5 rounded-lg shadow flex lg:flex-initial flex-1 items-center lg:m-auto mr-5'>
              <input
                type='text'
                className='text-base font-medium text-gray-900 placeholder-opacity-10 outline-none w-full'
                placeholder='Search'
              />
              <button className='text-gray-500 hover:text-gray-700 transition-colors duration-150'>
                <Hi.HiSearch className='h-6 w-6' />
              </button>
            </div>
            <div className='flex items-center'>
              <button
                className={
                  switchPage
                    ? 'bg-red-200 text-red-500 rounded-full mr-5 transition-all duration-150'
                    : 'bg-gray-200 text-gray-500 rounded-full mr-5 transition-all duration-150'
                }
                onClick={() => handlePageToggle()}>
                {switchPage ? (
                  <Hi.HiX className='h-5 w-5 m-2.5' />
                ) : (
                  <Hi.HiUserAdd className='h-5 w-5 m-2.5' />
                )}
              </button>
              {/* Notification Dropdown */}
              <button
                className='relative bg-gray-200 text-gray-500 rounded-full'
                onClick={() => handlenewFriendRequestToggle()}>
                {!newFriendRequest.isLoading &&
                newFriendRequest.data.length !== 0 ? (
                  <div className='absolute right-0 h-2.5 w-2.5 bg-red-500 rounded-full'></div>
                ) : (
                  <></>
                )}
                <Hi.HiBell className='h-5 w-5 m-2.5' />
              </button>
              {pendingToggle ? (
                !newFriendRequest.isLoading &&
                newFriendRequest.data.length === 0 ? (
                  <div className='z-20 absolute top-14 right-6 p-4 md:w-3/12 w-6/12 bg-white border border-gray-200 shadow-sm rounded-xl text-center'>
                    <span className='font-medium text-sm'>
                      No Notifications
                    </span>
                  </div>
                ) : (
                  <div className='z-20 absolute top-14 right-6 p-4 md:w-3/12 w-6/12 bg-white border border-gray-200 shadow-sm rounded-xl'>
                    {newFriendRequest.data.map((request) => (
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                          <img className='h-10 w-10 rounded-full mr-2.5' />
                          <div className='flex flex-col'>
                            <span className='text-sm font-poppins font-medium text-gray-700'>
                              {request.name}
                            </span>
                            <span className='text-xs font-normal text-gray-400'>
                              New friend request
                            </span>
                          </div>
                        </div>
                        <div className='flex space-x-2.5'>
                          {checkFriendRequestId(request.friend_id) ===
                          'inAccepted' ? (
                            <h1 className='text-green-400 font-semibold text-sm'>
                              Accepted
                            </h1>
                          ) : checkFriendRequestId(request.friend_id) ===
                            'inDenied' ? (
                            <h1 className='text-red-400 font-semibold text-sm'>
                              Denied
                            </h1>
                          ) : (
                            <>
                              <button
                                className='rounded-full bg-green-100 text-green-500 p-1'
                                onClick={() =>
                                  handleFriendRequests('PUT', request.friend_id)
                                }>
                                <Hi.HiCheck className='h-5 w-5' />
                              </button>
                              <button
                                className='rounded-full bg-red-100 text-red-500 p-1'
                                onClick={() =>
                                  handleFriendRequests(
                                    'DELETE',
                                    request.friend_id
                                  )
                                }>
                                <Hi.HiX className='h-5 w-5' />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                ''
              )}
            </div>
          </div>
          {switchPage ? (
            /* Add friends subpage */
            !isLoading && data ? (
              data.length === 0 ? (
                <ErrorPromptAction
                  buttonActionFunction={handlePageToggle}
                  buttonText={'View my friends'}
                  prompt={'No users found'}
                  emoji={
                    <Hi.HiOutlineEmojiSad className='h-7 w-7 m-3 text-red-500' />
                  }
                />
              ) : (
                <div className='grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 px-1 md:py-2.5 py-1.5'>
                  {data.map((friend) => (
                    <AddFriendCard
                      friend={friend}
                      handleSubmissions={handleSubmissions}
                    />
                  ))}
                </div>
              )
            ) : (
              <Loader name='Loading' />
            )
          ) : (
            /* Unfriend friends subpage */
            <>
              {!isLoading && data ? (
                data.length === 0 ? (
                  <ErrorPromptAction
                    buttonActionFunction={handlePageToggle}
                    buttonText={'Add friends'}
                    prompt={'No friends found'}
                    emoji={
                      <Hi.HiOutlineEmojiSad className='h-7 w-7 m-3 text-red-500' />
                    }
                  />
                ) : (
                  <div className='grid xl:grid-cols-4 xl:grid-rows-3 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-1 py-2.5'>
                    {data.map((friend) => (
                      <DisplayFriendCard
                        friend={friend}
                        handleSubmissions={handleSubmissions}
                      />
                    ))}
                  </div>
                )
              ) : (
                <Loader name='Loading' />
              )}
            </>
          )}
        </div>
      ) : (
        <Redirect push to='/login' />
      )}
    </>
  );
};
