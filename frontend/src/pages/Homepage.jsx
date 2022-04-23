import { Helmet } from 'react-helmet';
import { Link, NavLink } from 'react-router-dom';
import * as Fa from 'react-icons/fa';

import Hero from 'static/Hero.jpeg';

export const Homepage = () => {
  return (
    <>
      <Helmet>
        <title>Budgeter: A simple solution to all your complex expenses</title>
      </Helmet>
      <div className='min-h-screen lg:px-28 md:px-12 px-4 text-gray-800 bg-gradient-to-br from-purple-100 via-red-100 to-pink-100'>
        <div className='flex flex-col lg:min-h-screen'>
          <nav className='flex justify-between h-20 items-center'>
            <NavLink
              to='/'
              className='font-mono font-semibold lg:text-lg text-base'>
              Budgeter
            </NavLink>
            <div className='lg:text-base md:text-sm text-xs'>
              <NavLink
                to='/signup'
                className='py-2.5 md:px-5 px-3 font-semibold rounded-lg lg:mr-5 mr-2.5 hover:opacity-80 transition-all duration-150'>
                Sign up
              </NavLink>
              <NavLink
                to='/login'
                className='py-2.5 md:px-5 px-4 md:font-semibold rounded-lg bg-gradient-to-b from-green-600 to-green-500 text-white hover:opacity-80 focus:ring-2 ring-offset-2 ring-green-600 transition-all duration-150'>
                Log in
              </NavLink>
            </div>
          </nav>
          <main className='flex-1 flex-shrink-0'>
            <div className='grid lg:grid-cols-2 lg:space-x-5'>
              <div className='font-poppins lg:pr-10 lg:mt-28 mt-12 md:text-left text-center'>
                <h1
                  className='font-bold lg:text-7xl md:text-5xl text-3xl'
                  style={{ lineHeight: '123%' }}>
                  Budgeting made simple
                </h1>
                <h3 className='lg:text-2xl md:text-lg text-base font-medium text-gray-500 lg:mt-5 mt-2.5'>
                  A simple solution to all your complex expenses.
                </h3>
                <Link to='/signup'>
                  <button className='border-2 bg-gradient-to-b from-blue-600 to-blue-500 text-white font-semibold md:text-lg text-base rounded-xl lg:px-8 px-4 lg:py-3 py-2 md:mt-7 mt-5 md:w-auto w-full focus:ring-2 ring-blue-600 ring-offset-1 transition-all duration-150 bg-transparent'>
                    Create Account
                  </button>
                </Link>
              </div>
              <div className='lg:mt-28 mt-14 lg:mb-0 mb-20'>
                <img
                  src={Hero}
                  alt='Hero'
                  draggable={false}
                  className='rounded-lg shadow-xl object-cover'
                />
              </div>
            </div>
          </main>
        </div>
        <footer className='flex items-center justify-between h-20'>
          <h3 className='font-mono font-semibold lg:text-lg md:text-base text-xs'>
            Made with <span className='text-red-600 animate-pulse'>❤</span> by{' '}
            <Link
              className='underline text-blue-600'
              to={{ pathname: 'https://twitter.com/sarveshrane2000' }}
              target='_blank'>
              @sarveshrane2000
            </Link>
          </h3>
          <Link
            to={{ pathname: 'https://github.com/sarveshrane2000' }}
            target='_blank'>
            <Fa.FaGithub className='lg:h-6 lg:w-6 md:w-5 md:h-5 h-3.5 w-3.5' />
          </Link>
        </footer>
      </div>
    </>
  );
};
