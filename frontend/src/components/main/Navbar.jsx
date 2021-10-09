import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Hi from 'react-icons/hi';

export const Navbar = ({ url }) => {
  const [isOpen, setIsOpen] = useState(
    window.screen.width > 768 ? true : false
  );
  const iconClassName = 'h-6 w-6 m-auto';
  const links = [
    {
      name: 'Home',
      to: `${url}`,
      icon: <Hi.HiHome className={iconClassName} />,
    },
    {
      name: 'Friends',
      to: `${url}/friends`,
      icon: <Hi.HiSparkles className={iconClassName} />,
    },
    {
      name: 'Graph View',
      to: `${url}/graphs`,
      icon: <Hi.HiChartPie className={iconClassName} />,
    },
  ];

  return (
    <nav className='h-screen w-60 bg-white border border-gray-200'>
      <div className='w-full px-2.5 flex flex-col text-xl mt-5'>
        <NavLink
          exact
          to={`${url}/new`}
          className='w-full px-2 py-1 rounded-xl font-poppins font-semibold text-blue-600 mb-5'
          activeClassName='font-bold bg-blue-200 transition-all duration-150'>
          <div className='flex items-center'>
            <div className='bg-blue-200 rounded-full p-2 mr-4'>
              <Hi.HiPlus className={iconClassName} />
            </div>
            <h2>Add Entry</h2>
          </div>
        </NavLink>
        {links.map((link) => (
          <NavLink
            exact
            to={link.to}
            className='w-full px-2 py-1 rounded-xl font-poppins font-medium text-gray-500 mb-5'
            activeClassName='font-bold text-gray-700 bg-gray-100 transition-all duration-150'>
            <div className='flex items-center'>
              <div className='bg-gray-100 rounded-full p-2 mr-4'>
                {link.icon}
              </div>
              <h2>{link.name}</h2>
            </div>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
