"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "bot" | "user"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Asalam-o-Alaikum! Welcome to Riphah International College. How can I help you today? Ask me about programs, admissions, fees, or anything else!",
    sender: "bot",
    timestamp: new Date()
  }
]

async function fetchBotReply(message: string): Promise<string> {
  try {
    const res = await fetch("/api/bot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) throw new Error("API error")
    const data = await res.json()
    return data.reply || "I couldn't find an answer. Please contact our admissions office for help."
  } catch {
    return "I'm having trouble right now. Please try again in a moment or visit our Contact page."
  }
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    
    const reply = await fetchBotReply(inputValue)
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: reply,
      sender: "bot",
      timestamp: new Date()
    }
    
    setIsTyping(false)
    setMessages(prev => [...prev, botMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <motion.button
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] shadow-lg flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ boxShadow: "0 0 20px rgba(30, 58, 138, 0.4)" }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Notification dot */}
          {!isOpen && (
            <motion.span
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#F59E0B] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
        

      </motion.div>
      
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="glass rounded-3xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">RIC Assistant</h3>
                    <p className="text-xs text-white/70">Online | Typically replies instantly</p>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-background/50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        message.sender === "bot" 
                          ? "bg-[#1E3A8A]" 
                          : "bg-[#F59E0B]"
                      }`}
                    >
                      {message.sender === "bot" ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div 
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        message.sender === "bot" 
                          ? "bg-muted rounded-tl-none" 
                          : "bg-[#1E3A8A] text-white rounded-tr-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === "bot" ? "text-muted-foreground" : "text-white/70"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    className="flex gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex gap-1">
                        <motion.span
                          className="w-2 h-2 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                          className="w-2 h-2 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.span
                          className="w-2 h-2 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Quick Replies */}
              <div className="px-4 py-2 border-t border-border/50 flex gap-2 overflow-x-auto scrollbar-hide">
                {["Admissions", "Programs", "Fee Structure", "Contact"].map((topic) => (
                  <motion.button
                    key={topic}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-[#1E3A8A]/10 transition-colors"
                    onClick={() => {
                      setInputValue(topic)
                      setTimeout(handleSend, 100)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
              
              {/* Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted border-2 border-transparent focus:border-[#1E3A8A] outline-none transition-all"
                  />
                  <motion.button
                    className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center"
                    onClick={handleSend}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
