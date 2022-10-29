import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Hi from 'react-icons/hi';
import * as Fa from 'react-icons/fa';
import * as Bi from 'react-icons/bi';
import * as Ri from 'react-icons/ri';
import moment from 'moment';

import { useFetcher } from 'hooks';
import { handleApiUrl } from 'shared';
import {
  ErrorPromptAction,
  ExpenseContainer,
  ExpenseEditingContainer,
  Loader,
  ModalPortal,
  ToastPortal,
} from 'components';

export const Main = () => {
  const [lend, setLend] = useState(0);
  const [borrow, setBorrow] = useState(0);
  const [headCards, setHeadCards] = useState<Array<any>>([]);
  const [isLoading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState<Array<any>>([]);
  const [searchQuery, setSearchQuery] = useState<String>('');
  const [filterSelection, setFilterSelection] = useState<String>('');
  const [userMaxExpense, setUserMaxExpense] = useState(0);
  const [activeExpenseId, setActiveExpenseId] = useState<null | number>(null);
  const [lendBorrowToggle, setLendBorrowToggle] = useState(false);
  const [expenseTotalAmount, setExpenseTotalAmount] = useState(0);
  const [expenseTotalAmountPervMonth] = useState(0);
  const [togglePrevMonth] = useState(false);
  const [currentMonthAndYear] = useState(moment().format('MM/YYYY').split('/'));
  const [pervoiusMonthAndYear] = useState(
    moment().subtract(1, 'month').format('MM/YYYY').split('/')
  );

  const mainIconClass = 'h-10 w-10';
  const moneyIconClass = String(`${mainIconClass} text-green-400`);
  const walletIconClass = String(`${mainIconClass} text-indigo-400`);
  const ownedIconClass = String(`${mainIconClass} text-red-400`);

  // Fetching user shared expenses by current month and year
  const sharedExpenseFetcher = useFetcher({
    url: handleApiUrl(
      `/expenses/shared?month=${
        togglePrevMonth ? pervoiusMonthAndYear[0] : currentMonthAndYear[0]
      }&year=${
        togglePrevMonth ? pervoiusMonthAndYear[1] : currentMonthAndYear[1]
      }`
    ),
  });

  // const sharedExpenseFetcher = useFetcher({
  //   url: handleApiUrl('/expenses/shared'),
  // });

  // Fetching all user shared expenses
  const allSharedExpenseFetcher = useFetcher({
    url: handleApiUrl('/expenses/shared'),
  });

  // Fetching user expenses by current month and year
  const expenseFetcher = useFetcher({
    url: handleApiUrl(
      `/expenses/?month=${
        togglePrevMonth ? pervoiusMonthAndYear[0] : currentMonthAndYear[0]
      }&year=${
        togglePrevMonth ? pervoiusMonthAndYear[1] : currentMonthAndYear[1]
      }`
    ),
  });

  // const expenseFetcher = useFetcher({
  //   url: handleApiUrl('/expenses/'),
  // });

  // Fetching all user expenses
  const allExpenseFetcher = useFetcher({
    url: handleApiUrl('/expenses/'),
  });

  // Fetching all user max expense for the month
  const maxExpenseFetcher = useFetcher({
    url: handleApiUrl('/max_expense/'),
  });

  const routerHistory = useHistory();

  // useEffect hook to clean and calculate expenses' amount
  useEffect(() => {
    const getExpenses = () => {
      const expenses: Array<any> = expenseFetcher.data;
      const sharedExpenses: Array<any> = sharedExpenseFetcher.data;
      const maxExpense: any = maxExpenseFetcher.data;
      const allSharedExpense = allSharedExpenseFetcher.data;
      const allExpenses = allExpenseFetcher.data;

      const calculateLending = (l: Array<any>) => {
        let sum = 0;
        for (let i of l) {
          if (i.shared) {
            for (let j of i.shared_expenses) {
              sum += j.amount;
            }
          }
        }
        return sum;
      };

      setLend(calculateLending(allExpenses));

      const calculateBorrowing = (l: Array<any>) => {
        let sum = 0;
        for (let i of l) {
          sum += i.SharedExpense.amount;
        }
        return sum;
      };

      setBorrow(calculateBorrowing(allSharedExpense));
      if (expenses && sharedExpenses) {
        const allExpensesCurrentMonth: Array<any> = expenses.concat(
          sharedExpenses.map((i) => i.SharedExpense)
        );

        // Returns sum of all expenses of the user
        const sumAllExpenses = (allExpenses: Array<any>) => {
          if (allExpenses.length === 0) return 0;
          if (allExpenses.length === 1) return allExpenses[0].amount;
          else
            return allExpenses
              .map((exp) => exp.amount)
              .reduce((amount1, amount2) => amount1 + amount2);
        };
        setExpenseTotalAmount(sumAllExpenses(allExpensesCurrentMonth));
        setExpenseData(
          // allExpenses
          allExpensesCurrentMonth.sort(
            (exp1, exp2) =>
              new Date(exp2.date).valueOf() - new Date(exp1.date).valueOf()
          )
        );
      }
      if (maxExpense) setUserMaxExpense(maxExpense.amount);
      else setUserMaxExpense(0);
      setLoading(false);
    };

    if (
      !sharedExpenseFetcher.isLoading &&
      !expenseFetcher.isLoading &&
      !maxExpenseFetcher.isLoading &&
      !allExpenseFetcher.isLoading &&
      !allSharedExpenseFetcher.isLoading
    )
      getExpenses();
  }, [
    sharedExpenseFetcher.data,
    expenseFetcher.data,
    maxExpenseFetcher.data,
    allSharedExpenseFetcher.data,
    allExpenseFetcher.data,
    sharedExpenseFetcher.isLoading,
    expenseFetcher.isLoading,
    maxExpenseFetcher.isLoading,
    allSharedExpenseFetcher.isLoading,
    allExpenseFetcher.isLoading,
  ]);

  // useEffect hook to handle the top main cards
  useEffect(() => {
    const headCardsData = [
      {
        header: 'Total Expenses',
        amount: `₹${expenseTotalAmount}`,
        percentage: `${
          isNaN((expenseTotalAmount / expenseTotalAmountPervMonth) * 100)
            ? '0'
            : expenseTotalAmount === 0 || expenseTotalAmountPervMonth === 0
            ? '0'
            : expenseTotalAmount / expenseTotalAmountPervMonth
        }%`,
        icon: <Fa.FaRegMoneyBillAlt className={moneyIconClass} />,
        iconParentClass:
          'bg-gradient-to-br from-green-100 to-green-200 rounded-full p-2.5 self-center',
        get badge() {
          const percentageIncDec = parseFloat(
            this.percentage.substring(1, this.percentage.length - 1)
          );
          return handleBadges(
            percentageIncDec > 1 ? 'down' : 'up',
            percentageIncDec > 1 ? 'down' : 'up'
          );
        },
      },
      {
        header: 'Remaining Savings',
        amount:
          userMaxExpense !== 0 ? (
            `₹${userMaxExpense - expenseTotalAmount}`
          ) : (
            <button
              className='h-max w-full text-xl font-bold rounded-md text-blue-700'
              onClick={() => routerHistory.push('/settings/profile')}>
              Set max expense
            </button>
          ),
        percentage: userMaxExpense
          ? `${((expenseTotalAmount / userMaxExpense) * 100).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
              }
            )}%`
          : '0',
        icon: <Bi.BiWallet className={walletIconClass} />,
        iconParentClass:
          'bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full p-2.5 self-center',
        get badge() {
          const percentageIncDec = parseFloat(this.percentage.split('%')[0]);
          return handleBadges(
            percentageIncDec < 0 ? 'up' : 'down',
            percentageIncDec > 100 ? 'up' : 'down'
          );
        },
      },
      {
        header: (
          <button
            className='text-base font-semibold'
            onClick={() => setLendBorrowToggle(!lendBorrowToggle)}>
            {lendBorrowToggle ? (
              <span className='flex items-center'>
                Total Borrowing
                <Hi.HiChevronUp className='ml-1.5 h-5 w-5 mt-0.5' />
              </span>
            ) : (
              <span className='flex items-center'>
                Total Lending
                <Hi.HiChevronDown className='ml-1.5 h-5 w-5 mt-0.5' />
              </span>
            )}
          </button>
        ),
        amount: lendBorrowToggle ? `₹${borrow}` : `₹${lend}`,
        percentage: '0',
        icon: <Ri.RiHandCoinLine className={ownedIconClass} />,
        iconParentClass:
          'bg-gradient-to-br from-red-100 to-red-200 rounded-full p-2.5 self-center',
        // get badge() {
        //   return handleBadges(this.percentage.split('%')[0]);
        // },
      },
    ];

    setHeadCards(headCardsData);
  }, [
    userMaxExpense,
    expenseTotalAmount,
    lendBorrowToggle,
    walletIconClass,
    routerHistory,
    borrow,
    expenseTotalAmountPervMonth,
    lend,
    moneyIconClass,
    ownedIconClass,
  ]);

  type ToastRef = {
    addMessage: (toast: any) => void;
  };

  const toastRef = useRef<ToastRef>(null);

  // const addToast = (
  //   mainMessage: string,
  //   subMessage: string,
  //   icon: HTMLElement
  // ) => {
  //   if (toastRef.current) {
  //     toastRef.current.addMessage({
  //       mainMessage: mainMessage,
  //       subMessage: subMessage,
  //       icon: icon,
  //     });
  //   }
  // };

  const modalRef = useRef<ToastRef>(null);

  // const addModal = (
  //   mainMessage: string,
  //   subMessage: string,
  //   icon: HTMLElement
  // ) => {
  //   if (modalRef.current) {
  //     modalRef.current.addMessage({
  //       mainMessage: mainMessage,
  //       subMessage: subMessage,
  //       icon: icon,
  //     });
  //   }
  // };

  // Handling the trend(Up/Down) behaviour of badges in main cards

  const handleBadges = (arrowDirection: string, trend: string) => {
    return {
      badgeClass:
        trend === 'up'
          ? 'flex font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-500'
          : 'flex font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-500',
      badgeIcon:
        arrowDirection === 'up' ? <Hi.HiTrendingUp /> : <Hi.HiTrendingDown />,
    };
  };

  const handleActiveExpenseView = (expenseId: number) => {
    if (expenseId === activeExpenseId) {
      setActiveExpenseId(null);
    } else {
      setActiveExpenseId(expenseId);
    }
  };

  const handleRedirect = (path: string) => {
    return routerHistory.push(path);
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className='max-h-screen overflow-auto flex flex-col flex-1 md:px-6 px-4 md:py-0 py-5 md:pt-0 pt-16'>
        {/* Top Cards */}
        <div className='lg:h-1/5 py-5 lg:grid lg:grid-cols-3 lg:space-x-4 lg:space-y-0 lg:grid-rows-1 grid-cols-1 grid-rows-3 space-x-0 space-y-4'>
          {headCards.map((card) => (
            <div className='flex justify-between items-center bg-white rounded-xl border border-gray-200 shadow-md px-5 py-3.5'>
              <div className='flex-1'>
                <h1 className='font-poppins font-semibold text-base text-gray-500'>
                  {card.header}
                </h1>
                <div className='flex items-center mt-0.5 proportional-nums'>
                  <h2 className='text-2xl font-bold text-gray-800 mr-2.5'>
                    {card.amount}
                  </h2>
                  {card.percentage !== '0' ? (
                    <div className={card.badge.badgeClass}>
                      {card.badge.badgeIcon}
                      <h2 className='text-xs ml-0.5'>{card.percentage}</h2>
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
                  buttonText={'Add Expense'}
                  prompt={'No Expense found'}
                  emoji={
                    <Hi.HiOutlineExclamationCircle className='h-7 w-7 m-3 text-red-500' />
                  }
                />
              ) : (
                <>
                  {activeExpenseId ? (
                    <ExpenseEditingContainer
                      updateExpenseId={setActiveExpenseId}
                      expense={expenseData
                        .filter((expense) => expense.id === activeExpenseId)
                        .pop()}
                      sharedExpense={sharedExpenseFetcher.data}
                    />
                  ) : (
                    <ExpenseContainer>
                      <ExpenseContainer.Header
                        onChange={setSearchQuery}
                        setFilterSelection={setFilterSelection}
                      />
                      <ExpenseContainer.Body>
                        {expenseData &&
                          expenseData
                            .filter((obj) =>
                              obj.description
                                ?.toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            )
                            .map((item) => (
                              <>
                                <ExpenseContainer.Body.Item
                                  Description={item.description}
                                  Amount={item.amount}
                                  Date={moment(item.date).local().format('LL')}
                                  Time={moment(moment.utc(item.date))
                                    .local()
                                    .format('LT')}
                                  Type={
                                    item.shared === true || item.main_user_id
                                      ? 'shared'
                                      : 'self'
                                  }
                                  onClick={() => setActiveExpenseId(item.id)}
                                />
                              </>
                            ))}
                      </ExpenseContainer.Body>
                      <ExpenseContainer.Footer
                        TotalAmount={expenseTotalAmount}
                        TotalItems={expenseData.length}
                      />
                    </ExpenseContainer>
                  )}
                  {console.log(filterSelection)}
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
                Shared Transactions
              </h1>
              <div className='grid grid-cols-2 space-x-2.5 p-1 h-11 mb-2.5 bg-gray-100 rounded-xl w-full text-base font-semibold font-poppins sticky top-0'>
                <div className='bg-white flex justify-center items-center rounded-lg text-gray-700'>
                  <h2>Lending</h2>
                </div>
                <div className='flex justify-center items-center rounded-lg text-gray-300'>
                  <h2>Borrowing</h2>
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(() => (
                <div className='flex justify-between rounded-xl py-3 px-2.5 pl-5 hover:bg-gray-100 mb-0.5 cursor-pointer'>
                  <h5 className='text-sm text-gray-700 font-bold'>2020</h5>
                  <div className='text-sm flex items-center'>
                    <h5 className='text-gray-700 mr-2.5 font-bold'>₹1000.00</h5>
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
      <ToastPortal ref={toastRef} autoClose={true} />
      <ModalPortal ref={modalRef} />
    </>
  );
};
