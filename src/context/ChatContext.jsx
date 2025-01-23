// context/ChatContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_MESSAGES } from '../constants/chatMessages';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([DEFAULT_MESSAGES.WELCOME, DEFAULT_MESSAGES.AGE_FORM]);
  const [userInfo, setUserInfo] = useState({
    age: null,
    hasAvailability: null
  });
  const [isInputEnabled, setIsInputEnabled] = useState(false);

  const submitAge = (age) => {
    setUserInfo(prev => ({ ...prev, age }));
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        avatar: 'U',
        message: `Tengo ${age} años`,
        isAI: false
      },
      DEFAULT_MESSAGES.AVAILABILITY_FORM
    ]);
  };

  const submitAvailability = (hasAvailability) => {
    setUserInfo(prev => ({ ...prev, hasAvailability }));
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        avatar: 'U',
        message: hasAvailability ? 'Sí, tengo disponibilidad' : 'No tengo disponibilidad',
        isAI: false
      },
      {
        ...DEFAULT_MESSAGES.NEXT_STEPS,
        id: Date.now() + 1
      }
    ]);
    setIsInputEnabled(true); 
  };

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      userInfo,
      isInputEnabled,
      submitAge,
      submitAvailability
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);