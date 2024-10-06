import React from "react";
import Menu from "./Menu";
import { Button } from "@material-tailwind/react";
import { useState ,useRef} from "react";
import { useEffect } from "react";
import axios from "axios";
import useAuth from "../../../AuthContext";
import Conversation from "../Conversation/Conversation";

const Sidebar = ({ conversations,setActiveConversation, activeConversation, onConversationClick ,fetchConversations,addNewChat}) => {
  const [editMode, setEditMode] = useState(false);
  // useEffect hook to monitor changes in activeConversation
  useEffect(() => {
    // Perform any necessary actions based on the activeConversation change
  }, [activeConversation]);
  // onConversationClick(activeConversation.id);
  const { currentUser, login, logout } = useAuth();
  const [tittle, setTittle] = useState()
  const inputRef = useRef(null);
  const handleNewChat = async (e) =>{
    e.preventDefault();
    await addNewChat();
    try{
      const res = await axios.post('https://eepow-chatbot-2023-phlyzwu6ga-uc.a.run.app/refresh')
    }catch(err)
    {
      console.log(err)
    }
  }
  useEffect(()=>{
    console.log('Tittle',tittle)
    setTittle(activeConversation?.Tittle)
  },[activeConversation])
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && editMode) {
      
      event.preventDefault(); // Prevents the default behavior of the Enter key (e.g., form submission)
      handleUpdateConversation(); // Call the function to update the conversation
    }
  };

  const handleUpdateConversation = async () => {
    try {
      const memo = activeConversation;
      const response = await axios.post(`http://localhost:3001/update-conversation/${activeConversation?.id}`, {
        Tittle: tittle,
      });
      // console.log("res", response);
      if (response.status === 200) {
        setEditMode(false);
        await fetchConversations();
        setTittle("");
        setActiveConversation(memo);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const handleClickOutside =async (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        handleUpdateConversation();
      }
    };
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && editMode) {
        event.preventDefault(); // Prevents the default behavior of the Enter key (e.g., form submission)
        handleUpdateConversation(); // Call the function to update the conversation
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [editMode, tittle, activeConversation, fetchConversations]);
  const handleDeleteConversation = async (conversationID) =>{
    
    try{
      const response = await axios.post(`http://localhost:3001/update-conversation/${conversationID}`, {
        Hidden: true
      })  
      if(response.status == 200)
        await fetchConversations();
      else console.log(response.error)
    }catch(err){
     console.error(err)
    };
    
   
  }
  const handleInputClick = (e) => {
    // Prevent propagation of the click event to avoid closing the edit mode
    e.stopPropagation();
  };
  return (
    <div className="SideBar flex flex-col relative pt-2 md:w-64">
      <div className="flex flex-row items-center justify-center h-12 mar pt-6">
        <div className="bg-dark h-10 w-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <g data-name="chat android app aplication phone">
              <path fill="#ffffff" d="M30.56 8.47a8 8 0 0 0-7-7 64.29 64.29 0 0 0-15.06 0 8 8 0 0 0-7 7 64.29 64.29 0 0 0 0 15.06 8 8 0 0 0 7 7 64.29 64.29 0 0 0 15.06 0 8 8 0 0 0 7-7 64.29 64.29 0 0 0 0-15.06zm-2 14.83a6 6 0 0 1-5.28 5.28 63.65 63.65 0 0 1-14.6 0 6 6 0 0 1-5.26-5.28 63.65 63.65 0 0 1 0-14.6A6 6 0 0 1 8.7 3.42a63.65 63.65 0 0 1 14.6 0 6 6 0 0 1 5.28 5.28 63.65 63.65 0 0 1 0 14.6z"/>
              <path fill="#ffffff" d="M16 8C9.93 8 5 11.59 5 16c0 2.43 1.45 4.66 4 6.18V25a1 1 0 0 0 1.55.83l3-2A15 15 0 0 0 16 24c6.07 0 11-3.59 11-8s-4.93-8-11-8zm0 14a13.6 13.6 0 0 1-2.44-.23 1 1 0 0 0-.74.15L11 23.13v-1.54a1 1 0 0 0-.53-.88C8.26 19.55 7 17.83 7 16c0-3.31 4-6 9-6s9 2.69 9 6-4 6-9 6z"/>
              <circle fill="#ffffff" cx="16" cy="16" r="1"/><circle fill="#ffffff" cx="20" cy="16" r="1"/><circle fill="#ffffff" cx="12" cy="16" r="1"/></g></svg>
        </div>
        <div className="ml-2 font-head text-white font-extrabold text-2xl">Eepow bot</div>
        </div>
      <div className="w-full mt-5">
      <Button onClick={handleNewChat} size='lg' variant="outlined" fullWidth className="text-md hover:bg-light bg-dark font-head font-extrabold text-center py-2 h-10">
        <span>
          New chat
        </span>
        </Button>
      </div >
      <span className="font-head font-bold text-base mx-3 pt-2">Active chat</span>
      {/* Active Conversations */}
      <div className="flex flex-grow  scroll-auto overflow-y-auto flex-col flex-grow mb-2 border-t-2">
        <div className="flex flex-col space-y-1 mt-4">
        {conversations.map((conversation) => (
            <div key={conversation.id} className={"flex flex-row rounded-lg  " + (conversation.id == activeConversation?.id ? ("bg-light hover:bg-beige") : ("bg-dark hover:bg-beige/20"))}>
            <button
            onDoubleClick={() => setEditMode(true)}
            onClick={() => onConversationClick(conversation.id)}
            key={`button-${conversation.id}`}
            className={
              "flex flex-row grow items-center rounded-l-lg p-2 "
            }
            >
            <div className="flex items-center font-bold justify-center h-8 w-8 bg-beige border-2 border-dark rounded-full">
              {conversation.Tittle?.charAt(0)}
            </div>
            {editMode && conversation.id == activeConversation.id ?(
              <input
              key={`input-${conversation.id}`}
              onClick={handleInputClick}
              ref={inputRef}
              className=" ml-1 pl-2 block w-auto rounded-md"
              type="text"
              value={tittle}
              onChange={(e) => setTittle((prevTittle) => e.target.value)}
              
              //  onBlur={() => setEditMode(false)}
              autoFocus
            />
            ):(
              <div className="text-sm pl-2">
                {
                conversation.Tittle
                } 
                  
                </div>
                 )
                }
          </button>
              {!editMode && conversation.id == activeConversation.id ? (
                <div className="py-3 px-1">
                <button
                onClick={()=>setEditMode(!editMode)}
                key={`edit-${conversation.id}`}
                className=" text-sm p-1 hover:bg-light">
               <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path fill="#1f2023" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                </button>
                <button
                onClick={()=>handleDeleteConversation(conversation.id)}
                key={`del-${conversation.id}`}
                className=" text-sm p-1 hover:bg-light"
                >        
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512"> <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                </button>
                </div>
          ):null}
        </div>
        ))}
        </div>
      </div>

      {/* Logout Button */}
     
      <div className="flex-grow absolute bottom-0 left-0 w-full">
      <Menu />
      
      </div>
    </div>
  );
};

export default Sidebar;
