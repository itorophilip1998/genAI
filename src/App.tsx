import { useState, useEffect, useRef, FormEvent } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { getAnswer } from "./ai/langchain";

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, how can I help you?", sender: "system" },
    { id: 2, text: "I need cold", sender: "user" },
  ]);
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef(null); // Reference to scroll to the bottom of the chat

  const handleSendMessage = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInputText("");
      const answer = await getAnswer(inputText);
      console.debug(answer);
    }
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl mb-6">Gen AI</h2>
      {/* chat container with glass effect */}
      <div className="flex flex-col justify-between bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-lg p-6 w-full max-w-4xl h-[90vh] shadow-xl">
        {/* Messages container */}
        <div className="flex flex-col flex-grow overflow-y-auto space-y-4 mb-4 no-scrollbar p-8">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg text-lg max-w-[80%] relative ${
                msg.sender === "user"
                  ? "bg-blue-600 self-end text-white "
                  : "bg-gray-700 self-start text-white  "
              }`}
            >
              {msg.text}
              <span
                className={`absolute ${
                  msg.sender === "user"
                    ? "right-[-8px] top-[80%] transform translate-y-[-50%] w-0 h-0 border-l-[8px] border-t-[8px] border-t-transparent border-l-blue-600"
                    : "left-[-8px] top-[80%] transform translate-y-[-50%] w-0 h-0 border-r-[8px] border-t-[8px] border-t-transparent border-r-gray-700"
                }`}
              ></span>
            </div>
          ))}
          {/* Reference div to scroll to the bottom */}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input & Send Button */}
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button> */}
          {inputText && (
            <RiSendPlaneFill
              onClick={handleSendMessage}
              className="text-blue-500 absolute right-10 bottom-10 cursor-pointer"
              size={34}
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
