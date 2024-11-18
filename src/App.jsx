import { useState } from "react";
import "./App.css";
import "dotenv";
const API_KEY = process.env.API_KEY;

console.log(API_KEY)
async function processMessageToChatGPT(chatMessages) {
  const apiMessages = chatMessages.map(({ message, sender }) => {
    const role = sender === "ChatGPT" ? "assistant" : "user";
    return { role, content: message };
  });
  const apiRequestBody = {
    model: "gpt-4-0125-preview",
    messages: [
      { role: "system", content: "I'm a Student using ChatGPT for learning" },
      ...apiMessages,
    ],
  };
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer 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`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiRequestBody),
  });

  return response.json();
}
const App = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm your assistant! How can I help you?!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const handleSendRequest = async (event) => {
    event.preventDefault();
    setIsTyping(true);
    const newMessage = {
      message: userInput,
      direction: "outgoing",
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserInput("");
    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = { message: content, sender: "ChatGPT" };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
        
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };
  return (
    <div className="container h-full w-full mx-auto overflow-y-auto border-gray-500 bg-gray-800 w-3/4 max-w-xxxl p-1">
      <div className="justify-center items-center h-auto flex flex-col col-span-* space-x-8 p-8 border-solid border-8 border-slate-600">
        {messages.map((message, i) => (
       
          <p
            key={i}
            className={`text-2xl p-5 rounded-lg w-full ${
              message.sender === "ChatGPT"
                ? "bg-black text-white " 
                : "bg-red-600 text-white text-right"
            }`}>
            {" "}
          
            {message.message}{" "}
          </p>
        ))}
      </div>{" "}
      {" "}
      <form
        className="space-y-4 flex flex-col justify-center items-center p-4"
        onSubmit={handleSendRequest}>
        <input
          className="w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question"
        />{" "}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit">
          {" "}
          Send{" "}
        </button>{" "}
      </form>{" "}
    </div>
  );
};
export default App;
