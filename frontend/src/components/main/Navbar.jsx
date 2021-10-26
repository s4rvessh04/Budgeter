import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Hi from 'react-icons/hi';
import { UserContext } from 'context';

export const Navbar = ({ url, isOpen, toggle, type }) => {
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [, , , , logout] = useContext(UserContext);

  const iconClassName = 'h-6 w-6 m-auto';

  const userLinks = [
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

  const settingsLinks = [
    {
      name: 'Profile',
      to: `${url}/profile`,
      icon: <Hi.HiUser className={iconClassName} />,
    },
    {
      name: 'Account',
      to: `${url}/account`,
      icon: <Hi.HiIdentification className={iconClassName} />,
    },
    {
      name: 'Security',
      to: `${url}/security`,
      icon: <Hi.HiKey className={iconClassName} />,
    },
  ];

  useEffect(() => {
    switch (type) {
      case 'settings':
        setNavLinks(settingsLinks);
        break;
      default:
        setNavLinks(userLinks);
    }
  }, [type]);

  const handleSettingsDropdown = () => setSettingsDropdown(!settingsDropdown);

  return (
    <>
      {/* Mobile Menu */}
      <nav className='bg-gray-800 p-3 transition duration-200 ease-in-out md:hidden fixed top-0 w-full z-20'>
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
          {type === 'main' ? (
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
          ) : type === 'settings' ? (
            <NavLink
              exact
              to='/user'
              onClick={toggle}
              className='w-full px-2 py-1 rounded-xl font-poppins font-semibold text-gray-500 mb-5 hover:bg-gray-100'
              activeClassName='font-bold bg-gray-100 transition-all duration-150'>
              <div className='flex items-center'>
                <div className='bg-gray-100 rounded-full p-2 mr-4'>
                  <Hi.HiArrowSmLeft className={iconClassName} />
                </div>
                <h2>Back to Home</h2>
              </div>
            </NavLink>
          ) : (
            ''
          )}

          {navLinks.map((link) => (
            <NavLink
              exact
              to={link.to}
              onClick={toggle}
              className='w-full px-2 py-1 rounded-xl font-poppins font-semibold text-gray-500 mb-5 hover:bg-gray-100'
              activeClassName='font-bold text-gray-700 bg-gray-100 transition-all duration-150'>
              <div className='flex items-center'>
                <div className='bg-gray-100 rounded-full p-2 mr-4'>
                  {link.icon}
                </div>
                <h2>{link.name}</h2>
              </div>
            </NavLink>
          ))}

          {type === 'main' ? (
            <button
              onClick={() => handleSettingsDropdown()}
              className={
                settingsDropdown
                  ? 'w-full px-2 py-1 rounded-xl font-poppins mb-5 mt-auto hover:bg-gray-100 transition-all duration-150 font-bold text-gray-700 bg-gray-100'
                  : 'w-full px-2 py-1 rounded-xl font-poppins font-semibold text-gray-500 mb-5 mt-auto hover:bg-gray-100 transition-all duration-150'
              }>
              <div className='flex items-center'>
                <div className='bg-gray-100 rounded-full p-2 mr-4'>
                  <Hi.HiCog className={iconClassName} />
                </div>
                <h2>Settings</h2>
              </div>
            </button>
          ) : type === 'settings' ? (
            <button
              onClick={() => logout()}
              className='w-full px-2 py-1 rounded-xl font-poppins font-semibold text-red-500 mt-auto mb-5 hover:bg-red-100 focus:ring-2 ring-inset ring-red-200 transition-all duration-150'>
              <div className='flex items-center'>
                <div className='bg-red-100 rounded-full p-2 mr-4'>
                  <Hi.HiLogout className={iconClassName} />
                </div>
                <h2>Logout</h2>
              </div>
            </button>
          ) : (
            ''
          )}
          {settingsDropdown ? (
            <div className='absolute left-64 bottom-20 shadow-md border border-gray-200 w-56 bg-white flex flex-col rounded-xl p-2 font-poppins font-semibold transition-all duration-150'>
              <NavLink
                exact
                to={`/settings`}
                onClick={toggle && handleSettingsDropdown}
                className='px-2 py-1.5 rounded-xl font-poppins font-semibold text-gray-500 mb-2 mt-auto hover:bg-gray-100 transition-all duration-150'
                activeClassName='font-bold text-gray-700 bg-gray-100'>
                <div className='flex items-center'>
                  <div className='bg-gray-100 rounded-full p-2 mr-3'>
                    <Hi.HiCog className='h-6 w-6 m-auto' />
                  </div>
                  <h2>User Settings</h2>
                </div>
              </NavLink>
              <button
                onClick={() => logout()}
                className='w-full px-2 py-1 rounded-xl font-poppins font-semibold text-red-500 mt-auto hover:bg-red-100 focus:ring-2 ring-inset ring-red-200 transition-all duration-150'>
                <div className='flex items-center'>
                  <div className='bg-red-100 rounded-full p-2 mr-3'>
                    <Hi.HiLogout className='h-5 w-5 m-auto' />
                  </div>
                  <h2>Logout</h2>
                </div>
              </button>
            </div>
          ) : (
            <></>
          )}
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
