import { useState, useRef, useEffect } from 'react';
import './Chat.css';

function Chat() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am the legal assistant for our law firm in Qatar. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        // Focus the input box when it's no longer loading
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [messages, isLoading]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Filter messages to format them correctly for the API (convert 'ai' role to 'assistant', and drop intro errors)
            const apiMessages = newMessages
                .filter(m => m.role === 'user' || m.role === 'ai')
                .map(m => ({ 
                    role: m.role === 'ai' ? 'assistant' : 'user', 
                    content: m.content 
                }));

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/chat';
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages }),
            });

            const data = await response.json();
            
            if (response.ok && data.reply) {
                setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'error', content: data.error || 'Failed to get a response.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'error', content: 'Network error. Make sure the backend is running.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <div className="message-bubble">
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message ai">
                        <div className="message-bubble typing">...typing</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={sendMessage} className="input-form">
                <input 
                    ref={inputRef}
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your legal question here..." 
                    disabled={isLoading}
                    autoFocus
                />
                <button type="submit" disabled={isLoading || !input.trim()}>Send</button>
            </form>
        </div>
    );
}

export default Chat;
