import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
function RessetSuccess() {
    const location = useLocation();
    const { email } = location.state || {};
    console.log('email',email)
    const navigate = useNavigate()
    const handleBack = (e) =>{
        e.preventDefault();
        navigate('/ResetPassword');
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        navigate('/Login')
    }
  return (
        <div className="LoginForm">
      <div className="flex flex-col bg-light shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        <div className="m-2 font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Reset password email sent!</div>
        <span>A reset password email has sent to your email adress  <span className='font-bold'>{email}</span> </span>
        <div className="flex w-full">
              <button
                type="submit"
                onClick={(e) =>{handleSubmit(e)}}
                className="my-4 flex items-center justify-center focus:outline-none text-white text-sm sm:text-base hover:border-light-500 rounded bg-darker/60 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 font-bold uppercase">Login</span>
                <span>
                  <svg className="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
        <div>
        </div>
        <div className="flex justify-center items-center">
          <button onClick={(e)=>{handleBack(e)}} className="inline-flex items-center font-bold text-darker/80 hover:text-darker/60 text-small text-center" type="button">
            <span >Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RessetSuccess
