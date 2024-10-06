  // ChatInput.js
  import React from "react";
  import { useState } from "react";
  const ChatInput = ({updateMessage,addNewChat,activeConversation}) => {
    const [message, setMessage] = useState('');
    const handleMessageChange = (e) => {
      e.preventDefault();
      setMessage(e.target.value)
      console.log(message);
    }
    const handleSend = async (e)  => {
      const sender = "User";
      console.log("Input ",message);
      if(message === '') return;
      // Use the functional form of setMessage to get the latest state
      console.log('active',activeConversation)
      if (document.activeElement !== document.getElementById('chatTextarea')) {
        if(!activeConversation)
        await addNewChat();
      const textarea = document.getElementById('chatTextArea');
      if (textarea) {
        console.log("yes")
        textarea.style.height = '45px';
      }
      const messageWithBreaks = message.replace(/\n/g, '  \n');
      updateMessage(messageWithBreaks, sender);
      setMessage('');
    // }
    }
    };
    const handleTextareaResize = (e) => {
      const maxTextareaHeight = 200; // Set your desired maximum height
      const minTextareaHeight = 45; // Set the height for an empty textarea
      const isEmpty = e.target.value.trim() === ''; // Check if the message is empty
      e.target.style.height = '0px';
      e.target.style.height = `${isEmpty ? minTextareaHeight : Math.min(e.target.scrollHeight, maxTextareaHeight)}px`;
    };
    return (
      <div className="ChatInput pb-4">
        <div>
        </div>
        <div className="flex-grow ml-4 mr-2">
          <div className="relative w-full">
            <textarea
            id = 'chatTextArea'
            onInput={handleTextareaResize}
              type="text"
              className="block mx-4 p-2 w-full border rounded-xl hover:border-darker/60 focus:outline-none focus:border-darker focus:ring-dark pl-4 h-10"
              placeholder="Type your message..."
              value={message}
              onChange={handleMessageChange}
              // onKeyDown={(e) => {
              //   if (e.key === 'Enter') {
              //     handleSend();
              //   }
              // }}
              required
            />
          </div>
        </div>
        <div className="ml-4">
          <button onClick={(e) =>{handleSend(e)}}
          className="flex items-center justify-center bg-darker/80 hover:bg-darker/60 rounded-xl text-white px-4 py-2 flex-shrink-0"> 
            <span>Send</span>
            <span className="ml-2">
              <svg
                className="w-4 h-4 transform rotate-45 -mt-px"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    );
  };

  export default ChatInput;
