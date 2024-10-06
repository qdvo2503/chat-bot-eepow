import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from "../../AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ChangePass = () => {
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState(null);

  const handleInputChange = (key, value) => {
    console.log(key,value)
    if(value){
      setErrors((prevErrors) => ({
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
        account: null
      }));
    } 
    switch (key) {
      case 'oldPassword':
        setOldPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validateField = (field,value, errorMessage) => {
      console.log('value',value)
      if (!value) {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
        return false;
      }
      return true;
    };

    if (!validateField('oldPassword',oldPassword, 'This field cannot be empty') ||
        !validateField('newPassword', newPassword,'This field cannot be empty') ||
        !validateField('confirmPassword', confirmPassword,'This field cannot be empty')) {
      setConfirmPassword('')
      setOldPassword('')
      setNewPassword('')
      return;
    }
    console.log(newPassword,confirmPassword)
    if (newPassword !== confirmPassword) {
      setConfirmPassword('');
      setNewPassword('')
      setOldPassword('')
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: 'Password does not match' }));
      return;
    }
    console.log(oldPassword)
    const res = await changePassword(oldPassword, newPassword);
    console.log(res)
    if (!res?.error) {
      setErrors((prevErrors) => ({ ...prevErrors, ReAuth: 'Password is not correct' }));
      setOldPassword(null);
      setConfirmPassword(null);
      setNewPassword(null);
      toast('Change password succesfully!')
      navigate("/Chat");
    }else{
      setErrors((prevErrors) => ({ ...prevErrors, ReAuth: res.error }));
      return
    }
  };
  const handleBack = (e)=>{
    e.preventDefault();
    navigate('/Chat')
  }
  return (
    <div className="LoginForm">
      <div className="flex flex-col bg-light shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Change password</div>
        <div className="mt-8">
        <div className='text-red-700 text-xs'>{errors?.ReAuth}</div>
          <form>
            {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <div key={field} className="flex flex-col mb-6">
                <label htmlFor={field} className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 text-left">
                  {field === 'oldPassword' ? 'Password:' : field === 'newPassword' ? 'New password:' : 'Confirm new password:'}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <span>
                      <svg className="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </div>
                  <input
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    id={field}
                    type="password"
                    name={field}
                    value={field==='oldPassword' ?  oldPassword : (field==='newPassword' ? newPassword : confirmPassword)}
                    className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-beige w-full py-2 focus:outline-none focus:border-dark"
                    placeholder={field === 'oldPassword' ? 'Password' : field === 'newPassword' ? 'New password' : 'Confirm new password'}
                  />
                </div>
                  {errors && errors[field] && <span className="text-red-700 text-xs">{errors[field]}</span>}
              </div>
            ))}
            <div className="flex w-full">
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-darker/70 hover:bg-darker/60 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">Change password</span>
                <span>
                  <svg className="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
              <div className="flex justify-center items-center mt-5">
           <button onClick={(e)=>{handleBack(e)}} className="inline-flex items-center font-bold text-darker/80 hover:text-darker/60 text-sm text-center" type="button">
            <span >Back</span>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
