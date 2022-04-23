import React from 'react';

type Props = {
  buttonActionFunctionArgs: string | null;
  buttonActionFunction: Function;
  prompt: String;
  buttonText: String;
  emoji: React.ReactElement;
};

export const ErrorPromptAction = (props: Props) => {
  return (
    <div className='flex-1 flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center'>
        <div className='bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-2'>
          {props.emoji}
        </div>
        <span className='text-red-600 font-semibold'>{props.prompt}</span>
        <button
          className='bg-gradient-to-b from-blue-600 to-blue-500 text-white text-base font-medium py-2 px-4 mt-2 rounded-lg hover:opacity-95 focus:ring-2 ring-inset ring-blue-600'
          type='submit'
          onClick={() =>
            props.buttonActionFunction(props.buttonActionFunctionArgs)
          }>
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};
