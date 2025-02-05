import { useState } from "react";

export default function Chatbot() {
  // Hardcode initial chatbot message
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there, I'm Dhilen Mistry's AI! Please note that I may have inaccuracies. For the most accurate information contact dhilenmistry@gmail.com.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
    setLoading(false);
  };

  return (
    <div
      className="container p-3 my-4"
      style={{
        border: "2px solid #ff804e",
        backgroundColor: "#1a1a1a",
        borderRadius: "0.5rem",
        color: "white"
      }}
    >
      {/* Messages container */}
      <div
        className="d-flex flex-column mb-3"
        style={{ height: 300, overflowY: "auto" }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              className={
                `my-1 d-inline-block rounded-3 px-3 py-2 ${
                  isUser ? "align-self-end text-end" : "align-self-start text-start"
                }`
              }
              style={{
                maxWidth: "70%",
                wordBreak: "break-word",
                backgroundColor: isUser ? "#ff804e" : "#2b2b2b",
                color: "#fff"
              }}
            >
              {msg.content}
            </div>
          );
        })}
        {loading && <div className="text-muted">Thinking...</div>}
      </div>

      {/* Input + button */}
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          style={{ backgroundColor: "#2b2b2b", color: "#fff", borderColor: "#ff804e" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="btn"
          style={{ backgroundColor: "#ff804e", color: "#fff", borderColor: "#ff804e" }}
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
