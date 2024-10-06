const express = require('express')  
const cors = require('cors')    
const bodyParser = require('body-parser')
const axios = require('axios');

var admin = require("firebase-admin");

var serviceAccount = require("./oop-chatbot-firebase-adminsdk-w0mjd-cd80e79035.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://oop-chatbot-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();

const app = express()
app.use(express.json()); // This is enough for JSON parsing
// app.use(express.json())
// app.use(bodyParser.json())
const corsOptions = {   
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))  
const port = 3001
const usersRef = db.collection("Users");
usersRef.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      console.log("New user: ", change.doc.data());
    }
    if (change.type === "modified") {
      console.log("Modified user: ", change.doc.data());
    }
    if (change.type === "removed") {
      console.log("Removed user: ", change.doc.data());
    }
  });
});
app.post('/add-user', async (req, res) => {
  try {
    const { UserID} = req.body;
    // Add user to Firestore with the provided user ID as document ID
    await db.collection('Users').doc(String(UserID)).set({
      Username : "Pikachu"
    });

    res.json({ success: true, message: 'User added successfully.' });
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get('/verify-email', async (req, res) => {
    try {
      const { email } = req.query; // Use req.query to get query parameters
  
      console.log(email);
  
      const usersRef = db.collection('Users');
      const snapshot = await usersRef.where('Email', '==', email).get();
  
      if (snapshot.empty) {
        return res.status(404).json({ message: 'Email not found in the database.', userID: null });
      }
  
      return res.status(200).json({ message: 'Email found in the database.', userID: snapshot.docs[0].id });
    } catch (error) {
      console.error('Error verifying email:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  });

  app.get('/verify-account', async (req, res) => {
    try {
      const { username,password } = req.body;
      if (!username || !password) { 
        return res.status(400).json({ error: 'Password and Username are required in the request body.' });
      }
  
      const usersRef = db.collection('Users');
      const snapshot = await usersRef.where('Username', '==', username).where('Password', '==', password).get();
  
      if (snapshot.empty) {
        return res.status(404).json({ message: 'Account not found in the database.' ,userID: null});
      }
  
      return res.status(200).json({ message: 'ACcount found in the database.' ,userID: snapshot.docs[0].id});
    } catch (error) {
      console.error('Error verifying account:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  });
  app.get('/get-user/:userID', async (req, res) =>{
    try{
      const {userID} = req.params;
      if(!userID){
        return res.status(400).json({ error: 'UserID is required in the request parameters.' });
      }
      const UserDoc =await db.collection('Users').doc(userID).get();
      
      if(!UserDoc.exists){
        return res.status(404).json({ error: 'User not found.' });
      }
      const userData = UserDoc.data();
      console.log(userData)
     res.json({ success: true, user: userData });
      
    }catch(error){
      console.error('Error getting user:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app.get('/get-conversations/:userID', async (req, res) => {
    try {
      const { userID } = req.params;
      if (!userID) {
        return res.status(400).json({ error: 'UserID is required in the request parameters.' });
      }
  
      const conversationsRef = db.collection('Conversations');
      const snapshot = await conversationsRef.where('UserID', '==', userID).where('Hidden', '==', false).get();
  
      const conversations = [];
      
      snapshot.forEach((doc) => {
        console.log(doc.data())
        conversations.push({
          Tittle: doc.data().Tittle,
          Hidden: Boolean(doc.data().Hidden),
          id: doc.id 
        });
      });
      return res.status(200).json({ conversations });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      console.log(error.response)
      return res.status(500).json({ error: 'Internal server error.' });
    }
  });
  
  // Update Conversation
app.post('/add-conversation', async (req, res) => {
  try {
    const { userID } = req.body;
    const {Tittle} = req.body;
    if (!userID|| !Tittle) {
      return res.status(400).json({ error: 'Invalid request parameters or body.' });
    }

    // Assuming your conversations are stored in a "Conversations" collection
    const conversationsRef = db.collection('Conversations');

    // Add the userID to the conversation data
   
    const newConversationRef = await conversationsRef.add({
      Time: new Date().toISOString(),
      Tittle: Tittle,
      UserID: userID,
      Hidden: false
    });

    return res.status(200).json({ message: 'Conversation added successfully.', conversationID: newConversationRef.id });
  } catch (error) {
    console.error('Error adding conversation:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});
app.post('/update-conversation/:conversationsID', async (req, res) => {
  try {
    const { conversationsID } = req.params;
    const { Tittle, Hidden } = req.body;
    console.log(req)
    if (!conversationsID || (Tittle=== undefined && Hidden === undefined)) {
      return res.status(400).json({ error: 'Invalid request parameters or body.' });
    }

    // Create an object to hold the fields you want to update
    const updateFields = {};
    if (Tittle !== undefined) {
      updateFields.Tittle = Tittle;
    }
    if (Hidden !== undefined) {
      updateFields.Hidden = Hidden;
    }

    if (Object.keys(updateFields).length === 0) {
      // No valid fields to updatef
      return res.status(400).json({ error: 'No valid fields to update.' });
    }

    // Assuming your conversations are stored in a "Conversations" collection
    await db.collection('Conversations').doc(conversationsID).update(updateFields);

    return res.status(200).json({ message: 'Conversation updated successfully.' });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Update Messages
app.post('/get-response',async(req,res)=>{
  try{
    const {text} = req.body;
    if(text==''){
      return res.status(400).json({error:"Text is null"});
    }
    console.log(text)
    const response = await axios.post('https://eepow-chatbot-2023-phlyzwu6ga-uc.a.run.app/predict', { text: text });
    console.log(response)
    return res.status(200).json(response.data)
  }catch(error){
    console.error('Error get predict:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});
app.post('/update-messages/:conversationID', async (req, res) => {
  console.log("new message",req.body)
  try {
    const { conversationID } = req.params;
    const { message } = req.body;
    if (!conversationID || !message) {
      return res.status(400).json({ error: 'Invalid request parameters or body.' });
    }
    // Assuming your messages are stored in a "Messages" subcollection within each conversation document
    const messageRef = db.collection('Messages')

    // Add messages to the conversation

    await messageRef.add({
      Data: message.Data,
      From: message.From,
      ConversationID: conversationID,
      Time: message.Time || new Date().toISOString(), // Use current time if not provided
    });

    return res.status(200).json({ message: 'Messages updated successfully.' });
  } catch (error) {
    console.error('Error updating messages:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/get-messages/:conversationID', async (req, res) => {
  try {
    const { conversationID } = req.params;

    if (!conversationID) {
      return res.status(400).json({ error: 'ConversationID is required in the request parameters.' });
    }
    // Assuming your messages are stored in a "Messages" subcollection within each conversation document
    const messagesRef = db.collection('Messages');

    // Fetch messages for the specified conversationID
    const snapshot = await messagesRef.where('ConversationID', '==', conversationID).orderBy('Time', 'asc').get();
  
    const Messages = [];
    
    snapshot.forEach((doc) => {
      Messages.push({
        id: doc.id,
        Data: doc.data().Data,
        From: doc.data().From,
        Time: doc.data().Time,
      });
    });

    return res.status(200).json({ Messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
