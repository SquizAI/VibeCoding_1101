import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../styles/ThemeProvider';
import EngagementTracker from './EngagementTracker';

interface AssistantPanelProps {
  chapterId: string;
  sectionId: string;
  skillLevel: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeSnippet?: string;
  relatedConcept?: string;
  ideIntegration?: boolean;
}

// Styled Components
const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PanelTitle = styled.h3`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    width: 24px;
    height: 24px;
    color: var(--color-primary);
  }
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MessageBubble = styled(motion.div)<{ $sender: 'user' | 'assistant'; $isDark: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-width: 95%;
  font-size: 0.95rem;
  line-height: 1.5;
  position: relative;
  
  background-color: ${props => 
    props.$sender === 'user' 
      ? (props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.07)') 
      : (props.$isDark ? 'var(--color-primary-dark)' : 'var(--color-primary-light)')
  };
  
  color: ${props => 
    props.$sender === 'user' 
      ? 'inherit' 
      : (props.$isDark ? '#fff' : '#333')
  };
  
  align-self: ${props => props.$sender === 'user' ? 'flex-end' : 'flex-start'};
  
  p {
    margin: 0 0 0.5rem 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CodeBlock = styled.pre<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 0.75rem;
  border-radius: 6px;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  overflow-x: auto;
  margin: 0.5rem 0;
  white-space: pre-wrap;
  word-break: break-word;
`;

const InputContainer = styled.div<{ $isDark: boolean }>`
  margin-top: auto;
  position: relative;
  border-radius: 8px;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : '#fff'};
  overflow: hidden;
`;

const MessageInput = styled.textarea<{ $isDark: boolean }>`
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: none;
  background: transparent;
  color: inherit;
  resize: none;
  min-height: 60px;
  font-size: 0.95rem;
  line-height: 1.5;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  }
`;

const SendButton = styled(motion.button)<{ $isDark: boolean }>`
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: white;
  border: none;
  cursor: pointer;
  padding: 0;
  
  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
`;

const FeatureButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(128, 128, 128, 0.5);
    border-radius: 4px;
  }
`;

const FeatureButton = styled.button<{ $isDark: boolean, $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  background-color: ${props => 
    props.$active 
      ? 'var(--color-primary)' 
      : (props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)')
  };
  color: ${props => props.$active ? '#fff' : 'inherit'};
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  &:hover {
    background-color: ${props => 
      props.$active 
        ? 'var(--color-primary-dark)' 
        : (props.$isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)')
    };
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const IDEIntegrationButton = styled(FeatureButton)<{ $connected: boolean }>`
  background-color: ${props => 
    props.$connected 
      ? '#10b981' 
      : (props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)')
  };
  color: ${props => props.$connected ? '#fff' : 'inherit'};
  
  &:hover {
    background-color: ${props => 
      props.$connected 
        ? '#059669' 
        : (props.$isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)')
    };
  }
`;

const Timestamp = styled.span<{ $isDark: boolean }>`
  font-size: 0.7rem;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
  display: block;
  margin-top: 0.25rem;
  text-align: right;
`;

const ConceptTag = styled.span<{ $isDark: boolean }>`
  display: inline-block;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
`;

const IDEActionButton = styled(motion.button)<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'};
  color: ${props => props.$isDark ? '#10b981' : '#059669'};
  border: 1px solid ${props => props.$isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'};
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  margin-top: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.15)'};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Mock initial messages based on context and skill level
const getInitialMessages = (_chapterId: string, _sectionId: string, skillLevel: string): Message[] => {
  const timestamp = new Date();
  
  // Common welcome message
  const welcome: Message = {
    id: 'welcome',
    sender: 'assistant',
    content: 'Welcome to the Vibe Coding Assistant! I\'m here to help you master AI-assisted programming.',
    timestamp: new Date(timestamp.getTime() - 1000)
  };
  
  let contextualMessage: Message;
  
  // Customize second message based on skill level
  if (skillLevel === 'ninja') {
    contextualMessage = {
      id: 'context',
      sender: 'assistant',
      content: 'I notice you\'re on the Ninja pathway. I\'ll focus on advanced concepts and cutting-edge techniques. Feel free to ask about integrating these ideas into your existing workflow.',
      timestamp,
      relatedConcept: 'Advanced Prompt Engineering'
    };
  } else if (skillLevel === 'advanced') {
    contextualMessage = {
      id: 'context',
      sender: 'assistant',
      content: 'You\'re on the Advanced pathway. I\'ll provide detailed explanations and help you optimize your AI collaboration techniques. Let me know if you want to dive deeper on any topic.',
      timestamp,
      relatedConcept: 'Effective AI Collaboration'
    };
  } else {
    contextualMessage = {
      id: 'context',
      sender: 'assistant',
      content: 'I see you\'re on the Beginner pathway. I\'ll guide you through the basics and provide extra context where helpful. Don\'t hesitate to ask questions about any concept!',
      timestamp,
      relatedConcept: 'Fundamentals of Vibe Coding'
    };
  }
  
  return [welcome, contextualMessage];
};

// Generate response based on user input, context, and skill level
const generateResponse = (
  input: string, 
  _chapterId: string, 
  _sectionId: string, 
  skillLevel: string
): Promise<Message> => {
  // In a real implementation, this would call an LLM API
  return new Promise(resolve => {
    setTimeout(() => {
      const timestamp = new Date();
      
      // Simple keyword-based responses for demo
      if (input.toLowerCase().includes('code') || input.toLowerCase().includes('example')) {
        resolve({
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: 'Here\'s an example of how you might approach this:',
          codeSnippet: `function vibeCode(prompt) {
  // First, analyze the intent behind the prompt
  const intent = analyzeIntent(prompt);
  
  // Then generate code based on that intent
  const generatedCode = generateCode(intent);
  
  // Finally, validate and refine the code
  return refineCode(generatedCode);
}`,
          timestamp,
          relatedConcept: 'Code Generation Patterns'
        });
      } else if (input.toLowerCase().includes('ide') || input.toLowerCase().includes('vscode') || input.toLowerCase().includes('editor')) {
        resolve({
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: 'I can integrate directly with your code editor to provide contextual assistance. Would you like to connect to VS Code now?',
          timestamp,
          ideIntegration: true
        });
      } else if (input.toLowerCase().includes('help') || input.toLowerCase().includes('understand')) {
        resolve({
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: skillLevel === 'beginner' 
            ? 'Let\'s break this down into simpler concepts. Vibe coding is about expressing your intent clearly and letting AI assist with implementation details.' 
            : 'The key insight here is that effective vibe coding requires a balance between high-level intent description and sufficient technical specificity.',
          timestamp,
          relatedConcept: 'Intent vs. Implementation'
        });
      } else {
        resolve({
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: 'That\'s an interesting point! Would you like me to elaborate on this concept or provide some practical examples you can try in your coding environment?',
          timestamp
        });
      }
    }, 1000);
  });
};

// Component
const AssistantPanel: React.FC<AssistantPanelProps> = ({ 
  chapterId, 
  sectionId, 
  skillLevel 
}) => {
  const { darkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState('assistant');
  const [isIDEConnected, setIsIDEConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize with contextual messages
  useEffect(() => {
    const initialMessages = getInitialMessages(chapterId, sectionId, skillLevel);
    setMessages(initialMessages);
  }, [chapterId, sectionId, skillLevel]);
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await generateResponse(input, chapterId, sectionId, skillLevel);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error generating response:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleIDEConnection = () => {
    // In a real implementation, this would initiate a connection with the IDE
    // through a browser extension or desktop integration
    setIsIDEConnected(prev => !prev);
    
    if (!isIDEConnected) {
      // Add confirmation message
      setMessages(prev => [...prev, {
        id: `ide-${Date.now()}`,
        sender: 'assistant',
        content: 'IDE connection established! I can now see your code context and provide more targeted assistance.',
        timestamp: new Date(),
        ideIntegration: true
      }]);
    }
  };
  
  const handleIDEAction = (action: string) => {
    // In a real implementation, this would send commands to the connected IDE
    console.log(`IDE action: ${action}`);
    
    // Add confirmation message
    setMessages(prev => [...prev, {
      id: `ide-action-${Date.now()}`,
      sender: 'assistant',
      content: `I've sent the ${action} to your IDE. You should see the changes reflected in your editor.`,
      timestamp: new Date(),
      ideIntegration: true
    }]);
  };
  
  return (
    <PanelContainer>
      <PanelTitle>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
        Vibe Coding Assistant
      </PanelTitle>
      
      <FeatureButtonsContainer>
        <FeatureButton 
          $isDark={darkMode}
          $active={activeFeature === 'assistant'}
          onClick={() => setActiveFeature('assistant')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
          </svg>
          Assistant
        </FeatureButton>
        
        <FeatureButton 
          $isDark={darkMode}
          $active={activeFeature === 'progress'}
          onClick={() => setActiveFeature('progress')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
          </svg>
          Progress
        </FeatureButton>
        
        <IDEIntegrationButton 
          $isDark={darkMode}
          $connected={isIDEConnected}
          onClick={handleIDEConnection}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>
          {isIDEConnected ? 'Connected to IDE' : 'Connect to IDE'}
        </IDEIntegrationButton>
      </FeatureButtonsContainer>
      
      {activeFeature === 'assistant' ? (
        <>
          <MessageContainer>
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  $sender={message.sender}
                  $isDark={darkMode}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>{message.content}</div>
                  
                  {message.codeSnippet && (
                    <CodeBlock $isDark={darkMode}>
                      {message.codeSnippet}
                    </CodeBlock>
                  )}
                  
                  {message.ideIntegration && (
                    <IDEActionButton 
                      $isDark={darkMode}
                      onClick={() => handleIDEAction('insert-code')}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                      </svg>
                      Insert into editor
                    </IDEActionButton>
                  )}
                  
                  {message.relatedConcept && (
                    <ConceptTag $isDark={darkMode}>
                      {message.relatedConcept}
                    </ConceptTag>
                  )}
                  
                  <Timestamp $isDark={darkMode}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Timestamp>
                </MessageBubble>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </MessageContainer>
          
          <InputContainer $isDark={darkMode}>
            <MessageInput
              $isDark={darkMode}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Vibe Coding or request help..."
              rows={1}
            />
            <SendButton
              $isDark={darkMode}
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </SendButton>
          </InputContainer>
        </>
      ) : (
        <EngagementTracker 
          chapterId={chapterId} 
          sectionId={sectionId} 
          userId="current-user" // In a real app, this would be the actual user ID
        />
      )}
    </PanelContainer>
  );
};

export default AssistantPanel;
