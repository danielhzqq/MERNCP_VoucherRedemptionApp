import React, { useState, useRef, useContext, useEffect } from "react";
import client from "../../services/restClient";
import { AuthContext } from "../../context/AuthContext";

const AIChatbox = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Reset chatbox state when user logs out
  useEffect(() => {
    if (!user) {
      setOpen(false);
      setMessages([{ sender: "ai", text: "Hi! How can I help you today?" }]);
      setInput("");
      setLoading(false);
    }
  }, [user]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      // Call backend AI endpoint
      const res = await client.service("ai-chat").create({
        topic: "general",
        message: input,
        history: messages,
      });
      setMessages((prev) => [...prev, { sender: "ai", text: res.text }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Sorry, there was an error. Please try again." }]);
    }
    setLoading(false);
  };

  // Scroll to bottom on new message
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-blue-700 transition-colors"
          onClick={() => setOpen(true)}
          aria-label="Open AI Chatbox"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {/* Chat Modal */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col" style={{ minHeight: 420, maxHeight: 520 }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-blue-600 rounded-t-xl">
            <span className="text-white font-semibold">AI Chat Support</span>
            <button className="text-white hover:text-gray-200" onClick={() => setOpen(false)} aria-label="Close Chat">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-white" style={{ minHeight: 200 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${msg.sender === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-800"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white rounded-b-xl">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
              disabled={loading}
            />
            <button
              className="bg-blue-600 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbox; 