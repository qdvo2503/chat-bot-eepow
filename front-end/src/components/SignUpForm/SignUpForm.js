import React, { useState } from 'react';
import useAuth from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const SignUpForm = () => {
  const navigate = useNavigate();
  const { currentUser, googleSignIn, googleSignUp, signup, logout } = useAuth();
  const [errors, setErrors] = useState();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [repassword,setRepassword] = useState('');
  const handleGoogleSignUp = async (e) =>{
    e.preventDefault();
    const res = await googleSignUp();
    await toast.promise(
      Promise.resolve(res), // Assuming signup returns a Promise
      {
        pending: 'Signing up...',
        success: 'Signup successful!',
        error: (error) => `Signup failed: ${error.error}`,
      }
    );
    console.log(res)
    if(res.error){
      console.log(res.error)
    } else{
      navigate('/Chat')
    }
  }
  console.log(errors)
  const validateField = (field,value, errorMessage) => {
    if (!value) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
      return false;
    }
    return true;
  };
  const handleLogin = (e)=>{
    navigate('/Login')
  }

  const handleSignUp = async (e)=>{
    e.preventDefault();
    setErrors(null)
    if (!validateField('email', email,'Email cannot be empty') || !validateField('password',password, 'Password cannot be empty') || !validateField('repassword',repassword,'Confirm password cannot be empty')) {
      console.log('Invalid value')
      setPassword('')
      setRepassword('')
      return;
    }
    if(password != repassword){
      e.preventDefault();
      setErrors((prevErrors) => ({ ...prevErrors, repassword: 'Password does not match' })); ;
      setPassword('')
      setRepassword('')
      return;
    }
    try{
      let err = await signup(email,password);
      if(err?.error !=null)
      {
        e.preventDefault();
        console.log(err)
      setErrors(err);
      setPassword('')
      setRepassword('')
      if(err.account!=null) setEmail('')
      return;
      }
    toast('Sign up successfully!');
    navigate('/Chat')
  }catch(err){
    console.error(err)
  }
    
  }
  return (
    <div className="LoginForm">
      <div className="flex flex-col bg-light shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Sign up to Eepow</div>
        <button onClick={handleGoogleSignUp} className="But">
          <span>
          <span className="absolute ml-10 top-0 flex items-center justify-center h-full w-10 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="15.25" viewBox="0 0 488 512"><path fill="white" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
          </span>
            Sign up with Google</span>
        </button>
        <div className="relative mt-10 h-px bg-gray-300">
          <div className="absolute left-0 top-0 flex justify-start w-full -mt-2">
            <span className="bg-light px-4 text-xs text-gray-500 uppercase">Or Sign up With Email</span>
          </div>
        </div>
          {errors && errors.account ? (
                  <label className="mt-2 text-xs sm:text-sm tracking-wide text-red-400 text-left">{errors.account}</label>):(null)}
        <div className="mt-2">
          <form action="#">
            <div className="flex flex-col mb-6">
              <label htmlFor="username" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 text-left">Email:</label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <svg className="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} id="username" name="username" className="Input " placeholder="Email" />
                  </div>
                {errors && errors.email ? (
                  <label className="text-xs sm:text-sm tracking-wide text-red-400 text-left">Invalid email!</label>):(null)}
            </div>

            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 text-left">Password:</label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <span>
                    <svg className="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>
                <input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" name="password" className="Input" placeholder="Password" />  
                
               </div>
               {errors && errors.password ? (
                  <label className=" text-xs sm:text-sm tracking-wide text-red-400 text-left">Password is too short</label>):(null)}
            </div>

            <div className="flex flex-col mb-6">
              <label htmlFor="confirm-password" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 text-left">Confirm Password:</label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <span>
                    <svg className="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>
                  <input value={repassword}  onChange={(e) => setRepassword(e.target.value)} id="confirm-password" type="password" name="confirm-password" className="Input" placeholder="Confirm Password" />
                
              </div>
              {errors && errors.repassword ? (
                  <label className="mb-1 text-xs sm:text-sm tracking-wide text-red-400 text-left">Password does not match!</label>):(null)}
            </div>
           
            <div className="flex w-full">
              <button onClick={handleSignUp} type="submit" className="flex bg-darker/60 hover:bg-darker/50 items-center justify-center focus:outline-none text-beige text-sm sm:text-base bg-dark/80 hover:bg-dark rounded py-2 w-full transition duration-150 ease-in">
                <span className="mr-2 font-bold uppercase">Sign up</span>
                <span>
                  <svg className="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
          <div className="flex justify-center items-center mt-6">
          <button onClick={(e) =>{handleLogin(e)}} className="inline-flex items-center font-bold text-darker/80 hover:text-darker/60 text-xs text-center" type="button">
            <span className="ml-2">Already have account? Log in</span>
          </button>
        </div>
        </div>

      </div>
    </div>
  );
};

export default SignUpForm;
