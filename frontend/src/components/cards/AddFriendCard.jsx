import React, { useState } from 'react';

import * as Hi from 'react-icons/hi';

export const AddFriendCard = ({ friend, handleSubmissions }) => {
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
      <div className='flex flex-col items-center'>
        <img className='h-12 w-12 border rounded-full mb-2.5' alt='' />
        <div className='flex-1 text-center mb-3'>
          <h1 className='font-poppins text-base font-semibold text-gray-900 mb-1'>
            {friend.name}
          </h1>
          <h4 className='text-xs font-medium text-gray-300'>
            @{friend.username}
          </h4>
        </div>
      </div>
      <button
        className='flex justify-center items-center w-full font-semibold text-xs py-2 bg-blue-500 text-white rounded-md hover:opacity-90 focus:ring-2 ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150'
        disabled={checkSentRequests(friend.id)}
        onClick={() => {
          handleSubmissions(friend.id);
          handleSubmitButtons(friend.id);
        }}>
        {checkSentRequests(friend.id) ? (
          <>
            <Hi.HiCheck className='h-5 w-5 mr-2' />
            <p>Sent</p>
          </>
        ) : (
          <>
            <Hi.HiUserAdd className='h-5 w-5 mr-2' />
            <p>Send Request</p>
          </>
        )}
      </button>
    </div>
  );
};
