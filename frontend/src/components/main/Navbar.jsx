import React from 'react';
import { NavLink } from 'react-router-dom';
import * as Hi from 'react-icons/hi';

export const Navbar = ({ url, isOpen, toggle }) => {
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
    <>
      {/* Mobile Menu */}
      <nav className='bg-gray-800 p-3 transition duration-200 ease-in-out md:hidden'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-semibold text-white font-mono'>
            Budgeter
          </h1>
          <button className='hover:bg-gray-900 rounded-full' onClick={toggle}>
            <Hi.HiMenu className='h-6 w-6 m-2 text-white' />
          </button>
        </div>
      </nav>

      {/* Desktop Menu */}
      <nav
        className={
          isOpen && window.innerWidth <= 768
            ? 'inset-y-0 left-0 w-60 flex flex-col bg-white border border-gray-200 absolute transform -translate-x-0 md:relative md:-translate-x-0 transition duration-200 ease-in-out z-40'
            : 'inset-y-0 left-0 w-60 flex flex-col bg-white border border-gray-200 absolute transform -translate-x-full md:relative md:-translate-x-0 transition duration-200 ease-in-out z-40'
        }>
        <div className='w-full px-2.5 flex flex-col text-xl mt-5 flex-1'>
          <NavLink
            exact
            to={`${url}/new`}
            onClick={toggle}
            className='w-full px-2 py-1 rounded-xl font-poppins font-semibold text-blue-600 mb-5 hover:bg-blue-200'
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
              onClick={toggle}
              className='w-full px-2 py-1 rounded-xl font-poppins font-medium text-gray-500 mb-5 hover:bg-gray-100'
              activeClassName='font-bold text-gray-700 bg-gray-100 transition-all duration-150'>
              <div className='flex items-center'>
                <div className='bg-gray-100 rounded-full p-2 mr-4'>
                  {link.icon}
                </div>
                <h2>{link.name}</h2>
              </div>
            </NavLink>
          ))}
          <NavLink
            exact
            to={`${url}/settings`}
            onClick={toggle}
            className='w-full px-2 py-1 rounded-xl font-poppins font-medium text-gray-500 mb-5 mt-auto hover:bg-gray-100'
            activeClassName='font-bold text-gray-700 bg-gray-100 transition-all duration-150'>
            <div className='flex items-center'>
              <div className='bg-gray-100 rounded-full p-2 mr-4'>
                <Hi.HiCog className={iconClassName} />
              </div>
              <h2>Settings</h2>
            </div>
          </NavLink>
        </div>
        <div className='w-full flex flex-col items-center py-5 border-t border-gray-200'>
          <h2 className='font-mono font-semibold text-xl text-gray-700'>
            Budgeter
          </h2>
          <p className='text-xs text-gray-400'>Copyright &#169; 2021</p>
        </div>
      </nav>
    </>
  );
};
