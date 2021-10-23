import React, { useContext, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import moment from 'moment';
import * as Hi from 'react-icons/hi';
import * as Fa from 'react-icons/fa';
import * as Bi from 'react-icons/bi';
import * as Ri from 'react-icons/ri';

import { useFetcher } from 'hooks';
import { UserContext } from 'context';
import { handleApiUrl } from 'shared';
import { ToastPortal } from 'components';
import { ModalPortal } from 'components';

export const Main = () => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [activeExpenseId, setActiveExpenseId] = useState(null);
  const [, , isAuthenticated, , logout] = useContext(UserContext);

  const { data } = useFetcher({
    url: handleApiUrl('/user/'),
  });

  const routerHistory = useHistory();

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

  const mainIconClass = 'h-10 w-10';
  const moneyIconClass = String(`${mainIconClass} text-green-400`);
  const walletIconClass = String(`${mainIconClass} text-indigo-400`);
  const ownedIconClass = String(`${mainIconClass} text-red-400`);

  const badgeMainClass = 'flex font-semibold px-1.5 py-0.5 rounded-full';

  const handleBadges = (percentage, relation = 'normal') => {
    if (percentage === 0) return '';
    else {
      if (relation === 'normal' ? percentage > 0 : percentage < 0) {
        return {
          badgeClass: `${badgeMainClass}  bg-red-100 text-red-500`,
          badgeIcon:
            relation === 'normal' ? <Hi.HiChevronUp /> : <Hi.HiChevronDown />,
        };
      } else
        return {
          badgeClass: `${badgeMainClass}  bg-green-100 text-green-500`,
          badgeIcon:
            relation === 'normal' ? <Hi.HiChevronDown /> : <Hi.HiChevronUp />,
        };
    }
  };

  const headCards = [
    {
      header: 'Total Expenses',
      amount: '₹1000.00',
      percentage: '2.5%',
      icon: <Fa.FaRegMoneyBillAlt className={moneyIconClass} />,
      iconParentClass: 'bg-green-100 rounded-full p-2.5 self-center',
      get badge() {
        return handleBadges(this.percentage.split('%')[0]);
      },
    },
    {
      header: 'Total Savings',
      amount: '₹500.00',
      percentage: '5%',
      icon: <Bi.BiWallet className={walletIconClass} />,
      iconParentClass: 'bg-indigo-100 rounded-full p-2.5 self-center',
      get badge() {
        return handleBadges(this.percentage.split('%')[0], 'inverse');
      },
    },
    {
      header: 'Total Active Owing',
      amount: '₹0.00',
      percentage: '0',
      icon: <Ri.RiHandCoinLine className={ownedIconClass} />,
      iconParentClass: 'bg-red-100 rounded-full p-2.5 self-center',
      get badge() {
        return handleBadges(this.percentage.split('%')[0]);
      },
    },
  ];

  const handleSearchBar = () => {
    setToggleSearch(!toggleSearch);
  };

  const handleActiveExpenseView = (expenseId) => {
    if (expenseId === activeExpenseId) {
      setActiveExpenseId(null);
    } else {
      setActiveExpenseId(expenseId);
    }
  };

  const handleRedirect = (path) => {
    return routerHistory.push(path);
  };

  return (
    <>
      {isAuthenticated ? (
        <div className='max-h-screen overflow-y-scroll flex flex-col flex-1 md:px-6 px-4 md:py-0 py-5 md:pt-0 pt-16'>
          {/* Top Cards */}
          <div className='h-1/5 py-5 grid md:grid-cols-3 md:space-x-4 md:space-y-0 md:grid-rows-1 grid-cols-1 grid-rows-3 space-x-0 space-y-4'>
            {headCards.map((card) => (
              <div className='flex justify-between bg-white rounded-xl border border-gray-200 shadow-md px-5 py-2.5'>
                <div>
                  <h1 className='font-poppins font-semibold text-xl '>
                    {card.header}
                  </h1>
                  <div className='flex items-center mt-2'>
                    <h2 className='text-lg font-bold text-gray-500 mr-2.5'>
                      {card.amount}
                    </h2>
                    {card.percentage !== '0' ? (
                      <div className={card.badge.badgeClass}>
                        {card.badge.badgeIcon}
                        <h2 className='text-xs '>{card.percentage}</h2>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div
                  className={card.iconParentClass}
                  style={{ height: 'fit-content' }}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
          {/* Bottom tables */}
          <div className='h-4/5 md:grid md:grid-cols-3 md:space-x-4 md:space-y-0 space-y-4'>
            {/* Expense table */}
            <div className='md:h-auto h-96 flex flex-col bg-white col-span-2 rounded-xl border border-gray-200 md:shadow-none shadow-md md:px-2.5 px-1.5 overflow-y-auto'>
              <div className='flex md:px-5 px-2 md:pt-5 pt-4 pb-3 font-poppins font-semibold text-sm justify-evenly text-gray-600 text-left sticky top-0 bg-white'>
                <div className='w-1/12 md:visible invisible'>Type</div>
                <div className='w-1/4 md:visible invisible'>Date</div>
                <div className='w-2/5 md:visible invisible'>Description</div>
                <div className='w-1/6 md:visible invisible'>Tag</div>
                <div className='md:w-1/4 w-full flex justify-between items-center'>
                  <span className='md:visible invisible'>Amount</span>
                  <span className='md:invisible visible'>Search</span>
                  <form
                    action='submit'
                    method='GET'
                    onSubmit={(e) => e.preventDefault()}
                    className={
                      toggleSearch ? 'absolute w-full left-0' : 'w-min'
                    }>
                    <div className='relative'>
                      <span className='absolute inset-y-0 right-0 flex items-center'>
                        <button
                          className='bg-gray-100 rounded-full mr-1'
                          onClick={() => handleSearchBar()}>
                          {toggleSearch ? (
                            <Hi.HiX className='h-5 w-5 m-1.5' />
                          ) : (
                            <Hi.HiSearch className='h-5 w-5 m-1.5' />
                          )}
                        </button>
                      </span>
                      <input
                        type='search'
                        className={
                          toggleSearch
                            ? 'font-inter font-medium text-gray-600 focus:outline-none flex items-center bg-white px-4 pr-10 border-2 border-gray-200 rounded-full w-full py-2'
                            : 'w-0'
                        }
                      />
                    </div>
                  </form>
                </div>
              </div>
              {data ? (
                data.expenses === null || data.expenses.length === 0 ? (
                  <div className='flex flex-col flex-1 justify-center items-center'>
                    <div className='bg-red-100 rounded-full mb-2'>
                      <Hi.HiOutlineExclamationCircle className='h-7 w-7 m-3 text-red-500' />
                    </div>
                    <span className='text-red-600 font-semibold'>
                      No Expense found
                    </span>
                    <button
                      className='bg-blue-500 text-white text-base font-medium py-2 px-4 mt-2 rounded-lg hover:opacity-95 focus:ring-2 ring-inset ring-blue-600'
                      type='submit'
                      onClick={() => handleRedirect('/user/new')}>
                      Add Expense
                    </button>
                  </div>
                ) : (
                  data.expenses.map((expense) => (
                    <div className='flex-1 overflow-y-auto'>
                      <div
                        className={
                          activeExpenseId === expense.id
                            ? 'text-sm font-medium text-gray-700 flex items-center justify-evenly md:px-5 px-3 py-2 bg-gray-100 rounded-xl cursor-pointer ring-2 ring-inset ring-gray-200'
                            : 'text-sm font-medium text-gray-200 flex items-center justify-evenly md:px-5 px-3 py-2 hover:bg-gray-100 cursor-pointer hover:text-gray-700 rounded-xl'
                        }
                        onClick={() => handleActiveExpenseView(expense.id)}>
                        <div className='w-1/12 text-gray-700'>
                          {expense.shared ? (
                            <Hi.HiUsers className='h-4 w-4 text-current' />
                          ) : (
                            <Hi.HiUser className='h-4 w-4 text-current' />
                          )}
                          {/* <select
                          name='members'
                          id=''
                          className='border border-gray-200 rounded-lg py-1.5 px-2 bg-transparent w-4/5 font-medium text-xs'>
                          {expense.shared_expenses.map((shared_expense) => (
                            <option value={shared_expense.member_id}>
                              {shared_expense.member_id}
                            </option>
                          ))}
                        </select> */}
                        </div>
                        <div className='w-1/4 flex flex-col space-y-1'>
                          <span className='font-bold text-gray-700'>
                            {moment(expense.date).format('LL')}
                          </span>
                          <span className='text-xs font-semibold text-gray-400'>
                            {moment(expense.date).format('LT')}
                          </span>
                        </div>
                        <div className='w-2/5 text-gray-700'>
                          {expense.description}
                        </div>
                        <div className='w-1/6 text-gray-700'>
                          {expense.tag_id}
                        </div>
                        <div className='w-1/4 font-bold flex justify-between items-center'>
                          <span className='text-gray-700'>
                            ₹{expense.amount}
                          </span>
                          <Hi.HiChevronRight className='mr-1 h-5 w-5 text-current' />
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className='w-full h-full flex justify-center items-center'>
                  <svg
                    class='animate-spin -ml-1 mr-3 h-8 w-8 text-gray-500'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <circle
                      class='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      stroke-width='4'></circle>
                    <path
                      class='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  <span className='font-medium text-xl text-gray-500'>
                    Loading
                  </span>
                </div>
              )}
              <div className='flex justify-between border-t border-gray-200 pl-5 py-1.5 font-bold text-sm text-gray-600 sticky bottom-0 w-full bg-white'>
                <div className='flex flex-col w-1/4'>
                  <h4 className='text-gray-700'>Total items</h4>
                  <span className='text-gray-500'>{3}</span>
                </div>
                <div className='flex flex-col w-1/4'>
                  <h4 className='text-gray-700'>Total Amount</h4>
                  <span className='text-gray-500'>₹{3000}</span>
                </div>
              </div>
            </div>
            {/* History table */}
            <div className='md:h-auto h-96 font-poppins font-semibold text-xl bg-white col-span-1 rounded-xl border border-gray-200 md:shadow-none shadow-md md:px-5 px-3.5 md:py-2.5 py-2'>
              History
            </div>
          </div>
          <button type='submit' onClick={() => logout()}>
            Logout
          </button>
          {/* <div className='flex flex-col'>
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
          </div> */}
          {data && console.log(data)}
        </div>
      ) : (
        <Redirect push to='/login' />
      )}
      <ToastPortal ref={toastRef} autoClose={true} />
      <ModalPortal ref={modalRef} />
    </>
  );
};
