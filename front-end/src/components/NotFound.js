import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function NotFound() {
    useEffect(()=>{
        toast("Wow so easy!")
    })
  return (
    <div>
      <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
/>
{/* Same as */}
<ToastContainer />
    </div>
  )
}

export default NotFound
