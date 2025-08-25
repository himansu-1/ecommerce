// src/components/Navbar.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSelectors";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin-dashboard";
      case "merchant":
        return "/merchant-dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <>
      <nav className="relative bg-gray-600/80 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* <!-- Mobile menu button--> */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  data-slot="icon"
                  aria-hidden="true"
                  className="size-6 in-aria-expanded:hidden"
                >
                  <path
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  data-slot="icon"
                  aria-hidden="true"
                  className="size-6 not-in-aria-expanded:hidden"
                >
                  <path
                    d="M6 18 18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                {/* <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="h-8 w-auto" /> */}
                <Link to="/" className="text-white text-lg font-bold">
                  🛍️ MyShop
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {user?.role === "merchant" && (
                    <>
                      <Link
                        to={getDashboardLink()}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Product List
                      </Link>
                      <Link
                        to="/merchant/products"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Create Products
                      </Link>
                    </>
                  )}

                  {user?.role === "admin" && (
                    <>
                      <Link
                        to={getDashboardLink()}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/products"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Products
                      </Link>
                      <Link
                        to="/admin/merchants"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Merchants
                      </Link>
                      <Link
                        to="/admin/users"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Users
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3 flex gap-2">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-menu" className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {user?.role === "merchant" && (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="block rounded-md px-3 py-2 text-base font-medium text-white bg-gray-700"
                  >
                    Product List
                  </Link>
                  <Link
                    to="/merchant/products"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Create Products
                  </Link>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="block rounded-md px-3 py-2 text-base font-medium text-white bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/products"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/merchants"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Merchants
                  </Link>
                  <Link
                    to="/admin/users"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Users
                  </Link>
                </>
              )}

              {!user && (
                <>
                  <Link
                    to="/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Register
                  </Link>
                </>
              )}

              {user && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
