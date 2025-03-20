import React, { useState } from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { useTheme } from '../../styles/ThemeProvider';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  title?: string;
  editable?: boolean;
  onCodeChange?: (code: string) => void;
  aiSuggestions?: Array<{
    trigger: string;
    completion: string;
    explanation: string;
  }>;
}

const EditorContainer = styled(motion.div)`
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  margin: 1.5rem 0;
  border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const EditorHeader = styled.div`
  background-color: ${props => props.theme === 'dark' ? 'var(--color-dark-light)' : '#f5f5f5'};
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const EditorTitle = styled.div`
  font-family: var(--font-code);
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LanguageBadge = styled.span<{ language: string }>`
  display: inline-block;
  background-color: ${props => {
    switch (props.language) {
      case 'javascript':
      case 'js':
        return '#f7df1e';
      case 'typescript':
      case 'ts':
        return '#3178c6';
      case 'python':
      case 'py':
        return '#306998';
      case 'html':
        return '#e34c26';
      case 'css':
        return '#264de4';
      case 'jsx':
      case 'tsx':
        return '#61dafb';
      default:
        return 'var(--color-gray)';
    }
  }};
  color: ${props => {
    switch (props.language) {
      case 'javascript':
      case 'js':
        return 'black';
      default:
        return 'white';
    }
  }};
  padding: 0.125rem 0.375rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'ghost' }>`
  border: none;
  background-color: ${props => {
    if (props.variant === 'primary') return 'var(--color-primary)';
    if (props.variant === 'secondary') return 'transparent';
    return 'transparent';
  }};
  color: ${props => {
    if (props.variant === 'primary') return 'white';
    if (props.variant === 'secondary') return 'var(--color-primary)';
    return props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)';
  }};
  border: ${props => props.variant === 'secondary' ? '1px solid var(--color-primary)' : 'none'};
  padding: 0.375rem 0.75rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => {
      if (props.variant === 'primary') return 'var(--color-primary-dark)';
      if (props.variant === 'secondary') return 'rgba(109, 40, 217, 0.1)';
      return props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    }};
  }
`;

const CodeContainer = styled.div`
  position: relative;
`;

const EditorTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  font-family: var(--font-code);
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 1rem;
  border: none;
  resize: vertical;
  background-color: ${props => props.theme === 'dark' ? 'var(--color-dark)' : 'white'};
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
  
  &:focus {
    outline: none;
  }
`;

const SuggestionPopup = styled(motion.div)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: ${props => props.theme === 'dark' ? 'var(--color-dark-light)' : 'white'};
  border: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: var(--border-radius-md);
  padding: 1rem;
  box-shadow: var(--shadow-lg);
  max-width: 300px;
  z-index: 10;
`;

const SuggestionTitle = styled.h4`
  margin-bottom: 0.5rem;
  color: var(--color-primary);
`;

const SuggestionText = styled.p`
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const SuggestionCode = styled.pre`
  background-color: ${props => props.theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 0.5rem;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-code);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  overflow-x: auto;
  color: ${props => props.theme === 'dark' ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language,
  title = 'Code Editor',
  editable = true,
  onCodeChange,
  aiSuggestions = []
}) => {
  const { darkMode } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [activeSuggestion, setActiveSuggestion] = useState<{
    trigger: string;
    completion: string;
    explanation: string;
  } | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    if (onCodeChange) {
      onCodeChange(newCode);
    }
    
    // Check for AI suggestions based on the code
    if (aiSuggestions.length > 0) {
      const suggestion = aiSuggestions.find(s => newCode.includes(s.trigger));
      setActiveSuggestion(suggestion || null);
    }
  };

  const applySuggestion = () => {
    if (activeSuggestion) {
      const newCode = code.replace(
        activeSuggestion.trigger,
        activeSuggestion.completion
      );
      setCode(newCode);
      
      if (onCodeChange) {
        onCodeChange(newCode);
      }
      
      setActiveSuggestion(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    // Could add a toast notification here
  };
  
  const resetCode = () => {
    setCode(initialCode);
    if (onCodeChange) {
      onCodeChange(initialCode);
    }
  };

  return (
    <EditorContainer
      theme={darkMode ? 'dark' : 'light'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <EditorHeader theme={darkMode ? 'dark' : 'light'}>
        <EditorTitle theme={darkMode ? 'dark' : 'light'}>
          {title}
          <LanguageBadge language={language}>
            {language}
          </LanguageBadge>
        </EditorTitle>
        <ButtonsContainer>
          <Button 
            onClick={copyToClipboard}
            theme={darkMode ? 'dark' : 'light'}
          >
            Copy
          </Button>
          {editable && (
            <Button 
              onClick={resetCode}
              theme={darkMode ? 'dark' : 'light'}
            >
              Reset
            </Button>
          )}
        </ButtonsContainer>
      </EditorHeader>
      
      <CodeContainer>
        {editable ? (
          <EditorTextarea
            value={code}
            onChange={handleCodeChange}
            theme={darkMode ? 'dark' : 'light'}
          />
        ) : (
          <SyntaxHighlighter
            language={language}
            style={darkMode ? vscDarkPlus : prism}
            customStyle={{
              margin: 0,
              padding: '1rem',
              borderRadius: 0,
            }}
          >
            {code}
          </SyntaxHighlighter>
        )}
        
        {activeSuggestion && (
          <SuggestionPopup
            theme={darkMode ? 'dark' : 'light'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <SuggestionTitle>AI Suggestion</SuggestionTitle>
            <SuggestionText theme={darkMode ? 'dark' : 'light'}>
              {activeSuggestion.explanation}
            </SuggestionText>
            <SuggestionCode theme={darkMode ? 'dark' : 'light'}>
              {activeSuggestion.completion}
            </SuggestionCode>
            <Button variant="primary" onClick={applySuggestion}>
              Apply Suggestion
            </Button>
          </SuggestionPopup>
        )}
      </CodeContainer>
    </EditorContainer>
  );
};

export default CodeEditor;
