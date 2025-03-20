import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';
import MainLayout from '../../layouts/MainLayout';
import StudentProgressSection from './StudentProgressSection';
import PathwayDistributionSection from './PathwayDistributionSection';
import EngagementMetricsSection from './EngagementMetricsSection';
import { useNavigate } from 'react-router-dom';

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
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
  gap: 2rem;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
  margin-bottom: 2rem;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ $active: boolean, $isDark: boolean }>`
  padding: 1rem 1.5rem;
  border: none;
  background-color: ${props => props.$active ? (props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)') : 'transparent'};
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? 'var(--color-primary)' : 'inherit'};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  border-radius: 8px 8px 0 0;
  
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
  
  &:hover {
    background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  }
`;

// Mock data for demonstration
const mockChapters = [
  { id: 'overview', name: 'Class Overview' },
  { id: 'chapter_01', name: 'Chapter 1: The Vibe Coding Revolution' },
  { id: 'chapter_02', name: 'Chapter 2: Getting Started' },
  { id: 'chapter_03', name: 'Chapter 3: Advanced Techniques' },
];

const FilterButton = styled.button<{ $active?: boolean, $isDark: boolean }>`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border-radius: 20px;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.$active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : 'inherit'};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-primary);
    color: ${props => !props.$active && 'var(--color-primary)'};
  }
`;

const FiltersContainer = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TeacherDashboard: React.FC = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();
  
  // Track the last updated time
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Simulate data refresh when changing tabs
  useEffect(() => {
    setLastUpdated(new Date());
  }, [activeTab]);
  
  return (
    <MainLayout>
      <DashboardContainer $isDark={darkMode}>
        <DashboardHeader>
          <Title>Teacher Dashboard</Title>
          <ActionButtons>
            <Button $isDark={darkMode}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
              </svg>
              Last Updated: {lastUpdated.toLocaleTimeString()}
            </Button>
            <Button $isDark={darkMode} onClick={() => navigate('/teacher-dashboard/reports')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25h2.25a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75v-3a.75.75 0 01.75-.75zm8.25.75a.75.75 0 00-1.5 0v2.25h-2.25a.75.75 0 000 1.5h3a.75.75 0 00.75-.75v-3z" clipRule="evenodd" />
              </svg>
              View Reports
            </Button>
            <Button $primary $isDark={darkMode}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Add Student
            </Button>
          </ActionButtons>
        </DashboardHeader>
        
        <TabsContainer>
          {mockChapters.map(chapter => (
            <Tab 
              key={chapter.id}
              $active={activeTab === chapter.id}
              $isDark={darkMode}
              onClick={() => setActiveTab(chapter.id)}
            >
              {chapter.name}
            </Tab>
          ))}
        </TabsContainer>
        
        <FiltersContainer>
          <FilterButton 
            $active={activeFilter === 'all'} 
            $isDark={darkMode} 
            onClick={() => setActiveFilter('all')}
          >
            All Students
          </FilterButton>
          <FilterButton 
            $active={activeFilter === 'active'} 
            $isDark={darkMode} 
            onClick={() => setActiveFilter('active')}
          >
            Active Today
          </FilterButton>
          <FilterButton 
            $active={activeFilter === 'inactive'} 
            $isDark={darkMode} 
            onClick={() => setActiveFilter('inactive')}
          >
            Inactive (7+ days)
          </FilterButton>
          <FilterButton 
            $active={activeFilter === 'at-risk'} 
            $isDark={darkMode} 
            onClick={() => setActiveFilter('at-risk')}
          >
            At Risk
          </FilterButton>
        </FiltersContainer>
        
        <DashboardGrid>
          <StudentProgressSection 
            chapterId={activeTab} 
            filterStatus={activeFilter} 
            onViewStudent={(studentId: string) => navigate(`/teacher-dashboard/student/${studentId}`)} 
          />
          <PathwayDistributionSection chapterId={activeTab} filterStatus={activeFilter} />
          <EngagementMetricsSection chapterId={activeTab} filterStatus={activeFilter} />
        </DashboardGrid>
      </DashboardContainer>
    </MainLayout>
  );
};

export default TeacherDashboard;
