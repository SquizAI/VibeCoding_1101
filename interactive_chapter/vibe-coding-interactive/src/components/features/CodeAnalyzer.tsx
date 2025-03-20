import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';
import { getStructuredOutput, OpenAIModel } from '../../utils/openai';
import { codeAnalysisSchema, CodeAnalysisResult } from '../../utils/schemas';
import CodeEditor from '../common/CodeEditor';

interface CodeAnalyzerProps {
  initialCode?: string;
  language?: string;
}

const Container = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: ${props => props.$isDark ? 'var(--color-dark-accent)' : 'var(--color-white)'};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2<{ $isDark: boolean }>`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const Description = styled.p<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ $primary?: boolean; $isDark: boolean }>`
  padding: 0.625rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$primary 
    ? `
      background-color: var(--color-primary);
      color: white;
      border: none;
      
      &:hover {
        background-color: var(--color-primary-dark);
      }
    ` 
    : `
      background-color: transparent;
      color: ${props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
      border: 1px solid ${props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
      
      &:hover {
        background-color: ${props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
      }
    `}
`;

const AnalysisContainer = styled.div<{ $isDark: boolean }>`
  border-radius: 0.375rem;
  padding: 1.5rem;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
`;

const AnalysisSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3<{ $level?: string; $isDark: boolean }>`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: ${props => {
    if (props.$level === 'beginner') return 'var(--color-beginner)';
    if (props.$level === 'advanced') return 'var(--color-advanced)';
    if (props.$level === 'ninja') return 'var(--color-ninja)';
    return props.$isDark ? 'var(--color-light)' : 'var(--color-dark)';
  }};
`;

const List = styled.ul<{ $isDark: boolean }>`
  list-style-type: circle;
  margin-left: 1.5rem;
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ScoreLabel = styled.span<{ $isDark: boolean }>`
  font-weight: 500;
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const ScoreValue = styled.span<{ $score: number; $isDark: boolean }>`
  font-weight: 700;
  color: ${props => {
    if (props.$score >= 8) return 'var(--color-ninja)';
    if (props.$score >= 5) return 'var(--color-advanced)';
    return 'var(--color-beginner)';
  }};
`;

const LoadingIndicator = styled.div<{ $isDark: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const ErrorMessage = styled.div<{ $isDark: boolean }>`
  padding: 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 0.375rem;
  color: #ef4444;
`;

const Improvement = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ImprovementTitle = styled.h4<{ $isDark: boolean }>`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const ImprovementDescription = styled.p<{ $isDark: boolean }>`
  margin-bottom: 0.75rem;
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const ApiKeyInput = styled.input<{ $isDark: boolean }>`
  padding: 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  background-color: ${props => props.$isDark ? 'var(--color-dark-light)' : 'var(--color-white)'};
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  width: 100%;
  margin-bottom: 1rem;
  
  &::placeholder {
    color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
  }
`;

const ModelSelector = styled.select<{ $isDark: boolean }>`
  padding: 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  background-color: ${props => props.$isDark ? 'var(--color-dark-light)' : 'var(--color-white)'};
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  width: 100%;
  margin-bottom: 1rem;
`;

const CodeAnalyzer: React.FC<CodeAnalyzerProps> = ({ 
  initialCode = "// Enter your code here\nfunction example() {\n  // Your code will be analyzed\n  console.log('Hello, Vibe Coding!');\n}",
  language = "javascript" 
}) => {
  const { darkMode } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>(OpenAIModel.O1_LATEST);
  const [analysis, setAnalysis] = useState<CodeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Import dynamically to avoid exposing in client bundle
      const { initializeOpenAI } = await import('../../utils/openai');
      
      // Initialize with API key
      initializeOpenAI(apiKey);
      
      const prompt = `Analyze the following ${language} code and provide detailed feedback:
\`\`\`${language}
${code}
\`\`\`

Analyze the code in terms of:
1. Skill level (beginner, advanced, or ninja)
2. Code quality (score from 0-10)
3. Key strengths
4. Areas for improvement
5. Specific suggestions with code examples

Please be thorough and provide actionable feedback.`;

      const result = await getStructuredOutput<CodeAnalysisResult>(
        prompt,
        selectedModel,
        codeAnalysisSchema,
        0.7
      );
      
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCode(initialCode);
    setAnalysis(null);
    setError(null);
  };

  return (
    <Container $isDark={darkMode}>
      <div>
        <Title $isDark={darkMode}>Code Analyzer</Title>
        <Description $isDark={darkMode}>
          Enter your code below and get AI-powered analysis using OpenAI's structured output API.
          The analysis will include skill level assessment, code quality score, strengths, weaknesses, and suggested improvements.
        </Description>
      </div>
      
      <ApiKeyInput
        type="password"
        placeholder="Enter your OpenAI API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        $isDark={darkMode}
      />
      
      <ModelSelector 
        value={selectedModel} 
        onChange={(e) => setSelectedModel(e.target.value as OpenAIModel)} 
        $isDark={darkMode}
      >
        <option value={OpenAIModel.O1_LATEST}>o1 (Latest)</option>
        <option value={OpenAIModel.O1_2024_12_17}>o1-2024-12-17</option>
        <option value={OpenAIModel.GPT4O_MINI_2024_07_18}>gpt-4o-mini-2024-07-18</option>
        <option value={OpenAIModel.GPT4O_2024_08_06}>gpt-4o-2024-08-06</option>
      </ModelSelector>
      
      <CodeEditor
        initialCode={code}
        language={language}
        title="Your Code"
        editable={true}
        onCodeChange={setCode}
      />
      
      <ButtonContainer>
        <Button onClick={handleClear} $isDark={darkMode}>
          Clear
        </Button>
        <Button onClick={handleAnalyze} $primary $isDark={darkMode}>
          Analyze Code
        </Button>
      </ButtonContainer>
      
      {error && (
        <ErrorMessage $isDark={darkMode}>
          {error}
        </ErrorMessage>
      )}
      
      {isLoading && (
        <LoadingIndicator $isDark={darkMode}>
          Analyzing your code... This may take a moment.
        </LoadingIndicator>
      )}
      
      {analysis && !isLoading && (
        <AnalysisContainer $isDark={darkMode}>
          <AnalysisSection>
            <SectionTitle $level={analysis.analysis.skillLevel} $isDark={darkMode}>
              Skill Level: {analysis.analysis.skillLevel.charAt(0).toUpperCase() + analysis.analysis.skillLevel.slice(1)}
            </SectionTitle>
            
            <ScoreContainer>
              <ScoreLabel $isDark={darkMode}>Code Quality Score:</ScoreLabel>
              <ScoreValue $score={analysis.analysis.codeQuality} $isDark={darkMode}>
                {analysis.analysis.codeQuality}/10
              </ScoreValue>
            </ScoreContainer>
          </AnalysisSection>
          
          <AnalysisSection>
            <SectionTitle $isDark={darkMode}>Strengths</SectionTitle>
            <List $isDark={darkMode}>
              {analysis.analysis.strengths.map((strength, index) => (
                <ListItem key={`strength-${index}`}>{strength}</ListItem>
              ))}
            </List>
          </AnalysisSection>
          
          <AnalysisSection>
            <SectionTitle $isDark={darkMode}>Areas for Improvement</SectionTitle>
            <List $isDark={darkMode}>
              {analysis.analysis.weaknesses.map((weakness, index) => (
                <ListItem key={`weakness-${index}`}>{weakness}</ListItem>
              ))}
            </List>
          </AnalysisSection>
          
          <AnalysisSection>
            <SectionTitle $isDark={darkMode}>Suggested Improvements</SectionTitle>
            {analysis.analysis.suggestedImprovements.map((improvement, index) => (
              <Improvement key={`improvement-${index}`}>
                <ImprovementTitle $isDark={darkMode}>{improvement.title}</ImprovementTitle>
                <ImprovementDescription $isDark={darkMode}>
                  {improvement.description}
                </ImprovementDescription>
                <CodeEditor
                  initialCode={improvement.codeExample}
                  language={language}
                  title="Improved Code"
                  editable={false}
                />
              </Improvement>
            ))}
          </AnalysisSection>
        </AnalysisContainer>
      )}
    </Container>
  );
};

export default CodeAnalyzer;
