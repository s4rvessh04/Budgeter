import React, { useContext, useEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import * as Hi from 'react-icons/hi';
import * as Fa from 'react-icons/fa';
import * as Bi from 'react-icons/bi';
import * as Ri from 'react-icons/ri';

import { useFetcher } from 'hooks';
import { UserContext } from 'context';
import { handleApiUrl } from 'shared';
import {
  ErrorPromptAction,
  Loader,
  ModalPortal,
  ToastPortal,
} from 'components';

export const Main = () => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [activeExpenseId, setActiveExpenseId] = useState(null);
  const [expenseData, setExpenseData] = useState([]);
  const [, , isAuthenticated, ,] = useContext(UserContext);

  const { data, isLoading } = useFetcher({
    url: handleApiUrl('/user/'),
  });

  useEffect(() => {
    const getExpenses = async () => {
      const expenses = await data.expenses;
      if (expenses) {
        const allExpenses = expenses.concat(data.shared_expenses);
        setExpenseData(
          allExpenses.sort(
            (exp1, exp2) => new Date(exp2.date) - new Date(exp1.date)
          )
        );
      }
    };

    if (data && !isLoading) {
      getExpenses();
    }
  }, [data, isLoading]);

  const routerHistory = useHistory();

  /*   const toastRef = useRef();

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
  }; */

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

  const iter = [1];
  let sum = 0;
  const addAmount = (amount) => {
    sum += amount;
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      {isAuthenticated ? (
        <div className='max-h-screen overflow-auto flex flex-col flex-1 md:px-6 px-4 md:py-0 py-5 md:pt-0 pt-16'>
          {/* Top Cards */}
          <div className='lg:h-1/5 py-5 lg:grid lg:grid-cols-3 lg:space-x-4 lg:space-y-0 lg:grid-rows-1 grid-cols-1 grid-rows-3 space-x-0 space-y-4'>
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
          <div className='lg:h-4/5 lg:grid lg:grid-cols-3 lg:space-x-4 lg:space-y-0 space-y-4'>
            {/* Expense table */}
            <div className='lg:h-auto h-96 flex flex-col bg-white col-span-2 rounded-xl border border-gray-200 md:shadow-none shadow-md overflow-y-auto'>
              {!isLoading ? (
                expenseData && expenseData.length === 0 ? (
                  <ErrorPromptAction
                    buttonActionFunction={handleRedirect}
                    buttonActionFunctionArgs={'/user/new'}
                    buttonText={'No Expense found'}
                    prompt={'Add Expense'}
                    emoji={
                      <Hi.HiOutlineExclamationCircle className='h-7 w-7 m-3 text-red-500' />
                    }
                  />
                ) : (
                  <>
                    <div className='flex md:px-5 px-2 md:pt-5 pt-4 pb-3 font-poppins font-semibold text-sm justify-evenly text-gray-600 text-left sticky top-0 bg-white'>
                      <div className='w-1/12 md:visible invisible'>Type</div>
                      <div className='w-1/4 md:visible invisible'>Date</div>
                      <div className='w-2/5 md:visible invisible'>
                        Description
                      </div>
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
                          <div className='relative mx-1.5'>
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
                    <div className='flex-1 overflow-y-auto md:px-2.5 px-1.5'>
                      {expenseData.map((expense) => (
                        <>
                          <div
                            className={
                              activeExpenseId === expense.id
                                ? 'text-sm font-medium text-gray-700 flex items-center justify-evenly md:px-5 px-3 py-2 bg-gray-100 rounded-xl cursor-pointer ring-2 ring-inset ring-gray-200'
                                : 'text-sm font-medium text-gray-200 flex items-center justify-evenly md:px-5 px-3 py-2 hover:bg-gray-100 cursor-pointer hover:text-gray-700 rounded-xl'
                            }
                            onClick={() => handleActiveExpenseView(expense.id)}>
                            <div className='w-1/12 text-gray-700'>
                              {expense.shared || expense.expense_id ? (
                                <Hi.HiUsers className='h-4 w-4 text-current' />
                              ) : (
                                <Hi.HiUser className='h-4 w-4 text-current' />
                              )}
                            </div>
                            <div className='w-1/4 flex flex-col space-y-1'>
                              <span className='font-bold text-gray-700'>
                                {moment(expense.date).local().format('LL')}
                              </span>
                              <span className='text-xs font-semibold text-gray-400'>
                                {moment(moment.utc(expense.date))
                                  .local()
                                  .format('LT')}
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
                                {addAmount(expense.amount)}
                              </span>
                              <Hi.HiChevronRight className='mr-1 h-5 w-5 text-current' />
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                    <div className='flex justify-between border-t border-gray-200 pl-5 py-2.5 font-bold text-sm text-gray-600 sticky bottom-0 w-full bg-white'>
                      <div className='flex flex-col'>
                        <h4 className='text-gray-700'>Total items</h4>
                        <span className='text-gray-500'>
                          {expenseData.length}
                        </span>
                      </div>
                      <div className='flex flex-col w-1/4'>
                        <h4 className='text-gray-700'>Total Amount</h4>
                        <span className='text-gray-500'>₹{sum}</span>
                      </div>
                    </div>
                  </>
                )
              ) : (
                <Loader name='loading' />
              )}
            </div>
            {/* History table */}
            <div className='lg:h-auto h-96 flex flex-col bg-white col-span-1 rounded-xl border border-gray-200 md:shadow-none shadow-md overflow-y-auto'>
              <div className='sticky top-0 md:px-5 px-3.5 md:pt-2.5 pt-2'>
                <h1 className='text-gray-900 font-poppins font-semibold text-xl mb-2.5'>
                  History
                </h1>
                <div className='grid grid-cols-2 space-x-2.5 p-1 h-11 mb-2.5 bg-gray-100 rounded-xl w-full text-base font-semibold font-poppins sticky top-0'>
                  <div className='bg-white flex justify-center items-center rounded-lg text-gray-700'>
                    <h2>Yearly</h2>
                  </div>
                  <div className='flex justify-center items-center rounded-lg text-gray-300'>
                    <h2>Monthly</h2>
                  </div>
                </div>
                <div className='flex justify-between bg-gray-100 rounded-xl py-1 px-2.5 pl-5 mb-2.5'>
                  <div className='text-sm'>
                    <h5 className='text-gray-400 font-semibold'>Current</h5>
                    <h5 className='text-gray-700 font-bold'>2021</h5>
                  </div>
                  <div className='text-sm flex items-center'>
                    <h5 className='text-gray-700 mr-2.5 font-bold'>₹1000.00</h5>
                    <div className='flex items-center bg-red-100 text-red-500 rounded-full text-xs py-0.5 px-1.5 font-semibold'>
                      <Hi.HiChevronUp className='h-4 w-4' /> 2.5%
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex-1 overflow-y-auto md:px-5 px-3.5'>
                {iter.map(() => (
                  <div className='flex justify-between rounded-lg py-2 px-2.5 pl-5 hover:bg-gray-100 mb-2.5 cursor-pointer'>
                    <h5 className='text-sm text-gray-700 font-bold'>2020</h5>
                    <div className='text-sm flex items-center'>
                      <h5 className='text-gray-700 mr-2.5 font-bold'>
                        ₹1000.00
                      </h5>
                      <div className='flex items-center bg-green-100 text-green-500 rounded-full text-xs py-0.5 px-1.5 font-semibold'>
                        <Hi.HiChevronDown className='h-4 w-4' /> 5%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex justify-between border-t border-gray-200 md:px-5 px-3.5 md:py-2.5 py-1.5 font-bold text-sm text-gray-600 sticky bottom-0 w-full bg-white'>
                <div className='flex flex-col'>
                  <h4 className='text-gray-700'>Total items</h4>
                  <span className='text-gray-500'>{3}</span>
                </div>
                <div className='flex flex-col'>
                  <h4 className='text-gray-700'>Total Amount</h4>
                  <span className='text-gray-500'>₹{3000}</span>
                </div>
              </div>
            </div>
          </div>
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
        </div>
      ) : (
        <Redirect push to='/login' />
      )}
      {/* <ToastPortal ref={toastRef} autoClose={true} />
      <ModalPortal ref={modalRef} /> */}
    </>
  );
};
