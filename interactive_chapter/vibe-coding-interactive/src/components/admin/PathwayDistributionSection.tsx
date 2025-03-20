import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeProvider';

interface PathwayDistributionSectionProps {
  chapterId: string;
  filterStatus?: string;
}

interface PathwayData {
  pathway: 'beginner' | 'advanced' | 'ninja';
  count: number;
  percentage: number;
  color: string;
  description: string;
}

// Styled components
const SectionContainer = styled.div<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? 'var(--color-dark)' : 'var(--color-light)'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div<{ $isDark: boolean }>`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--color-primary);
  }
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const ChartContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Simple donut chart component with correct type definitions
interface DonutChartProps {
  beginner: number;
  advanced: number;
  isDark: boolean;
}

const DonutChart = styled.div<DonutChartProps>`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    #9333ea 0% ${props => props.beginner || 0}%, 
    #2563eb ${props => props.beginner || 0}% ${props => (props.beginner || 0) + (props.advanced || 0)}%, 
    #047857 ${props => (props.beginner || 0) + (props.advanced || 0)}% 100%
  );
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background-color: ${props => props.isDark ? 'var(--color-dark)' : 'var(--color-light)'};
    border-radius: 50%;
  }
`;

const ChartCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
`;

const TotalStudents = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const TotalLabel = styled.div`
  font-size: 0.9rem;
  color: #888;
`;

const PathwaysList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PathwayItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PathwayInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PathwayColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.$color};
`;

const PathwayName = styled.div`
  font-weight: 600;
`;

const PathwayDescription = styled.div`
  color: #888;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const PathwayCount = styled.div`
  font-weight: 600;
`;

const PathwayPercentage = styled.div`
  color: #888;
  font-size: 0.9rem;
  text-align: right;
`;

// Mock data for demonstration
const getMockPathwayData = (chapterId: string, filterStatus: string = 'all'): PathwayData[] => {
  // In a real app, this data would come from a database based on the chapterId and filterStatus
  console.log(`Fetching pathway data for chapter: ${chapterId} with filter: ${filterStatus}`);
  
  // Different data based on filters
  if (filterStatus === 'active') {
    return [
      {
        pathway: 'beginner',
        count: 8,
        percentage: 50,
        color: '#047857',
        description: 'Learning fundamentals with step-by-step guidance'
      },
      {
        pathway: 'advanced',
        count: 6,
        percentage: 37.5,
        color: '#2563eb',
        description: 'Experimenting with more complex concepts'
      },
      {
        pathway: 'ninja',
        count: 2,
        percentage: 12.5,
        color: '#9333ea',
        description: 'Building complete systems with deep understanding'
      }
    ];
  } else if (filterStatus === 'at-risk') {
    return [
      {
        pathway: 'beginner',
        count: 4,
        percentage: 66.7,
        color: '#047857',
        description: 'Learning fundamentals with step-by-step guidance'
      },
      {
        pathway: 'advanced',
        count: 2,
        percentage: 33.3,
        color: '#2563eb',
        description: 'Experimenting with more complex concepts'
      },
      {
        pathway: 'ninja',
        count: 0,
        percentage: 0,
        color: '#9333ea',
        description: 'Building complete systems with deep understanding'
      }
    ];
  }
  
  // Default data
  return [
    {
      pathway: 'beginner',
      count: 12,
      percentage: 60,
      color: '#047857',
      description: 'Learning fundamentals with step-by-step guidance'
    },
    {
      pathway: 'advanced',
      count: 5,
      percentage: 25,
      color: '#2563eb',
      description: 'Experimenting with more complex concepts'
    },
    {
      pathway: 'ninja',
      count: 3,
      percentage: 15,
      color: '#9333ea',
      description: 'Building complete systems with deep understanding'
    }
  ];
};

const PathwayDistributionSection: React.FC<PathwayDistributionSectionProps> = ({ 
  chapterId, 
  filterStatus = 'all' 
}) => {
  const { darkMode } = useTheme();
  const pathwayData = getMockPathwayData(chapterId, filterStatus);
  
  const totalStudents = pathwayData.reduce((sum, data) => sum + data.count, 0);
  
  // Calculate starting points for donut chart segments
  const beginnerPercentage = pathwayData.find(d => d.pathway === 'beginner')?.percentage || 0;
  const advancedPercentage = pathwayData.find(d => d.pathway === 'advanced')?.percentage || 0;
  
  return (
    <SectionContainer $isDark={darkMode}>
      <SectionHeader $isDark={darkMode}>
        <SectionTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
          </svg>
          Pathway Distribution
        </SectionTitle>
      </SectionHeader>
      
      <SectionContent>
        <ChartContainer>
          <DonutChart 
            beginner={beginnerPercentage} 
            advanced={advancedPercentage}
            isDark={darkMode}
          />
          <ChartCenter>
            <TotalStudents>{totalStudents}</TotalStudents>
            <TotalLabel>Total Students</TotalLabel>
          </ChartCenter>
        </ChartContainer>
        
        <PathwaysList>
          {pathwayData.map(data => (
            <PathwayItem key={data.pathway}>
              <PathwayInfo>
                <PathwayColor $color={data.color} />
                <div>
                  <PathwayName>
                    {data.pathway.charAt(0).toUpperCase() + data.pathway.slice(1)}
                  </PathwayName>
                  <PathwayDescription>{data.description}</PathwayDescription>
                </div>
              </PathwayInfo>
              <div>
                <PathwayCount>{data.count} students</PathwayCount>
                <PathwayPercentage>{data.percentage}%</PathwayPercentage>
              </div>
            </PathwayItem>
          ))}
        </PathwaysList>
      </SectionContent>
    </SectionContainer>
  );
};

export default PathwayDistributionSection;
