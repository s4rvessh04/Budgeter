import * as Hi from 'react-icons/hi';

export const Toast = ({ onClose, mainMessage, subMessage, icon = null }) => {
  return (
    <div className='z-40 w-96 flex justify-between p-4 lg:m-0 lg:mb-3.5 m-auto mb-3 border border-gray-300 rounded-xl shadow-md bg-white animate-slideIn-fast'>
      <div className='flex mr-3 overflow-ellipsis'>
        {icon}
        <div className='m-auto'>
          <h6 className='text-sm font-semibold mb-1 text-gray-800'>
            {mainMessage}
          </h6>
          <h6 className='text-sm font-medium text-gray-400'>{subMessage}</h6>
        </div>
      </div>
      <button
        onClick={onClose}
        className='flex justify-center items-center rounded-full p-1 relative -top-1 -right-1 hover:bg-gray-100'
        style={{ height: 'fit-content' }}>
        <Hi.HiX className='h-5 w-5 text-gray-400' />
      </button>
    </div>
  );
};
