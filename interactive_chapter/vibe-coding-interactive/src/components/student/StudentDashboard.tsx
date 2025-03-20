import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { EngagementMetrics, getInitialEngagementMetrics, generateAdaptiveHint } from '../reader/engagementUtils';
import PathwayIndicator from '../reader/PathwayIndicator';
import AdaptiveHint from '../reader/AdaptiveHint';

const DashboardContainer = styled.div<{ $isDark: boolean }>`
  padding: 2rem;
  background-color: ${props => props.$isDark ? 'var(--color-dark-secondary)' : 'var(--color-light-secondary)'};
  min-height: calc(100vh - 80px);
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-muted);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ $primary?: boolean, $isDark: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  
  background-color: ${props => props.$primary ? 
    'var(--color-primary)' : 
    props.$isDark ? 
      'rgba(255, 255, 255, 0.1)' : 
      'rgba(0, 0, 0, 0.05)'
  };
  
  color: ${props => props.$primary ? 
    'white' : 
    props.$isDark ? 
      'rgba(255, 255, 255, 0.9)' : 
      'rgba(0, 0, 0, 0.8)'
  };
  
  &:hover {
    background-color: ${props => props.$primary ? 
      'var(--color-primary-dark)' : 
      props.$isDark ? 
        'rgba(255, 255, 255, 0.15)' : 
        'rgba(0, 0, 0, 0.08)'
    };
  }
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const StatCard = styled.div<{ $isDark: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
  flex: 1;
  min-width: 120px;
  
  @media (max-width: 768px) {
    min-width: 100px;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--color-text-muted);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div<{ $isDark: boolean }>`
  padding: 1.5rem;
  border-radius: 12px;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CourseItem = styled.div<{ $isDark: boolean, $active?: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.$active ? 
    props.$isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' : 
    props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
  };
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.$active ? 
      props.$isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)' : 
      props.$isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
    };
  }
`;

const CourseTitle = styled.div`
  font-weight: 600;
`;

const CourseProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div<{ $progress: number, $isDark: boolean }>`
  width: 80px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background-color: var(--color-primary);
    border-radius: 4px;
  }
`;

const ProgressValue = styled.span`
  font-size: 0.9rem;
`;

// Mock data for demonstration
const mockCourses = [
  { id: 'c1', title: 'Introduction to VibeCoding', progress: 100, pathway: 'beginner' },
  { id: 'c2', title: 'Functions & Code Reuse', progress: 75, pathway: 'beginner', active: true },
  { id: 'c3', title: 'Data Structures Basics', progress: 30, pathway: 'beginner' },
  { id: 'c4', title: 'Object-Oriented Programming', progress: 0, pathway: 'advanced' },
  { id: 'c5', title: 'Advanced Data Structures', progress: 0, pathway: 'ninja' },
];

const StudentDashboard: React.FC = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<EngagementMetrics>(getInitialEngagementMetrics());
  const [hint, setHint] = useState<{ icon: string; text: string } | null>(null);
  
  useEffect(() => {
    // In a real app, we would fetch the user's metrics from the backend
    // For demonstration, we'll use mock data
    const mockMetrics = {
      ...getInitialEngagementMetrics(),
      timeSpent: 320,
      codeInteractions: 45,
      aiPrompts: 12,
      codeModifications: 28,
      executionSuccess: 18,
      executionFailures: 7,
      aiAssistanceRequests: 10,
      conceptExtensions: 3,
      confidenceScore: 0.72,
      learningPathway: 'advanced' as 'beginner' | 'advanced' | 'ninja',
      engagementTrend: 'increasing' as 'increasing' | 'stable' | 'decreasing',
      lastActive: new Date()
    };
    
    setMetrics(mockMetrics);
    
    // Generate a personalized hint based on metrics
    const newHint = generateAdaptiveHint(mockMetrics, 'c2', 'functions');
    setHint(newHint);
  }, []);
  
  const getTotalHoursSpent = () => {
    // Convert seconds to hours
    return (metrics.timeSpent / 3600).toFixed(1);
  };
  
  return (
    <MainLayout>
      <DashboardContainer $isDark={darkMode}>
        <DashboardHeader>
          <div>
            <Title>My Learning Dashboard</Title>
          </div>
          <ActionButtons>
            <Button $isDark={darkMode}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 9h-1v5h1zm0-3h-1v1h1z" />
              </svg>
              Help
            </Button>
            <Button $primary $isDark={darkMode} onClick={() => navigate('/interactive')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Continue Learning
            </Button>
          </ActionButtons>
        </DashboardHeader>
        
        <ProfileSection>
          <ProfileImage>
            S
          </ProfileImage>
          <ProfileInfo>
            <Title>Hi, Student!</Title>
            <Subtitle>Keep up the good work</Subtitle>
            <StatsContainer>
              <StatCard $isDark={darkMode}>
                <StatValue>{getTotalHoursSpent()}</StatValue>
                <StatLabel>Hours Spent</StatLabel>
              </StatCard>
              <StatCard $isDark={darkMode}>
                <StatValue>{metrics.codeInteractions}</StatValue>
                <StatLabel>Code Interactions</StatLabel>
              </StatCard>
              <StatCard $isDark={darkMode}>
                <StatValue>{metrics.executionSuccess}</StatValue>
                <StatLabel>Code Runs</StatLabel>
              </StatCard>
              <StatCard $isDark={darkMode}>
                <StatValue>{Math.round(metrics.confidenceScore * 100)}%</StatValue>
                <StatLabel>Confidence Score</StatLabel>
              </StatCard>
            </StatsContainer>
          </ProfileInfo>
        </ProfileSection>
        
        <DashboardGrid>
          <Card $isDark={darkMode}>
            <CardTitle>My Courses</CardTitle>
            <CourseList>
              {mockCourses.map(course => (
                <CourseItem 
                  key={course.id} 
                  $isDark={darkMode} 
                  $active={course.active}
                  onClick={() => navigate('/interactive')}
                >
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseProgress>
                    <ProgressBar $progress={course.progress} $isDark={darkMode} />
                    <ProgressValue>{course.progress}%</ProgressValue>
                  </CourseProgress>
                </CourseItem>
              ))}
            </CourseList>
          </Card>
          
          <div>
            <Card $isDark={darkMode} style={{ marginBottom: '1.5rem' }}>
              <CardTitle>My Learning Pathway</CardTitle>
              <PathwayIndicator pathway={metrics.learningPathway} isDark={darkMode} />
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                You're on the <strong>{metrics.learningPathway}</strong> pathway. Keep challenging yourself to unlock more advanced content!
              </div>
            </Card>
            
            <Card $isDark={darkMode}>
              <CardTitle>Personal Recommendations</CardTitle>
              {hint && (
                <AdaptiveHint 
                  icon={hint.icon}
                  text={hint.text}
                  isDark={darkMode}
                />
              )}
              <div style={{ marginTop: '1rem' }}>
                <Button $isDark={darkMode} style={{ width: '100%' }} onClick={() => navigate('/resources')}>
                  View Learning Resources
                </Button>
              </div>
            </Card>
          </div>
        </DashboardGrid>
      </DashboardContainer>
    </MainLayout>
  );
};

export default StudentDashboard;
