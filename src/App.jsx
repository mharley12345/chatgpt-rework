import { useState, useEffect } from 'react';
import './App.css';
import 'dotenv'

let message;
const API_KEY = process.env.API_KEY

const App = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async (message) => {
   message.preventDefault();
    const newMessage = {
      message:message.target[0].value,
      direction: 'outgoing',
      sender: "user",
    };
     message.target[0].value = ''
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };
const handleClick = (e) => { 

  e.preventDefault();
}
  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  return (
  
      <div className='justify-center h-2/3 w-screen  space-y-10 '>
    
            <ul className='justify-center flex scroll-smooth space-y-12 grid grid-cols-2'
              
            
            >
              {messages.map((message, i) => {
              
              return <li key={i} className={ message.sender === "ChatGPT" ? "bg-black text-white p-5 rounded-2xl place-self-start" : "bg-red-600 text-white p-5 rounded-xl  pleace-self-end right-0"} >{message.message}</li>
              })}
            </ul>
          
            <form className=' w-screen grid grid-cols-2 space-y-15 overflow-hidden sticky bottom-0   ' onSubmit={handleSendRequest}>
            
           <div type="input" className="place-self-stretch" placeholder="Ask ChatGPT" value={message}><input  className= 'place-self-stretch border-1 border-black-600' type="text" placeholder='Ask a question'/><button type='submit'><img type="submit"  className='place-self-end  right-0' src={"src/assets/icons8-send-button.svg"} width={20} height={20}/> </button></div>
           </form>
          </div>
         
         
         
  
  
  )
}

export default App;