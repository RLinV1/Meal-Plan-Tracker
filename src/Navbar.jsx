import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { openAddModal } from "./redux/addItemModalSlice";
import { useDispatch } from "react-redux";
import Logo from "./assets/logo.png";
import { openMealsModal } from "./redux/calculateMealsModalSlice";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleAuthStateChange = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        // console.log("User Info: ", user);
        // console.log("User Name: ", user.displayName);
        // console.log("User Email: ", user.email);
        // console.log("User Photo URL: ", user.photoURL); // User profile picture
        setUserPhoto(user.photoURL);
      } else {
        // User is signed out
        console.log("No user is signed in");
      }
    });
  };
  useEffect(() => {
    handleAuthStateChange();
  }, []);
  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful");
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Sign-out error", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Check if the current path is the sign-in page
  const isSignInPage = location.pathname === "/";
  const isForgotPasswordPage = location.pathname === "/forgot";
  return (
    <nav className={`bg-white border-gray-200 dark:bg-[#121530] w-screen`}>
      <div
        className={`max-w-screen-xl flex flex-wrap items-center mx-auto p-4 ${
          isSignInPage || isForgotPasswordPage
            ? "justify-center"
            : "justify-between"
        }`}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={Logo} className="h-12 w-12" alt="Meal Plan Tracker Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Meal Plan Tracker
          </span>
        </div>
        <button
          onClick={toggleMobileMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`w-full md:w-auto ${
            isMobileMenuOpen ? "block" : "hidden"
          } ${isSignInPage || isForgotPasswordPage ? "hidden" : "md:block"}`}
          id="navbar-default"
        >
          <ul className="font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-900 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <div
                onClick={() => {
                  dispatch(openAddModal());
                }}
                className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0 dark:text-white hover:text-[#747bff] cursor-pointer"
              >
                Add Item
              </div>
            </li>
            <li>
              <div
                onClick={() => {
                  dispatch(openMealsModal());
                }}
                className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0 dark:text-white hover:text-[#747bff] cursor-pointer"
              >
                Meal Calculator
              </div>
            </li>
            {!isSignInPage && (
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent bg-transparent"
                  aria-expanded={isDropdownOpen}
                >
                  {userPhoto != null ? (
                    <img
                      src={userPhoto}
                      alt={userPhoto ? "User Photo" : "Account"}
                      className="h-8 w-8 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    "Account"
                  )}

                  <svg
                    className="w-2.5 h-2.5 ms-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div
                  className={`mt-[0.4rem] absolute top-full left-1/2 transform -translate-x-1/2 ${
                    isDropdownOpen ? "" : "hidden"
                  } ${
                    isMobileMenuOpen ? "mt-0 w-full relative" : ""
                  } font-normal divide-y rounded-lg shadow w-44`}
                  id="dropdownNavbar"
                >
                  <div className="pt-1">
                    <button
                      onClick={handleSignOut}
                      className="bg-gray-800 block w-full h-12 px-4 py-2 text-sm text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white text-left"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
