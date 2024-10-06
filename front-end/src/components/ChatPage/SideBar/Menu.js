import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// const auth = getAuth();
const Menu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const { currentUser, method,login, logout } = useAuth();
  console.log(currentUser)
  const handleSignOut = async(e) => {
    e.preventDefault();
    toast('See you later :3')
    navigate('/');
    await logout();
    setIsOpen(false);
  }
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(()=>{
   console.log(currentUser)
  },[currentUser])
  console.log('method',method)
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={menuRef} className="w-full relative block text-left border border-green">
      <button
        onClick={toggleDropdown}
        className={`w-full bg-${!isOpen ? "dark" : "darker/60"} hover:bg-darker/50 text-white text-sm font-bold py-3 px-4 rounded`}
      >
        {currentUser?.displayName ? (currentUser.displayName):(currentUser?.email)}
      </button>
      {isOpen && (
        <div className="absolute bottom-12 left-0 border shadow-lg z-10 w-full border-green">
        { method == 'password' ?(

        <a className="block px-4 py-2 text-sm text-black bg-white hover:bg-light" onClick={()=>{navigate('/ChangePass')}}>
        Đổi mật khẩu
        </a>
            ):null
          }
           <a className="block px-4 py-2 text-sm text-black bg-white hover:bg-light" onClick={(e)=> handleSignOut(e)}>
            Log out
          </a>
         
        </div>
      )}
    </div>
  );
};

export default Menu;
