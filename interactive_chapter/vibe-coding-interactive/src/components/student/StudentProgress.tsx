import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';

interface StudentProgressProps {
  chapterId?: string;
  detailed?: boolean;
}

interface ProgressStats {
  topicTitle: string;
  completionRate: number;
  timeSpent: number;
  exercisesCompleted: number;
  lastAccessed: Date;
}

const ProgressCard = styled.div<{ $isDark: boolean }>`
  padding: 1.5rem;
  border-radius: 12px;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const ProgressItem = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TopicTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
`;

const TopicMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
`;

const ProgressBarContainer = styled.div`
  height: 12px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 6px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: var(--color-primary);
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Mock data for demonstration
const getProgressData = (chapterId?: string): ProgressStats[] => {
  const allStats = [
    {
      topicTitle: "Introduction to VibeCoding",
      completionRate: 100,
      timeSpent: 120, // in minutes
      exercisesCompleted: 8,
      lastAccessed: new Date(2025, 2, 15) // March 15, 2025
    },
    {
      topicTitle: "Functions & Code Reuse",
      completionRate: 75,
      timeSpent: 90,
      exercisesCompleted: 6,
      lastAccessed: new Date(2025, 2, 19) // March 19, 2025
    },
    {
      topicTitle: "Data Structures Basics",
      completionRate: 30,
      timeSpent: 45,
      exercisesCompleted: 3,
      lastAccessed: new Date(2025, 2, 20) // March 20, 2025
    },
    {
      topicTitle: "Object-Oriented Programming",
      completionRate: 0,
      timeSpent: 0,
      exercisesCompleted: 0,
      lastAccessed: new Date(2025, 1, 1) // Just a placeholder date
    }
  ];
  
  if (chapterId) {
    // In a real app, we would filter based on chapterId
    return allStats;
  }
  
  return allStats;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const StudentProgress: React.FC<StudentProgressProps> = ({ chapterId, detailed = false }) => {
  const { darkMode } = useTheme();
  const progressData = getProgressData(chapterId);
  
  return (
    <ProgressCard $isDark={darkMode}>
      <CardTitle>Learning Progress</CardTitle>
      
      {progressData.map((item, index) => (
        <ProgressItem key={index}>
          <TopicTitle>
            <span>{item.topicTitle}</span>
            <span>{item.completionRate}%</span>
          </TopicTitle>
          
          {detailed && (
            <TopicMeta>
              <MetaItem>
                <Icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </Icon>
                <span>{item.timeSpent} mins</span>
              </MetaItem>
              
              <MetaItem>
                <Icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </Icon>
                <span>{item.exercisesCompleted} exercises</span>
              </MetaItem>
              
              <MetaItem>
                <Icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </Icon>
                <span>Last: {formatDate(item.lastAccessed)}</span>
              </MetaItem>
            </TopicMeta>
          )}
          
          <ProgressBarContainer>
            <ProgressBarFill $progress={item.completionRate} />
          </ProgressBarContainer>
        </ProgressItem>
      ))}
    </ProgressCard>
  );
};

export default StudentProgress;
