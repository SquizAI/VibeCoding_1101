import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../styles/ThemeProvider';
import CodeEditor from './CodeEditor';

interface SkillLevelComparisonProps {
  title: string;
  beginnerCode: string;
  advancedCode: string;
  ninjaCode: string;
  beginnerLanguage?: string;
  advancedLanguage?: string;
  ninjaLanguage?: string;
  activeLevel?: 'beginner' | 'advanced' | 'ninja';
  description?: string;
}

const ComparisonContainer = styled(motion.div)<{ $isDark: boolean }>`
  margin: 2rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: ${props => props.$isDark ? 'var(--color-dark-accent)' : 'var(--color-white)'};
`;

const ComparisonHeader = styled.div<{ $isDark: boolean }>`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const ComparisonTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const ComparisonDescription = styled.p<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  margin-bottom: 1rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Tab = styled(motion.button)<{ $active: boolean; $level: string }>`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${props => props.$active ? 
    (props.$level === 'beginner' ? 'var(--color-beginner)' : 
     props.$level === 'advanced' ? 'var(--color-advanced)' : 
     'var(--color-ninja)') : 'transparent'};
  color: ${props => props.$active ? 'white' : 
    (props.$level === 'beginner' ? 'var(--color-beginner)' : 
     props.$level === 'advanced' ? 'var(--color-advanced)' : 
     'var(--color-ninja)')};
  border-radius: 9999px;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: ${props => props.$active ? '' : 
      (props.$level === 'beginner' ? 'rgba(59, 130, 246, 0.1)' : 
       props.$level === 'advanced' ? 'rgba(236, 72, 153, 0.1)' : 
       'rgba(139, 92, 246, 0.1)')};
  }
`;

const TabContent = styled(motion.div)`
  padding: 1.5rem;
`;

const SkillLevelDescription = styled.div<{ $level: string }>`
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: ${props => {
    switch (props.$level) {
      case 'beginner': return 'rgba(59, 130, 246, 0.1)';
      case 'advanced': return 'rgba(236, 72, 153, 0.1)';
      case 'ninja': return 'rgba(139, 92, 246, 0.1)';
      default: return 'rgba(0, 0, 0, 0.05)';
    }
  }};
`;

const SkillLevelTitle = styled.h3<{ $level: string }>`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${props => {
    switch (props.$level) {
      case 'beginner': return 'var(--color-beginner)';
      case 'advanced': return 'var(--color-advanced)';
      case 'ninja': return 'var(--color-ninja)';
      default: return 'inherit';
    }
  }};
`;

const SkillLevelText = styled.p<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
`;

const ToolTag = styled.span<{ tool: string }>`
  display: inline-block;
  background-color: ${props => {
    switch (props.tool) {
      case 'bolt': return '#FFC107';
      case 'cursor': return '#0CA5E9';
      case 'windsurf': return '#805AD5';
      default: return 'var(--color-gray)';
    }
  }};
  color: ${props => props.tool === 'bolt' ? 'black' : 'white'};
  padding: 0.125rem 0.5rem;
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  font-weight: bold;
  margin-left: 0.5rem;
`;

const descriptions = {
  beginner: {
    text: "Perfect for beginners, this approach uses Bolt.new to quickly scaffold projects with minimal setup. The focus is on understanding the core concepts rather than implementation details.",
    tool: "bolt"
  },
  advanced: {
    text: "For experienced developers, this approach leverages Cursor to optimize workflows and implement more sophisticated patterns while maintaining control over the codebase.",
    tool: "cursor"
  },
  ninja: {
    text: "This expert-level approach uses Windsurf to implement cutting-edge techniques, with a focus on efficiency, scalability, and pushing the boundaries of what's possible.",
    tool: "windsurf"
  }
};

const SkillLevelComparison: React.FC<SkillLevelComparisonProps> = ({
  title,
  description,
  beginnerCode,
  advancedCode,
  ninjaCode,
  beginnerLanguage = 'javascript',
  advancedLanguage = 'javascript',
  ninjaLanguage = 'javascript',
  activeLevel
}) => {
  const { darkMode, skillLevel } = useTheme();
  const [activeTab, setActiveTab] = useState<'beginner' | 'advanced' | 'ninja'>(activeLevel || skillLevel);

  return (
    <ComparisonContainer
      $isDark={darkMode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ComparisonHeader $isDark={darkMode}>
        <ComparisonTitle $isDark={darkMode}>{title}</ComparisonTitle>
        {description && <ComparisonDescription $isDark={darkMode}>{description}</ComparisonDescription>}
        
        <TabsContainer>
          <Tab
            $active={activeTab === 'beginner'}
            $level="beginner"
            onClick={() => setActiveTab('beginner')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Beginner
          </Tab>
          <Tab
            $active={activeTab === 'advanced'}
            $level="advanced"
            onClick={() => setActiveTab('advanced')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Advanced
          </Tab>
          <Tab
            $active={activeTab === 'ninja'}
            $level="ninja"
            onClick={() => setActiveTab('ninja')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ninja
          </Tab>
        </TabsContainer>
      </ComparisonHeader>
      
      <AnimatePresence mode="wait">
        <TabContent
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <SkillLevelDescription $level={activeTab}>
            <SkillLevelTitle $level={activeTab}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Approach
              <ToolTag tool={descriptions[activeTab].tool}>
                {descriptions[activeTab].tool === 'bolt' ? 'Bolt.new' : 
                 descriptions[activeTab].tool === 'cursor' ? 'Cursor' : 'Windsurf'}
              </ToolTag>
            </SkillLevelTitle>
            <SkillLevelText $isDark={darkMode}>
              {descriptions[activeTab].text}
            </SkillLevelText>
          </SkillLevelDescription>
          
          <CodeEditor
            initialCode={activeTab === 'beginner' ? beginnerCode : 
                 activeTab === 'advanced' ? advancedCode : ninjaCode}
            language={activeTab === 'beginner' ? beginnerLanguage : 
                     activeTab === 'advanced' ? advancedLanguage : ninjaLanguage}
            title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Implementation`}
            editable={false}
          />
        </TabContent>
      </AnimatePresence>
    </ComparisonContainer>
  );
};

export default SkillLevelComparison;
