import React, { useState } from 'react'
import useAuth from "../../AuthContext";
import { useNavigate } from 'react-router-dom';
import RessetSuccess from './RessetSuccess';
export default function SendEmailReset() {
 const [email,setEmail] = useState()
 const navigate = useNavigate()
 const {resetPassword} = useAuth()
 const [errors,setErrors] = useState()
 const handleSubmit = async (e) =>{
  e.preventDefault();
  try{
    const res = await resetPassword(email)
    if(res === true){
      navigate('/ResetSuccess',{ state: { email } } );
    }else {
      setEmail('')
      setErrors('Email not exists')
      return;
    }

  }catch(err){
    console.error(err);
  }
 }
 const handleBack = (e)=>{
  e.preventDefault();
  navigate('/Login')
 }
  return (  
    <div className="LoginForm">
      <div className="flex flex-col bg-light shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Reset password</div>

        <div className="mt-10">
          <form>
           
              <div key='email' className="flex flex-col mb-6">
                <label htmlFor='email' className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 text-left">
                 Email
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
                    onChange={(e) => {setEmail(e.target.value)}}
                    id='email'
                    type="email"
                    value ={email}
                    className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-beige w-full py-2 focus:outline-none focus:border-dark"

                  />
                </div>
                <span className='text-red-700 h-3 text-xs'>{errors}</span>
              </div>
            <div className="flex w-full">
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base hover:border-light-500 rounded bg-darker/60 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">Reset password</span>
                <span>
                  <svg className="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center mt-6">
          <button onClick={(e)=>{handleBack(e)}} className="inline-flex items-center font-bold text-darker/80 hover:text-darker/60 text-sm text-center" type="button">
            <span >Back to Login page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
