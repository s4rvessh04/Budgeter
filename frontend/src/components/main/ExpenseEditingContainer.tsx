import React, { useEffect, useState } from 'react';
import moment from 'moment';
import * as Hi from 'react-icons/hi';
import { FaHandshake } from 'react-icons/fa';

import { Dropdown, InputBox } from 'components';
import { useFetcher } from 'hooks';
import { handleApiUrl } from 'shared';

interface SharedExpenseData {
  id: number;
  date: string;
  amount: number;
  description: string;
  expense_id: number;
  main_user_id: number;
  member_id: number;
  tag_id: number | null;
  [key: string]: any;
}

type User = {
  name: string;
  username: string;
  email: string;
};

type Props = {
  updateExpenseId: Function;
  expense: SharedExpenseData;
};

type Friend = {
  name: string;
  username: string;
  email: string;
  friend_id: number;
  request_status: boolean;
};

export const ExpenseEditingContainer: React.FC<Props> = ({
  updateExpenseId,
  expense,
}) => {
  const [sharedExpenseAmount, setSharedExpenseAmount] = useState<number>(0);
  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [mainUserId, setMainUserId] = useState<number | null>(null);
  const [mainUser, setMainUser] = useState<User | null>(null);
  const isSelfExpense = 'shared_expenses' in expense;

  const fetchMainUserOfExpense = useFetcher({
    url: handleApiUrl(`/friends/?friend_id=${mainUserId}`),
  });

  const fetchUserFriends = useFetcher({
    url: handleApiUrl(`/friends/`),
  });

  useEffect(() => {
    setMainUserId(expense.main_user_id);
    if (expense.shared) {
      const sum: number = expense.shared_expenses.reduce(
        (exp1: SharedExpenseData, exp2: SharedExpenseData) =>
          exp1.amount + exp2.amount
      );
      setSharedExpenseAmount(sum);
      setFriends(fetchUserFriends.data);
    } else {
      if (mainUserId && !fetchMainUserOfExpense.isLoading)
        setMainUser(fetchMainUserOfExpense.data[0]);
    }
  }, [
    expense,
    mainUserId,
    fetchMainUserOfExpense.data,
    fetchUserFriends.data,
    fetchUserFriends.isLoading,
    fetchMainUserOfExpense.isLoading,
  ]);

  return (
    <div className='flex flex-col flex-1 overflow-y-hidden'>
      <div className='font-poppins font-semibold text-sm flex justify-between py-3.5 px-2.5 border-b border-gray-200 bg-white sticky top-0 z-20'>
        <button
          className='py-2 px-5 rounded-full font-semibold text-gray-600 bg-gray-100 flex items-center hover:bg-gray-200 focus:ring-2 ring-gray-400 ring-inset transition-all duration-200'
          onClick={() => updateExpenseId(null)}>
          <Hi.HiArrowLeft className='h-4 w-4 text-current mr-2.5' />
          Back to expenses
        </button>
        {expense.shared || isSelfExpense ? (
          <div className='space-x-2.5 flex items-center'>
            <button className='py-2 px-5 rounded-full font-semibold text-white bg-green-600 flex items-center'>
              <Hi.HiCheck className='h-4 w-4 text-current mr-1' />
              Save
            </button>
            <button className='py-2 px-5 rounded-full font-semibold text-red-600 bg-red-100 flex items-center'>
              <Hi.HiTrash className='h-4 w-4 text-current mr-1' />
              Delete
            </button>
          </div>
        ) : (
          <div className='py-2 px-5 rounded-full font-semibold text-yellow-600 bg-yellow-100 flex items-center'>
            <Hi.HiExclamation className='h-4 w-4 text-current mr-1' />
            Read Only
          </div>
        )}
      </div>
      <div className='xl:p-5 py-4 pl-4 pr-2 flex flex-col flex-1 overflow-y-scroll'>
        {/* Shared Expense Content */}
        <div className='grid grid-cols-5 space-x-5'>
          <div className='col-span-3'>
            <div className='font-semibold flex flex-col space-y-0.5'>
              <span className='font-bold text-gray-700 text-base'>
                {moment(expense.date).local().format('LL')}
              </span>
              <span className='text-gray-400 text-sm'>
                {moment(moment.utc(expense.date)).local().format('LT')}
              </span>
            </div>
            <span className='flex items-center space-y-2.5 text-purple-600 font-semibold text-xs bg-purple-100 rounded-full w-max py-1 px-3 mt-2.5'>
              <Hi.HiUsers className='mr-1 h-3 w-3' /> Shared
            </span>
          </div>
          <div className='col-span-2 z-10'>
            <Dropdown
              title='Tag'
              items={[]}
              setMembers={null}
              setMembersCount={() => ''}
            />
          </div>
        </div>
        <div className='grid grid-cols-5 space-x-5 mt-0.5'>
          <div className='col-span-3'>
            <InputBox
              labelClassName={''}
              inputClassName={
                expense.shared || isSelfExpense ? '' : 'cursor-not-allowed'
              }
              type='text'
              name='Description'
              value={null}
              placeholder={expense.description}
              labelName='Description'
              onChange={null}
              required={false}
              disabled={expense.shared || isSelfExpense ? false : true}
            />
          </div>
          <div className='col-span-2'>
            <InputBox
              labelClassName={''}
              inputClassName={
                expense.shared || isSelfExpense ? '' : 'cursor-not-allowed'
              }
              type='number'
              name='Amount'
              value={null}
              placeholder={expense.amount}
              labelName='Amount'
              onChange={null}
              required={false}
              disabled={expense.shared || isSelfExpense ? false : true}
            />
          </div>
        </div>
        {expense.shared ? (
          <div className='border-gray-300 rounded-lg xl:mt-5 mt-4 border flex flex-col flex-1'>
            <div className='border-b border-gray-300 p-2.5 flex'>
              <h4 className='font-poppins font-semibold text-lg xl:text-center flex-1 text-gray-700'>
                Members Included
              </h4>
              <button className='flex items-center font-poppins font-semibold text-xs text-blue-600 bg-blue-100 rounded-full py-1.5 px-3'>
                <Hi.HiPlus className='mr-1' />
                Add member
              </button>
            </div>
            <div className='p-2.5 pr-0 flex-1 overflow-y-scroll'>
              <ul className='font-semibold text-sm'>
                <li className='mb-1 bg-gray-100 px-3 py-2 rounded-lg flex items-center justify-between'>
                  <span>Self</span>{' '}
                  <span>{expense.amount - sharedExpenseAmount}</span>
                </li>
                {expense.shared_expenses.map(
                  (shared_expense: SharedExpenseData) => (
                    <li className='mb-1 hover:bg-gray-100 px-3 py-2 rounded-lg flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <button className='bg-red-100 text-red-600 p-1.5 rounded-full'>
                          <Hi.HiTrash className='h-5 w-5' />
                        </button>
                        <span>
                          {
                            friends.find(
                              (user) =>
                                user.friend_id === shared_expense.member_id
                            )?.name
                          }
                        </span>
                      </div>
                      <span>{shared_expense.amount}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        ) : !isSelfExpense ? (
          <div className='select-none flex items-center border-2 border-dashed rounded-lg border-purple-500 bg-purple-100 font-poppins font-semibold text-sm text-purple-600 py-3 px-2 mt-5 justify-center space-x-1'>
            <FaHandshake className='h-5 w-5 text-current mr-2.5' /> Expense is
            shared with:
            <span className='font-bold'>{mainUser && mainUser.name}</span>
          </div>
        ) : (
          ''
        )}
      </div>
      {/* Self Expense Content */}
    </div>
  );
};
