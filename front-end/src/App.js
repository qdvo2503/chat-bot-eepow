import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import ChatPage from './components/ChatPage/ChatPage';
import ChangePass from './components/ChangePass/ChangePass';
import Home from './components/Home';
import SignUpForm from './components/SignUpForm/SignUpForm';
import './index.css';
// Required for side-effects
import { AuthProvider } from './AuthContext';
import SendEmailReset from './components/ResetPassword/SendEmailReset';
import RessetSuccess from './components/ResetPassword/RessetSuccess';
import NotFound from './components/NotFound';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  
  return (
    <div>
 <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Chat" element={<ChatPage />} />
        <Route path="/SignUp" element={<SignUpForm />} />
        <Route path="/ChangePass" element={<ChangePass />} />
        <Route path="*" element={<NotFound/>} />
        <Route path="/Login" element={<LoginForm/>} />
        <Route path="/ResetPassword" element={<SendEmailReset/>} />
        <Route path="/ResetSuccess" element={<RessetSuccess/>}/>
      </Routes>
    </BrowserRouter>
    <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
/>
 </AuthProvider>
    </div>
  );
}

export default App;
