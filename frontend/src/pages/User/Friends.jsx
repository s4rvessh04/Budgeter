import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import * as Hi from 'react-icons/hi';

import { useFetcher } from 'hooks';
import { UserContext } from 'context';
import { handleApiUrl } from 'shared';
import { Redirect } from 'react-router';
import { Loader } from 'components';

export const Friends = () => {
  const [, , isAuthenticated, ,] = useContext(UserContext);
  const [switchPage, setSwitchPage] = useState(false);

  const { data } = useFetcher({
    url: handleApiUrl(switchPage ? '/friends/addFriends/' : '/friends/'),
  });

  const handleButton = () => setSwitchPage(!switchPage);

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
                onClick={() => handleButton()}>
                {switchPage ? (
                  <Hi.HiX className='h-5 w-5 m-2.5' />
                ) : (
                  <Hi.HiUserAdd className='h-5 w-5 m-2.5' />
                )}
              </button>
              <button className='relative bg-gray-200 text-gray-500 rounded-full'>
                <div className='absolute right-0 h-2.5 w-2.5 bg-red-500 rounded-full'></div>
                <Hi.HiBell className='h-5 w-5 m-2.5' />
              </button>
            </div>
          </div>
          {switchPage ? (
            /* Add friends subpage */
            data ? (
              data === null || data.length === 0 ? (
                <div className='flex-1 flex justify-center items-center'>
                  <div className='flex flex-col justify-center items-center'>
                    <div className='bg-red-100 rounded-full mb-2'>
                      <Hi.HiOutlineEmojiSad className='h-7 w-7 m-3 text-red-500' />
                    </div>
                    <span className='text-red-600 font-semibold'>
                      No Friends found
                    </span>
                    <button
                      className='bg-blue-500 text-white text-base font-medium py-2 px-4 mt-2 rounded-lg hover:opacity-95 focus:ring-2 ring-inset ring-blue-600'
                      type='submit'
                      onClick={() => handleButton()}>
                      Add Friends
                    </button>
                  </div>
                </div>
              ) : (
                <div className='grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 px-1 md:py-2.5 py-1.5'>
                  {data.map((friend) => (
                    <>
                      <div className='p-5 border rounded-xl bg-white mx-2.5 my-2.5'>
                        <div className='flex flex-col items-center'>
                          <img
                            className='h-12 w-12 border rounded-full mb-2.5'
                            alt=''
                          />
                          <div className='flex-1 text-center mb-3'>
                            <h1 className='font-poppins text-base font-semibold text-gray-900 mb-1'>
                              {friend.name}
                            </h1>
                            <h4 className='text-xs font-medium text-gray-300'>
                              @{friend.username}
                            </h4>
                          </div>
                          {/* <div className='flex text-purple-500 mt-1 mb-2'>
                    <Hi.HiUserGroup className='mr-1' />
                    <p className='text-xs font-semibold'>{100}</p>
                  </div> */}
                        </div>
                        <button className='flex justify-center items-center w-full font-semibold text-xs py-2 bg-blue-500 text-white rounded-md hover:opacity-90 focus:ring-2 ring-blue-300 transition-all duration-150'>
                          <Hi.HiUserAdd className='h-5 w-5 mr-2' />
                          <p>Send Request</p>
                        </button>
                      </div>
                    </>
                  ))}
                </div>
              )
            ) : (
              <Loader name='Loading' />
            )
          ) : (
            /* Unfriend friends subpage */
            <>
              {data ? (
                data === null || data.length === 0 ? (
                  <div className='flex-1 flex justify-center items-center'>
                    <div className='flex flex-col justify-center items-center'>
                      <div className='bg-red-100 rounded-full mb-2'>
                        <Hi.HiOutlineEmojiSad className='h-7 w-7 m-3 text-red-500' />
                      </div>
                      <span className='text-red-600 font-semibold'>
                        No Friends found
                      </span>
                      <button
                        className='bg-blue-500 text-white text-base font-medium py-2 px-4 mt-2 rounded-lg hover:opacity-95 focus:ring-2 ring-inset ring-blue-600'
                        type='submit'
                        onClick={() => handleButton()}>
                        Add Friends
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='grid xl:grid-cols-4 xl:grid-rows-3 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-1 py-2.5'>
                    {data.map((friend) => (
                      <div className='p-5 border rounded-xl bg-white mx-2.5 my-2.5'>
                        <div className='flex items-center mb-5'>
                          <img
                            className='h-10 w-10 border rounded-full'
                            alt=''
                          />
                          <div className='flex-1 ml-5'>
                            <h1 className='font-poppins text-base font-semibold text-gray-900'>
                              {friend.name}
                            </h1>
                            <h4 className='text-xs font-medium text-gray-300'>
                              @{friend.username}
                            </h4>
                          </div>
                          {/* <div className='flex text-purple-500'>
                                <Hi.HiUserGroup className='mr-1' />
                                <p className='text-xs font-semibold'>100</p>
                              </div> */}
                        </div>
                        <div className='flex mb-5'>
                          <div className='flex flex-col mr-5 text-xs space-y-2.5'>
                            <h3 className='font-medium text-gray-400'>Owned</h3>
                            <h3 className='font-medium text-gray-400'>Due</h3>
                          </div>
                          <div className='flex flex-col text-xs space-y-2.5'>
                            <h3 className='font-semibold text-gray-600'>
                              ₹1000.00
                            </h3>
                            <h3 className='font-semibold text-gray-600'>
                              ₹500.00
                            </h3>
                          </div>
                        </div>
                        <button className='flex justify-center items-center w-full font-semibold text-xs py-2 bg-red-100 text-red-500 rounded-md hover:bg-red-200 focus:ring-2 ring-red-300 transition-all duration-150'>
                          <Hi.HiUserRemove className='h-5 w-5 mr-2' />
                          <p>Unfriend</p>
                        </button>
                      </div>
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
