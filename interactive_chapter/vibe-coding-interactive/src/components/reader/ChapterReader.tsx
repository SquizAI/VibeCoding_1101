import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../styles/ThemeProvider';
import MainLayout from '../../layouts/MainLayout';

// Interfaces
interface ChapterSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'code' | 'image' | 'video' | 'interactive';
  codeLanguage?: string;

  completed: boolean;
}



interface ChapterData {
  id: string;
  title: string;
  description: string;
  sections: ChapterSection[];
  prerequisites: string[];
  learningObjectives: string[];
  estimatedTime: string;
}

// Styled Components
const ReaderContainer = styled.div<{ $isDark: boolean }>`
  display: flex;
  margin: 0 auto;
  max-width: 100%;
  min-height: calc(100vh - 80px);
  background-color: ${props => props.$isDark ? 'var(--color-dark-secondary)' : 'var(--color-light-secondary)'};
  transition: background-color 0.3s ease;
`;

const ChapterContent = styled.div`
  flex: 1;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ChapterHeader = styled.div`
  margin-bottom: 2rem;
`;

const ChapterDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 1rem 0 2rem;
`;

const LearningObjectives = styled.div<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border-left: 4px solid var(--color-primary);
  padding: 1.5rem;
  border-radius: 0 8px 8px 0;
  margin-bottom: 2rem;
`;

const ObjectivesList = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
`;

const SectionContainer = styled(motion.div)<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'var(--color-dark)' : 'var(--color-light)'};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: var(--color-primary);
    border-radius: 3px;
  }
`;

const SectionContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  
  p {
    margin-bottom: 1.2rem;
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  blockquote {
    border-left: 3px solid var(--color-primary);
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #666;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const NavButton = styled(motion.button)<{ $isDark: boolean, $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background-color: ${props => props.$primary ? 
    'var(--color-primary)' : 
    props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  
  color: ${props => props.$primary ? 
    '#fff' : 
    props.$isDark ? 'var(--color-light)' : 'var(--color-dark)'};
  
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.$primary ? 
      'var(--color-primary-dark)' : 
      props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ProgressContainer = styled.div`
  margin: 2rem 0;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

const SidePanel = styled.div<{ $isDark: boolean, $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '350px' : '60px'};
  background-color: ${props => props.$isDark ? 'var(--color-dark)' : 'var(--color-light)'};
  border-left: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  padding: ${props => props.$isOpen ? '1.5rem' : '1.5rem 0.5rem'};
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  transition: width 0.3s ease, padding 0.3s ease;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    position: fixed;
    right: 0;
    z-index: 90;
    transform: translateX(${props => props.$isOpen ? '0' : '100%'});
    width: 300px;
  }
`;

const PanelToggle = styled.button<{ $isDark: boolean, $isOpen: boolean }>`
  position: absolute;
  left: ${props => props.$isOpen ? '1rem' : '50%'};
  top: 1rem;
  transform: ${props => props.$isOpen ? 'none' : 'translateX(-50%)'};
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

// Mock data
const mockChapterData: ChapterData = {
  id: "chapter_01",
  title: "The Vibe Coding Revolution",
  description: "Explore the transformative shift in programming paradigms brought about by AI collaboration. This chapter introduces the core concepts of vibe coding and sets the foundation for effective human-AI partnership in software development.",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: `The world of software development is experiencing a seismic shift. For decades, the process of building software has followed a relatively consistent pattern: developers translate requirements into code, line by line, manually crafting solutions through an iterative process of writing, testing, and debugging. This approach has served the industry well, but it is now being fundamentally transformed by the emergence of sophisticated artificial intelligence capable of understanding and generating code.

This revolution—what we call "vibe coding"—represents a paradigm shift in how humans interact with computers to create software. Rather than focusing primarily on the mechanical aspects of coding, developers are increasingly able to operate at a higher level of abstraction, expressing their intent and having AI systems assist with implementation details. This collaborative approach elevates the developer's role from manual code generation to creative problem-solving and architectural design.

In this chapter, we'll explore the foundations of vibe coding, the technologies that enable it, and the mindset shift required to effectively leverage these powerful new tools. We'll examine how this approach is not merely a productivity enhancer but a fundamental reimagining of the development process—one that promises to make programming more accessible, efficient, and creative.`,
      type: "text",
      completed: false
    },
    {
      id: "foundations",
      title: "Foundations of AI-Assisted Development",
      content: `The capabilities that enable vibe coding have emerged from remarkable advances in artificial intelligence, particularly in the domain of large language models (LLMs). These models, trained on vast corpora of text and code, have demonstrated an unprecedented ability to understand the context, intent, and nuances of human communication. When applied to programming, these AI systems can:

1. Generate code from natural language descriptions: Translating high-level requirements into functional implementations
2. Complete partial code: Suggesting logical continuations based on existing patterns
3. Refactor and optimize: Improving code quality while preserving functionality
4. Explain and document: Providing clear explanations of complex code segments
5. Debug and troubleshoot: Identifying potential issues and suggesting fixes

This technological foundation is continually evolving, with new capabilities emerging regularly. The most advanced systems are increasingly able to understand broader project context, maintain consistency across multiple files, and even reason about architectural trade-offs.`,
      type: "text",
      completed: false
    },
    {
      id: "core_principles",
      title: "Core Principles of Vibe Coding",
      content: `At its heart, vibe coding represents a shift in how developers conceptualize their relationship with development tools. The fundamental principles include:

1. Intent over implementation: Focusing on clearly expressing what you want to achieve rather than how to implement it
2. Iterative refinement: Working collaboratively with AI to progressively enhance and refine solutions
3. Human-AI complementarity: Leveraging the unique strengths of both human creativity and AI's processing power
4. Prompting as programming: Developing skills in effectively communicating with AI systems
5. Verification over creation: Shifting emphasis from writing code to verifying and improving AI-generated solutions

These principles reorient the development process around a more conversational, collaborative model. Rather than starting with a blank editor and manually constructing solutions, developers engage in a dialogue with AI systems, iteratively refining their ideas and the resulting code.`,
      type: "text",
      completed: false
    },
    {
      id: "prompt_engineering",
      title: "The Art of Prompt Engineering",
      content: `As AI becomes a core part of the development process, the ability to effectively communicate with these systems emerges as a crucial skill. Prompt engineering—the art of crafting inputs that produce desired outputs from AI models—becomes a fundamental competency.

Effective prompt engineering for code generation involves:

1. Clarity and specificity: Precisely defining the desired behavior and constraints
2. Context provision: Supplying relevant background information and requirements
3. Incremental refinement: Iteratively improving prompts based on AI responses
4. Pattern utilization: Leveraging established patterns that consistently yield good results
5. Constraint management: Clearly specifying limitations and requirements

This skill set bridges traditional programming expertise with an understanding of how AI models process and respond to information. Mastering prompt engineering allows developers to more effectively leverage AI capabilities, producing higher-quality code with less iteration.`,
      type: "text",
      completed: false
    },
    {
      id: "coding_quiz",
      title: "Understanding Check: Vibe Coding Fundamentals",
      content: "This section has been replaced with a text version of the quiz content.",
      type: "text",
      /* Quiz functionality removed
        {
          question: "What is the primary shift in focus that vibe coding represents?",
          options: [
            "From debugging to testing",
            "From implementation details to intent and high-level problem-solving",
            "From frontend to backend development",
            "From compiled to interpreted languages"
          ],
          correctAnswer: 1,
          explanation: "Vibe coding represents a shift from focusing on implementation details (how to code something) to expressing intent and focusing on high-level problem-solving, letting AI handle more of the implementation details."
        },
        {
          question: "Which of the following is NOT one of the core principles of vibe coding discussed in the chapter?",
          options: [
            "Intent over implementation",
            "Iterative refinement",
            "Code memorization",
            "Human-AI complementarity"
          ],
          correctAnswer: 2,
          explanation: "Code memorization is not a principle of vibe coding. In fact, vibe coding reduces the need to memorize syntax and implementation details by allowing developers to focus on concepts and intent."
        },
        {
          question: "What is prompt engineering in the context of vibe coding?",
          options: [
            "A technique for optimizing code performance",
            "The practice of crafting effective instructions for AI tools to produce desired code outputs",
            "A method for designing user interfaces",
            "A strategy for debugging complex code"
          ],
          correctAnswer: 1,
          explanation: "Prompt engineering is the practice of crafting effective instructions (prompts) for AI tools to produce desired code outputs. It's a fundamental skill in the vibe coding paradigm."
        }
      */
      completed: false
    },
    {
      id: "practice_section",
      title: "Practice: Your First Vibe Coding Experience",
      content: "Let's put vibe coding into practice with a simple example. Try using the provided code sandbox to implement a simple function using natural language instructions instead of writing code directly. This will help you experience the shift from implementation-focused to intent-focused programming.",
      type: "interactive",
      completed: false
    },
    {
      id: "reflection",
      title: "Reflection and Discussion",
      content: `Now that you've explored the foundations of vibe coding and experienced it firsthand, take some time to reflect on how this approach might impact your own development workflow. Consider the following questions:

1. How might vibe coding change the skill set required for effective software development? Which aspects of traditional programming become more or less important?
2. What are the potential limitations or challenges you anticipate in relying more heavily on AI for code generation?
3. How do you think the relationship between developers will evolve as these tools become more integrated into standard workflows?
4. What ethical considerations should be kept in mind when using AI-generated code in production applications?

Your reflections on these questions will help prepare you for deeper exploration in subsequent chapters.`,
      type: "text",
      completed: false
    }
  ],
  prerequisites: ["Basic understanding of programming concepts", "No specific language knowledge required"],
  learningObjectives: [
    "Understand the paradigm shift from traditional coding to AI-assisted development",
    "Identify the key AI technologies enabling vibe coding",
    "Explain the core principles and philosophy of vibe coding",
    "Develop initial skills in prompt engineering for code generation",
    "Experience firsthand the workflow of AI-assisted development"
  ],
  estimatedTime: "45 minutes"
};

// Component
const ChapterReader: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  // No navigation needed
  const { darkMode, skillLevel } = useTheme();
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    // In a real application, we would fetch the chapter data from an API
    // For now, we're using mock data
    setChapter(mockChapterData);
    
    // Load saved progress from localStorage if available
    const savedProgress = localStorage.getItem(`chapter_progress_${chapterId}_${skillLevel}`);
    if (savedProgress) {
      const { sectionIndex, completedSections, responses } = JSON.parse(savedProgress);
      setCurrentSectionIndex(sectionIndex);
      setUserResponses(responses || {});
      
      // Update the completion status of sections
      if (completedSections && mockChapterData) {
        const updatedSections = mockChapterData.sections.map((section, index) => ({
          ...section,
          completed: completedSections[index] || false
        }));
        setChapter({
          ...mockChapterData,
          sections: updatedSections
        });
      }
    }
    
    // Calculate initial progress
    if (mockChapterData) {
      const completedCount = mockChapterData.sections.filter(s => s.completed).length;
      setProgress((completedCount / mockChapterData.sections.length) * 100);
    }
  }, [chapterId, skillLevel]);

  const saveProgress = (sectionIndex: number, completedSections: boolean[], responses: Record<string, any>) => {
    localStorage.setItem(`chapter_progress_${chapterId}_${skillLevel}`, JSON.stringify({
      sectionIndex,
      completedSections,
      responses
    }));
    
    // Update progress percentage
    setProgress((completedSections.filter(Boolean).length / completedSections.length) * 100);
  };

  const handleNext = () => {
    if (!chapter) return;
    
    const newIndex = currentSectionIndex + 1;
    if (newIndex < chapter.sections.length) {
      setCurrentSectionIndex(newIndex);
      
      // Mark current section as completed
      const updatedSections = [...chapter.sections];
      updatedSections[currentSectionIndex].completed = true;
      setChapter({
        ...chapter,
        sections: updatedSections
      });
      
      // Save progress
      const completedStatus = updatedSections.map(s => s.completed);
      saveProgress(newIndex, completedStatus, userResponses);
      
      // Scroll to top of new section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      // Scroll to top of new section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const renderSectionContent = (section: ChapterSection) => {
    switch (section.type) {
      case 'text':
        return (
          <SectionContent dangerouslySetInnerHTML={{ __html: section.content }} />
        );
      case 'code':
        return (
          <pre>
            <code>{section.content}</code>
          </pre>
        );

      case 'interactive':
        return (
          <>
            <SectionContent dangerouslySetInnerHTML={{ __html: section.content }} />
            <pre>
              <code>// Interactive code example placeholder</code>
            </pre>
          </>
        );
      default:
        return <SectionContent dangerouslySetInnerHTML={{ __html: section.content }} />;
    }
  };

  if (!chapter) {
    return (
      <MainLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading chapter content...</div>
      </MainLayout>
    );
  }

  const currentSection = chapter.sections[currentSectionIndex];

  return (
    <MainLayout>
      <ReaderContainer $isDark={darkMode}>
        <ChapterContent>
          <ChapterHeader>
            <h2>{chapter.title}</h2>
            <ChapterDescription>{chapter.description}</ChapterDescription>
            
            <LearningObjectives $isDark={darkMode}>
              <h3>Learning Objectives</h3>
              <ObjectivesList>
                {chapter.learningObjectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ObjectivesList>
            </LearningObjectives>
            
            <ProgressContainer>
              <ProgressText>
                <span>Your progress</span>
                <span>{Math.round(progress)}%</span>
              </ProgressText>
              <div style={{ width: `${progress}%`, height: '8px', backgroundColor: 'var(--color-primary)', borderRadius: '4px' }}></div>
            </ProgressContainer>
          </ChapterHeader>
          
          <AnimatePresence mode="wait">
            <SectionContainer
              key={currentSection.id}
              $isDark={darkMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeading>{currentSection.title}</SectionHeading>
              {renderSectionContent(currentSection)}
            </SectionContainer>
          </AnimatePresence>
          
          <NavigationButtons>
            <NavButton
              $isDark={darkMode}
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              whileTap={{ scale: 0.98 }}
            >
              ← Previous
            </NavButton>
            
            <NavButton
              $isDark={darkMode}
              $primary
              onClick={handleNext}
              disabled={currentSectionIndex === chapter.sections.length - 1}
              whileTap={{ scale: 0.98 }}
            >
              Next →
            </NavButton>
          </NavigationButtons>
        </ChapterContent>
        
        {/* Side panel with assistant */}
        <SidePanel $isDark={darkMode} $isOpen={isAssistantOpen}>
          <PanelToggle 
            $isDark={darkMode} 
            $isOpen={isAssistantOpen}
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            aria-label={isAssistantOpen ? "Close assistant" : "Open assistant"}
          >
            {isAssistantOpen ? '→' : '←'}
          </PanelToggle>
          
          {isAssistantOpen && (
            <div style={{ padding: '1rem' }}>
              <h3>Learning Assistant</h3>
              <p>Assistant panel placeholder</p>
            </div>
          )}
        </SidePanel>
      </ReaderContainer>
    </MainLayout>
  );
};

export default ChapterReader;
