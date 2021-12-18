import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as Fa from 'react-icons/fa';

export const ErrorPage = () => {
  return (
    <div className='min-h-screen lg:px-28 md:px-12 px-4 text-gray-800 bg-gradient-to-br from-red-100 via-pink-100 to-purple-100'>
      <div className='flex flex-col min-h-screen'>
        <nav className='flex justify-between h-20 items-center'>
          <NavLink
            to='/'
            className='font-mono font-semibold lg:text-lg text-base'>
            Budgeter
          </NavLink>
          <div className='lg:text-base md:text-sm text-xs'>
            <NavLink
              to='/signup'
              className='py-1.5 md:px-5 px-3 font-semibold md:rounded-lg rounded-md lg:mr-5 mr-2.5 hover:opacity-80 transition-all duration-150'>
              Sign up
            </NavLink>
            <NavLink
              to='/login'
              className='py-1.5 md:px-5 px-4 md:font-semibold rounded-md bg-green-600 text-white hover:opacity-80 focus:ring-2 ring-offset-2 ring-green-500 transition-all duration-150'>
              Log in
            </NavLink>
          </div>
        </nav>
        <main className='flex flex-col flex-1 flex-shrink-0 lg:justify-center items-center font-poppins lg:mt-0 mt-28'>
          <h1 className='font-bold lg:text-7xl md:text-5xl text-3xl'>
            ErrorCode: 404
          </h1>
          <h3 className='lg:text-2xl md:text-lg text-sm font-medium text-gray-500 lg:mt-5 mt-2.5'>
            The page you are looking for does not exist.
          </h3>
        </main>
      </div>
      <footer className='flex items-center justify-between h-20'>
        <h3 className='font-mono font-semibold lg:text-lg md:text-base text-xs'>
          Made with <span className='text-red-500'>❤</span> by Sarvesh
        </h3>
        <Link
          to={{ pathname: 'https://github.com/targusrock' }}
          target='_blank'>
          <Fa.FaGithub className='lg:h-6 lg:w-6 md:w-5 md:h-5 h-3.5 w-3.5' />
        </Link>
      </footer>
    </div>
  );
};
