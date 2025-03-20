import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';
import { motion } from 'framer-motion';

interface CodeSandboxProps {
  code: string;
  language: string;
  interactive?: boolean;
}

const SandboxContainer = styled.div<{ $isDark: boolean }>`
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: ${props => props.$isDark ? '#1e1e1e' : '#f5f5f5'};
`;

const SandboxHeader = styled.div<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.$isDark ? '#2d2d2d' : '#e5e5e5'};
  border-bottom: 1px solid ${props => props.$isDark ? '#444' : '#ddd'};
`;

const SandboxTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LanguageTag = styled.span<{ $isDark: boolean }>`
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background-color: ${props => props.$isDark ? '#444' : '#ddd'};
  color: ${props => props.$isDark ? '#ccc' : '#555'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? '#444' : '#ddd'};
  color: ${props => props.$isDark ? '#eee' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$isDark ? '#555' : '#ccc'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EditorContainer = styled.div`
  position: relative;
`;

const CodeEditor = styled.textarea<{ $isDark: boolean, $height: string }>`
  width: 100%;
  height: ${props => props.$height};
  padding: 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${props => props.$isDark ? '#eee' : '#333'};
  background-color: ${props => props.$isDark ? '#1e1e1e' : '#f8f8f8'};
  border: none;
  resize: none;
  tab-size: 2;
  
  &:focus {
    outline: none;
  }
`;

const OutputContainer = styled.div<{ $isDark: boolean, $isError?: boolean }>`
  padding: 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  background-color: ${props => props.$isDark ? 
    (props.$isError ? '#2d1e1e' : '#1e2d1e') : 
    (props.$isError ? '#fff0f0' : '#f0fff0')};
  border-top: 1px solid ${props => props.$isDark ? 
    (props.$isError ? '#5a3232' : '#325a32') : 
    (props.$isError ? '#ffcccc' : '#ccffcc')};
  color: ${props => props.$isDark ? 
    (props.$isError ? '#ff8888' : '#88ff88') : 
    (props.$isError ? '#cc0000' : '#00cc00')};
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const AIAssistanceContainer = styled.div<{ $isDark: boolean }>`
  padding: 1rem;
  background-color: ${props => props.$isDark ? 'rgba(52, 152, 219, 0.1)' : 'rgba(52, 152, 219, 0.05)'};
  border-top: 1px solid ${props => props.$isDark ? 'rgba(52, 152, 219, 0.3)' : 'rgba(52, 152, 219, 0.2)'};
`;

const AIPromptInput = styled.textarea<{ $isDark: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid ${props => props.$isDark ? '#444' : '#ddd'};
  background-color: ${props => props.$isDark ? '#2d2d2d' : '#fff'};
  color: ${props => props.$isDark ? '#eee' : '#333'};
  font-size: 0.9rem;
  resize: none;
  min-height: 80px;
  margin-bottom: 0.75rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }
`;

const SubmitButton = styled(motion.button)`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  float: right;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AIResponseContainer = styled.div<{ $isDark: boolean }>`
  padding: 1rem;
  background-color: ${props => props.$isDark ? 'rgba(52, 152, 219, 0.15)' : 'rgba(52, 152, 219, 0.1)'};
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

// Simulated code execution engine
const executeCode = (code: string): Promise<{ result: string, error: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // This is a simplified version for demo purposes
        // In a real app, you'd use a secure evaluation method or a service
        const result = new Function(`
          try {
            let output = '';
            const originalConsoleLog = console.log;
            console.log = (...args) => {
              output += args.join(' ') + '\\n';
            };
            
            ${code}
            
            console.log = originalConsoleLog;
            return { result: output, error: false };
          } catch (e) {
            return { result: e.toString(), error: true };
          }
        `)();
        
        resolve(result);
      } catch (e) {
        resolve({ 
          result: e instanceof Error ? e.toString() : "An error occurred", 
          error: true 
        });
      }
    }, 500);
  });
};

// Simulated AI code assistance (in a real app, this would call OpenAI's API)
const generateCodeWithAI = async (prompt: string): Promise<string> => {
  // In a real implementation, this would call the OpenAI API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple responses for demonstration
      if (prompt.toLowerCase().includes('hello world')) {
        resolve(`// Here's a simple hello world function
function sayHello() {
  console.log("Hello, world!");
}

// Let's call it
sayHello();`);
      } else if (prompt.toLowerCase().includes('average')) {
        resolve(`// Function to calculate the average of an array of numbers
function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }
  
  const sum = numbers.reduce((total, num) => total + num, 0);
  return sum / numbers.length;
}

// Example usage
const numbers = [5, 10, 15, 20, 25];
const average = calculateAverage(numbers);
console.log(\`The average is: \${average}\`);`);
      } else {
        resolve(`// Here's some code based on your request
function processRequest() {
  console.log("Processing your request: ${prompt}");
  return "Request processed successfully";
}

const result = processRequest();
console.log(result);`);
      }
    }, 1000);
  });
};

const CodeSandbox: React.FC<CodeSandboxProps> = ({ 
  code, 
  language, 
  interactive = false
}) => {
  const { darkMode } = useTheme();
  const [editorValue, setEditorValue] = useState(code);
  const [output, setOutput] = useState<{ result: string, error: boolean } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Calculate appropriate editor height based on content
  const calculateEditorHeight = () => {
    const lineCount = (editorValue.match(/\n/g) || []).length + 2;
    const minLines = 5;
    const maxLines = 15;
    const lines = Math.min(Math.max(lineCount, minLines), maxLines);
    return `${lines * 1.5}rem`;
  };
  
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    
    try {
      const result = await executeCode(editorValue);
      setOutput(result);
    } catch (error) {
      setOutput({ 
        result: error instanceof Error ? error.message : "An unknown error occurred", 
        error: true 
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleGenerateCode = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setAiResponse('');
    
    try {
      const generatedCode = await generateCodeWithAI(aiPrompt);
      setAiResponse(generatedCode);
      
      // Option to apply generated code
      setEditorValue(generatedCode);
    } catch (error) {
      setAiResponse('Sorry, there was an error generating code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(editorValue);
  };
  
  const handleReset = () => {
    setEditorValue(code);
    setOutput(null);
  };
  
  return (
    <SandboxContainer $isDark={darkMode}>
      <SandboxHeader $isDark={darkMode}>
        <SandboxTitle>
          <span>Code Editor</span>
          <LanguageTag $isDark={darkMode}>{language}</LanguageTag>
        </SandboxTitle>
        <ActionButtons>
          <ActionButton 
            $isDark={darkMode} 
            onClick={handleCopy}
            title="Copy code"
          >
            Copy
          </ActionButton>
          <ActionButton 
            $isDark={darkMode} 
            onClick={handleRunCode}
            disabled={isRunning}
            title="Run code"
          >
            {isRunning ? 'Running...' : 'Run'}
          </ActionButton>
          <ActionButton 
            $isDark={darkMode} 
            onClick={handleReset}
            title="Reset to original code"
          >
            Reset
          </ActionButton>
        </ActionButtons>
      </SandboxHeader>
      
      <EditorContainer>
        <CodeEditor
          $isDark={darkMode}
          $height={calculateEditorHeight()}
          value={editorValue}
          onChange={(e) => setEditorValue(e.target.value)}
          spellCheck={false}
        />
      </EditorContainer>
      
      {output && (
        <OutputContainer $isDark={darkMode} $isError={output.error}>
          {output.result || 'No output'}
        </OutputContainer>
      )}
      
      {interactive && (
        <AIAssistanceContainer $isDark={darkMode}>
          <h4>AI Code Assistance</h4>
          <p>Describe what you want to create, and our AI will help generate the code for you.</p>
          
          <AIPromptInput
            $isDark={darkMode}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="E.g., Create a function that calculates the average of an array of numbers"
            rows={3}
          />
          
          <SubmitButton
            onClick={handleGenerateCode}
            disabled={isGenerating || !aiPrompt.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? 'Generating...' : 'Generate Code'}
          </SubmitButton>
          
          <div style={{ clear: 'both' }}></div>
          
          {aiResponse && (
            <AIResponseContainer $isDark={darkMode}>
              {aiResponse}
            </AIResponseContainer>
          )}
        </AIAssistanceContainer>
      )}
    </SandboxContainer>
  );
};

export default CodeSandbox;
