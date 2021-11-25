import React, { useState } from 'react';
import * as Hi from 'react-icons/hi';

export const Dropdown = ({
  title,
  items,
  setMembersCount,
  setMembers,
  multiselect = false,
  search = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggle = () => setIsOpen(!isOpen);

  const handleSelectItems = (item) => {
    let data;
    if (!selected.some((current) => current.friend_id === item.friend_id)) {
      if (!multiselect) {
        data = [item];
        setSelected(data);
        setMembers(data);
      } else {
        data = [...selected, item];
        setSelected(data);
        setMembers(data);
      }
    } else {
      let selectedItemsUnselected = selected;
      selectedItemsUnselected = selectedItemsUnselected.filter(
        (current) => current.friend_id !== item.friend_id
      );
      data = [...selectedItemsUnselected];
      setSelected(data);
      setMembers(data);
    }
  };

  const checkSelectedItem = (item) => {
    if (selected.some((current) => current.friend_id === item.friend_id))
      return true;
    else return false;
  };

  return (
    <div
      className={
        isOpen
          ? 'relative bg-white text-blue-600'
          : 'relative text-gray-600 bg-white'
      }
      onClick={() => toggle()}>
      <label className='relative text-xs font-semibold px-1 left-2.5 top-3 bg-white text-current'>
        {title}
      </label>
      <div
        name='membersCount'
        className={
          isOpen
            ? 'flex justify-between items-center w-full border-2 px-3 py-3 text-sm font-semibold bg-white rounded-lg focus:outline-none border-blue-600 text-gray-900'
            : 'flex justify-between items-center w-full border-2 px-3 py-3 text-sm font-semibold bg-white rounded-lg focus:outline-none border-gray-300 text-gray-900'
        }>
        {selected.length + 1}
        {setMembersCount(selected.length + 1)}
        {isOpen ? (
          <Hi.HiChevronUp className='h-5 w-5 text-blue-600' />
        ) : (
          <Hi.HiChevronDown className='h-5 w-5 text-gray-400' />
        )}
      </div>
      {isOpen && (
        <ul className='absolute w-full shadow-lg rounded-lg p-2 text-sm mt-2 border-2 border-gray-200 h-40 overflow-auto bg-white'>
          <li className='mb-1'>
            <button
              className='cursor-not-allowed opacity-50 bg-gray-200 w-full text-left text-gray-600 px-3 py-2 rounded-lg'
              disabled>
              <span className='font-semibold'>Self</span>
            </button>
          </li>
          {items.map((item) => (
            <li key={item.friend_id} className='mb-1'>
              <button
                onClick={() => handleSelectItems(item)}
                className={
                  checkSelectedItem(item)
                    ? 'bg-blue-100 w-full text-left text-blue-600 px-3 py-2 rounded-lg'
                    : 'w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600'
                }>
                <span className='font-semibold'>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
