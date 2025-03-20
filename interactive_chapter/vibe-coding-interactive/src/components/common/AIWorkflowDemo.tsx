import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../styles/ThemeProvider';
import CodeEditor from './CodeEditor';

interface Step {
  id: number;
  title: string;
  description: string;
  userInput?: string;
  aiResponse?: string;
  code?: string;
  language?: string;
}

interface WorkflowProps {
  title: string;
  description: string;
  tool: 'bolt' | 'cursor' | 'windsurf';
  steps: Step[];
}

const DemoContainer = styled(motion.div)`
  margin: 2rem 0;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background-color: ${props => props.theme === 'dark' ? 'var(--color-dark-light)' : 'var(--color-white)'};
`;

const DemoHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const DemoTitle = styled.h2<{ tool: string }>`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => {
    switch (props.tool) {
      case 'bolt': return '#FFC107';
      case 'cursor': return '#0CA5E9';
      case 'windsurf': return '#805AD5';
      default: return 'inherit';
    }
  }};
  display: flex;
  align-items: center;
`;

const ToolIcon = styled.span<{ tool: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 0.75rem;
  border-radius: var(--border-radius-full);
  background-color: ${props => {
    switch (props.tool) {
      case 'bolt': return '#FFC107';
      case 'cursor': return '#0CA5E9';
      case 'windsurf': return '#805AD5';
      default: return 'var(--color-gray)';
    }
  }};
  color: ${props => props.tool === 'bolt' ? 'black' : 'white'};
  font-weight: bold;
  font-size: 1rem;
`;

const DemoDescription = styled.p`
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
  margin-bottom: 1.5rem;
`;

const StepsContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    border-radius: var(--border-radius-full);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: var(--border-radius-full);
  }
`;

const StepButton = styled(motion.button)<{ active: boolean; tool: string }>`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? 
    (props.tool === 'bolt' ? '#FFC107' : 
     props.tool === 'cursor' ? '#0CA5E9' : 
     '#805AD5') : 'transparent'};
  color: ${props => props.active ? 
    (props.tool === 'bolt' ? 'black' : 'white') : 
    props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
  border: 1px solid ${props => 
    props.tool === 'bolt' ? '#FFC107' : 
    props.tool === 'cursor' ? '#0CA5E9' : 
    '#805AD5'};
  border-radius: var(--border-radius-full);
  margin-right: 0.5rem;
  min-width: max-content;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '' : 
      (props.tool === 'bolt' ? 'rgba(255, 193, 7, 0.1)' : 
       props.tool === 'cursor' ? 'rgba(12, 165, 233, 0.1)' : 
       'rgba(128, 90, 213, 0.1)')};
  }
`;

const StepNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
`;

const DemoContent = styled.div`
  padding: 1.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const StepDescription = styled.p`
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
  margin-bottom: 1.5rem;
`;

const ChatContainer = styled.div`
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const UserMessage = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const UserLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const UserText = styled.div`
  font-family: var(--font-code);
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
  white-space: pre-wrap;
`;

const AIMessage = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme === 'dark' ? 'rgba(128, 90, 213, 0.1)' : 'rgba(128, 90, 213, 0.05)'};
`;

const AILabel = styled.div<{ tool: string }>`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => {
    switch (props.tool) {
      case 'bolt': return '#FFC107';
      case 'cursor': return '#0CA5E9';
      case 'windsurf': return '#805AD5';
      default: return 'inherit';
    }
  }};
`;

const AIText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
  white-space: pre-wrap;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const NavButton = styled(motion.button)<{ variant: 'back' | 'next'; tool: string }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.variant === 'next' ? 
    (props.tool === 'bolt' ? '#FFC107' : 
     props.tool === 'cursor' ? '#0CA5E9' : 
     '#805AD5') : 'transparent'};
  color: ${props => props.variant === 'next' ? 
    (props.tool === 'bolt' ? 'black' : 'white') : 
    (props.tool === 'bolt' ? '#FFC107' : 
     props.tool === 'cursor' ? '#0CA5E9' : 
     '#805AD5')};
  border: 1px solid ${props => 
    props.tool === 'bolt' ? '#FFC107' : 
    props.tool === 'cursor' ? '#0CA5E9' : 
    '#805AD5'};
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.variant === 'next' ? 
      (props.tool === 'bolt' ? '#E6AF06' : 
       props.tool === 'cursor' ? '#0B95D2' : 
       '#7251BE') : 
      (props.tool === 'bolt' ? 'rgba(255, 193, 7, 0.1)' : 
       props.tool === 'cursor' ? 'rgba(12, 165, 233, 0.1)' : 
       'rgba(128, 90, 213, 0.1)')};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AIWorkflowDemo: React.FC<WorkflowProps> = ({
  title,
  description,
  tool,
  steps
}) => {
  const { darkMode } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  
  const currentStep = steps[activeStep];
  
  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };
  
  const getToolIcon = () => {
    switch (tool) {
      case 'bolt': return '⚡';
      case 'cursor': return '📝';
      case 'windsurf': return '🌊';
    }
  };
  
  const getToolName = () => {
    switch (tool) {
      case 'bolt': return 'Bolt.new';
      case 'cursor': return 'Cursor';
      case 'windsurf': return 'Windsurf';
    }
  };
  
  return (
    <DemoContainer
      theme={darkMode ? 'dark' : 'light'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DemoHeader>
        <DemoTitle tool={tool}>
          <ToolIcon tool={tool}>{getToolIcon()}</ToolIcon>
          {title}
        </DemoTitle>
        <DemoDescription theme={darkMode ? 'dark' : 'light'}>{description}</DemoDescription>
        
        <StepsContainer theme={darkMode ? 'dark' : 'light'}>
          {steps.map((step, index) => (
            <StepButton
              key={step.id}
              active={activeStep === index}
              tool={tool}
              theme={darkMode ? 'dark' : 'light'}
              onClick={() => setActiveStep(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <StepNumber theme={darkMode ? 'dark' : 'light'}>{index + 1}</StepNumber>
              {step.title}
            </StepButton>
          ))}
        </StepsContainer>
      </DemoHeader>
      
      <AnimatePresence mode="wait">
        <DemoContent
          key={activeStep}
          as={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <StepTitle theme={darkMode ? 'dark' : 'light'}>
            Step {activeStep + 1}: {currentStep.title}
          </StepTitle>
          <StepDescription theme={darkMode ? 'dark' : 'light'}>
            {currentStep.description}
          </StepDescription>
          
          {currentStep.userInput && currentStep.aiResponse && (
            <ChatContainer theme={darkMode ? 'dark' : 'light'}>
              <UserMessage theme={darkMode ? 'dark' : 'light'}>
                <UserLabel theme={darkMode ? 'dark' : 'light'}>User:</UserLabel>
                <UserText theme={darkMode ? 'dark' : 'light'}>{currentStep.userInput}</UserText>
              </UserMessage>
              <AIMessage theme={darkMode ? 'dark' : 'light'}>
                <AILabel tool={tool}>{getToolName()}:</AILabel>
                <AIText theme={darkMode ? 'dark' : 'light'}>{currentStep.aiResponse}</AIText>
              </AIMessage>
            </ChatContainer>
          )}
          
          {currentStep.code && (
            <CodeEditor
              language={currentStep.language || 'javascript'}
              initialCode={currentStep.code}
              title={`Generated Code - Step ${activeStep + 1}`}
              editable={false}
            />
          )}
          
          <NavigationButtons>
            <NavButton
              variant="back"
              tool={tool}
              onClick={handlePrevStep}
              disabled={activeStep === 0}
              whileHover={{ scale: activeStep === 0 ? 1 : 1.05 }}
              whileTap={{ scale: activeStep === 0 ? 1 : 0.95 }}
            >
              ← Previous Step
            </NavButton>
            <NavButton
              variant="next"
              tool={tool}
              onClick={handleNextStep}
              disabled={activeStep === steps.length - 1}
              whileHover={{ scale: activeStep === steps.length - 1 ? 1 : 1.05 }}
              whileTap={{ scale: activeStep === steps.length - 1 ? 1 : 0.95 }}
            >
              Next Step →
            </NavButton>
          </NavigationButtons>
        </DemoContent>
      </AnimatePresence>
    </DemoContainer>
  );
};

export default AIWorkflowDemo;
