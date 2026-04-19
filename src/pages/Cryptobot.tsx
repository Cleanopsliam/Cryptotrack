import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const INITIAL_MESSAGE: Message = {
  id: 'init',
  text: 'Hello! I am your Cryptobot. I can answer basic questions about the crypto markets. Try asking me "What is Bitcoin?" or "market status".',
  sender: 'bot'
};

const Cryptobot = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const userMessage: Message = { id: Date.now().toString(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to the bot API');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${err.message}. Are you running this via 'npx vercel dev' with your API key set?`,
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <div className="header">
        <h1>Cryptobot</h1>
      </div>
      
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about crypto..."
          />
          <button type="submit" className="chat-submit" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Cryptobot;
