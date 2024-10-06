import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from "../AuthContext";
const Home = () => {
  const dynamicText = "Welcome to Eepow chat bot";
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate(); 
  console.log(currentUser)
  const handleSignIn = () => {
    navigate("/Login");
  };
  const handleSignUp = () => {
    navigate("/SignUp");
  };
  return (
    <div className="flex h-screen">
      <div class="flex min-h-screen items-center justify-center bg-gradient-to-tr to-darker from-light p-10">
        <div class="w-max">
          <h1 class="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-5xl text-white font-bold">{dynamicText}</h1>
        </div>
      </div>
      <div className="w-1/2 flex flex-col bg-beigh items-center justify-center">
        <h1 className="text-3xl text-darker mb-8 ">Do you have an account?</h1>
        <div className="flex space-x-4">
          <button onClick={handleSignIn} className="bg-darker hover:bg-darker/80 text-white font-bold py-2 px-4 rounded">
            Sign In
          </button>
          <button onClick={handleSignUp} className="bg-darker hover:bg-darker/80 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
