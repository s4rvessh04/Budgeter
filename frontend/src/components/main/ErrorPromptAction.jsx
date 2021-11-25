import React from 'react';

import * as Hi from 'react-icons/hi';

export const ErrorPromptAction = ({
  buttonActionFunction,
  buttonActionFunctionArgs = null,
  prompt,
  buttonText,
  emoji,
}) => {
  return (
    <div className='flex-1 flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center'>
        <div className='bg-red-100 rounded-full mb-2'>{emoji}</div>
        <span className='text-red-600 font-semibold'>{prompt}</span>
        <button
          className='bg-blue-500 text-white text-base font-medium py-2 px-4 mt-2 rounded-lg hover:opacity-95 focus:ring-2 ring-inset ring-blue-600'
          type='submit'
          onClick={() => buttonActionFunction(buttonActionFunctionArgs)}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};
