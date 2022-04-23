import React, { useContext, useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet';
import * as Hi from 'react-icons/hi';

import { useFetcher, useSubmit } from 'hooks';
import { UserContext } from 'context';
import { handleApiUrl } from 'shared';
import { ToastPortal, InputBox, Dropdown } from 'components';

type MembersAndAmount = {
  [key: string]: number;
};

type SharedExpense = {
  members_and_amount: MembersAndAmount;
  description: string;
  tag_id: number;
};

type Form = {
  description: string;
  amount: number;
  tag_id: number;
  shared: boolean;
  shared_expense: SharedExpense | null;
};

type ToastRef = {
  addMessage: (args: Object) => void;
};

export const NewExpense: React.FC = () => {
  const toastRef = useRef<ToastRef>(null);
  const [, setErrorMessage] = useState('');
  const [, , isAuthenticated] = useContext(UserContext);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [members, setMembers] = useState<Array<string>>([]);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [tagId, setTagId] = useState<number | null>(null);
  const [shared, setShared] = useState<boolean>(false);
  const [formData, setFormData] = useState<Form | Object | any>({});

  const friendsList = useFetcher({
    url: handleApiUrl('/friends/'),
  });

  const { submitRequest } = useSubmit({
    url: handleApiUrl('/expenses/'),
    method: 'POST',
    body: formData,
  });

  const addToast = (
    mainMessage: string,
    subMessage: string,
    icon: React.ReactElement
  ) => {
    toastRef.current?.addMessage({
      mainMessage: mainMessage,
      subMessage: subMessage,
      icon: icon,
    });
  };

  const submitForm = async () => {
    const { response, data } = await submitRequest();
    console.log(response, data);
    if (!response.ok) {
      const message = data.detail;
      setErrorMessage(message);
      addToast(
        'Something went wrong',
        message,
        <Hi.HiOutlineExclamationCircle className='flex-shrink-0 h-6 w-6 mr-3 text-red-500' />
      );
    } else if (response.ok) {
      addToast(
        'added successful',
        'extra message',
        <Hi.HiOutlineCheckCircle className='flex-shrink-0 h-6 w-6 mr-3 text-green-400' />
      );
    }
  };

  const handleDescription = (e: any) => {
    setDescription(e.target.value);
  };

  const handleAmount = (e: any) => {
    setAmount(e.target.value);
  };

  const handleTag = (e: any) => {
    setTagId(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    submitForm();
  };

  useEffect(() => {
    let members_and_amount: MembersAndAmount = {};
    let isShared: boolean = members.length >= 1 ? true : false;
    members.forEach(
      (member: any) =>
        (members_and_amount[member.friend_id] = amount / membersCount)
    );

    setShared(isShared);

    let sharedExpenseData = {
      members_and_amount: members_and_amount,
      description: description,
      tag_id: tagId,
    };

    setFormData({
      description: description,
      amount: amount,
      tag_id: tagId,
      shared: shared,
      shared_expense: shared ? sharedExpenseData : null,
    });
  }, [members, shared, amount, tagId, membersCount, description]);

  return (
    <>
      {!isAuthenticated ? (
        <Redirect push to='/login' />
      ) : (
        <>
          <Helmet>
            <title>New-Expense</title>
          </Helmet>
          <form
            action='POST'
            onSubmit={handleSubmit}
            className='flex flex-col flex-1 items-center max-h-screen overflow-auto md:px-6 md:py-0 px-4 py-5 pt-16'>
            <div className='lg:w-1/2 w-full px-5 py-2.5 mb-8 mt-5 rounded-xl shadow-lg bg-white border border-gray-200'>
              <h1 className='mb-3.5 font-poppins font-semibold text-2xl text-gray-500'>
                Expense Details
              </h1>
              <InputBox
                type='text'
                name='description'
                labelName='Description'
                onChange={handleDescription}
                inputClassName='mb-4'
                required={true}
              />
              <InputBox
                type='text'
                name='tag'
                labelName='Tag'
                onChange={handleTag}
                inputClassName='mb-4'
                required={false}
              />
            </div>
            <div className='lg:w-1/2 w-full px-5 py-2.5 mb-8 rounded-xl shadow-lg bg-white border border-gray-200'>
              <h1 className='mb-3.5 font-poppins font-semibold text-2xl text-gray-500'>
                Amount Details
              </h1>
              <InputBox
                type='text'
                name='amount'
                labelName='Amount'
                onChange={handleAmount}
                inputClassName='mb-4'
                required={true}
              />
              <Dropdown
                title='Member(s)'
                items={!friendsList.isLoading ? friendsList.data : null}
                setMembersCount={setMembersCount}
                setMembers={setMembers}
                multiselect={true}
              />
              <button className='border p-2 mb-2.5 mt-3 font-semibold text-sm rounded-md text-gray-500 hover:border-gray-500 ring-inset focus:ring-2 ring-gray-500 transition-all duration-200'>
                Custom Split
              </button>
            </div>
            <div className='lg:w-1/2 w-full px-5 py-2.5 lg:mb-0 mb-5 flex justify-between rounded-xl shadow-lg bg-white border-2 border-blue-600'>
              <div>
                <h1 className='font-poppins font-semibold text-2xl text-gray-900'>
                  Final Amount
                </h1>
                <h5 className='mb-1.5 text-xs font-semibold text-gray-400'>
                  ₹{amount || 0} / {membersCount}
                </h5>
                <h3 className='mb-2.5 text-xl font-bold text-gray-600'>
                  ₹{(amount || 0) / membersCount}{' '}
                  {membersCount > 1 ? (
                    <small className='font-semibold text-current'>each</small>
                  ) : (
                    ''
                  )}
                </h3>
              </div>
              <div className='self-center'>
                <button className='px-8 py-2 flex items-center rounded-lg font-poppins font-bold text-white bg-gradient-to-b from-blue-600 to-blue-500 hover:opacity-90 focus:ring-2 focus:ring-blue-600 ring-offset-1 transition-all duration-150'>
                  Confirm <Hi.HiCheck className='h-5 w-5 ml-1' />
                </button>
              </div>
            </div>
          </form>
          <ToastPortal autoClose={true} ref={toastRef} />
        </>
      )}
    </>
  );
};
