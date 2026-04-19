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

  const generateBotResponse = (text: string) => {
    // See /cryptobot.md for system prompt and guardrails
    const lower = text.toLowerCase();
    
    // Simple mock guardrail check
    const isCryptoRelated = ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'market', 'status', 'portfolio', 'coin', 'token', 'price'].some(keyword => lower.includes(keyword));

    if (!isCryptoRelated) {
      return "I am only designed to provide you with the best Crypto information.";
    }

    if (lower.includes('bitcoin') || lower.includes('btc')) {
      return "Bitcoin (BTC) is the first and most widely recognized cryptocurrency. It often leads the market trends.";
    }
    if (lower.includes('ethereum') || lower.includes('eth')) {
      return "Ethereum (ETH) is a decentralized platform that runs smart contracts and is the second-largest crypto by market cap.";
    }
    if (lower.includes('market') || lower.includes('status')) {
      return "The crypto market is highly volatile. Currently, the top coins by volume are typically stablecoins like USDT and majors like BTC/ETH.";
    }
    if (lower.includes('portfolio')) {
      return "You can add coins to your portfolio by clicking the star icon next to them on the dashboard.";
    }
    return "I am a simple simulated bot. I don't have real-time live LLM API access right now, but I can talk about Bitcoin, Ethereum, and your portfolio!";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(userMessage.text),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
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
