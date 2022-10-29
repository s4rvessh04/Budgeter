import React, { useState } from 'react';

import * as Hi from 'react-icons/hi';

export const DisplayFriendCard = ({ friend, handleSubmissions }) => {
  const [sendRequestIds, setSendRequestIds] = useState([]);

  const handleSubmitButtons = (id) => {
    if (!sendRequestIds.some((currentId) => currentId === id))
      setSendRequestIds([...sendRequestIds, id]);
    else {
      let resetValues = sendRequestIds;
      resetValues = resetValues.filter((currentId) => currentId !== id);
      setSendRequestIds([...resetValues]);
    }
  };

  const checkSentRequests = (id) => {
    if (sendRequestIds.some((currentId) => currentId === id)) return true;
    else return false;
  };

  return (
    <div className='p-5 border rounded-xl bg-white mx-2.5 my-2.5'>
      <div className='flex items-center mb-5'>
        <img className='h-10 w-10 border rounded-full' alt='' />
        <div className='flex-1 ml-5'>
          <h1 className='font-poppins text-base font-semibold text-gray-900'>
            {friend.name}
          </h1>
          <h4 className='text-xs font-medium text-gray-300'>
            @{friend.username}
          </h4>
        </div>
      </div>
      {/* <div className='flex mb-5'>
        <div className='flex flex-col mr-5 text-xs space-y-2.5'>
          <h3 className='font-medium text-gray-400'>Owned</h3>
          <h3 className='font-medium text-gray-400'>Due</h3>
        </div>
        <div className='flex flex-col text-xs space-y-2.5'>
          <h3 className='font-semibold text-gray-600'>₹1000.00</h3>
          <h3 className='font-semibold text-gray-600'>₹500.00</h3>
        </div>
      </div> */}
      <button
        className='flex justify-center items-center w-full font-semibold text-xs py-2 bg-red-100 text-red-500 rounded-md hover:opacity-90 focus:ring-2 ring-red-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150'
        disabled={checkSentRequests(friend.friend_id)}
        onClick={() => {
          handleSubmitButtons(friend.friend_id);
          handleSubmissions(friend.friend_id);
        }}>
        {checkSentRequests(friend.friend_id) ? (
          <>
            <Hi.HiMinus className='h-5 w-5 mr-2' />
            <p>Unfriended</p>
          </>
        ) : (
          <>
            <Hi.HiUserRemove className='h-5 w-5 mr-2' />
            <p>Unfriend</p>
          </>
        )}
      </button>
    </div>
  );
};
