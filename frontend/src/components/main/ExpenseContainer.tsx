import * as Hi from 'react-icons/hi';

import { DropdownMenu } from 'components';

type ExpenseContainerProps = {
  children: JSX.Element | JSX.Element[];
};

type HeaderProps = {
  onChange?: Function;
  setFilterSelection?: Function;
  children?: JSX.Element;
};

type BodyProps = {
  children?: JSX.Element | JSX.Element[];
};

type ItemProps = {
  onClick: Function;
  Description: String;
  Amount: Number;
  Date: String;
  Time: String;
  Type: String;
};

type FooterProps = {
  TotalAmount: Number;
  TotalItems: Number;
};

export const ExpenseContainer = ({ children }: ExpenseContainerProps) => {
  return (
    <div className='flex flex-col flex-1 overflow-y-auto md:px-2.5 px-1.5 mt-2.5'>
      {children}
    </div>
  );
};

const Header = ({ onChange, setFilterSelection, children }: HeaderProps) => {
  return (
    <div className='flex items-center sticky top-0 bg-white'>
      <form action='GET' className='w-full'>
        <div className='flex bg-gray-100 rounded-lg p-1'>
          <Hi.HiSearch className='h-5 w-5 m-1.5 text-gray-500' />
          <input
            className='bg-transparent w-full focus:outline-none font-inter font-semibold text-gray-700'
            onChange={(e) => onChange && onChange(e.target.value)}
          />
        </div>
      </form>
      <DropdownMenu>
        <DropdownMenu.Button
          icon={<Hi.HiFilter className='h-5 w-5 text-gray-500' />}
        />
        <div className='absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full'></div>
        <DropdownMenu.MenuList position={'right-0'} alignItems={'left'}>
          <DropdownMenu.MenuList.Item
            text={'Current month'}
            value={0}
            onClick={setFilterSelection}
          />
          <DropdownMenu.MenuList.Item
            text={'All Expenses'}
            value={1}
            onClick={setFilterSelection}
          />
        </DropdownMenu.MenuList>
      </DropdownMenu>
      {children}
    </div>
  );
};

const Body = ({ children }: BodyProps) => {
  return <div className='flex flex-1 flex-col mt-2.5'>{children}</div>;
};

const Item = ({
  Description,
  Amount,
  Date,
  Time,
  Type,
  onClick,
}: ItemProps) => {
  return (
    <div
      className='cursor-pointer bg-gray-50 hover:bg-gray-100 py-4 px-5 rounded-xl grid grid-cols-3 mb-2.5 hover:shadow transition-colors duration-150'
      onClick={() => onClick()}>
      <div>
        <h1 className='font-bold text-lg text-gray-800 capitalize'>
          {Description ? Description : 'No Description'}
        </h1>
        <h2 className='font-extrabold text-xl text-gray-500'>₹{Amount}</h2>
      </div>
      <div className='text-sm flex flex-col justify-center'>
        <h1 className='font-bold text-gray-800'>{Date}</h1>
        <h2 className='font-medium text-gray-500'>{Time}</h2>
      </div>
      <div className='text-sm flex justify-between items-center'>
        {Type.toLowerCase() === 'shared' ? (
          <span className='font-poppins flex items-center space-y-2.5 text-purple-600 font-semibold text-xs bg-purple-100 rounded-full w-max py-1 px-3 mt-2.5'>
            <Hi.HiUsers className='mr-1 h-3 w-3' /> Shared
          </span>
        ) : (
          <span className='font-poppins flex items-center space-y-2.5 text-purple-600 font-semibold text-xs bg-purple-100 rounded-full w-max py-1 px-3 mt-2.5'>
            <Hi.HiUser className='mr-1 h-3 w-3' /> Self
          </span>
        )}
        <Hi.HiChevronRight className='h-5 w-5 text-gray-700' />
      </div>
    </div>
  );
};

const Footer = ({ TotalItems, TotalAmount }: FooterProps) => {
  return (
    <div className='flex sticky bottom-0 justify-between border-t border-gray-200 pl-5 py-2.5 font-bold text-sm text-gray-600 w-full bg-white'>
      <div className='flex flex-col'>
        <h4 className='text-gray-500 text-base'>Total Amount</h4>
        <span className='text-gray-700 text-xl'>₹{TotalAmount}</span>
      </div>
      <div className='flex flex-col'>
        <h4 className='text-gray-500 text-base'>Total Items</h4>
        <span className='text-gray-700 text-xl'>{TotalItems}</span>
      </div>
    </div>
  );
};

Body.Item = Item;
ExpenseContainer.Header = Header;
ExpenseContainer.Body = Body;
ExpenseContainer.Footer = Footer;
