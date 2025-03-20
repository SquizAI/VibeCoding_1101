import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../styles/ThemeProvider';
import MainLayout from '../../layouts/MainLayout';

// Types
interface EngagementPoint {
  timestamp: string;
  metric: string;
  value: number;
  chapterId: string;
  sectionId: string;
}

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  pathway: 'beginner' | 'advanced' | 'ninja';
  currentChapter: string;
  engagementMetrics: {
    timeSpent: number; // in minutes
    codeInteractions: number;
    aiPrompts: number;
    conceptualUnderstanding: number; // 0-100
    completionRate: number; // percentage
    revisitRate: number; // percentage
  };
  progressByChapter: {
    [chapterId: string]: {
      progress: number;
      lastAccessed: string;
      timeSpent: number;
    };
  };
  engagementTimeline: EngagementPoint[];
}

// Styled components
const Container = styled.div<{ $isDark: boolean }>`
  padding: 2rem;
  background-color: ${props => props.$isDark ? 'var(--color-dark-secondary)' : 'var(--color-light-secondary)'};
  border-radius: 12px;
  margin: 2rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const BackButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  
  &:hover {
    color: var(--color-primary);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AvatarContainer = styled.div`
  flex-shrink: 0;
`;

const Avatar = styled.div<{ $src: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const StudentDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  margin-bottom: 0.5rem;
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 600;
`;

const PathwayBadge = styled.div<{ $pathway: string, $isDark: boolean }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  
  background-color: ${props => {
    if (props.$pathway === 'ninja') {
      return props.$isDark ? 'rgba(88, 24, 69, 0.3)' : 'rgba(147, 51, 234, 0.1)';
    } else if (props.$pathway === 'advanced') {
      return props.$isDark ? 'rgba(12, 74, 110, 0.3)' : 'rgba(59, 130, 246, 0.1)';
    } else {
      return props.$isDark ? 'rgba(6, 78, 59, 0.3)' : 'rgba(16, 185, 129, 0.1)';
    }
  }};
  
  color: ${props => {
    if (props.$pathway === 'ninja') {
      return props.$isDark ? '#d946ef' : '#9333ea';
    } else if (props.$pathway === 'advanced') {
      return props.$isDark ? '#3b82f6' : '#2563eb';
    } else {
      return props.$isDark ? '#10b981' : '#047857';
    }
  }};
`;

const SectionTitle = styled.h2`
  margin: 2rem 0 1rem 0;
  font-size: 1.5rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'var(--color-dark)' : 'var(--color-light)'};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MetricName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const MetricDescription = styled.div`
  font-size: 0.9rem;
  color: #888;
`;

const ProgressSection = styled.div`
  margin-bottom: 2rem;
`;

const ChapterProgressList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const ChapterProgressItem = styled.div<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'var(--color-dark)' : 'var(--color-light)'};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChapterTitle = styled.div`
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
`;

const ProgressFill = styled.div<{ $progress: number, $pathway: string }>`
  height: 100%;
  width: ${props => `${props.$progress}%`};
  background: ${props => {
    switch(props.$pathway) {
      case 'ninja': return 'linear-gradient(to right, #8e2de2, #4a00e0)';
      case 'advanced': return 'linear-gradient(to right, #2193b0, #6dd5ed)';
      default: return 'linear-gradient(to right, #11998e, #38ef7d)';
    }
  }};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const ProgressDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
`;

const ProgressPercentage = styled.div`
  font-weight: 600;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ $active: boolean, $isDark: boolean }>`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? 'var(--color-primary)' : 'inherit'};
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--color-primary);
    transform-origin: bottom;
    transform: ${props => props.$active ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

// Mock data for demonstration
const getMockStudentData = (studentId: string): StudentDetail => {
  return {
    id: studentId,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    joinedDate: '2025-01-15',
    pathway: 'advanced',
    currentChapter: 'Chapter 2: Getting Started',
    engagementMetrics: {
      timeSpent: 347, // in minutes
      codeInteractions: 128,
      aiPrompts: 42,
      conceptualUnderstanding: 78, // 0-100
      completionRate: 67, // percentage
      revisitRate: 23, // percentage
    },
    progressByChapter: {
      'chapter_01': {
        progress: 100,
        lastAccessed: '2025-02-10',
        timeSpent: 120
      },
      'chapter_02': {
        progress: 68,
        lastAccessed: '2025-03-18',
        timeSpent: 95
      },
      'chapter_03': {
        progress: 15,
        lastAccessed: '2025-03-19',
        timeSpent: 32
      }
    },
    engagementTimeline: [
      {
        timestamp: '2025-03-15T10:30:00',
        metric: 'code_interaction',
        value: 12,
        chapterId: 'chapter_02',
        sectionId: 'section_3'
      },
      {
        timestamp: '2025-03-16T14:45:00',
        metric: 'ai_prompt',
        value: 8,
        chapterId: 'chapter_02',
        sectionId: 'section_4'
      },
      {
        timestamp: '2025-03-18T09:15:00',
        metric: 'time_spent',
        value: 45,
        chapterId: 'chapter_02',
        sectionId: 'section_5'
      },
      {
        timestamp: '2025-03-19T16:20:00',
        metric: 'time_spent',
        value: 32,
        chapterId: 'chapter_03',
        sectionId: 'section_1'
      }
    ]
  };
};

const StudentDetailView: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'code'>('overview');
  
  // Fetch student data - in a real app, this would come from an API
  // For demo purposes, we're using mock data
  const student = getMockStudentData(studentId || 'student1');
  
  const handleBack = () => {
    navigate('/teacher-dashboard');
  };
  
  // Format chapter name for display
  const formatChapterName = (chapterId: string): string => {
    return chapterId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return (
    <MainLayout>
      <Container $isDark={darkMode}>
        <Header>
          <BackButton $isDark={darkMode} onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </BackButton>
        </Header>
        
        <ProfileSection>
          <AvatarContainer>
            <Avatar $src={student.avatar} />
          </AvatarContainer>
          <ProfileInfo>
            <StudentName>{student.name}</StudentName>
            <StudentDetails>
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{student.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Learning Pathway</DetailLabel>
                <DetailValue>
                  <PathwayBadge $pathway={student.pathway} $isDark={darkMode}>
                    {student.pathway.charAt(0).toUpperCase() + student.pathway.slice(1)}
                  </PathwayBadge>
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Joined</DetailLabel>
                <DetailValue>{student.joinedDate}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Current Progress</DetailLabel>
                <DetailValue>{student.currentChapter}</DetailValue>
              </DetailItem>
            </StudentDetails>
          </ProfileInfo>
        </ProfileSection>
        
        <TabsContainer>
          <Tab 
            $active={activeTab === 'overview'} 
            $isDark={darkMode}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Tab>
          <Tab 
            $active={activeTab === 'engagement'} 
            $isDark={darkMode}
            onClick={() => setActiveTab('engagement')}
          >
            Engagement Details
          </Tab>
          <Tab 
            $active={activeTab === 'code'} 
            $isDark={darkMode}
            onClick={() => setActiveTab('code')}
          >
            Code Submissions
          </Tab>
        </TabsContainer>
        
        {activeTab === 'overview' && (
          <>
            <SectionTitle>Engagement Metrics</SectionTitle>
            <MetricsGrid>
              <MetricCard $isDark={darkMode}>
                <MetricName>Time Spent</MetricName>
                <MetricValue>{student.engagementMetrics.timeSpent} min</MetricValue>
                <MetricDescription>Total time engaging with content</MetricDescription>
              </MetricCard>
              <MetricCard $isDark={darkMode}>
                <MetricName>Code Interactions</MetricName>
                <MetricValue>{student.engagementMetrics.codeInteractions}</MetricValue>
                <MetricDescription>Number of code edits and executions</MetricDescription>
              </MetricCard>
              <MetricCard $isDark={darkMode}>
                <MetricName>AI Assistant Usage</MetricName>
                <MetricValue>{student.engagementMetrics.aiPrompts}</MetricValue>
                <MetricDescription>Queries sent to the AI assistant</MetricDescription>
              </MetricCard>
              <MetricCard $isDark={darkMode}>
                <MetricName>Conceptual Understanding</MetricName>
                <MetricValue>{student.engagementMetrics.conceptualUnderstanding}%</MetricValue>
                <MetricDescription>Estimated from interactions and code quality</MetricDescription>
              </MetricCard>
            </MetricsGrid>
            
            <SectionTitle>Progress by Chapter</SectionTitle>
            <ProgressSection>
              <ChapterProgressList>
                {Object.entries(student.progressByChapter).map(([chapterId, data]) => (
                  <ChapterProgressItem key={chapterId} $isDark={darkMode}>
                    <ChapterTitle>{formatChapterName(chapterId)}</ChapterTitle>
                    <ProgressBar>
                      <ProgressFill $progress={data.progress} $pathway={student.pathway} />
                    </ProgressBar>
                    <ProgressDetails>
                      <div>Last accessed: {data.lastAccessed}</div>
                      <ProgressPercentage>{data.progress}%</ProgressPercentage>
                    </ProgressDetails>
                  </ChapterProgressItem>
                ))}
              </ChapterProgressList>
            </ProgressSection>
          </>
        )}
        
        {activeTab === 'engagement' && (
          <div>
            <SectionTitle>Engagement Timeline</SectionTitle>
            <p>Detailed engagement metrics would be shown here in a real application.</p>
          </div>
        )}
        
        {activeTab === 'code' && (
          <div>
            <SectionTitle>Code Submissions</SectionTitle>
            <p>Student's code submissions and exercises would be shown here in a real application.</p>
          </div>
        )}
      </Container>
    </MainLayout>
  );
};

export default StudentDetailView;
