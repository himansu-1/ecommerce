// src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSelectors';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'merchant':
        return '/merchant-dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <>
      <nav className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* <!-- Mobile menu button--> */}
              <button type="button" command="--toggle" commandfor="mobile-menu" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true" className="size-6 in-aria-expanded:hidden">
                  <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true" className="size-6 not-in-aria-expanded:hidden">
                  <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                {/* <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="h-8 w-auto" /> */}
                <Link to="/" className="navbar-logo">
                  🛍️ MyShop
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                {/* <div className="flex space-x-4">
                  <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Team</Link>
                  <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Projects</Link>
                  <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Calendar</Link>
                </div> */}
                <div className="flex space-x-4">
                  {user?.role === 'merchant' && (
                    <>
                      <Link to={getDashboardLink()} className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                        Dashboard
                      </Link>
                      <Link to="/merchant/products" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                        Products
                      </Link>
                    </>
                  )}

                  {user?.role === 'admin' && (
                    <>
                      <Link to={getDashboardLink()} className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                        Dashboard
                      </Link>
                      <Link to="/admin/products" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                        Products
                      </Link>
                      <Link to="/admin/merchants" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                        Merchants
                      </Link>
                      <Link to="/admin/users" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                        Users
                      </Link>
                    </>
                  )}
                </div>

              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

              <el-dropdown className="relative ml-3">
                {!user ? (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden">Login</Link>
                    <Link to="/register" className="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden">Register</Link>
                  </>
                ) : (
                  <>
                    {/* <Link to={getDashboardLink()} className="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden">Dashboard</Link> */}
                    <button className="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                )}
              </el-dropdown>
            </div>
          </div>
        </div>

        <el-disclosure id="mobile-menu" hidden className="block sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <a href="#" aria-current="page" className="block rounded-md bg-gray-950/50 px-3 py-2 text-base font-medium text-white">Dashboard</a>
            <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Team</a>
            <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Projects</a>
            <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Calendar</a>
          </div>
        </el-disclosure>
      </nav>
    </>
  );
};

export default Navbar;
