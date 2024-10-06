import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./SideBar/SideBar.js";
import Conversation from "./Conversation/Conversation";
import ChatInput from "./ChatInput";
import useAuth from "../../AuthContext";

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eepowResponse,setEepowResponse] = useState();
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    async function postMessageToFirebase(message) {
      try {
        // Post the message to Firebase
        const response = await axios.post(`http://localhost:3001/update-messages/${activeConversation.id}`, { message });
  
        if (response.status === 200) {
          console.log('Message posted to Firebase successfully:', response.data);
        } else {
          console.error('Error posting message to Firebase:', response.status, response.data);
        }
      } catch (error) {
        console.error('Error posting message to Firebase:', error.message);
      }
    }
  
    if (newMessage) {
      // If the message is from the user, post it to Firebase
      postMessageToFirebase(newMessage.message);
      setNewMessage('');
    }
  
    if (eepowResponse) {
      
      // If the response is from Eepow, post it to Firebase
      postMessageToFirebase(eepowResponse.message);
      setEepowResponse(null); // Clear the eepowResponse state
    }
  }, [newMessage, eepowResponse]);
  
  const addNewChat = async () =>{
    try{
      console.log("New char")
      const response = await axios.post('http://localhost:3001/add-conversation', {
        userID: currentUser.uid,
        Tittle: "New chat"
      })
      if(response.status==200)
      {
        console.log(response.data.conversationID)
        await fetchConversations();
      }else console.log(response.error)
    }catch(err){
      console.error(err)
    }
  }
  const intervalId = setInterval(async () => {
    const res = await axios.post('https://eepow-chatbot-2023-phlyzwu6ga-uc.a.run.app/refresh')
  }, 300000);
  
  // Stop the interval after 5 seconds

  const updateMessage = async (message, sender) => {
    try {
      // Send user message
      const userMessage = {
        message: {
          From: sender,
          Data: message,
        },
      };
      setNewMessage(userMessage);
      const timeout = setTimeout(()=>{setLoading(true)},300)
      
      // Get response from server
      const response = await axios.post('http://localhost:3001/get-response', { text: message });
      let eepowResponse = {};
      if (response.status === 200) {
        
        // Set Eepow's response separately
        eepowResponse = {
          message: {
            From: 'Eepow',
            Data: response.data,
          },
        };
        console.log(response.data)
        
      } else {
        eepowResponse = {
          message: {
            From: 'Eepow',
            Data: 'Network error!!!',
          },
        };
        console.error('Error getting response');
      }
     setEepowResponse(eepowResponse)
     
    } catch (error) {
      console.error('Error updating message:', error.message);
  
      // Handle any additional error scenarios or provide user feedback
    } finally {
      // Clear loading state after all operations are completed
      setLoading(false);
      
    }
  };
  
  
  const fetchConversations = async () => {
    try {
      if (currentUser) {
        const response = await axios.get(`http://localhost:3001/get-conversations/${String(currentUser.uid)}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setConversations(response.data.conversations);
        console.log("fetched conversations",response.data.conversations)
        if (response.data.conversations && response.data.conversations.length > 0) {
          setActiveConversation(response.data.conversations[0]);
        }else setActiveConversation(null)
      }
    } catch (error) {
      console.log("Error fetching conversations:", error);
    }
  };

  const handleConversationClick = (conversationId) => {
    const selectedConversation = conversations.find((conversation) => conversation.id === conversationId);
    setActiveConversation(selectedConversation);
    console.log("Conversation clicked: ", conversationId);
  };

  return (
    <div className="ChatPage">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationClick={handleConversationClick}
        fetchConversations={fetchConversations}
        addNewChat={addNewChat}
        setActiveConversation={setActiveConversation}
      />
      <div className="flex flex-col w-full">
        <Conversation activeConversation={activeConversation} newMessage={newMessage} eepowResponse={eepowResponse} isLoading={loading} />
        <ChatInput updateMessage={updateMessage} activeConversation={activeConversation} addNewChat={addNewChat} />
      </div>
    </div>
  );
};

export default ChatPage;
